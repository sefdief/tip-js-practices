"use strict";

const totalText = "12";
const completedText = "5";

if (typeof totalText !== "string" || typeof completedText !== "string") {
    console.log("Ошибка: данные должны быть строками");
} else {
    const total = totalText.trim();
    const completed = completedText.trim();

    if (total === "" || completed === "") {
        console.log("Ошибка: пустой ввод");
    } else {
        const totalTasks = Number(total);
        const completedTasks = Number(completed);

        if (Number.isNaN(totalTasks) || Number.isNaN(completedTasks)) {
            console.log("Ошибка: недопустимое числовое значение");
        } else if (
            !Number.isFinite(totalTasks) ||
            !Number.isFinite(completedTasks)
        ) {
            console.log("Ошибка: число должно быть конечным");
        } else if (
            totalTasks < 0 ||
            completedTasks < 0
        ) {
            console.log("Ошибка: отрицательное количество");
        } else if (totalTasks > 1000 || completedTasks > 1000) {
            console.log("Ошибка: превышена верхняя граница");
        } else if (completedTasks > totalTasks) {
            console.log("Ошибка: выполнено больше, чем существует");
        } else if (
            !Number.isInteger(totalTasks) ||
            !Number.isInteger(completedTasks)
        ) {
            console.log("Ошибка: дробное количество");
        } else {
            const remainingTasks = totalTasks - completedTasks;
            const progress = totalTasks === 0
                ? 0
                : Math.round(completedTasks / totalTasks * 100);

            console.log("Всего задач:", totalTasks);
            console.log("Выполнено:", completedTasks);
            console.log("Осталось:", remainingTasks);
            console.log("Прогресс:", progress + "%");
        }
    }
}