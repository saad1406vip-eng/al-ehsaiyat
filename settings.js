const DEFAULT_SETTINGS = {
  summerFactor: 120, schoolFactor: 100, ramadanFactor: 70,
  eidFitrFactor: 50, eidAdhaFactor: 50,
  saudiRatio: 90, edRatio: 40, opdRatio: 40, inpRatio: 20
};

function saveSettings() {
  const settings = {
    summerFactor: parseInt(document.getElementById('summer-factor').value) || 120,
    schoolFactor: parseInt(document.getElementById('school-factor').value) || 100,
    ramadanFactor: parseInt(document.getElementById('ramadan-factor').value) || 70,
    eidFitrFactor: parseInt(document.getElementById('eid-fitr-factor').value) || 50,
    eidAdhaFactor: parseInt(document.getElementById('eid-adha-factor').value) || 50,
    saudiRatio: parseInt(document.getElementById('saudiRatio').value) || 90,
    edRatio: parseInt(document.getElementById('edRatio').value) || 40,
    opdRatio: parseInt(document.getElementById('opdRatio').value) || 40,
    inpRatio: parseInt(document.getElementById('inpRatio').value) || 20
  };
  localStorage.setItem('ehsaiyatSettings', JSON.stringify(settings));
  alert('✅ تم حفظ الإعدادات');
}

function loadSettings() {
  const saved = localStorage.getItem('ehsaiyatSettings');
  const s = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;

  const fields = ['summer-factor', 'school-factor', 'ramadan-factor', 'eid-fitr-factor', 'eid-adha-factor'];
  const keys = ['summerFactor', 'schoolFactor', 'ramadanFactor', 'eidFitrFactor', 'eidAdhaFactor'];
  fields.forEach((f, i) => {
    const el = document.getElementById(f);
    if (el) el.value = s[keys[i]];
  });

  ['saudiRatio', 'edRatio', 'opdRatio', 'inpRatio'].forEach(k => {
    const el = document.getElementById(k);
    if (el) el.value = s[k];
  });
}

function getSeasonalFactor(month) {
  const s = JSON.parse(localStorage.getItem('ehsaiyatSettings') || JSON.stringify(DEFAULT_SETTINGS));
  if (month >= 6 && month <= 8) return s.summerFactor / 100;
  return s.schoolFactor / 100;
}

function getRatio(key) {
  const s = JSON.parse(localStorage.getItem('ehsaiyatSettings') || JSON.stringify(DEFAULT_SETTINGS));
  return s[key] || DEFAULT_SETTINGS[key];
}

document.addEventListener('DOMContentLoaded', loadSettings);
