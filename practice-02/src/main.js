import { demoTasks, variantNumber, variantTasks } from "./data.js";

import {
  createTask,
  findTaskById,
  getPendingTasks,
  getTaskTitles,
  getTaskStats,
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask,
} from "./task-service.js";
import { searchTasks } from "./task-extra.js";

// TODO: после реализации функций выполнить общий сценарий из раздела 6.5.
// Текущее состояние хранится в локальной переменной:
// let currentTasks = demoTasks;
// После успешной операции currentTasks получает result.tasks.
// При result.ok === false необходимо вывести ошибку, не заменяя состояние.
// Сводка выводится после каждого этапа; вычисления выполняются в task-service.js.

// TODO: выполнить отдельный сценарий для variantTasks по разделу 7.
// Общий набор demoTasks не заменяется данными варианта.

// TODO: показать хотя бы одну обработанную ошибку и неизменность исходных данных.
// Для удобного вывода объектов допустимо использовать console.table().

console.log("ПР2. Заготовка демонстрационного сценария");
console.log("Количество задач в общем наборе:", demoTasks.length);
console.log("Номер варианта:", variantNumber);
console.log(
  "Количество задач в индивидуальном наборе:",
  variantTasks.length
);

function showStats(tasks, stage) {
  const { total, completed, pending, progress } =
    getTaskStats(tasks);

  console.log(`\n--- ${stage} ---`);
  console.log(`Всего: ${total}`);
  console.log(`Выполнено: ${completed}`);
  console.log(`Осталось: ${pending}`);

  if (total === 0) {
    console.log("Задач пока нет");
  } else {
    console.log(`Прогресс: ${progress.toFixed(1)}%`);
  }
}

// Общий набор

let currentTasks = demoTasks;

console.log("\n=== ОБЩИЙ НАБОР ===");

console.log("\n--- Исходные задачи ---");
console.table(currentTasks);

console.log("--- Названия задач ---");
console.log(getTaskTitles(currentTasks));

console.log("--- Невыполненные задачи ---");
console.table(getPendingTasks(currentTasks));

showStats(currentTasks, "Исходный набор");

let result = addTask(
  currentTasks,
  20,
  "Добавить проверку",
  "high"
);

if (result.ok) {
  currentTasks = result.tasks;
  showStats(currentTasks, "После добавления id = 20");
} else {
  console.error(`Ошибка: ${result.error}`);
}

result = setTaskCompleted(
  currentTasks,
  4,
  true
);

if (result.ok) {
  currentTasks = result.tasks;
  showStats(currentTasks, "После выполнения id = 4");
} else {
  console.error(`Ошибка: ${result.error}`);
}

result = renameTask(
  currentTasks,
  10,
  "Подготовить инструкцию запуска"
);

if (result.ok) {
  currentTasks = result.tasks;
  showStats(currentTasks, "После переименования id = 10");
} else {
  console.error(`Ошибка: ${result.error}`);
}

result = removeTask(
  currentTasks,
  7
);

if (result.ok) {
  currentTasks = result.tasks;
  showStats(currentTasks, "После удаления id = 7");
} else {
  console.error(`Ошибка: ${result.error}`);
}

console.log("\n=== Проверка findTaskById ===");

console.log(
  "Задача с id = 4:",
  findTaskById(currentTasks, 4)
);

console.log(
  "Задача с id = 777:",
  findTaskById(currentTasks, 777)
);

console.log("\n=== Проверка ошибки ===");

result = addTask(
  currentTasks,
  20,
  "Повторная задача",
  "low"
);

if (result.ok) {
  currentTasks = result.tasks;
} else {
  console.error(`Ошибка: ${result.error}`);
}

console.log("\n=== Итоговое состояние ===");

console.table(currentTasks);

console.log(
  "Итоговые ID:",
  currentTasks.map(task => task.id)
);

showStats(currentTasks, "Итог");

console.log("\n=== Проверка исходного demoTasks ===");

console.table(demoTasks);

console.log(
  "ID исходного набора:",
  demoTasks.map(task => task.id)
);

