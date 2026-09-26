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

// Отрисовка сот: теперь иконка и текст обернуты во внутренний контейнер .card-content
function renderAchievements() {
    grid.innerHTML = '';
    achievementsData.forEach(ach => {
        const card = document.createElement('div');
        card.classList.add('achievement-card');
        card.innerHTML = `
            <div class="card-content">
                <div class="card-icon">${ach.icon}</div>
                <h3 class="card-title">${ach.title}</h3>
            </div>
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

// --- ЛОГИКА ДВИЖЕНИЯ С ИНЕРЦИЕЙ И ФИКСИРОВАННЫМИ ГРАНЯМИ ---
let isDragging = false;
let startX, startY;
let currentX = 0, currentY = 0;
let targetX = 0, targetY = 0;
const ease = 0.12;

// Улучшенное идеальное центрирование облака сот по центру экрана
function initCenter() {
    const hexWidth = 155; // Должно совпадать с --hex-width из CSS
    const hexHeight = hexWidth * 0.866;

    // Вычисляем точные координаты центра холста со смещением на половину соты
    const initLeft = (grid.scrollWidth - window.innerWidth) / 2 + (hexWidth / 4);
    const initTop = (grid.scrollHeight - window.innerHeight) / 2 - (hexHeight / 4);

    targetX = -initLeft;
    targetY = -initTop;
    currentX = targetX;
    currentY = targetY;
}

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

viewport.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches.clientX - targetX;
    startY = e.touches.clientY - targetY;
});
viewport.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    targetX = e.touches.clientX - startX;
    targetY = e.touches.clientY - startY;
});
viewport.addEventListener('touchend', () => isDragging = false);

function updateAnimation() {
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    grid.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    const cards = document.querySelectorAll('.achievement-card');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const maxDistance = Math.min(centerX, centerY) * 0.85;

    cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        const distX = cardCenterX - centerX;
        const distY = cardCenterY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Стандартный сдвиг рядов по вертикали для стыковки граней
        const baseTranslateY = (index % 4 === 1 || index % 4 === 3) ? (rect.height / 2 + 7) : 0;

        // Находим внутреннее содержимое соты
        const cardContent = card.querySelector('.card-content');

        if (distance < maxDistance) {
            const progress = distance / maxDistance;
            const scale = 1 - Math.pow(progress, 2) * 0.5;
            const opacity = 1 - Math.pow(progress, 2) * 0.55;

            // КАРКАС СОТЫ (card): Перемещается, но НЕ масштабируется. Зазоры стабильны!
            card.style.transform = `translateY(${baseTranslateY}px)`;
            card.style.opacity = opacity;

            // КОНТЕНТ (иконка + текст): Преломляется и сжимается внутри соты
            if (cardContent) {
                cardContent.style.transform = `scale(${scale})`;
            }
        } else {
            // За пределами радиуса видимости
            card.style.transform = `translateY(${baseTranslateY}px)`;
            card.style.opacity = 0.35;
            if (cardContent) {
                cardContent.style.transform = `scale(0.5)`;
            }
        }
    });

    requestAnimationFrame(updateAnimation);
}

renderAchievements();
initCenter();
requestAnimationFrame(updateAnimation);
