// Список студентов группы
const allStudents = [
    'Андреев Иван Александрович',
    'Багаутдинова Камила Ринатовна',
    'Васильев Евгений Николаевич',
    'Габидуллина Азалия Рафаэлевна', // Не дежурит
    'Кабанов Владислав Алексеевич',
    'Казаков Раниль Ильмирович',
    'Кожевников Виктор Алексеевич',
    'Колесников Илья Александрович',
    'Кондрашев Иван Станиславович',
    'Косынко Данил Эдуардович',
    'Краснов Владимир Дмитриевич',
    'Кривовязов Сергей Николаевич',
    'Ликандрин Кирилл Константинович', // Не дежурит
    'Манашев Рифат Ильдарович',
    'Миляев Никита Алексеевич',
    'Мугинова Рина Асхатовна',
    'Мустаев Рамиль Айзулович',
    'Нугуманов Тимур Русланович',
    'Ризванов Амир Аликович',
    'Салмина Ульяна Алексеевна',
    'Сергеев Данила Андреевич',
    'Сорокин Иван Александрович',
    'Таркин Артём Юрьевич', // Не дежурит
    'Шестаков Александр Сергеевич',
    'Щербаков Марат Евгеньевич'
];

// Список студентов, которые могут дежурить (исключаем определенных студентов)
const students = allStudents.filter((_, index) => ![3, 12, 22].includes(index));

// Список болеющих студентов (будет обновляться через админ-панель)
let sickStudents = [];

// Массив для хранения замен
let scheduleChanges = [];

// Добавим глобальную переменную для отслеживания статуса админа
let isAdmin = false;

// Функция для получения дежурных на конкретную дату
function getDutyPersonsForDate(date) {
    const startDate = new Date('2024-01-01');
    const daysPassed = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
    
    // Получаем доступных студентов (исключая болеющих)
    const availableStudents = students.filter(student => !sickStudents.includes(student));
    const totalStudents = availableStudents.length;
    
    // Если осталось меньше 2 доступных студентов, вернуть сообщение об ошибке
    if (totalStudents < 2) {
        return ['Недостаточно студентов для дежурства', 'Слишком много болеющих'];
    }
    
    // Определяем индексы дежурных
    const firstStudentIndex = (daysPassed * 2) % totalStudents;
    const secondStudentIndex = (daysPassed * 2 + 1) % totalStudents;
    
    // Проверяем, что второй индекс не выходит за пределы массива
    if (secondStudentIndex >= totalStudents) {
        return [availableStudents[firstStudentIndex], availableStudents[0]];
    }
    
    return [availableStudents[firstStudentIndex], availableStudents[secondStudentIndex]];
}

// Функция для определения текущих дежурных
function getCurrentDutyPersons() {
    return getDutyPersonsForDate(new Date());
}

// Функция для отображения календаря дежурств
function displayDutyCalendar() {
    const calendarContainer = document.getElementById('duty-calendar');
    calendarContainer.innerHTML = '';

    const today = new Date();
    const weekDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];

    // Создаем календарь на неделю вперед
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // Пропускаем выходные
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        const dutyPersons = getDutyPersonsForDate(date);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'duty-day';
        
        // Проверяем, является ли день текущим
        const currentDate = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        if (date.getDate() === currentDate && 
            date.getMonth() === currentMonth && 
            date.getFullYear() === currentYear) {
            dayElement.classList.add('current-day');
        }
        
        dayElement.innerHTML = `
            <h4>${weekDays[date.getDay() - 1]}, ${date.toLocaleDateString()}</h4>
            <p>Дежурные:</p>
            <p>1. ${dutyPersons[0]}</p>
            <p>2. ${dutyPersons[1]}</p>
        `;
        calendarContainer.appendChild(dayElement);
    }
}

// Обновление информации о дежурных
function updateDutyInfo() {
    const dutyPersons = getCurrentDutyPersons();
    const dutyContainer = document.getElementById('current-duty-person');
    dutyContainer.innerHTML = `
        <p>Сегодня дежурят:</p>
        <p>1. ${dutyPersons[0]}</p>
        <p>2. ${dutyPersons[1]}</p>
    `;
}

// Функции для админ-панели
function showAdminPanel() {
    const adminPanel = document.getElementById('admin-panel');
    adminPanel.style.display = 'block';
}

function hideAdminPanel() {
    const adminPanel = document.getElementById('admin-panel');
    adminPanel.style.display = 'none';
    isAdmin = false;
}

function loginAdmin() {
    const password = document.getElementById('admin-password').value;
    if (password === '125690kir') {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        isAdmin = true;
        initializeAdminPanel();
    } else {
        alert('Неверный пароль');
    }
}

