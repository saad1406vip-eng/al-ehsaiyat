// ===== قائمة الفريق الافتراضية (مصححة) =====
const DEFAULT_STAFF = [
  { id: 1, name: "سعد علي سعد القرني", emp: "0123105", role: "رئيس قسم المختبر" },
  { id: 2, name: "حاتم خليفة كرار", emp: "7245417", role: "طبيب أمراض دم" },
  { id: 3, name: "محمد دخيل الله محمد الغامدي", emp: "0123124", role: "أخصائي أول" },
  { id: 4, name: "محمد خلف أحمد الخثعمي", emp: "65269", role: "فني مختبر" },
  { id: 5, name: "محمد سهلان سعد العلياني", emp: "7221400", role: "فني مختبر" },
  { id: 6, name: "فهد عبدالله محمد القرني", emp: "46139", role: "فني مختبر" },
  { id: 7, name: "سلطان محمد دخيل القرني", emp: "0123074", role: "أخصائي" },
  { id: 8, name: "محمد سعد عبدالله القرني", emp: "0124959", role: "فني مختبر" },
  { id: 9, name: "نايف عبدالله محبوب القرني", emp: "7241475", role: "فني مختبر" },
  { id: 10, name: "مسفر عائض محمد القرني", emp: "7219250", role: "فني مختبر" },
  { id: 11, name: "سعد عيد سعيد آل سعد القرني", emp: "7707014", role: "أخصائي" },
  { id: 12, name: "حسام سعيد عبدالله القرني", emp: "66540", role: "فني مختبر" },
  { id: 13, name: "محمد ناصر محمد القرني", emp: "7221389", role: "أخصائي" },
  { id: 14, name: "بدر محمد ماكن القرني", emp: "7670327", role: "فني مختبر" },
  { id: 15, name: "عبدالعزيز راشد جديع البريدي", emp: "7669825", role: "أخصائي" },
  { id: 16, name: "منصور محمد منصور القرني", emp: "7670350", role: "فني مختبر" },
  { id: 17, name: "نايف محمد عبدالله العلياني", emp: "7670368", role: "فني مختبر" },
  { id: 18, name: "محمد صالح محمد الخثعمي", emp: "62526", role: "فني مختبر" }
];

// ===== تحميل الفريق =====
function loadStaff() {
  const saved = localStorage.getItem('staffData');
  if (saved) {
    try { return JSON.parse(saved); } catch(e) { return [...DEFAULT_STAFF]; }
  }
  return [...DEFAULT_STAFF];
}

let STAFF = loadStaff();

// ===== عرض الفريق =====
function renderStaff() {
  const tbody = document.getElementById('staffTable');
  if (!tbody) return;
  tbody.innerHTML = STAFF.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${s.name}</td>
      <td>${s.emp}</td>
      <td>${s.role}</td>
      <td><button onclick="removeStaff(${i})" class="btn-secondary" style="padding:6px 12px;font-size:12px;">🗑️</button></td>
    </tr>
  `).join('');
  const statEl = document.getElementById('stat-staff');
  if (statEl) statEl.textContent = STAFF.length;
}

// ===== إضافة موظف =====
function addStaff() {
  const name = document.getElementById('new-staff-name').value.trim();
  const emp = document.getElementById('new-staff-emp').value.trim();
  const role = document.getElementById('new-staff-role').value;

  if (!name || !emp) { alert('⚠️ الرجاء إدخال الاسم والرقم الوظيفي'); return; }

  STAFF.push({ name, emp, role });
  saveStaff();
  renderStaff();
  document.getElementById('new-staff-name').value = '';
  document.getElementById('new-staff-emp').value = '';
  alert('✅ تم إضافة الموظف');
}

// ===== حذف موظف =====
function removeStaff(index) {
  if (!confirm('⚠️ هل أنت متأكد من حذف هذا الموظف؟')) return;
  STAFF.splice(index, 1);
  saveStaff();
  renderStaff();
  alert('✅ تم حذف الموظف');
}

// ===== حفظ =====
function saveStaff() { localStorage.setItem('staffData', JSON.stringify(STAFF)); }

// ===== استعادة =====
function resetStaff() {
  if (!confirm('⚠️ سيتم استعادة القائمة الافتراضية. هل أنت متأكد؟')) return;
  STAFF = [...DEFAULT_STAFF];
  saveStaff();
  renderStaff();
  alert('✅ تم استعادة القائمة');
}

// ===== تصدير =====
function exportStaff() {
  const data = STAFF.map((s, i) => ({ '#': i + 1, 'الاسم': s.name, 'الرقم الوظيفي': s.emp, 'المسمى': s.role }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'الفريق');
  XLSX.writeFile(wb, `فريق_المختبر_${new Date().toISOString().split('T')[0]}.xlsx`);
}

document.addEventListener('DOMContentLoaded', renderStaff);
