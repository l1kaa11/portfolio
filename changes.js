const scheduleChangesData = [];

// Функция для обновления данных
function updateChangesData(changes) {
    scheduleChangesData.length = 0; // Очищаем массив
    changes.forEach(change => scheduleChangesData.push(change));
} 