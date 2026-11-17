
export const STORAGE_VERSION = 1;

const VALID_PRIORITIES = new Set(["low", "medium", "high"]);

function copyTasks(tasks) {
  return tasks.map((task) => ({ ...task }));
}

export function isValidTaskList(value) {
  if (!Array.isArray(value)) {
    return false;
  }

  const ids = new Set();

  for (const task of value) {
    if (
      task === null ||
      typeof task !== "object" ||
      Array.isArray(task)
    ) {
      return false;
    }

    if (!Number.isSafeInteger(task.id) || task.id <= 0) {
      return false;
    }

    if (ids.has(task.id)) {
      return false;
    }

    ids.add(task.id);

    if (
      typeof task.title !== "string" ||
      task.title.length < 1 ||
      task.title.length > 100 ||
      task.title.trim() !== task.title
    ) {
      return false;
    }

    if (typeof task.completed !== "boolean") {
      return false;
    }

    if (!VALID_PRIORITIES.has(task.priority)) {
      return false;
    }
  }

  return true;
}

export function loadTasks(storage, key, fallbackTasks) {
  const fallback = copyTasks(fallbackTasks);

  try {
    const raw = storage.getItem(key);

    if (raw === null) {
      return {
        ok: true,
        source: "initial",
        tasks: fallback,
      };
    }

    const parsed = JSON.parse(raw);

    if (
      parsed === null ||
      typeof parsed !== "object" ||
      Array.isArray(parsed) ||
      parsed.version !== STORAGE_VERSION ||
      !isValidTaskList(parsed.tasks)
    ) {
      return {
        ok: false,
        source: "fallback",
        tasks: fallback,
        error: "Сохранённые данные имеют некорректную структуру.",
      };
    }

    return {
      ok: true,
      source: "storage",
      tasks: copyTasks(parsed.tasks),
    };
  } catch (error) {
    return {
      ok: false,
      source: "fallback",
      tasks: fallback,
      error: `Не удалось загрузить данные: ${error.message}`,
    };
  }
}

export function saveTasks(storage, key, tasks) {
  if (!isValidTaskList(tasks)) {
    return {
      ok: false,
      error: "Невозможно сохранить некорректный список задач.",
    };
  }

  try {
    const data = {
      version: STORAGE_VERSION,
      tasks: copyTasks(tasks),
    };

    storage.setItem(key, JSON.stringify(data));

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: `Не удалось сохранить данные: ${error.message}`,
    };
  }
}

export function removeSavedTasks(storage, key) {
  try {
    storage.removeItem(key);

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: `Не удалось удалить сохранённые данные: ${error.message}`,
    };
  }
}
