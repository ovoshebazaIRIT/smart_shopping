/*
 * Данные каталога «Умный Шопинг».
 * Сгенерировано из TS-версии, зависимостей нет: подключается обычным <script>.
 */
(function () {
  'use strict';

const CATEGORIES = [
  { id: 'electronics', title: 'Электроника' },
  { id: 'audio', title: 'Аудио и наушники' },
  { id: 'appliances', title: 'Бытовая техника' },
  { id: 'clothing', title: 'Одежда и обувь' },
];

/** Быстрый переход к популярным видам товаров на главной. */
const QUICK_LINKS = [
  { id: 'phones', title: 'Смартфоны', query: 'смартфон' },
  { id: 'tv', title: 'Телевизоры', query: 'телевизор' },
  { id: 'laptops', title: 'Ноутбуки', query: 'ноутбук' },
  { id: 'headphones', title: 'Наушники', query: 'наушники' },
];

const SHOPS = [
  { id: 'dns', name: 'DNS', rating: 4.7, reviews: 158430 },
  { id: 'mvideo', name: 'М.Видео', rating: 4.4, reviews: 96320 },
  { id: 'ozon', name: 'Ozon', rating: 4.6, reviews: 412870 },
  { id: 'wb', name: 'Wildberries', rating: 4.5, reviews: 508140 },
  { id: 'citilink', name: 'Ситилинк', rating: 4.6, reviews: 74210 },
  { id: 'ymarket', name: 'Яндекс Маркет', rating: 4.5, reviews: 187460 },
  { id: 'lamoda', name: 'Lamoda', rating: 4.3, reviews: 58940 },
  { id: 'eldorado', name: 'Эльдорадо', rating: 4.2, reviews: 63180 },
];

const SHOP_BY_ID = Object.fromEntries(
  SHOPS.map((shop) => [shop.id, shop]),
);

const CATEGORY_BY_ID = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
);;

/**
 * Демонстрационный набор товаров и предложений.
 * На следующем этапе данные будут приходить из API агрегатора,
 * структура `Product` уже описывает нужный формат ответа.
 */
const PRODUCTS = [
  {
    id: 'iphone-16-128',
    title: 'Смартфон Apple iPhone 16 128 ГБ',
    brand: 'Apple',
    category: 'electronics',
    specs: ['6.1" OLED', 'A18', '128 ГБ', 'камера 48 Мп'],
    rating: 4.9,
    reviews: 2140,
    offers: [
      { shopId: 'dns', price: 79990, deliveryCost: 0, deliveryDays: 1, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'ozon', price: 76990, deliveryCost: 199, deliveryDays: 2, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'mvideo', price: 81990, deliveryCost: 0, deliveryDays: 1, pickup: true, inStock: false, warrantyMonths: 24 },
      { shopId: 'citilink', price: 78490, deliveryCost: 390, deliveryDays: 3, pickup: true, inStock: true, warrantyMonths: 12 },
    ],
  },
  {
    id: 'samsung-s25-256',
    title: 'Смартфон Samsung Galaxy S25 256 ГБ',
    brand: 'Samsung',
    category: 'electronics',
    specs: ['6.2" AMOLED', 'Snapdragon 8', '256 ГБ', 'камера 50 Мп'],
    rating: 4.8,
    reviews: 1680,
    offers: [
      { shopId: 'mvideo', price: 71990, deliveryCost: 0, deliveryDays: 2, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'ozon', price: 69990, deliveryCost: 0, deliveryDays: 3, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'wb', price: 68490, deliveryCost: 0, deliveryDays: 4, pickup: true, inStock: true, warrantyMonths: 12 },
    ],
  },
  {
    id: 'xiaomi-15t-256',
    title: 'Смартфон Xiaomi 15T 256 ГБ',
    brand: 'Xiaomi',
    category: 'electronics',
    specs: ['6.83" AMOLED', 'Dimensity 8400', '256 ГБ', 'быстрая зарядка 67 Вт'],
    rating: 4.7,
    reviews: 980,
    offers: [
      { shopId: 'ozon', price: 46990, deliveryCost: 0, deliveryDays: 2, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'dns', price: 48990, deliveryCost: 0, deliveryDays: 1, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'citilink', price: 47990, deliveryCost: 290, deliveryDays: 3, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'eldorado', price: 49990, deliveryCost: 0, deliveryDays: 2, pickup: false, inStock: true, warrantyMonths: 12 },
    ],
  },
  {
    id: 'redmi-note-14-pro',
    title: 'Смартфон Xiaomi Redmi Note 14 Pro 5G 256 ГБ',
    brand: 'Xiaomi',
    category: 'electronics',
    specs: ['6.67" AMOLED', 'Dimensity 7300', '256 ГБ', 'камера 200 Мп'],
    rating: 4.6,
    reviews: 1420,
    offers: [
      { shopId: 'ozon', price: 27990, deliveryCost: 0, deliveryDays: 2, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'dns', price: 28990, deliveryCost: 0, deliveryDays: 1, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'wb', price: 26990, deliveryCost: 0, deliveryDays: 4, pickup: true, inStock: true, warrantyMonths: 12 },
    ],
  },
  {
    id: 'samsung-a56-256',
    title: 'Смартфон Samsung Galaxy A56 256 ГБ',
    brand: 'Samsung',
    category: 'electronics',
    specs: ['6.7" Super AMOLED', 'Exynos 1580', '256 ГБ', 'зарядка 45 Вт'],
    rating: 4.6,
    reviews: 860,
    offers: [
      { shopId: 'mvideo', price: 34990, deliveryCost: 0, deliveryDays: 1, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'citilink', price: 33990, deliveryCost: 0, deliveryDays: 3, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'ozon', price: 32990, deliveryCost: 199, deliveryDays: 2, pickup: true, inStock: true, warrantyMonths: 12 },
    ],
  },
  {
    id: 'pixel-8a-128',
    title: 'Смартфон Google Pixel 8a 128 ГБ',
    brand: 'Google',
    category: 'electronics',
    specs: ['6.1" OLED 120 Гц', 'Tensor G3', '128 ГБ', 'камера 64 Мп'],
    rating: 4.8,
    reviews: 640,
    offers: [
      { shopId: 'ymarket', price: 44990, deliveryCost: 0, deliveryDays: 3, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'ozon', price: 46490, deliveryCost: 0, deliveryDays: 2, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'dns', price: 47990, deliveryCost: 0, deliveryDays: 1, pickup: true, inStock: true, warrantyMonths: 12 },
    ],
  },
  {
    id: 'sony-wh1000xm5',
    title: 'Беспроводные наушники Sony WH-1000XM5',
    brand: 'Sony',
    category: 'audio',
    specs: ['активное шумоподавление', '30 ч работы', 'Bluetooth 5.2', 'USB-C'],
    rating: 4.9,
    reviews: 3120,
    offers: [
      { shopId: 'dns', price: 29990, deliveryCost: 0, deliveryDays: 1, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'ozon', price: 27490, deliveryCost: 0, deliveryDays: 3, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'ymarket', price: 28490, deliveryCost: 149, deliveryDays: 2, pickup: true, inStock: true, warrantyMonths: 12 },
    ],
  },
  {
    id: 'airpods-pro-2',
    title: 'Наушники Apple AirPods Pro 2 (USB-C)',
    brand: 'Apple',
    category: 'audio',
    specs: ['активное шумоподавление', 'адаптивный звук', 'футляр MagSafe'],
    rating: 4.8,
    reviews: 4420,
    offers: [
      { shopId: 'mvideo', price: 22990, deliveryCost: 0, deliveryDays: 1, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'ozon', price: 21490, deliveryCost: 0, deliveryDays: 2, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'wb', price: 20990, deliveryCost: 0, deliveryDays: 4, pickup: true, inStock: true, warrantyMonths: 12 },
    ],
  },
  {
    id: 'asus-vivobook-15',
    title: 'Ноутбук ASUS Vivobook 15 (Ryzen 7, 16 ГБ)',
    brand: 'ASUS',
    category: 'electronics',
    specs: ['15.6" FullHD', 'Ryzen 7 7730U', '16 ГБ RAM', 'SSD 512 ГБ'],
    rating: 4.6,
    reviews: 740,
    offers: [
      { shopId: 'citilink', price: 58990, deliveryCost: 0, deliveryDays: 2, pickup: true, inStock: true, warrantyMonths: 24 },
      { shopId: 'dns', price: 60990, deliveryCost: 0, deliveryDays: 1, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'ozon', price: 57490, deliveryCost: 0, deliveryDays: 5, pickup: true, inStock: true, warrantyMonths: 12 },
    ],
  },
  {
    id: 'dyson-v15',
    title: 'Пылесос Dyson V15 Detect Absolute',
    brand: 'Dyson',
    category: 'appliances',
    specs: ['беспроводной', 'лазерное обнаружение пыли', '60 мин работы'],
    rating: 4.8,
    reviews: 520,
    offers: [
      { shopId: 'mvideo', price: 64990, deliveryCost: 0, deliveryDays: 2, pickup: true, inStock: true, warrantyMonths: 24 },
      { shopId: 'ozon', price: 61990, deliveryCost: 0, deliveryDays: 4, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'dns', price: 66990, deliveryCost: 0, deliveryDays: 1, pickup: true, inStock: true, warrantyMonths: 12 },
    ],
  },
  {
    id: 'delonghi-magnifica-s',
    title: 'Кофемашина De’Longhi Magnifica S',
    brand: 'De’Longhi',
    category: 'appliances',
    specs: ['автоматическая', 'встроенная кофемолка', '15 бар'],
    rating: 4.7,
    reviews: 1890,
    offers: [
      { shopId: 'eldorado', price: 32990, deliveryCost: 0, deliveryDays: 3, pickup: false, inStock: true, warrantyMonths: 12 },
      { shopId: 'ozon', price: 31490, deliveryCost: 0, deliveryDays: 2, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'ymarket', price: 33990, deliveryCost: 0, deliveryDays: 1, pickup: true, inStock: true, warrantyMonths: 12 },
    ],
  },
  {
    id: 'lg-oled-55',
    title: 'Телевизор LG OLED55B4 55"',
    brand: 'LG',
    category: 'electronics',
    specs: ['4K OLED', '120 Гц', 'webOS 24', 'HDMI 2.1'],
    rating: 4.8,
    reviews: 1130,
    offers: [
      { shopId: 'dns', price: 119990, deliveryCost: 0, deliveryDays: 3, pickup: false, inStock: true, warrantyMonths: 24 },
      { shopId: 'mvideo', price: 124990, deliveryCost: 0, deliveryDays: 2, pickup: false, inStock: true, warrantyMonths: 12 },
      { shopId: 'citilink', price: 116990, deliveryCost: 990, deliveryDays: 5, pickup: true, inStock: true, warrantyMonths: 12 },
    ],
  },
  {
    id: 'north-face-jacket',
    title: 'Куртка The North Face Resolve 2',
    brand: 'The North Face',
    category: 'clothing',
    specs: ['мембрана DryVent', 'мужская', 'водонепроницаемая'],
    rating: 4.6,
    reviews: 640,
    offers: [
      { shopId: 'lamoda', price: 14990, deliveryCost: 0, deliveryDays: 3, pickup: true, inStock: true, warrantyMonths: 0 },
      { shopId: 'wb', price: 13490, deliveryCost: 0, deliveryDays: 5, pickup: true, inStock: true, warrantyMonths: 0 },
      { shopId: 'ozon', price: 15790, deliveryCost: 0, deliveryDays: 2, pickup: true, inStock: true, warrantyMonths: 0 },
    ],
  },
  {
    id: 'nike-air-max-270',
    title: 'Кроссовки Nike Air Max 270',
    brand: 'Nike',
    category: 'clothing',
    specs: ['мужские', 'амортизация Air', 'размеры 40–46'],
    rating: 4.5,
    reviews: 2310,
    offers: [
      { shopId: 'lamoda', price: 12990, deliveryCost: 0, deliveryDays: 4, pickup: true, inStock: true, warrantyMonths: 0 },
      { shopId: 'wb', price: 11490, deliveryCost: 0, deliveryDays: 6, pickup: true, inStock: true, warrantyMonths: 0 },
      { shopId: 'ymarket', price: 12490, deliveryCost: 0, deliveryDays: 3, pickup: true, inStock: false, warrantyMonths: 0 },
    ],
  },
  {
    id: 'redmond-multicooker',
    title: 'Мультиварка REDMOND RMC-M90',
    brand: 'REDMOND',
    category: 'appliances',
    specs: ['5 л', '16 программ', 'отложенный старт'],
    rating: 4.4,
    reviews: 3120,
    offers: [
      { shopId: 'ozon', price: 7990, deliveryCost: 0, deliveryDays: 2, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'wb', price: 7490, deliveryCost: 0, deliveryDays: 4, pickup: true, inStock: true, warrantyMonths: 12 },
      { shopId: 'eldorado', price: 8990, deliveryCost: 390, deliveryDays: 3, pickup: true, inStock: true, warrantyMonths: 12 },
    ],
  },
];

/** Заглушка профиля: данные будут приходить из личного кабинета после авторизации. */
const CURRENT_USER = {
  name: 'Мария',
  email: 'maria@example.com',
  region: 'Екатеринбург',
  memberSince: 'март 2026',
  budget: 50000,
  priorities: ['Цена', 'Скорость доставки', 'Гарантия'],
  favoriteCategories: ['electronics', 'audio'],
};;

/**
 * Расширенный каталог для ленты.
 * Базовые товары лежат в `products.ts`, здесь — дополнительные позиции,
 * чтобы пагинация и бесконечная прокрутка работали на реальном объёме.
 */

const EXTRA = [
  // --- смартфоны ---
  ['samsung-a16', 'Смартфон Samsung Galaxy A16 128 ГБ', 'Samsung', 'electronics', 15990, 4.4, 420, ['6.7" Super AMOLED', 'Exynos 1330', '128 ГБ', 'камера 50 Мп']],
  ['redmi-13c', 'Смартфон Xiaomi Redmi 13C 128 ГБ', 'Xiaomi', 'electronics', 11990, 4.2, 1180, ['6.74" IPS', 'Helio G85', '128 ГБ', 'камера 50 Мп']],
  ['realme-12-pro', 'Смартфон realme 12 Pro 256 ГБ', 'realme', 'electronics', 24990, 4.6, 640, ['6.7" AMOLED', 'Snapdragon 6 Gen 1', '256 ГБ', 'камера 50 Мп']],
  ['honor-200-lite', 'Смартфон Honor 200 Lite 256 ГБ', 'Honor', 'electronics', 21990, 4.5, 510, ['6.7" AMOLED', 'Dimensity 6080', '256 ГБ', 'камера 108 Мп']],
  ['infinix-note-40', 'Смартфон Infinix Note 40 256 ГБ', 'Infinix', 'electronics', 18490, 4.3, 380, ['6.78" AMOLED', 'Helio G99', '256 ГБ', 'зарядка 45 Вт']],
  ['moto-g84', 'Смартфон Motorola Moto G84 256 ГБ', 'Motorola', 'electronics', 19990, 4.4, 290, ['6.5" OLED', 'Snapdragon 695', '256 ГБ', 'камера 50 Мп']],
  ['nothing-2a', 'Смартфон Nothing Phone (2a) 128 ГБ', 'Nothing', 'electronics', 27990, 4.6, 470, ['6.7" AMOLED 120 Гц', 'Dimensity 7200 Pro', '128 ГБ', 'камера 50 Мп']],
  ['samsung-s24-fe', 'Смартфон Samsung Galaxy S24 FE 256 ГБ', 'Samsung', 'electronics', 54990, 4.7, 380, ['6.7" AMOLED 120 Гц', 'Exynos 2400e', '256 ГБ', 'камера 50 Мп']],
  ['xiaomi-14t-pro', 'Смартфон Xiaomi 14T Pro 512 ГБ', 'Xiaomi', 'electronics', 64990, 4.8, 520, ['6.67" AMOLED', 'Dimensity 9300+', '512 ГБ', 'зарядка 120 Вт']],
  ['iphone-15', 'Смартфон Apple iPhone 15 128 ГБ', 'Apple', 'electronics', 62990, 4.9, 3120, ['6.1" OLED', 'A16 Bionic', '128 ГБ', 'камера 48 Мп']],

  // --- ноутбуки ---
  ['lenovo-ideapad-3', 'Ноутбук Lenovo IdeaPad Slim 3 15 (Ryzen 5, 16 ГБ)', 'Lenovo', 'electronics', 42990, 4.5, 620, ['15.6" FullHD', 'Ryzen 5 7530U', '16 ГБ RAM', 'SSD 512 ГБ']],
  ['hp-pavilion-15', 'Ноутбук HP Pavilion 15 (Core i5, 16 ГБ)', 'HP', 'electronics', 54990, 4.4, 410, ['15.6" FullHD', 'Core i5-1335U', '16 ГБ RAM', 'SSD 512 ГБ']],
  ['acer-aspire-5', 'Ноутбук Acer Aspire 5 (Ryzen 5, 8 ГБ)', 'Acer', 'electronics', 39990, 4.3, 730, ['15.6" FullHD', 'Ryzen 5 5500U', '8 ГБ RAM', 'SSD 256 ГБ']],
  ['msi-modern-14', 'Ноутбук MSI Modern 14 (Core i5, 16 ГБ)', 'MSI', 'electronics', 49990, 4.5, 260, ['14" FullHD', 'Core i5-1235U', '16 ГБ RAM', 'SSD 512 ГБ']],
  ['matebook-d15', 'Ноутбук Huawei MateBook D 15 (Core i5, 16 ГБ)', 'Huawei', 'electronics', 45990, 4.6, 540, ['15.6" FullHD', 'Core i5-12450H', '16 ГБ RAM', 'SSD 512 ГБ']],

  // --- телевизоры ---
  ['samsung-cu7100', 'Телевизор Samsung UE50CU7100 50"', 'Samsung', 'electronics', 42990, 4.6, 830, ['50" 4K UHD', 'Smart TV', 'HDR10+', '3× HDMI']],
  ['lg-43ur78006', 'Телевизор LG 43UR78006 43"', 'LG', 'electronics', 32990, 4.5, 610, ['43" 4K UHD', 'webOS 23', 'HDR10', '2× HDMI']],
  ['xiaomi-tv-a2', 'Телевизор Xiaomi TV A2 43"', 'Xiaomi', 'electronics', 27990, 4.4, 920, ['43" 4K UHD', 'Android TV', 'Google Assistant', '2× HDMI']],
  ['haier-55-s4', 'Телевизор Haier 55 Smart TV S4 55"', 'Haier', 'electronics', 36990, 4.3, 340, ['55" 4K UHD', 'Smart TV', 'HDR10', '3× HDMI']],
  ['hisense-50a6k', 'Телевизор Hisense 50A6K 50"', 'Hisense', 'electronics', 33990, 4.4, 480, ['50" 4K UHD', 'VIDAA U6', 'Dolby Vision', '3× HDMI']],

  // --- аудио ---
  ['jbl-tune-770nc', 'Наушники JBL Tune 770NC', 'JBL', 'audio', 8990, 4.4, 2380, ['накладные', 'шумоподавление', '70 ч работы', 'Bluetooth 5.3']],
  ['marshall-major-v', 'Наушники Marshall Major V', 'Marshall', 'audio', 14990, 4.6, 410, ['накладные', '100 ч работы', 'Bluetooth 5.2', 'складная конструкция']],
  ['sony-wf1000xm5', 'Наушники Sony WF-1000XM5', 'Sony', 'audio', 21990, 4.8, 1620, ['TWS', 'шумоподавление', '8 ч в наушниках', 'LDAC']],
  ['redmi-buds-5-pro', 'Наушники Xiaomi Redmi Buds 5 Pro', 'Xiaomi', 'audio', 5990, 4.5, 3140, ['TWS', 'шумоподавление 52 дБ', '10 ч работы', 'Bluetooth 5.3']],
  ['sennheiser-accentum', 'Наушники Sennheiser Accentum', 'Sennheiser', 'audio', 17990, 4.7, 380, ['накладные', 'шумоподавление', '50 ч работы', 'USB-C']],
  ['freebuds-6i', 'Наушники Huawei FreeBuds 6i', 'Huawei', 'audio', 6990, 4.4, 1260, ['TWS', 'шумоподавление', '8 ч работы', 'быстрая зарядка']],

  // --- бытовая техника ---
  ['bosch-twk8611p', 'Чайник Bosch TWK8611P', 'Bosch', 'appliances', 8899, 4.6, 1120, ['1.5 л', '2400 Вт', 'нержавеющая сталь', 'набор температур']],
  ['bosch-twk3p420', 'Чайник Bosch TWK3P420', 'Bosch', 'appliances', 5735, 4.5, 890, ['1.7 л', '2400 Вт', 'поворотная база', 'индикатор уровня воды']],
  ['bosch-tat3p420', 'Тостер Bosch TAT3P420', 'Bosch', 'appliances', 10400, 4.5, 340, ['2 отделения', '815 Вт', '8 степеней прожарки', 'поддон для крошек']],
  ['bosch-tsm6a013b', 'Кофемолка Bosch TSM6A013B', 'Bosch', 'appliances', 9520, 4.4, 260, ['180 Вт', '50 г зерна', 'нож из нержавеющей стали', 'импульсный режим']],
  ['samsung-vs20c85', 'Пылесос Samsung VS20C85', 'Samsung', 'appliances', 44990, 4.5, 190, ['беспроводной', '210 Вт', '60 мин работы', 'контейнер 0.5 л']],
  ['polaris-pmc-0516', 'Мультиварка Polaris PMC 0516', 'Polaris', 'appliances', 8990, 4.3, 2050, ['5 л', '20 программ', 'отложенный старт', 'антипригарное покрытие']],
  ['philips-dst5030', 'Утюг Philips DST5030', 'Philips', 'appliances', 4290, 4.6, 1740, ['2600 Вт', 'паровой удар 180 г', 'керамическая подошва', 'автоотключение']],
  ['lg-ms2042db', 'Микроволновка LG MS-2042DB', 'LG', 'appliances', 7990, 4.4, 1180, ['20 л', 'гриль', '700 Вт', 'био-керамическое покрытие']],

  // --- одежда и обувь ---
  ['columbia-powder-lite', 'Куртка Columbia Powder Lite', 'Columbia', 'clothing', 12990, 4.5, 720, ['утеплитель Omni-Heat', 'мужская', 'водоотталкивающая']],
  ['uniqlo-uld', 'Пуховик Uniqlo Ultra Light Down', 'Uniqlo', 'clothing', 9990, 4.4, 1180, ['пух 90/10', 'складной', 'женский']],
  ['timberland-6inch', 'Ботинки Timberland 6-Inch Premium', 'Timberland', 'clothing', 19990, 4.7, 640, ['натуральная кожа', 'водонепроницаемые', 'размеры 40–45']],
  ['adidas-samba', 'Кроссовки Adidas Samba OG', 'Adidas', 'clothing', 11990, 4.6, 2140, ['кожаные', 'унисекс', 'размеры 36–46']],
  ['levis-501', 'Джинсы Levi’s 501 Original', 'Levi’s', 'clothing', 7990, 4.5, 1620, ['прямой крой', '100% хлопок', 'размеры 28–38']],
  ['nike-club', 'Худи Nike Club Fleece', 'Nike', 'clothing', 5490, 4.4, 980, ['утеплённое', 'унисекс', 'размеры S–XXL']],
];

function buildOffers(basePrice, category) {
  const warranty = category === 'clothing' ? 0 : 12;
  return [
    {
      shopId: 'dns',
      price: basePrice,
      deliveryCost: 0,
      deliveryDays: 1,
      pickup: true,
      inStock: true,
      warrantyMonths: warranty,
    },
    {
      shopId: 'ozon',
      price: Math.max(basePrice - 200, 100),
      deliveryCost: 0,
      deliveryDays: 3,
      pickup: true,
      inStock: true,
      warrantyMonths: warranty,
    },
    {
      shopId: 'citilink',
      price: basePrice + 290,
      deliveryCost: 290,
      deliveryDays: 2,
      pickup: true,
      inStock: true,
      warrantyMonths: warranty,
    },
  ];
}

const EXTRA_PRODUCTS = EXTRA.map(([id, title, brand, category, price, rating, reviews, specs]) => ({
  id,
  title,
  brand,
  category,
  specs,
  rating,
  reviews,
  offers: buildOffers(price, category),
}));

/** Полный каталог: базовые товары + расширение для пагинации. */
const CATALOG = [...PRODUCTS, ...EXTRA_PRODUCTS];

  window.US = window.US || {};
  window.US.data = {
    CATEGORIES: CATEGORIES,
    SHOPS: SHOPS,
    SHOP_BY_ID: SHOP_BY_ID,
    CATEGORY_BY_ID: CATEGORY_BY_ID,
    QUICK_LINKS: QUICK_LINKS,
    PRODUCTS: PRODUCTS,
    CURRENT_USER: CURRENT_USER,
    CATALOG: CATALOG,
  };
})();
