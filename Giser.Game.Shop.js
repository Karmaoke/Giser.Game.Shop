// Данные пользователя
let currentUser = null;
let isAdmin = false;

// Данные товаров
let items = [];
let vehicles = [];
let favorites = [];

// DOM элементы
const authContainer = document.getElementById('authContainer');
const mainContent = document.getElementById('mainContent');
const loginBtn = document.getElementById('loginBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const registerLink = document.getElementById('registerLink');
const adminControls = document.getElementById('adminControls');

// Элементы навигации
const mainMenu = document.getElementById('mainMenu');
const moneyMarket = document.getElementById('moneyMarket');
const itemsMarket = document.getElementById('itemsMarket');
const vehiclesMarket = document.getElementById('vehiclesMarket');
const profileSection = document.getElementById('profileSection');
const favoritesSection = document.getElementById('favoritesSection');

// Кнопки продажи
const sellItemBtn = document.getElementById('sellItemBtn');
const sellVehicleBtn = document.getElementById('sellVehicleBtn');

// Модальные окна
const sellItemModal = document.getElementById('sellItemModal');
const sellVehicleModal = document.getElementById('sellVehicleModal');
const itemDetailModal = document.getElementById('itemDetailModal');

// Кнопки закрытия модальных окон
const closeItemModal = document.getElementById('closeItemModal');
const closeVehicleModal = document.getElementById('closeVehicleModal');
const closeDetailModal = document.getElementById('closeDetailModal');
const cancelItemBtn = document.getElementById('cancelItemBtn');
const cancelVehicleBtn = document.getElementById('cancelVehicleBtn');
const closeDetailBtn = document.getElementById('closeDetailBtn');

// Кнопки отправки форм
const submitItemBtn = document.getElementById('submitItemBtn');
const submitVehicleBtn = document.getElementById('submitVehicleBtn');
const contactSellerBtn = document.getElementById('contactSellerBtn');

// Элементы профиля
const profileName = document.getElementById('profileName');
const profileDescription = document.getElementById('profileDescription');
const profileAvatar = document.getElementById('profileAvatar');
const editNickname = document.getElementById('editNickname');
const editTelegram = document.getElementById('editTelegram');
const editGameNumber = document.getElementById('editGameNumber');
const editDescription = document.getElementById('editDescription');
const avatarUpload = document.getElementById('avatarUpload');
const avatarPreview = document.getElementById('avatarPreview');
const saveProfileBtn = document.getElementById('saveProfileBtn');

// Элементы предпросмотра изображений
const itemPhotoPreview = document.getElementById('itemPhotoPreview');
const vehiclePhotoPreview = document.getElementById('vehiclePhotoPreview');
const vehiclePstPreview = document.getElementById('vehiclePstPreview');

// Элементы деталей товара
const detailImage = document.getElementById('detailImage');
const detailTitle = document.getElementById('detailTitle');
const detailPrice = document.getElementById('detailPrice');
const detailBargain = document.getElementById('detailBargain');
const detailDate = document.getElementById('detailDate');
const detailCategory = document.getElementById('detailCategory');
const sellerNickname = document.getElementById('sellerNickname');
const sellerTelegram = document.getElementById('sellerTelegram');
const sellerGameNumber = document.getElementById('sellerGameNumber');

// Сетки товаров
const itemsGrid = document.getElementById('itemsGrid');
const vehiclesGrid = document.getElementById('vehiclesGrid');
const favoritesGrid = document.getElementById('favoritesGrid');

// Навигация в нижнем меню
const navItems = document.querySelectorAll('.nav-item');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Показываем анимацию логотипа на 2.5 секунды
    setTimeout(() => {
        // После анимации показываем форму входа
        authContainer.style.display = 'flex';
    }, 3500);
    
    // Назначаем обработчики событий
    setupEventListeners();
    
    // Загружаем данные из localStorage
    loadData();
});

