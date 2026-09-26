// Тестовые данные (в будущем они будут прилетать из бэкенда/Firebase)
const achievementsData = [
    {
        id: 1,
        title: "Запустил этот сайт",
        date: "26 Сентября 2026",
        icon: "🚀",
        fullDescription: "Первая рабочая версия доски достижений успешно развернута на GitHub Pages! Написан чистый код на связке HTML/CSS/JS."
    },
    {
        id: 2,
        title: "Изучил основы Git",
        date: "24 Сентября 2026",
        icon: "💻",
        fullDescription: "Освоил команды git init, commit, push. Теперь проект синхронизируется с репозиторием на GitHub напрямую из PyCharm."
    },
    {
        id: 3,
        title: "Прочитал 5 глав книги по JS",
        date: "20 Сентября 2026",
        icon: "📚",
        fullDescription: "Разобрался с тем, как устроены объекты, массивы и как динамически манипулировать DOM элементами на странице."
    }
];

const grid = document.getElementById('achievementsGrid');
const modal = document.getElementById('achievementModal');
const closeModalBtn = document.getElementById('closeModal');

// Функция отрисовки плашек на главной странице
function renderAchievements() {
    grid.innerHTML = '';
    achievementsData.forEach(ach => {
        const card = document.createElement('div');
        card.classList.add('achievement-card');
        card.innerHTML = `
            <div class="card-icon">${ach.icon}</div>
            <h3 class="card-title">${ach.title}</h3>
            <span class="card-date">${ach.date}</span>
        `;

        // Вешаем событие клика для открытия модалки
        card.addEventListener('click', () => openModal(ach));
        grid.appendChild(card);
    });
}

// Открытие модального окна с деталями
function openModal(ach) {
    document.getElementById('modalIcon').innerText = ach.icon;
    document.getElementById('modalTitle').innerText = ach.title;
    document.getElementById('modalDate').innerText = ach.date;
    document.getElementById('modalDesc').innerText = ach.fullDescription;

    modal.style.display = 'flex';
}

// Закрытие модального окна
closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Запуск при загрузке страницы
renderAchievements();