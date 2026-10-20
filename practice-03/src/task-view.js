import { getTaskStats } from "./task-service.js";

// Здесь создаётся DOM, но не изменяется состояние приложения.
// Контракт карточки, селекторы и тексты описаны в методичке.

const PRIORITY_LABELS = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

// Создаёт элемент, назначает класс и текст. Текст всегда через textContent:
// название задачи не разбирается как HTML.
function createElementWithText(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function createActionButton(action, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.action = action;

  const labelElement = createElementWithText("span", "action-label", label);
  button.append(labelElement);

  return button;
}

export function createTaskElement(task) {
  const card = document.createElement("li");
  card.classList.add("task-card");
  card.classList.toggle("is-completed", task.completed);
  card.dataset.taskId = String(task.id);

  const title = createElementWithText("h3", "task-title", task.title);
  const status = createElementWithText(
    "span",
    "task-status",
    task.completed ? "Выполнена" : "В работе",
  );
  const priority = createElementWithText(
    "span",
    "task-priority",
    PRIORITY_LABELS[task.priority] ?? task.priority,
  );

  const toggleButton = createActionButton("toggle", "Выполнена");
  toggleButton.setAttribute("aria-pressed", String(task.completed));

  const deleteButton = createActionButton("delete", "Удалить");

  const actions = document.createElement("div");
  actions.classList.add("task-actions");
  actions.append(toggleButton, deleteButton);

  card.append(title, status, priority, actions);

  return card;
}

export function renderTaskList(listElement, tasks) {
  // replaceChildren заменяет только содержимое: сам ul и его обработчик сохраняются.
  listElement.replaceChildren(...tasks.map((task) => createTaskElement(task)));
}

function setStat(summaryElement, name, value) {
  const target = summaryElement.querySelector(`[data-stat="${name}"]`);

  if (target) {
    target.textContent = String(value);
  }
}

export function renderSummary(summaryElement, tasks, visibleCount) {
  // tasks — весь текущий массив, поэтому фильтр не влияет на общую статистику.
  const { total, completed, pending, progress } = getTaskStats(tasks);

  setStat(summaryElement, "total", total);
  setStat(summaryElement, "completed", completed);
  setStat(summaryElement, "pending", pending);
  setStat(summaryElement, "progress", `${progress.toFixed(1)}%`);
  setStat(summaryElement, "visible", visibleCount);
}

export function renderEmptyState(messageElement, total, visibleCount) {
  if (visibleCount > 0) {
    messageElement.textContent = "";
    messageElement.hidden = true;
    return;
  }

  messageElement.textContent =
    total === 0 ? "Список задач пуст." : "Нет задач по выбранному фильтру.";
  messageElement.hidden = false;
}