function setupEventListeners() {
    // Обработчики для входа
    loginBtn.addEventListener('click', handleLogin);
    googleLoginBtn.addEventListener('click', handleGoogleLogin);
    registerLink.addEventListener('click', handleRegister);
    
    // Обработчики для категорий
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            if (category === 'money') {
                showSection(moneyMarket);
            } else if (category === 'items') {
                showSection(itemsMarket);
                renderItems();
            } else if (category === 'vehicles') {
                showSection(vehiclesMarket);
                renderVehicles();
            }
        });
    });
    
    // Обработчики для кнопок продажи
    sellItemBtn.addEventListener('click', () => {
        // Заполняем поля данными из профиля, если они есть
        const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
        document.getElementById('itemNickname').value = userProfile.nickname || '';
        document.getElementById('itemTelegram').value = userProfile.telegram || '';
        document.getElementById('itemGameNumber').value = userProfile.gameNumber || '';
        
        sellItemModal.style.display = 'flex';
    });
    
    sellVehicleBtn.addEventListener('click', () => {
        // Заполняем поля данными из профиля, если они есть
        const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
        document.getElementById('vehicleNickname').value = userProfile.nickname || '';
        document.getElementById('vehicleTelegram').value = userProfile.telegram || '';
        document.getElementById('vehicleGameNumber').value = userProfile.gameNumber || '';
        
        sellVehicleModal.style.display = 'flex';
    });
    
    // Обработчики для закрытия модальных окон
    closeItemModal.addEventListener('click', () => {
        sellItemModal.style.display = 'none';
    });
    
    closeVehicleModal.addEventListener('click', () => {
        sellVehicleModal.style.display = 'none';
    });
    
    closeDetailModal.addEventListener('click', () => {
        itemDetailModal.style.display = 'none';
    });
    
    cancelItemBtn.addEventListener('click', () => {
        sellItemModal.style.display = 'none';
    });
    
    cancelVehicleBtn.addEventListener('click', () => {
        sellVehicleModal.style.display = 'none';
    });
    
    closeDetailBtn.addEventListener('click', () => {
        itemDetailModal.style.display = 'none';
    });
    
    // Обработчики для отправки форм
    submitItemBtn.addEventListener('click', addNewItem);
    submitVehicleBtn.addEventListener('click', addNewVehicle);
    contactSellerBtn.addEventListener('click', contactSeller);
    
    // Обработчик для сохранения профиля
    saveProfileBtn.addEventListener('click', saveProfile);
    
    // Обработчики для загрузки изображений
    avatarUpload.addEventListener('change', function(e) {
        handleImageUpload(e, avatarPreview);
    });
    
    document.getElementById('itemPhoto').addEventListener('change', function(e) {
        handleImageUpload(e, itemPhotoPreview);
    });
    
    document.getElementById('vehiclePhoto').addEventListener('change', function(e) {
        handleImageUpload(e, vehiclePhotoPreview);
    });
    
    document.getElementById('vehiclePst').addEventListener('change', function(e) {
        handleImageUpload(e, vehiclePstPreview);
    });
    
    // Обработчики для навигации
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            
            // Убираем активный класс у всех элементов
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Добавляем активный класс текущему элементу
            this.classList.add('active');
            
            // Показываем соответствующую секцию
            if (page === 'main') {
                showMainMenu();
            } else if (page === 'support') {
                window.open('https://t.me/Karma_0ke', '_blank');
                // Возвращаем активность на главную
                setTimeout(() => {
                    navItems.forEach(navItem => {
                        navItem.classList.remove('active');
                        if (navItem.getAttribute('data-page') === 'main') {
                            navItem.classList.add('active');
                        }
                    });
                }, 100);
            } else if (page === 'favorites') {
                showSection(favoritesSection);
                renderFavorites();
            } else if (page === 'profile') {
                showSection(profileSection);
                loadProfileData();
            }
        });
    });
}