function updateSickStudents() {
    const checkedStudents = Array.from(document.querySelectorAll('.student-item input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.id.replace('student-', ''));
    
    sickStudents = checkedStudents;
    localStorage.setItem('sickStudents', JSON.stringify(sickStudents));
    
    // Обновляем отображение
    updateDutyInfo();
    displayDutyCalendar();
    
    showNotification('Список болеющих студентов обновлен');
}

// Функция для определения текущей недели (числитель/знаменатель)
function isNumerator() {
    const today = new Date();
    const startDate = new Date('2024-01-08'); // Дата начала семестра
    const weeksPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24 * 7));
    return weeksPassed % 2 === 0;
}

// Функция для отображения расписания
function displaySchedule() {
    const scheduleContainer = document.querySelector('.schedule');
    scheduleContainer.innerHTML = ''; // Очищаем контейнер
    const isNumeratorWeek = isNumerator();

    const schedule = {
        'Понедельник': [
            { number: 1, subject: 'Классный час' },
            { number: 2, subject: 'МДК 02.02', room: '1.2.4' },
            { number: 3, subject: 'Компьютерные сети', room: '1.2.1' },
            { number: 4, subject: 'Численные методы', room: '2.3.3' },
            { number: 5, subject: 'Информационные технологии', room: '2.3.3' }
        ],
        'Вторник': [
            { number: 1, subject: 'МДК 02.01', room: '2.3.10' },
            { number: 2, subject: 'Дискретная математика', room: '1.2.3' },
            { number: 3, subject: 'МДК 03.01', room: '2.2.1' },
            { number: 4, subject: isNumeratorWeek ? '—' : 'Эл.высш.математики', room: '2.2.1' }
        ],
        'Среда': [
            { number: 1, subject: 'Основы проектирования БД' },
            { number: 2, subject: 'МДК 02.03', room: '1.1.2' },
            { number: 3, subject: 'Эл.Высш.математики', room: '1.2.3' },
            { number: 4, subject: isNumeratorWeek ? 'МДК 03.01' : 'МДК 03.02' }
        ],
        'Четверг': [
            { number: 1, subject: 'Физкультура' },
            { number: 2, subject: 'Иностр.язык' },
            { number: 3, subject: 'МДК 02.01' },
            { number: 4, subject: 'МДК 03.02' }
        ],
        'Пятница': [
            { number: 1, subject: isNumeratorWeek ? 'Числ.методы' : 'Основы философии' },
            { number: 2, subject: 'МДК 02.02' },
            { number: 3, subject: isNumeratorWeek ? 'Основы философии' : '—' }
        ]
    };

    const weekType = document.createElement('div');
    weekType.className = 'week-type';
    weekType.textContent = isNumeratorWeek ? 'Числитель' : 'Знаменатель';
    scheduleContainer.appendChild(weekType);

    for (const [day, lessons] of Object.entries(schedule)) {
        const dayElement = document.createElement('div');
        dayElement.className = 'schedule-day';
        
        const dayHeader = document.createElement('h3');
        dayHeader.textContent = day;
        dayElement.appendChild(dayHeader);

        lessons.forEach(lesson => {
            const lessonElement = document.createElement('p');
            lessonElement.textContent = `${lesson.number}. ${lesson.subject}${lesson.room ? ` (${lesson.room})` : ''}`;
            dayElement.appendChild(lessonElement);
        });

        scheduleContainer.appendChild(dayElement);
    }
}

// Функция для обновления изменений в расписании
async function updateScheduleChanges() {
    const changesContainer = document.getElementById('schedule-changes-list');
    changesContainer.innerHTML = '';

    // Загружаем сохраненные замены
    const savedChanges = localStorage.getItem('scheduleChanges');
    if (savedChanges) {
        scheduleChanges = JSON.parse(savedChanges);
    }

    if (!Array.isArray(scheduleChanges) || scheduleChanges.length === 0) {
        changesContainer.innerHTML = '<p class="no-changes">На сегодня замен нет</p>';
    } else {
        scheduleChanges.forEach((change, index) => {
            // Проверяем, что хотя бы одно из полей замены не пустое и не содержит прочерк
            if (change.original !== '—' || change.replacement !== '—' || 
                change.teacher !== '—' || change.newTeacher !== '—') {
                const changeElement = document.createElement('div');
                changeElement.className = 'change-item';
                changeElement.innerHTML = `
                    <h4>${change.para ? change.para + '-я пара' : 'Без номера пары'}</h4>
                    <p>Было: ${change.original} (${change.teacher})</p>
                    <p>Стало: ${change.replacement} (${change.newTeacher})</p>
                    ${isAdmin ? `<button onclick="deleteChange(${index})" class="delete-change">Удалить</button>` : ''}
                `;
                changesContainer.appendChild(changeElement);
            }
        });
    }

    // Обновляем время последнего обновления
    document.getElementById('last-update-time').textContent = new Date().toLocaleString();
}

