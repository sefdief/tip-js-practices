// Проверки расширения (вариант А): searchTasks из src/task-extra.js.
// Запуск: node checks-extra.js
import assert from "node:assert/strict";
import { searchTasks } from "./src/task-extra.js";

let passed = 0;
let failed = 0;

function check(name, action) {
  try {
    action();
    passed += 1;
    console.log(`OK: ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL: ${name}`);
    console.error(error.message);
  }
}

function fixture() {
  return [
    { id: 1, title: "Изучить функции", completed: true, priority: "medium" },
    { id: 4, title: "Подготовить модель задач", completed: false, priority: "high" },
    { id: 7, title: "Проверить методы массивов", completed: false, priority: "low" },
    { id: 10, title: "Оформить README", completed: true, priority: "medium" },
  ];
}

check("Поиск 01. Обычный запрос", () => {
  const tasks = fixture();
  assert.deepEqual(searchTasks(tasks, "модель").map((task) => task.id), [4]);
});

check("Поиск 02. Разный регистр запроса и названия", () => {
  const tasks = fixture();
  assert.deepEqual(searchTasks(tasks, "readme").map((task) => task.id), [10]);
  assert.deepEqual(searchTasks(tasks, "README").map((task) => task.id), [10]);
  assert.deepEqual(searchTasks(tasks, "ИЗУЧИТЬ").map((task) => task.id), [1]);
});

check("Поиск 03. Пробелы по краям запроса", () => {
  const tasks = fixture();
  assert.deepEqual(searchTasks(tasks, " ФУНК ").map((task) => task.id), [1]);
});

check("Поиск 04. Нет совпадений", () => {
  const tasks = fixture();
  assert.deepEqual(searchTasks(tasks, "несуществующий фрагмент"), []);
});

check("Поиск 05. Порядок сохраняется при нескольких совпадениях", () => {
  const tasks = fixture();
  // «ть» есть в названиях всех четырёх задач: порядок такой же, как в исходном массиве
  assert.deepEqual(searchTasks(tasks, "ть").map((task) => task.id), [1, 4, 7, 10]);
  // «ов» есть только в названиях задач 4 и 7
  assert.deepEqual(searchTasks(tasks, "ов").map((task) => task.id), [4, 7]);
});

check("Поиск 06. Пустой и пробельный запрос возвращают новый массив всех задач", () => {
  const tasks = fixture();
  for (const query of ["", "   "]) {
    const result = searchTasks(tasks, query);
    assert.deepEqual(result, tasks);
    assert.notEqual(result, tasks);
  }
});

check("Поиск 07. Пустой список", () => {
  const empty = [];
  assert.deepEqual(searchTasks(empty, "что угодно"), []);
  const result = searchTasks(empty, "");
  assert.deepEqual(result, []);
  assert.notEqual(result, empty);
});

check("Поиск 08. Результат — новый массив, задачи не изменяются", () => {
  // Замораживание — инструмент проверки неизменности входных данных.
  const tasks = Object.freeze(fixture().map((task) => Object.freeze(task)));
  const result = searchTasks(tasks, "оформить");
  assert.notEqual(result, tasks);
  assert.deepEqual(result.map((task) => task.id), [10]);
  assert.deepEqual(tasks, fixture());
});

console.log(`\nПроверок расширения пройдено: ${passed}; не пройдено: ${failed}.`);
if (failed > 0) {
  process.exitCode = 1;
}