function handleLogin() {
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
        // Проверяем, является ли пользователь админом
        if (email === 'zuzu666527@gmail.com' && password === 'zuzu0885') {
            currentUser = {
                username: 'Admin',
                email: email,
                isAdmin: true
            };
            isAdmin = true;
        } else {
            // Для обычных пользователей
            currentUser = {
                username: email.split('@')[0],
                email: email,
                isAdmin: false
            };
            isAdmin = false;
        }
        
        // Сохраняем данные пользователя
        saveUserData();
        
        // Показываем основной контент
        showMainContent();
    } else {
        alert('Пожалуйста, заполните все поля');
    }
}

function handleGoogleLogin() {
    // В реальном приложении здесь была бы интеграция с Google OAuth
    // Для демонстрации просто создаем случайного пользователя
    const randomId = Math.floor(Math.random() * 10000);
    currentUser = {
        username: `user${randomId}`,
        email: `user${randomId}@gmail.com`,
        isAdmin: false
    };
    
    isAdmin = false;
    
    // Сохраняем данные пользователя
    saveUserData();
    
    // Показываем основной контент
    showMainContent();
}

function handleRegister() {
    // В реальном приложении здесь была бы форма регистрации
    alert('Функция регистрации временно недоступна. Используйте вход через Google или войдите с email: zuzu666527@gmail.com и паролем: zuzu0885 для админ-панели.');
}

function showMainContent() {
    authContainer.style.display = 'none';
    mainContent.style.display = 'block';
    
    // Показываем админские функции, если пользователь админ
    if (isAdmin) {
        adminControls.style.display = 'block';
    }
    
    // Показываем главное меню
    showMainMenu();
}

function showMainMenu() {
    hideAllSections();
    mainMenu.style.display = 'grid';
    
    // Обновляем активную кнопку в навигации
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === 'main') {
            item.classList.add('active');
        }
    });
}

function showSection(section) {
    hideAllSections();
    section.style.display = 'block';
}

