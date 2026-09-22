"use strict";

const totalTasks = 14;
const completedTasks = 4;
const dailyLimit = 4;

if (totalTasks >= 0 &&
    totalTasks <= 1000 &&
    completedTasks >= 0 &&
    completedTasks <= totalTasks &&
    Number.isInteger(totalTasks) &&
    Number.isInteger(completedTasks)
) {

    if (typeof dailyLimit === 'string') {
        console.log("Ошибка: дневная норма задана строкой");

    } else if (Number.isNaN(dailyLimit)) {
        console.log("Ошибка: недопустимое числовое значение");

    } else if (dailyLimit < 1) {
        console.log("Ошибка: дневная норма должна быть от 1 до 1000");

    } else if (dailyLimit > 1000) {
        console.log("Ошибка: превышена верхняя граница нормы");

    } else if (Number.isInteger(dailyLimit) === false) {
        console.log("Ошибка: дробной дневной нормы быть не должно");

    } else {

        let remainingTasks = totalTasks - completedTasks;
        let day = 0;

        if (remainingTasks === 0) {
            console.log("Все задачи уже выполнены");
            console.log("Потребуется дней: 0");

        } else {
            console.log("Осталось задач: " + remainingTasks);

            while (remainingTasks > 0) {
                day++;

                const completedToday = Math.min(dailyLimit, remainingTasks);
                remainingTasks -= completedToday;

                console.log(
                    "День " + day +
                    ": выполнено " + completedToday +
                    ", осталось " + remainingTasks
                );
            }

            console.log("Потребуется дней: " + day);
        }
    }

} else if (typeof totalTasks === 'string' || typeof completedTasks === 'string') {
    console.log("Ошибка: вместо числа передана строка");

} else if (totalTasks < 0 || completedTasks < 0) {
    console.log("Ошибка: отрицательное количество");

} else if (totalTasks < completedTasks) {
    console.log("Ошибка: выполнено больше, чем существует");

} else if (Number.isNaN(totalTasks) || Number.isNaN(completedTasks)) {
    console.log("Ошибка: недопустимое числовое значение");

} else if (totalTasks > 1000 || completedTasks > 1000) {
    console.log("Ошибка: превышена верхняя граница.");

} else if (Number.isInteger(totalTasks) === false || Number.isInteger(completedTasks) === false) {
    console.log("Ошибка: дробное количество");
}