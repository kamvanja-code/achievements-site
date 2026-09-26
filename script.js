const achievementsData = [
    { id: 1, title: "Запустил этот сайт", date: "26 Сентября 2026", icon: "🚀", fullDescription: "Первая рабочая версия доски достижений успешно развернута на GitHub Pages!" },
    { id: 2, title: "Изучил основы Git", date: "24 Сентября 2026", icon: "💻", fullDescription: "Освоил команды git init, commit, push через интерфейс PyCharm." },
    { id: 3, title: "Прочитал 5 глав по JS", date: "20 Сентября 2026", icon: "📚", fullDescription: "Разобрался с тем, как устроены объекты, массивы и динамический DOM." },
    { id: 4, title: "Сетки и интерфейсы", date: "26 Сентября 2026", icon: "📐", fullDescription: "Освоил продвинутый CSS Grid и математический расчет формулы clip-path для создания идеальных гексагонов." },
    { id: 5, title: "Дизайн Apple Watch", date: "26 Сентября 2026", icon: "⌚", fullDescription: "Воссоздал уникальную сотовую структуру умных часов с бесконечным холстом перетаскивания." },
    { id: 6, title: "Тайм-менеджмент", date: "15 Сентября 2026", icon: "⏱️", fullDescription: "Начал вести ежедневное планирование задач, повысив личную продуктивность." },
    { id: 7, title: "Спортивный рекорд", date: "10 Сентября 2026", icon: "🏃‍♂️", fullDescription: "Пробежал свои первые 5 километров без остановки с отличным временем." },
    { id: 8, title: "Изучаю бэкенд", date: "В процессе", icon: "🛡️", fullDescription: "Планирую подключить к этой сотовой системе облачную базу данных Supabase." }
];

const viewport = document.getElementById('viewport');
const grid = document.getElementById('achievementsGrid');
const modal = document.getElementById('achievementModal');
const closeModalBtn = document.getElementById('closeModal');

// Отрисовка сот
function renderAchievements() {
    grid.innerHTML = '';
    achievementsData.forEach(ach => {
        const card = document.createElement('div');
        card.classList.add('achievement-card');
        card.innerHTML = `
            <div class="card-icon">${ach.icon}</div>
            <h3 class="card-title">${ach.title}</h3>
        `;
        card.addEventListener('click', () => openModal(ach));
        grid.appendChild(card);
    });
}

// Открытие / закрытие модалки
function openModal(ach) {
    document.getElementById('modalIcon').innerText = ach.icon;
    document.getElementById('modalTitle').innerText = ach.title;
    document.getElementById('modalDate').innerText = ach.date;
    document.getElementById('modalDesc').innerText = ach.fullDescription;
    modal.style.display = 'flex';
}
closeModalBtn.addEventListener('click', () => modal.style.display = 'none');

// --- ЛОГИКА СВЕРХПЛАВНОГО ПЕРЕТАСКИВАНИЯ МЫШЬЮ (ДРАГ-ЭНД-ДРОП) ---
let isDown = false;
let startX, startY;
let scrollLeft, scrollTop;

// Центрируем холст при загрузческие
function centerGrid() {
    viewport.scrollLeft = (grid.scrollWidth - viewport.clientWidth) / 2;
    viewport.scrollTop = (grid.scrollHeight - viewport.clientHeight) / 2;
}

viewport.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - viewport.offsetLeft;
    startY = e.pageY - viewport.offsetTop;
    scrollLeft = viewport.scrollLeft;
    scrollTop = viewport.scrollTop;
});

viewport.addEventListener('mouseleave', () => isDown = false);
viewport.addEventListener('mouseup', () => isDown = false);

viewport.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const y = e.pageY - viewport.offsetTop;
    // Множитель 1.5 отвечает за скорость и отзывчивость пролистывания
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    viewport.scrollLeft = scrollLeft - walkX;
    viewport.scrollTop = scrollTop - walkY;
});

// Поддержка тач-скринов для смартфонов
viewport.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - viewport.offsetLeft;
    startY = e.touches[0].pageY - viewport.offsetTop;
    scrollLeft = viewport.scrollLeft;
    scrollTop = viewport.scrollTop;
});
viewport.addEventListener('touchend', () => isDown = false);
viewport.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - viewport.offsetLeft;
    const y = e.touches[0].pageY - viewport.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    viewport.scrollLeft = scrollLeft - walkX;
    viewport.scrollTop = scrollTop - walkY;
});

// Запуск
renderAchievements();
window.onload = centerGrid;