function hideAllSections() {
    const sections = [
        mainMenu, 
        moneyMarket, 
        itemsMarket, 
        vehiclesMarket, 
        profileSection, 
        favoritesSection
    ];
    
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

function addNewItem() {
    const nickname = document.getElementById('itemNickname').value;
    const telegram = document.getElementById('itemTelegram').value;
    const gameNumber = document.getElementById('itemGameNumber').value;
    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;
    const bargain = document.getElementById('itemBargain').value;
    const photo = itemPhotoPreview.querySelector('img') ? itemPhotoPreview.querySelector('img').src : '';
    
    if (!nickname || !telegram || !gameNumber || !name || !price) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    const newItem = {
        id: Date.now(),
        nickname,
        telegram,
        gameNumber,
        name,
        price: parseInt(price),
        bargain: bargain === 'yes',
        date: new Date().toLocaleString('ru-RU'),
        seller: currentUser.username,
        photo: photo,
        type: 'item'
    };
    
    items.push(newItem);
    saveItemsData();
    renderItems();
    
    // Закрываем модальное окно и очищаем форму
    sellItemModal.style.display = 'none';
    document.getElementById('itemNickname').value = '';
    document.getElementById('itemTelegram').value = '';
    document.getElementById('itemGameNumber').value = '';
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemBargain').value = 'yes';
    itemPhotoPreview.innerHTML = '';
    
    alert('Товар успешно выставлен на продажу!');
}

function addNewVehicle() {
    const nickname = document.getElementById('vehicleNickname').value;
    const telegram = document.getElementById('vehicleTelegram').value;
    const gameNumber = document.getElementById('vehicleGameNumber').value;
    const model = document.getElementById('vehicleModel').value;
    const price = document.getElementById('vehiclePrice').value;
    const bargain = document.getElementById('vehicleBargain').value;
    const photo = vehiclePhotoPreview.querySelector('img') ? vehiclePhotoPreview.querySelector('img').src : '';
    const pstPhoto = vehiclePstPreview.querySelector('img') ? vehiclePstPreview.querySelector('img').src : '';
    
    if (!nickname || !telegram || !gameNumber || !model || !price) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    const newVehicle = {
        id: Date.now(),
        nickname,
        telegram,
        gameNumber,
        model,
        price: parseInt(price),
        bargain: bargain === 'yes',
        date: new Date().toLocaleString('ru-RU'),
        seller: currentUser.username,
        photo: photo,
        pstPhoto: pstPhoto,
        type: 'vehicle'
    };
    
    vehicles.push(newVehicle);
    saveVehiclesData();
    renderVehicles();
    
    // Закрываем модальное окно и очищаем форму
    sellVehicleModal.style.display = 'none';
    document.getElementById('vehicleNickname').value = '';
    document.getElementById('vehicleTelegram').value = '';
    document.getElementById('vehicleGameNumber').value = '';
    document.getElementById('vehicleModel').value = '';
    document.getElementById('vehiclePrice').value = '';
    document.getElementById('vehicleBargain').value = 'yes';
    vehiclePhotoPreview.innerHTML = '';
    vehiclePstPreview.innerHTML = '';
    
    alert('Транспортное средство успешно выставлено на продажу!');
}

function renderItems() {
    itemsGrid.innerHTML = '';
    
    if (items.length === 0) {
        itemsGrid.innerHTML = '<div class="empty-market"><div class="empty-icon">🎒</div><h3>Рынок пуст</h3><p>Будьте первым, кто выставит товар на продажу!</p></div>';
        return;
    }
    
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.setAttribute('data-id', item.id);
        itemCard.setAttribute('data-type', 'item');
        
        itemCard.innerHTML = `
            <div class="item-image">
                ${item.photo ? `<img src="${item.photo}" alt="${item.name}">` : '<span>🎒</span>'}
            </div>
            <div class="item-details">
                <div class="item-title">${item.name}</div>
                <div class="item-price">${item.price} руб.</div>
                <div class="item-meta">
                    <span>Торг: ${item.bargain ? 'Да' : 'Нет'}</span>
                    <span>${item.date}</span>
                </div>
                <div class="item-seller">
                    <span>Продавец: ${item.nickname}</span>
                    <button class="favorite-btn" data-id="${item.id}" data-type="item">${favorites.some(fav => fav.id === item.id && fav.type === 'item') ? '❤️' : '🤍'}</button>
                </div>
            </div>
        `;
        itemsGrid.appendChild(itemCard);
    });
    
    // Добавляем обработчики для карточек товаров
    document.querySelectorAll('.item-card[data-type="item"]').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('favorite-btn')) {
                const id = parseInt(this.getAttribute('data-id'));
                showItemDetails(id, 'item');
            }
        });
    });
    
    // Добавляем обработчики для кнопок избранного
    document.querySelectorAll('.favorite-btn[data-type="item"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            toggleFavorite(id, 'item', this);
        });
    });
}

