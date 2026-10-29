document.addEventListener('DOMContentLoaded', () => {
  const logoData = getLogo();
  if (logoData) {
    document.getElementById('site-logo').innerHTML = `<img src="${logoData}" alt="OCT STORE">`;
  }
  if (isAdmin()) showAdmin(); else showLogin();
  bindLogin();
  bindTabs();
  bindForms();
});

function showLogin() {
  document.getElementById('login-view').style.display = 'block';
  document.getElementById('admin-view').style.display = 'none';
}

function showAdmin() {
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('admin-view').style.display = 'block';
  renderPortfolioAdmin();
  renderFeaturesAdmin();
  renderOrdersAdmin();
}

function bindLogin() {
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;
    const err = document.getElementById('login-error');
    if (email === CONFIG.ADMIN_EMAIL && pass === CONFIG.ADMIN_PASSWORD) {
      loginAdmin();
      err.textContent = '';
      showAdmin();
    } else {
      err.textContent = '❌ البريد الإلكتروني أو كلمة المرور غير صحيحة';
    }
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    logoutAdmin();
    showLogin();
  });
}

function bindTabs() {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).style.display = 'block';
    });
  });
}

function bindForms() {
  // Logo Upload
  document.getElementById('logo-form').addEventListener('submit', e => {
    e.preventDefault();
    const file = document.getElementById('logo-file').files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      setLogo(evt.target.result);
      document.getElementById('site-logo').innerHTML = `<img src="${evt.target.result}" alt="OCT STORE">`;
      alert('✅ تم تحديث الشعار بنجاح! سيظهر في جميع الصفحات.');
      e.target.reset();
    };
    reader.readAsDataURL(file);
  });

  // Portfolio
  document.getElementById('portfolio-form').addEventListener('submit', e => {
    e.preventDefault();
    const list = getPortfolio();
    list.push({
      id: Date.now(),
      name: document.getElementById('pf-name').value.trim(),
      description: document.getElementById('pf-desc').value.trim(),
      link: document.getElementById('pf-link').value.trim() || '#',
    });
    setPortfolio(list);
    e.target.reset();
    renderPortfolioAdmin();
  });

  // Features
  document.getElementById('feature-form').addEventListener('submit', e => {
    e.preventDefault();
    const list = getFeatures();
    list.push({
      id: Date.now(),
      name: document.getElementById('ft-name').value.trim(),
      price: parseFloat(document.getElementById('ft-price').value),
    });
    setFeatures(list);
    e.target.reset();
    renderFeaturesAdmin();
  });
}

function renderPortfolioAdmin() {
  const list = getPortfolio();
  const el = document.getElementById('portfolio-admin-list');
  if (!list.length) { el.innerHTML = '<p class="empty">لا توجد عناصر</p>'; return; }
  el.innerHTML = list.map(item => `
    <div class="admin-item">
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <p>${escapeHtml(item.description)}</p>
      </div>
      <div class="admin-actions">
        <button class="btn-edit" onclick="editPortfolio(${item.id})">تعديل</button>
        <button class="btn-danger" onclick="deletePortfolio(${item.id})">حذف</button>
      </div>
    </div>
  `).join('');
}

window.editPortfolio = function(id) {
  const list = getPortfolio();
  const item = list.find(i => i.id === id);
  if (!item) return;
  const name = prompt('اسم البوت:', item.name);
  const desc = prompt('الوصف:', item.description);
  const link = prompt('الرابط:', item.link);
  if (name === null || desc === null) return;
  item.name = name; item.description = desc; item.link = link || '#';
  setPortfolio(list); renderPortfolioAdmin();
};

window.deletePortfolio = function(id) {
  if (!confirm('حذف هذا العنصر؟')) return;
  setPortfolio(getPortfolio().filter(i => i.id !== id));
  renderPortfolioAdmin();
};

function renderFeaturesAdmin() {
  const list = getFeatures();
  const el = document.getElementById('features-admin-list');
  if (!list.length) { el.innerHTML = '<p class="empty">لا توجد ميزات</p>'; return; }
  el.innerHTML = list.map(f => `
    <div class="admin-item">
      <div><strong>${escapeHtml(f.name)}</strong> — <span class="price-tag">${formatPrice(f.price)}</span></div>
      <div class="admin-actions">
        <button class="btn-edit" onclick="editFeature(${f.id})">تعديل</button>
        <button class="btn-danger" onclick="deleteFeature(${f.id})">حذف</button>
      </div>
    </div>
  `).join('');
}

window.editFeature = function(id) {
  const list = getFeatures();
  const item = list.find(i => i.id === id);
  if (!item) return;
  const name = prompt('اسم الميزة:', item.name);
  const price = prompt('السعر (بالليرة السورية):', item.price);
  if (name === null || price === null) return;
  item.name = name; item.price = parseFloat(price) || 0;
  setFeatures(list); renderFeaturesAdmin();
};

window.deleteFeature = function(id) {
  if (!confirm('حذف هذه الميزة؟')) return;
  setFeatures(getFeatures().filter(i => i.id !== id));
  renderFeaturesAdmin();
};

function renderOrdersAdmin() {
  const list = getOrders();
  const el = document.getElementById('orders-list');
  if (!list.length) { el.innerHTML = '<p class="empty">لا توجد طلبات محفوظة</p>'; return; }
  el.innerHTML = list.map(o => `
    <div class="admin-item order-item">
      <div>
        <strong>👤 ${escapeHtml(o.name)}</strong> — 📱 ${escapeHtml(o.phone)}
        <p class="order-features">${o.features.map(f => escapeHtml(f.name)).join(' • ')}</p>
        <small>🕒 ${escapeHtml(o.date)}</small>
      </div>
      <div class="order-total">${formatPrice(o.total)}</div>
    </div>
  `).join('');
}
