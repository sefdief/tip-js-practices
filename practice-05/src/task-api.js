
import { ApiError } from "./api-client.js";

function invalidResponse(message, url = null) {
  return new ApiError(message, {
    kind: "invalid-response",
    url,
  });
}

function isPlainObject(value) {
  return (
    value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype
  );
}

function normalizeFilters(filters = {}) {
  if (!isPlainObject(filters)) {
    throw new TypeError("Фильтры должны быть обычным объектом.");
  }

  const allowedFilters = [
    "completed",
    "priority",
    "categoryId",
    "q",
  ];

  for (const key of Object.keys(filters)) {
    if (!allowedFilters.includes(key)) {
      throw new TypeError(`Недопустимый фильтр: ${key}.`);
    }
  }

  const normalized = {};

  if (filters.completed !== undefined && filters.completed !== null) {
    if (typeof filters.completed !== "boolean") {
      throw new TypeError("completed должен иметь логический тип.");
    }

    normalized.completed = filters.completed;
  }

  if (filters.priority !== undefined && filters.priority !== null) {
    if (
      !["low", "medium", "high"].includes(filters.priority)
    ) {
      throw new TypeError("Недопустимое значение priority.");
    }

    if (filters.priority !== "") {
      normalized.priority = filters.priority;
    }
  }

  if (filters.categoryId !== undefined && filters.categoryId !== null) {
    if (
      !Number.isSafeInteger(filters.categoryId)
      || filters.categoryId <= 0
    ) {
      throw new TypeError("categoryId должен быть положительным целым числом.");
    }

    normalized.categoryId = filters.categoryId;
  }

  if (filters.q !== undefined && filters.q !== null) {
    if (typeof filters.q !== "string") {
      throw new TypeError("q должен быть строкой");
    }

    const q = filters.q.trim();

    if (q.length > 100) {
      throw new TypeError("Длина q не должна превышать 100 символов");
    }

    if (q !== "") {
      normalized.q = q;
    }
  }

  return normalized;
}

function validateTask(task) {
  return (
    isPlainObject(task)
    && Number.isSafeInteger(task.id)
    && task.id > 0
    && typeof task.title === "string"
    && task.title.trim().length > 0
    && task.title.length <= 100
    && typeof task.completed === "boolean"
    && ["low", "medium", "high"].includes(task.priority)
    && Number.isSafeInteger(task.categoryId)
    && task.categoryId > 0
  );
}

function validateCategory(category) {
  return (
    isPlainObject(category)
    && Number.isSafeInteger(category.id)
    && category.id > 0
    && typeof category.name === "string"
    && category.name.trim().length > 0
    && category.name.length <= 100
  );
}

function hasUniqueIds(items) {
  const ids = new Set();

  for (const item of items) {
    if (ids.has(item.id)) {
      return false;
    }

    ids.add(item.id);
  }

  return true;
}

function validateTasksResponse(payload) {
  if (
    !isPlainObject(payload)
    || !Array.isArray(payload.data)
    || !isPlainObject(payload.meta)
    || !Number.isSafeInteger(payload.meta.total)
    || payload.meta.total < 0
  ) {
    throw invalidResponse("Некорректная структура ответа со списком задач.");
  }

  if (!payload.data.every(validateTask)) {
    throw invalidResponse("Ответ содержит некорректные данные задач.");
  }

  if (!hasUniqueIds(payload.data)) {
    throw invalidResponse("В ответе обнаружены повторяющиеся id задач.");
  }

  if (payload.meta.total !== payload.data.length) {
    throw invalidResponse("Количество задач не совпадает с meta.total.");
  }

  return {
    tasks: payload.data,
    meta: payload.meta,
  };
}

function validateTaskResponse(payload) {
  if (
    !isPlainObject(payload)
    || !validateTask(payload.data)
  ) {
    throw invalidResponse("Некорректная структура ответа с задачей.");
  }

  return payload.data;
}

function validateCategoriesResponse(payload) {
  if (
    !isPlainObject(payload)
    || !Array.isArray(payload.data)
  ) {
    throw invalidResponse("Некорректная структура ответа с категориями.");
  }

  if (!payload.data.every(validateCategory)) {
    throw invalidResponse("Ответ содержит некорректные категории.");
  }

  if (!hasUniqueIds(payload.data)) {
    throw invalidResponse("В ответе обнаружены повторяющиеся id категорий.");
  }

  return payload.data;
}

export function createTaskApi(client) {
  if (
    !client
    || typeof client.requestJson !== "function"
  ) {
    throw new TypeError("client должен содержать requestJson.");
  }

  async function getTasks(filters = {}) {
    const query = normalizeFilters(filters);

    const payload = await client.requestJson("/tasks", {
      query,
    });

    return validateTasksResponse(payload);
  }

  async function getTaskById(id) {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new TypeError("id должен быть положительным целым числом.");
    }

    const payload = await client.requestJson(`/tasks/${id}`);

    const task = validateTaskResponse(payload);

    if (task.id !== id) {
      throw invalidResponse("ID задачи в ответе не совпадает с запрошенным.");
    }

    return task;
  }

  async function getCategories() {
    const payload = await client.requestJson("/categories");

    return validateCategoriesResponse(payload);
  }

  async function loadInitialData(filters = {}) {
    const [tasksResult, categories] = await Promise.all([
      getTasks(filters),
      getCategories(),
    ]);

    return {
      tasks: tasksResult.tasks,
      categories,
      meta: tasksResult.meta,
    };
  }

  return {
    getTasks,
    getTaskById,
    getCategories,
    loadInitialData,
  };
}