function renderVehicles() {
    vehiclesGrid.innerHTML = '';
    
    if (vehicles.length === 0) {
        vehiclesGrid.innerHTML = '<div class="empty-market"><div class="empty-icon">🚗</div><h3>Рынок пуст</h3><p>Будьте первым, кто выставит транспортное средство на продажу!</p></div>';
        return;
    }
    
    vehicles.forEach(vehicle => {
        const vehicleCard = document.createElement('div');
        vehicleCard.className = 'item-card';
        vehicleCard.setAttribute('data-id', vehicle.id);
        vehicleCard.setAttribute('data-type', 'vehicle');
        
        vehicleCard.innerHTML = `
            <div class="item-image">
                ${vehicle.photo ? `<img src="${vehicle.photo}" alt="${vehicle.model}">` : '<span>🚗</span>'}
            </div>
            <div class="item-details">
                <div class="item-title">${vehicle.model}</div>
                <div class="item-price">${vehicle.price} руб.</div>
                <div class="item-meta">
                    <span>Торг: ${vehicle.bargain ? 'Да' : 'Нет'}</span>
                    <span>${vehicle.date}</span>
                </div>
                <div class="item-seller">
                    <span>Продавец: ${vehicle.nickname}</span>
                    <button class="favorite-btn" data-id="${vehicle.id}" data-type="vehicle">${favorites.some(fav => fav.id === vehicle.id && fav.type === 'vehicle') ? '❤️' : '🤍'}</button>
                </div>
            </div>
        `;
        vehiclesGrid.appendChild(vehicleCard);
    });
    
    // Добавляем обработчики для карточек товаров
    document.querySelectorAll('.item-card[data-type="vehicle"]').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('favorite-btn')) {
                const id = parseInt(this.getAttribute('data-id'));
                showItemDetails(id, 'vehicle');
            }
        });
    });
    
    // Добавляем обработчики для кнопок избранного
    document.querySelectorAll('.favorite-btn[data-type="vehicle"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            toggleFavorite(id, 'vehicle', this);
        });
    });
}

function showItemDetails(id, type) {
    let item;
    if (type === 'item') {
        item = items.find(i => i.id === id);
    } else {
        item = vehicles.find(v => v.id === id);
    }
    
    if (!item) return;
    
    // Заполняем модальное окно деталей
    detailImage.src = item.photo || (type === 'item' ? '' : '');
    detailImage.alt = type === 'item' ? item.name : item.model;
    detailTitle.textContent = type === 'item' ? item.name : item.model;
    detailPrice.textContent = `${item.price} руб.`;
    detailBargain.textContent = item.bargain ? 'Да' : 'Нет';
    detailDate.textContent = item.date;
    detailCategory.textContent = type === 'item' ? 'Вещь' : 'Транспортное средство';
    sellerNickname.textContent = item.nickname;
    sellerTelegram.textContent = item.telegram;
    sellerGameNumber.textContent = item.gameNumber;
    
    // Показываем модальное окно
    itemDetailModal.style.display = 'flex';
}

function contactSeller() {
    const telegram = sellerTelegram.textContent;
    if (telegram) {
        window.open(`https://t.me/${telegram.replace('@', '')}`, '_blank');
    } else {
        alert('Телеграм продавца не указан');
    }
}

function renderFavorites() {
    favoritesGrid.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<div class="empty-market"><div class="empty-icon">⭐</div><h3>В избранном пусто</h3><p>Добавьте товары в избранное, чтобы видеть их здесь</p></div>';
        return;
    }
    
    favorites.forEach(fav => {
        let item;
        if (fav.type === 'item') {
            item = items.find(i => i.id === fav.id);
        } else {
            item = vehicles.find(v => v.id === fav.id);
        }
        
        if (!item) return;
        
        const favoriteCard = document.createElement('div');
        favoriteCard.className = 'item-card';
        favoriteCard.setAttribute('data-id', item.id);
        favoriteCard.setAttribute('data-type', fav.type);
        
        favoriteCard.innerHTML = `
            <div class="item-image">
                ${item.photo ? `<img src="${item.photo}" alt="${fav.type === 'item' ? item.name : item.model}">` : `<span>${fav.type === 'item' ? '🎒' : '🚗'}</span>`}
            </div>
            <div class="item-details">
                <div class="item-title">${fav.type === 'item' ? item.name : item.model}</div>
                <div class="item-price">${item.price} руб.</div>
                <div class="item-meta">
                    <span>Торг: ${item.bargain ? 'Да' : 'Нет'}</span>
                    <span>${item.date}</span>
                </div>
                <div class="item-seller">
                    <span>Продавец: ${item.nickname}</span>
                    <button class="favorite-btn active" data-id="${item.id}" data-type="${fav.type}">❤️</button>
                </div>
            </div>
        `;
        favoritesGrid.appendChild(favoriteCard);
    });
    
    // Добавляем обработчики для карточек товаров
    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('favorite-btn')) {
                const id = parseInt(this.getAttribute('data-id'));
                const type = this.getAttribute('data-type');
                showItemDetails(id, type);
            }
        });
    });
    
    // Добавляем обработчики для кнопок избранного
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            const type = this.getAttribute('data-type');
            toggleFavorite(id, type, this);
            
            // Если мы в разделе избранного, перерисовываем список
            if (favoritesSection.style.display === 'block') {
                renderFavorites();
            }
        });
    });
}

