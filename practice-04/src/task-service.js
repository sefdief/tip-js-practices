// Заготовка модуля. throw ниже отмечает отсутствие реализации,
// а не способ обработки некорректных данных в готовом решении.
// Для предусмотренных ошибок необходимо возвращать { ok: false, error: "..." }.
// console.log(), prompt(), document и чтение внешнего состояния здесь не нужны.

export function createTask(id, title, priority = "medium") {
  // TODO: проверить поля и вернуть результат создания задачи.
  if (typeof id !== "number") {
    return {ok: false, error: "id должен быть числом"};
  } 

  if (!Number.isSafeInteger(id) || id <= 0 ) {
    return {ok: false, error: "id должен быть положительным безопасным целым числом"};
  }

  if (typeof title !== "string") {
    return {ok: false, error: "title должен быть строкой"}
  }

  const normalizedTitle = title.trim();

  if (normalizedTitle.length < 1 || normalizedTitle.length > 100) {
    return {ok: false, error: "title должен содержать от 1 до 100 символов"};
  }

  if (!["low", "medium", "high"].includes(priority)) {
    return {ok: false, error: 'priority должен быть только "low", "medium" или "high"'};
  }
  
  const task = {id, 
    title: normalizedTitle, 
    completed: false, 
    priority
  }

  return{ok: true, 
    task
  };
}

export function findTaskById(tasks, id) {
  // TODO: найти задачу с помощью find(); отсутствие результата — undefined.
  return tasks.find(task => task.id === id);

}

export function getPendingTasks(tasks) {
  // TODO: вернуть новый массив невыполненных задач с помощью filter().
  return tasks.filter(task => task.completed === false)

}

export function getTaskTitles(tasks) {
  // TODO: вернуть массив названий с помощью map().
  return tasks.map(task => task.title)

}

export function getTaskStats(tasks) {
  // TODO: вернуть { total, completed, pending, progress }.
  const total = tasks.length; 
  const completed = tasks.filter(task => task.completed === true).length; 
  const pending = total - completed; 
  const progress = total > 0 ? completed / total * 100 : 0;

  return { total, completed, pending, progress };

}

export function updateTask(tasks, id, title, priority = "medium") {
  if (!isValidId(id)) {
    return { ok: false, error: "Некорректный идентификатор" };
  }

  const taskIndex = findTaskIndex(tasks, id);

  if (taskIndex === -1) {
    return { ok: false, error: "Задача с таким id не найдена" };
  }

  const titleResult = normalizeTitle(title);

  if (!titleResult.ok) {
    return titleResult;
  }

  const priorityResult = validatePriority(priority);

  if (!priorityResult.ok) {
    return priorityResult;
  }

  const resultTasks = tasks.map((task, index) => {
    if (index === taskIndex) {
      return {
        ...task,
        title: titleResult.title,
        priority: priorityResult.priority
      };
    }

    return task;
  });

  return {
    ok: true,
    tasks: resultTasks
  };
}

export function addTask(tasks, id, title, priority = "medium") {
  // TODO: проверить данные через createTask(), исключить дублирование id,
  // вернуть { ok: true, tasks: новыйМассив } без изменения исходного массива.
  
  if (!isValidId(id)) {
    return {ok: false, error: "Некорректный идентификатор"};
  }

  if (tasks.some(task => task.id === id)) {
    return {ok: false,error: "Задача с таким id уже существует"};
  }

  const titleResult = normalizeTitle(title);

  if (!titleResult.ok) {
    return titleResult;
  }

  const priorityResult = validatePriority(priority);

  if (!priorityResult.ok) {
    return priorityResult;
  }

  const newTask = {
    id,
    title: titleResult.title,
    completed: false,
    priority: priorityResult.priority
  };

  return {
    ok: true,
    tasks: [...tasks, newTask]
  };

}

export function setTaskCompleted(tasks, id, completed) {
  // TODO: проверить id и completed, найти задачу, создать обновлённые данные.

  if (!isValidId(id)) {
    return {ok: false, error: "Некорректный идентификатор"};
  }

  if (completed !== true && completed !== false) {
    return {ok: false,error: "completed должен быть true или false"};
  }

  const taskIndex = findTaskIndex(tasks, id);

  if (taskIndex === -1) {
    return {ok: false,error: "Задача с таким id не найдена"};
  }

  const resultTasks = tasks.map((task, index) => {
    if (index === taskIndex) {
      return {...task, completed};
    }

    return task;
  });

  return {
    ok: true,
    tasks: resultTasks
  };
  
}

export function renameTask(tasks, id, title) {
  // Проверить id и title, изменить только название выбранной задачи.
  if (!isValidId(id)) {
    return { ok: false, error: "Некорректный идентификатор" };
  }

  const titleResult = normalizeTitle(title);

  if (!titleResult.ok) {
    return titleResult;
  }

  const taskIndex = findTaskIndex(tasks, id);

  if (taskIndex === -1) {
    return { ok: false, error: "Задача с таким id не найдена" };
  }

  const resultTasks = tasks.map((task, index) => {
    if (index === taskIndex) {
      return { ...task, title: titleResult.title };
    }

    return task;
  });

  return { ok: true, tasks: resultTasks };
}

export function removeTask(tasks, id) {
  // TODO: проверить id, обработать отсутствие задачи, вернуть новый массив.
  if (!isValidId(id)) {
        return { ok: false, error: "Некорректный идентификатор" };
  }

  if (!tasks.some(task => task.id === id)) {
     return { ok: false, error: "Задача с таким id не найдена" }; 
  } 

return {
     ok: true,
    tasks: tasks.filter(task => task.id !== id)
    };

  
}

function isValidId(id) {
  return typeof id === "number" && Number.isSafeInteger(id) && id > 0;
}

function normalizeTitle(title) {
  if (typeof title !== "string") {
    return { ok: false, error: "title должен быть строкой" };
  }

  const normalizedTitle = title.trim();

  if (normalizedTitle.length < 1 || normalizedTitle.length > 100) {
    return { ok: false, error: "title должен содержать от 1 до 100 символов" };
  }

  return { ok: true, title: normalizedTitle };
}

function validatePriority(priority) {
  if (!["low", "medium", "high"].includes(priority)) {
    return { ok: false, error: 'priority должен быть только "low", "medium" или "high"' };
  }

  return { ok: true, priority };
}

function findTaskIndex(tasks, id) {
  return tasks.findIndex(task => task.id === id);
}
