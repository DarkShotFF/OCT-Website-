let selectedFeatures = [];

document.addEventListener('DOMContentLoaded', () => {
  const logoData = getLogo();
  if (logoData) {
    document.getElementById('site-logo').innerHTML = `<img src="${logoData}" alt="OCT STORE">`;
  }
  renderFeatures();
  bindEvents();
});

function renderFeatures() {
  const list = document.getElementById('features-list');
  const features = getFeatures();
  if (!features.length) {
    list.innerHTML = '<p class="empty">لم تُضف ميزات بعد.</p>';
    return;
  }
  list.innerHTML = features.map(f => `
    <label class="feature-item">
      <input type="checkbox" value="${f.id}" data-price="${f.price}" data-name="${escapeHtml(f.name)}">
      <span class="checkmark"></span>
      <div class="feature-info">
        <span class="feature-name">${escapeHtml(f.name)}</span>
        <span class="feature-price">${formatPrice(f.price)}</span>
      </div>
    </label>
  `).join('');

  list.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', updateTotal);
  });
}

function updateTotal() {
  const checked = [...document.querySelectorAll('#features-list input:checked')];
  selectedFeatures = checked.map(cb => ({
    name: cb.dataset.name,
    price: parseFloat(cb.dataset.price)
  }));
  const total = selectedFeatures.reduce((s, f) => s + f.price, 0);
  document.getElementById('total-price').textContent = formatPrice(total);
  document.getElementById('confirm-btn').disabled = selectedFeatures.length === 0;
}

function getTotal() {
  return selectedFeatures.reduce((s, f) => s + f.price, 0);
}

function buildOrderText() {
  const featuresList = selectedFeatures.map(f => `• ${f.name} (${formatPrice(f.price)})`).join('\n');
  const notes = document.getElementById('custom-notes').value.trim();
  
  let text = `مرحباً، أريد طلب بوت تيليجرام من متجر OCT STORE\n\n` +
             `📋 الميزات المطلوبة:\n${featuresList}\n`;
  if (notes) {
    text += `\n📝 تفاصيل إضافية:\n${notes}\n`;
  }
  text += `\n💰 السعر الإجمالي: ${formatPrice(getTotal())}`;
  return text;
}

function bindEvents() {
  document.getElementById('confirm-btn').addEventListener('click', () => {
    document.getElementById('options-modal').classList.add('show');
  });

  document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('options-modal').classList.remove('show');
  });

  document.getElementById('direct-contact').addEventListener('click', () => {
    const url = `${CONFIG.DEVELOPER_TELEGRAM}?text=${encodeURIComponent(buildOrderText())}`;
    window.open(url, '_blank');
    document.getElementById('options-modal').classList.remove('show');
  });

  document.getElementById('send-order').addEventListener('click', () => {
    document.getElementById('options-modal').classList.remove('show');
    document.getElementById('form-modal').classList.add('show');
  });

  document.getElementById('close-form').addEventListener('click', () => {
    document.getElementById('form-modal').classList.remove('show');
  });

  document.getElementById('order-form').addEventListener('submit', handleSubmitOrder);
}

function handleSubmitOrder(e) {
  e.preventDefault();
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const notes = document.getElementById('custom-notes').value.trim();
  
  if (!name || !phone) return;

  const order = {
    id: Date.now(),
    name, phone, notes,
    features: selectedFeatures,
    total: getTotal(),
    date: new Date().toLocaleString('ar-EG'),
  };

  const orders = getOrders();
  orders.unshift(order);
  setOrders(orders);

  const message = `مرحباً، أريد طلب بوت تيليجرام من متجر OCT STORE\n\n` +
                  `👤 الاسم: ${name}\n📱 الرقم: ${phone}\n\n` +
                  `📋 الميزات:\n${selectedFeatures.map(f => `• ${f.name} (${formatPrice(f.price)})`).join('\n')}\n` +
                  (notes ? `\n📝 تفاصيل إضافية:\n${notes}\n` : '') +
                  `\n💰 الإجمالي: ${formatPrice(getTotal())}`;
  
  const waUrl = `https://wa.me/${CONFIG.DEVELOPER_WHATSAPP}?text=${encodeURIComponent(message)}`;

  document.getElementById('form-modal').classList.remove('show');
  showToast('✅ تم حفظ طلبك! جاري فتح واتساب...');
  setTimeout(() => window.open(waUrl, '_blank'), 800);
  
  document.getElementById('order-form').reset();
  document.getElementById('custom-notes').value = '';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}