console.log(
  "Количество исходных задач:",
  demoTasks.length
);

console.log("\n=== Проверка createTask ===");

const createdTask = createTask(
  200,
  "Новая созданная задача",
  "low"
);

console.log(createdTask);


// Вариант 8

console.log("\n=== ИНДИВИДУАЛЬНЫЙ НАБОР ВАРИАНТА 8 ===");

let variantCurrentTasks = variantTasks;

console.log("\n--- Исходные задачи варианта ---");
console.table(variantCurrentTasks);

console.log("--- Названия задач ---");
console.log(getTaskTitles(variantCurrentTasks));

console.log("--- Невыполненные задачи ---");
console.table(getPendingTasks(variantCurrentTasks));

showStats(
  variantCurrentTasks,
  "Исходная сводка варианта"
);

let variantResult = addTask(
  variantCurrentTasks,
  80,
  "Оформить раздел с ограничениями",
  "low"
);

if (variantResult.ok) {
  variantCurrentTasks = variantResult.tasks;

  console.log("\nПосле добавления id = 80:");
  console.table(variantCurrentTasks);

  showStats(
    variantCurrentTasks,
    "После добавления id = 80"
  );
} else {
  console.error(`Ошибка: ${variantResult.error}`);
}

variantResult = setTaskCompleted(
  variantCurrentTasks,
  11,
  true
);

if (variantResult.ok) {
  variantCurrentTasks = variantResult.tasks;

  console.log("\nПосле выполнения id = 11:");
  console.table(variantCurrentTasks);

  showStats(
    variantCurrentTasks,
    "После выполнения id = 11"
  );
} else {
  console.error(`Ошибка: ${variantResult.error}`);
}

variantResult = renameTask(
  variantCurrentTasks,
  23,
  "Описать структуру и назначение проекта"
);

if (variantResult.ok) {
  variantCurrentTasks = variantResult.tasks;

  console.log("\nПосле переименования id = 23:");
  console.table(variantCurrentTasks);

  showStats(
    variantCurrentTasks,
    "После переименования id = 23"
  );
} else {
  console.error(`Ошибка: ${variantResult.error}`);
}

variantResult = removeTask(
  variantCurrentTasks,
  37
);

if (variantResult.ok) {
  variantCurrentTasks = variantResult.tasks;

  console.log("\nПосле удаления id = 37:");
  console.table(variantCurrentTasks);

  showStats(
    variantCurrentTasks,
    "После удаления id = 37"
  );
} else {
  console.error(`Ошибка: ${variantResult.error}`);
}

console.log("\n=== Проверка отказа: повторный id = 80 ===");

variantResult = addTask(
  variantCurrentTasks,
  80,
  "Повторная задача",
  "low"
);

if (variantResult.ok) {
  variantCurrentTasks = variantResult.tasks;
} else {
  console.error(`Ошибка: ${variantResult.error}`);
}

console.log("\n=== Итог индивидуального набора ===");

console.table(variantCurrentTasks);

console.log(
  "Итоговые ID:",
  variantCurrentTasks.map(task => task.id)
);

showStats(
  variantCurrentTasks,
  "Итоговая сводка варианта"
);

console.log("\n=== Проверка исходного variantTasks ===");

console.table(variantTasks);

console.log(
  "Исходные ID:",
  variantTasks.map(task => task.id)
);

console.log(
  "Количество исходных задач:",
  variantTasks.length
);


// Расширение (вариант А): поиск задач по части названия

console.log("\n=== РАСШИРЕНИЕ: searchTasks ===");

console.log('Запрос " ФУНК ":');
console.table(searchTasks(demoTasks, " ФУНК "));

console.log('Запрос "несуществующий фрагмент":');
console.log(searchTasks(demoTasks, "несуществующий фрагмент"));

console.log('Пустой запрос "   ":');
const allFound = searchTasks(demoTasks, "   ");
console.log(
  "Найдено задач:", allFound.length,
  "| новый массив:", allFound !== demoTasks
);

console.log(
  "ID исходного demoTasks после поиска:",
  demoTasks.map(task => task.id)
);