// ===== الإعدادات الافتراضية =====
const DEFAULT_SETTINGS = {
  summerFactor: 120,
  schoolFactor: 100,
  ramadanFactor: 70,
  eidFitrFactor: 50,
  eidAdhaFactor: 50,
  nationalDayFactor: 80,
  holidayFactor: 80,
  saudiRatio: 70,
  femaleRatio: 60,
  edRatio: 40,
  opdRatio: 40,
  inpRatio: 20
};

// ===== حفظ الإعدادات =====
function saveSettings() {
  const settings = {
    summerFactor: parseInt(document.getElementById('summer-factor').value) || 120,
    schoolFactor: parseInt(document.getElementById('school-factor').value) || 100,
    ramadanFactor: parseInt(document.getElementById('ramadan-factor').value) || 70,
    eidFitrFactor: parseInt(document.getElementById('eid-fitr-factor').value) || 50,
    eidAdhaFactor: parseInt(document.getElementById('eid-adha-factor').value) || 50,
    nationalDayFactor: parseInt(document.getElementById('national-day-factor').value) || 80,
    holidayFactor: parseInt(document.getElementById('holiday-factor').value) || 80,
    saudiRatio: parseInt(document.getElementById('saudiRatio').value) || 70,
    femaleRatio: parseInt(document.getElementById('femaleRatio').value) || 60,
    edRatio: parseInt(document.getElementById('edRatio').value) || 40,
    opdRatio: parseInt(document.getElementById('opdRatio').value) || 40,
    inpRatio: parseInt(document.getElementById('inpRatio').value) || 20
  };
  localStorage.setItem('ehsaiyatSettings', JSON.stringify(settings));
  alert('✅ تم حفظ الإعدادات');
}

// ===== تحميل الإعدادات =====
function loadSettings() {
  const saved = localStorage.getItem('ehsaiyatSettings');
  const s = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  
  document.getElementById('summer-factor').value = s.summerFactor;
  document.getElementById('school-factor').value = s.schoolFactor;
  document.getElementById('ramadan-factor').value = s.ramadanFactor;
  document.getElementById('eid-fitr-factor').value = s.eidFitrFactor;
  document.getElementById('eid-adha-factor').value = s.eidAdhaFactor;
  document.getElementById('national-day-factor').value = s.nationalDayFactor;
  document.getElementById('holiday-factor').value = s.holidayFactor;
  document.getElementById('saudiRatio').value = s.saudiRatio;
  document.getElementById('femaleRatio').value = s.femaleRatio;
  document.getElementById('edRatio').value = s.edRatio;
  document.getElementById('opdRatio').value = s.opdRatio;
  document.getElementById('inpRatio').value = s.inpRatio;
}

// ===== الحصول على معامل الموسمية =====
function getSeasonalFactor(month) {
  const s = JSON.parse(localStorage.getItem('ehsaiyatSettings') || JSON.stringify(DEFAULT_SETTINGS));
  
  // الصيف: يونيو (6) - أغسطس (8)
  if (month >= 6 && month <= 8) return s.summerFactor / 100;
  
  // رمضان (تقديري - يعتمد على التقويم الهجري)
  // TODO: إضافة منطق رمضان
  
  // باقي الشهور: الدراسة
  return s.schoolFactor / 100;
}

// ===== التشغيل =====
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
});
