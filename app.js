// ===== البيانات الأساسية =====
const STAFF = [
  { id: 1, name: "سعد علي سعد القرني", emp: "0123105", role: "رئيس قسم المختبر" },
  { id: 2, name: "مسفر عائض محمد القرني", emp: "7219250", role: "فني مختبر" },
  { id: 3, name: "محمد دخيل الله محمد الغامدي", emp: "0123124", role: "فني مختبر" },
  { id: 4, name: "محمد خلف أحمد الخثعمي", emp: "65269", role: "فني مختبر" },
  { id: 5, name: "محمد سهلان سعد العلياني", emp: "7221400", role: "فني مختبر" },
  { id: 6, name: "فهد عبدالله محمد القرني", emp: "46139", role: "فني مختبر" },
  { id: 7, name: "سلطان محمد دخيل القرني", emp: "0123074", role: "فني مختبر" },
  { id: 8, name: "محمد سعد عبدالله القرني", emp: "0124959", role: "فني مختبر" },
  { id: 9, name: "نايف عبدالله محبوب القرني", emp: "7241475", role: "فني مختبر" },
  { id: 10, name: "حاتم خليفة كرار", emp: "7245417", role: "فني مختبر" },
  { id: 11, name: "سعد عيد سعيد آل سعد القرني", emp: "7707014", role: "فني مختبر" },
  { id: 12, name: "حسام سعيد عبدالله القرني", emp: "66540", role: "فني مختبر" },
  { id: 13, name: "محمد ناصر محمد القرني", emp: "7221389", role: "فني مختبر" },
  { id: 14, name: "بدر محمد ماكن القرني", emp: "7670327", role: "فني مختبر" },
  { id: 15, name: "عبدالعزيز راشد جديع البريدي", emp: "7669825", role: "فني مختبر" },
  { id: 16, name: "منصور محمد منصور القرني", emp: "7670350", role: "فني مختبر" },
  { id: 17, name: "نايف محمد عبدالله العلياني", emp: "7670368", role: "فني مختبر" },
  { id: 18, name: "محمد صالح محمد الخثعمي", emp: "62526", role: "فني مختبر" }
];

// ===== التبويبات =====
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// ===== دوال التاريخ =====
function getHijriDate() {
  try {
    const today = new Date();
    return today.toLocaleDateString('ar-SA-u-ca-islamic', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  } catch(e) { return ''; }
}

function getGregorianDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${today.getFullYear()}`;
}

// ===== عرض الفريق =====
function renderStaff() {
  const tbody = document.getElementById('staffTable');
  if (!tbody) return;
  tbody.innerHTML = STAFF.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.role}</td>
    </tr>
  `).join('');
  const statEl = document.getElementById('stat-staff');
  if (statEl) statEl.textContent = STAFF.length;
}

// ===== الفترة الزمنية =====
function applyDateRange() {
  const from = document.getElementById('dateFrom').value;
  const to = document.getElementById('dateTo').value;
  if (!from || !to) {
    alert('⚠️ الرجاء اختيار التاريخ من وإلى');
    return;
  }
  document.getElementById('dateResult').innerHTML = `
    <p style="color:green;margin-top:10px;">✅ تم تطبيق الفترة: من ${from} إلى ${to}</p>
  `;
  localStorage.setItem('ehsaiyatDateFrom', from);
  localStorage.setItem('ehsaiyatDateTo', to);
}

// ===== تبديل أوضاع الإدخال =====
function toggleBBMode() {
  const mode = document.querySelector('input[name="bb-mode"]:checked').value;
  document.getElementById('bb-manual').style.display = mode === 'manual' ? 'block' : 'none';
  document.getElementById('bb-auto').style.display = mode === 'auto' ? 'block' : 'none';
}
function toggleLabMode() {
  const mode = document.querySelector('input[name="lab-mode"]:checked').value;
  document.getElementById('lab-manual').style.display = mode === 'manual' ? 'block' : 'none';
  document.getElementById('lab-auto').style.display = mode === 'auto' ? 'block' : 'none';
}

// ===== الإعدادات =====
function saveSettings() {
  const settings = {
    saudiRatio: document.getElementById('saudiRatio').value,
    femaleRatio: document.getElementById('femaleRatio').value,
    edRatio: document.getElementById('edRatio').value,
    opdRatio: document.getElementById('opdRatio').value,
    inpRatio: document.getElementById('inpRatio').value,
    variance: document.getElementById('variance').value
  };
  localStorage.setItem('ehsaiyatSettings', JSON.stringify(settings));
  alert('✅ تم حفظ الإعدادات');
}

