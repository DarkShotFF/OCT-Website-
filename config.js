const CONFIG = {
  ADMIN_EMAIL: 'hishamyousef333@gmail.com',
  ADMIN_PASSWORD: 'octopus2025', // ✏️ غير كلمة المرور
  DEVELOPER_TELEGRAM: 'https://t.me/YOUR_USERNAME', // ✏️ ضع يوزر تيليجرام
  DEVELOPER_WHATSAPP: '9639XXXXXXXXX', // ✏️ ضع رقم واتساب (بدون +)
};

const STORAGE_KEYS = {
  PORTFOLIO: 'octopus_portfolio',
  FEATURES: 'octopus_features',
  ORDERS: 'octopus_orders',
  ADMIN_SESSION: 'octopus_admin_session',
  LOGO: 'octopus_logo',
};

// أسعار بالليرة السورية
const DEFAULT_PORTFOLIO = [
  { id: 1, name: 'بوت إدارة القنوات', description: 'بوت متكامل لإدارة القنوات والمجموعات مع لوحة تحكم كاملة.', link: '#' },
  { id: 2, name: 'بوت المتجر الإلكتروني', description: 'بوت لعرض المنتجات والطلب والدفع، مع دعم عدة طرق دفع.', link: '#' },
  { id: 3, name: 'بوت الألعاب والمسابقات', description: 'بوت تفاعلي للأسئلة والمسابقات مع نظام نقاط ومكافآت.', link: '#' },
];

const DEFAULT_FEATURES = [
  { id: 1, name: 'قائمة أوامر أساسية', price: 50000 },
  { id: 2, name: 'لوحة تحكم للمشرفين', price: 150000 },
  { id: 3, name: 'قاعدة بيانات MySQL / MongoDB', price: 200000 },
  { id: 4, name: 'نظام اشتراكات مدفوعة', price: 250000 },
  { id: 5, name: 'دعم بوابات الدفع الإلكتروني', price: 300000 },
  { id: 6, name: 'نظام إحالات ومكافآت', price: 150000 },
  { id: 7, name: 'إشعارات تلقائية للمستخدمين', price: 100000 },
  { id: 8, name: 'دعم متعدد اللغات (عربي/إنجليزي)', price: 120000 },
  { id: 9, name: 'نشر البوت على سيرفر واستضافته', price: 200000 },
];

function loadData(key, fallback) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; }
  catch { return fallback; }
}
function saveData(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function getPortfolio() { return loadData(STORAGE_KEYS.PORTFOLIO, DEFAULT_PORTFOLIO); }
function setPortfolio(v) { saveData(STORAGE_KEYS.PORTFOLIO, v); }
function getFeatures() { return loadData(STORAGE_KEYS.FEATURES, DEFAULT_FEATURES); }
function setFeatures(v) { saveData(STORAGE_KEYS.FEATURES, v); }
function getOrders() { return loadData(STORAGE_KEYS.ORDERS, []); }
function setOrders(v) { saveData(STORAGE_KEYS.ORDERS, v); }

function getLogo() { return localStorage.getItem(STORAGE_KEYS.LOGO); }
function setLogo(base64) { localStorage.setItem(STORAGE_KEYS.LOGO, base64); }

function isAdmin() { return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true'; }
function loginAdmin() { sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true'); }
function logoutAdmin() { sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION); }

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function formatPrice(price) {
  return Number(price).toLocaleString('ar-SY') + ' ل.س';
}