// Функция для добавления новой замены
function addScheduleChange() {
    // Получаем значения полей
    const para = document.getElementById('change-para').value.trim();
    const original = document.getElementById('change-original').value.trim();
    const teacher = document.getElementById('change-teacher').value.trim();
    const replacement = document.getElementById('change-replacement').value.trim();
    const newTeacher = document.getElementById('change-new-teacher').value.trim();

    const change = {
        para: parseInt(para) || '',
        original: original || '—',
        teacher: teacher || '—',
        replacement: replacement || '—',
        newTeacher: newTeacher || '—'
    };

    // Инициализируем массив, если он пустой
    if (!Array.isArray(scheduleChanges)) {
        scheduleChanges = [];
    }

    scheduleChanges.push(change);
    localStorage.setItem('scheduleChanges', JSON.stringify(scheduleChanges));
    
    // Очищаем форму
    document.getElementById('changes-form').reset();
    
    // Обновляем отображение
    updateScheduleChanges();
    
    // Показываем уведомление
    showNotification('Замена добавлена');
}

// Функция для удаления замены
function deleteChange(index) {
    scheduleChanges.splice(index, 1);
    localStorage.setItem('scheduleChanges', JSON.stringify(scheduleChanges));
    updateScheduleChanges();
    showNotification('Замена удалена');
}

// Функция для очистки всех замен
function clearAllChanges() {
    if (confirm('Вы уверены, что хотите удалить все замены?')) {
        scheduleChanges = [];
        localStorage.setItem('scheduleChanges', JSON.stringify(scheduleChanges));
        updateScheduleChanges();
        showNotification('Все замены удалены');
    }
}

// Функция для загрузки файла с заменами
function loadChangesFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            const lines = content.split('\n');
            const newChanges = [];

            lines.forEach(line => {
                if (line.trim()) {
                    const parts = line.split('|').map(part => part.trim());
                    if (parts.length >= 5) {
                        newChanges.push({
                            para: parts[0] || '—',
                            original: parts[1] || '—',
                            teacher: parts[2] || '—',
                            replacement: parts[3] || '—',
                            newTeacher: parts[4] || '—'
                        });
                    }
                }
            });

            if (newChanges.length > 0) {
                scheduleChanges = newChanges;
                localStorage.setItem('scheduleChanges', JSON.stringify(scheduleChanges));
                updateScheduleChanges();
                showNotification('Замены успешно загружены из файла', 'success');
            }
        } catch (error) {
            showNotification('Ошибка при чтении файла', 'error');
            console.error('Error reading file:', error);
        }
    };
    reader.readAsText(file);
}

// Функция для инициализации списка студентов в админ-панели
function initializeAdminPanel() {
    const studentsGrid = document.querySelector('.students-grid');
    studentsGrid.innerHTML = ''; // Очищаем контейнер
    
    // Создаем элементы для каждого студента
    students.forEach(student => {
        const item = document.createElement('div');
        item.className = 'student-item';
        if (sickStudents.includes(student)) {
            item.classList.add('sick');
        }
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `student-${student}`;
        checkbox.checked = sickStudents.includes(student);
        
        const label = document.createElement('label');
        label.htmlFor = `student-${student}`;
        label.textContent = student;
        
        // Обработчик изменения состояния
        checkbox.addEventListener('change', () => {
            item.classList.toggle('sick');
            updateSickStudents();
        });
        
        item.appendChild(checkbox);
        item.appendChild(label);
        studentsGrid.appendChild(item);
    });

    // Инициализация формы замен
    const changesForm = document.getElementById('changes-form');
    changesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addScheduleChange();
    });
}

// Загрузка сохраненного списка болеющих при старте
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем список болеющих из localStorage
    const savedSickStudents = localStorage.getItem('sickStudents');
    if (savedSickStudents) {
        sickStudents = JSON.parse(savedSickStudents);
    }
    
    updateDutyInfo();
    displaySchedule();
    updateScheduleChanges();
    displayDutyCalendar();
    initializeAdminPanel();
    
    // Обновляем изменения каждые 30 минут
    setInterval(updateScheduleChanges, 30 * 60 * 1000);
}); 