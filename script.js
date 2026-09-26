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

function openModal(ach) {
    document.getElementById('modalIcon').innerText = ach.icon;
    document.getElementById('modalTitle').innerText = ach.title;
    document.getElementById('modalDate').innerText = ach.date;
    document.getElementById('modalDesc').innerText = ach.fullDescription;
    modal.style.display = 'flex';
}
closeModalBtn.addEventListener('click', () => modal.style.display = 'none');

// --- ЛОГИКА ДВИЖЕНИЯ С ИНЕРЦИЕЙ И ПРЕЛОМЛЕНИЕМ (APPLE WATCH) ---
let isDragging = false;
let startX, startY;
let currentX = 0, currentY = 0;
let targetX = 0, targetY = 0;
const ease = 0.1; // Коэффициент плавности инерции (чем меньше, тем плавнее)

// Центрирование при старте
function initCenter() {
    const initLeft = (grid.scrollWidth - window.innerWidth) / 2;
    const initTop = (grid.scrollHeight - window.innerHeight) / 2;
    targetX = -initLeft;
    targetY = -initTop;
    currentX = targetX;
    currentY = targetY;
}

// Слушатели мыши
viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - targetX;
    startY = e.clientY - targetY;
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    targetX = e.clientX - startX;
    targetY = e.clientY - startY;
});

window.addEventListener('mouseup', () => isDragging = false);

// Слушатели тач-скринов
viewport.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX - targetX;
    startY = e.touches[0].clientY - targetY;
});
window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    targetX = e.touches[0].clientX - startX;
    targetY = e.touches[0].clientY - startY;
});
window.addEventListener('touchend', () => isDragging = false);

// Магическая функция анимации преломления на периферии
function updateAnimation() {
    // Реализация плавного инерционного скольжения холста
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    grid.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    // Эффект линзы Apple Watch для каждой карточки отдельно
    const cards = document.querySelectorAll('.achievement-card');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const maxDistance = Math.min(centerX, centerY) * 1.3; // Радиус начала искажения

    cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        // Вычисляем расстояние соты от центра экрана
        const distX = cardCenterX - centerX;
        const distY = cardCenterY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Расчет базового смещения для шахматной сетки граней из CSS
        const baseTranslateY = (index % 4 === 1 || index % 4 === 3) ? (rect.height / 2 + 8) : 0;

        if (distance < maxDistance) {
            // Эффект сферы: соты в центре крупные (масштаб 1), к краям пропорционально сжимаются
            const progress = distance / maxDistance;
            const scale = 1 - Math.pow(progress, 2) * 0.45; // Уменьшение до 55% на самом краю
            const opacity = 1 - Math.pow(progress, 3) * 0.6; // Плавное исчезновение к периферии

            card.style.transform = `translateY(${baseTranslateY}px) scale(${scale})`;
            card.style.opacity = opacity;
        } else {
            // За границей видимости сильно сжимаем и скрываем
            card.style.transform = `translateY(${baseTranslateY}px) scale(0.55)`;
            card.style.opacity = 0.4;
        }
    });

    requestAnimationFrame(updateAnimation);
}

// Запуск
renderAchievements();
initCenter();
requestAnimationFrame(updateAnimation);
