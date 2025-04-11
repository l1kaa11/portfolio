<?php
header('Content-Type: application/json');

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Метод не поддерживается']));
}

// Получаем данные из POST-запроса
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    die(json_encode(['error' => 'Неверный формат данных']));
}

// Формируем содержимое для changes.js
$jsContent = "// Здесь хранятся все замены\nconst scheduleChangesData = " . 
    json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . ";\n\n" .
    "// Функция для обновления данных\n" .
    "function updateChangesData(changes) {\n" .
    "    scheduleChangesData.length = 0; // Очищаем массив\n" .
    "    changes.forEach(change => scheduleChangesData.push(change));\n" .
    "}";

// Записываем данные в файл
if (file_put_contents('changes.js', $jsContent) === false) {
    http_response_code(500);
    die(json_encode(['error' => 'Ошибка при сохранении данных']));
}

// Отправляем успешный ответ
echo json_encode(['success' => true]); 