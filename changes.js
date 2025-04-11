// Здесь хранятся все замены
const scheduleChangesData = [
    {
        para: "2",
        original: "МДК 02.01",
        teacher: "Иванов И.И.",
        replacement: "Физкультура",
        newTeacher: "Петров П.П."
    }
];

// Функция для обновления данных
function updateChangesData(changes) {
    scheduleChangesData.length = 0; // Очищаем массив
    changes.forEach(change => scheduleChangesData.push(change));
} 