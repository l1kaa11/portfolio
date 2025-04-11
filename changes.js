// Здесь хранятся все замены
const scheduleChangesData = [
    // Пример структуры замены:
    // {
    //     para: "1",
    //     original: "Математика",
    //     teacher: "Иванов И.И.",
    //     replacement: "Информатика",
    //     newTeacher: "Петров П.П."
    // }
];

// Функция для обновления данных
function updateChangesData(changes) {
    scheduleChangesData.length = 0; // Очищаем массив
    changes.forEach(change => scheduleChangesData.push(change));
} 