function toggleFavorite(id, type, button) {
    const index = favorites.findIndex(fav => fav.id === id && fav.type === type);
    
    if (index === -1) {
        // Добавляем в избранное
        favorites.push({ id, type });
        if (button) button.textContent = '❤️';
        if (button) button.classList.add('active');
    } else {
        // Удаляем из избранного
        favorites.splice(index, 1);
        if (button) button.textContent = '🤍';
        if (button) button.classList.remove('active');
    }
    
    saveFavoritesData();
}

function loadProfileData() {
    const userData = JSON.parse(localStorage.getItem('userProfile')) || {};
    
    editNickname.value = userData.nickname || currentUser.username;
    editTelegram.value = userData.telegram || '';
    editGameNumber.value = userData.gameNumber || '';
    editDescription.value = userData.description || '';
    
    profileName.textContent = userData.nickname || currentUser.username;
    profileDescription.textContent = userData.description || 'Описание профиля';
    
    if (userData.avatar) {
        profileAvatar.innerHTML = `<img src="${userData.avatar}" alt="Аватар">`;
        avatarPreview.innerHTML = `<img src="${userData.avatar}" alt="Аватар">`;
    } else {
        profileAvatar.innerHTML = `<span>${currentUser.username.charAt(0).toUpperCase()}</span>`;
        avatarPreview.innerHTML = '';
    }
}

function saveProfile() {
    const userProfile = {
        nickname: editNickname.value,
        telegram: editTelegram.value,
        gameNumber: editGameNumber.value,
        description: editDescription.value,
        avatar: localStorage.getItem('userAvatar') || ''
    };
    
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Обновляем отображение профиля
    profileName.textContent = userProfile.nickname;
    profileDescription.textContent = userProfile.description;
    
    // Обновляем аватар, если он был загружен
    if (userProfile.avatar) {
        profileAvatar.innerHTML = `<img src="${userProfile.avatar}" alt="Аватар">`;
    }
    
    alert('Профиль успешно сохранен!');
}

function handleImageUpload(e, previewElement) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageDataUrl = event.target.result;
            
            if (previewElement === avatarPreview) {
                localStorage.setItem('userAvatar', imageDataUrl);
            }
            
            previewElement.innerHTML = `<img src="${imageDataUrl}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// Функции для работы с localStorage
function saveUserData() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function saveItemsData() {
    localStorage.setItem('marketItems', JSON.stringify(items));
}

function saveVehiclesData() {
    localStorage.setItem('marketVehicles', JSON.stringify(vehicles));
}

function saveFavoritesData() {
    localStorage.setItem('userFavorites', JSON.stringify(favorites));
}

function loadData() {
    // Загружаем данные пользователя
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAdmin = currentUser.email === 'zuzu666527@gmail.com';
        showMainContent();
    }
    
    // Загружаем товары
    const savedItems = localStorage.getItem('marketItems');
    if (savedItems) {
        items = JSON.parse(savedItems);
    }
    
    // Загружаем транспортные средства
    const savedVehicles = localStorage.getItem('marketVehicles');
    if (savedVehicles) {
        vehicles = JSON.parse(savedVehicles);
    }
    
    // Загружаем избранное
    const savedFavorites = localStorage.getItem('userFavorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }
}