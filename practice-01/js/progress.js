"use strict";

const totalTasks = 14;
const completedTasks = 4;

if (totalTasks >= 0 &&
    totalTasks <= 1000 &&
    completedTasks >= 0 &&
    completedTasks <= totalTasks &&
    Number.isInteger(totalTasks) &&
    Number.isInteger(completedTasks)
) {
    const Tasksleft = totalTasks - completedTasks;

    if (totalTasks === 0 && completedTasks === 0) {
        console.log("Задач пока нет");
    } else {
        const pr = completedTasks / totalTasks * 100;
        const progress = Math.round(pr * 10) / 10;
        let status = "В работе";

        if (progress === 0) {
            status = "Не начато";
        } else if (completedTasks === totalTasks) {
            status = "Завершено";
        }

        console.log(
            "Всего задач: " + totalTasks + "\n" +
            "Выполнено: " + completedTasks + "\n" +
            "Осталось: " + Tasksleft + "\n" +
            "Прогресс: " + progress + "%\n" +
            "Статус: " + "«" + status + "»"
        );
    }

} else if (typeof totalTasks === 'string' || typeof completedTasks === 'string') {
    console.log("Ошибка: вместо числа передана строка");

} else if (totalTasks < 0 || completedTasks < 0) {
    console.log("Ошибка: отрицательное количество");

} else if (totalTasks < completedTasks) {
    console.log("Ошибка: выполнено больше, чем существует");

} else if (Number.isNaN(totalTasks) || Number.isNaN(completedTasks)){
    console.log("Ошибка: недопустимое числовое значение");

} else if (totalTasks > 1000 || completedTasks > 1000) {
    console.log("Ошибка: превышена верхняя граница.");

} else if (Number.isInteger(totalTasks) === false || Number.isInteger(completedTasks) === false) {
    console.log("Ошибка: дробное количество");
}