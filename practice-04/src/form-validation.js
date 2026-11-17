const ALLOWED_PRIORITIES = new Set(["low", "medium", "high"]);

// Чистая проверка данных формы. DOM и показ сообщений выполняются в main.js.
// draft: { id, title, priority }; editingId: null либо id редактируемой задачи.
export function validateTaskDraft(draft, tasks, editingId = null) {
const errors = {};
  let id;

  if (editingId !== null) {
    id = editingId;

    if (!Number.isSafeInteger(id) || id <= 0) {
      errors.id = "Некорректный идентификатор редактируемой задачи.";
    } else if (!tasks.some((task) => task.id === id)) {
      errors.id = "Редактируемая задача не найдена.";
    }
  } else {
    if (
      typeof draft.id !== "string" &&
      typeof draft.id !== "number"
    ) {
      errors.id = "Идентификатор должен быть числом.";
    } else if (
      typeof draft.id === "string" &&
      draft.id.trim() === ""
    ) {
      errors.id = "Идентификатор не должен быть пустым.";
    } else {
      id = Number(draft.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        errors.id =
          "ID должен быть положительным безопасным целым числом.";
      } else if (tasks.some((task) => task.id === id)) {
        errors.id = "Задача с таким ID уже существует.";
      }
    }
  }

  let title;

  if (typeof draft.title !== "string") {
    errors.title = "Название должно быть строкой.";
  } else {
    title = draft.title.trim();

    if (title.length < 1 || title.length > 100) {
      errors.title =
        "Название должно содержать от 1 до 100 символов.";
    }
  }

  const priority = draft.priority;

  if (!ALLOWED_PRIORITIES.has(priority)) {
    errors.priority = "Выберите допустимый приоритет.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
    };
  }

  return {
    ok: true,
    value: {
      id,
      title,
      priority,
    },
  };

  void ALLOWED_PRIORITIES;
  void draft;
  void tasks;
  void editingId;
}