function loadSettings() {
  const saved = localStorage.getItem('ehsaiyatSettings');
  if (!saved) return;
  const s = JSON.parse(saved);
  Object.keys(s).forEach(k => {
    const el = document.getElementById(k);
    if (el) el.value = s[k];
  });
}

// ===== قراءة ملف فيدا =====
async function readVidaFile(file, resultDivId) {
  try {
    let rows;
    
    if (file.name.endsWith('.csv')) {
      const text = await file.text();
      rows = parseCSV(text);
    } else {
      const data = new Uint8Array(await file.arrayBuffer());
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    }
    
    const parsed = analyzeVidaData(rows);
    window.vidaParsedData = parsed;
    
    document.getElementById(resultDivId).innerHTML = `
      <div style="margin-top:10px;padding:15px;background:#f0f4f8;border-radius:8px;">
        <p style="color:green;">✅ تم قراءة ملف فيدا</p>
        <p><strong>عدد الأقسام:</strong> ${parsed.divisions.length}</p>
        <p><strong>الإجمالي:</strong> ${parsed.totals.grand.toLocaleString()}</p>
      </div>
    `;
    
  } catch(err) {
    document.getElementById(resultDivId).innerHTML = `
      <p style="color:red;">❌ خطأ: ${err.message}</p>
    `;
  }
}

// ===== تحليل CSV =====
function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const rows = [];
  for (const line of lines) {
    if (line.includes('Sabt Al Alaya') || line.includes('Generated on')) continue;
    const cells = line.split(',').map(c => c.trim().replace(/"/g, ''));
    rows.push(cells);
  }
  return rows;
}

// ===== تحليل بيانات فيدا =====
function analyzeVidaData(rows) {
  let headerIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === 'Division' || rows[i][0]?.includes('Division')) {
      headerIndex = i;
      break;
    }
  }
  
  if (headerIndex === -1) throw new Error('لم يتم العثور على رأس الجدول');
  
  const dataRows = rows.slice(headerIndex + 1).filter(r => r[0] && r[0] !== '');
  
  const data = {};
  const totals = { ER: 0, IP: 0, OPD: 0, grand: 0 };
  
  for (const row of dataRows) {
    const division = row[0];
    if (!division) continue;
    
    const values = row.slice(1).map(v => parseInt(v) || 0);
    
    data[division] = {
      erSaudiM: values[0] || 0,
      erSaudiF: values[1] || 0,
      erNsaudiM: values[2] || 0,
      erNsaudiF: values[3] || 0,
      ipSaudiM: values[4] || 0,
      ipSaudiF: values[5] || 0,
      ipNsaudiM: values[6] || 0,
      ipNsaudiF: values[7] || 0,
      opdSaudiM: values[8] || 0,
      opdSaudiF: values[9] || 0,
      opdNsaudiM: values[10] || 0,
      opdNsaudiF: values[11] || 0,
      total: values[12] || 0
    };
    
    totals.ER += data[division].erSaudiM + data[division].erSaudiF + data[division].erNsaudiM + data[division].erNsaudiF;
    totals.IP += data[division].ipSaudiM + data[division].ipSaudiF + data[division].ipNsaudiM + data[division].ipNsaudiF;
    totals.OPD += data[division].opdSaudiM + data[division].opdSaudiF + data[division].opdNsaudiM + data[division].opdNsaudiF;
    totals.grand += data[division].total;
  }
  
  return { data, totals, divisions: Object.keys(data) };
}

// ===== التشغيل =====
document.addEventListener('DOMContentLoaded', () => {
  renderStaff();
  loadSettings();
  
  document.getElementById('vidaFile')?.addEventListener('change', (e) => {
    if (e.target.files[0]) readVidaFile(e.target.files[0], 'vidaFileResult');
  });
  document.getElementById('vidaFile2')?.addEventListener('change', (e) => {
    if (e.target.files[0]) readVidaFile(e.target.files[0], 'vidaFile2Result');
  });
  document.getElementById('aseerFile')?.addEventListener('change', (e) => {
    if (e.target.files[0]) readAseerFile(e.target.files[0]);
  });
});
