// Расширение (вариант А): поиск задач по части названия.
// Контракты девяти обязательных функций task-service.js не затрагиваются.

export function searchTasks(tasks, query) {
  const normalizedQuery = query.trim().toLowerCase();

  // Пустой или пробельный запрос: новый массив со всеми задачами.
  if (normalizedQuery === "") {
    return [...tasks];
  }

  // filter() создаёт новый массив и сохраняет исходный порядок;
  // сами задачи не копируются и не изменяются.
  return tasks.filter(task =>
    task.title.toLowerCase().includes(normalizedQuery)
  );
}