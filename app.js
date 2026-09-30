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

// ===== بنك مواضيع المحاضر =====
const MEETING_TOPICS = [
  "مناقشة آلية العمل خلال الشهر",
  "مناقشة الصعوبات التي تواجه الموظفين",
  "مناقشة الإحصائية الشهرية للمحاليل والمستلزمات",
  "مناقشة التحديات في التموين الخاص ببرنامج عينتي",
  "مناقشة خطة العمل المستقبلية",
  "مناقشة نتائج الجولات التفتيشية",
  "مناقشة تقارير الجودة",
  "مناقشة شكاوى المرضى",
  "مناقشة اقتراحات الموظفين",
  "مناقشة احتياجات القسم",
  "مناقشة برامج الصيانة الوقائية",
  "مناقشة معايرة الأجهزة",
  "مناقشة ضبط الجودة الداخلي",
  "مناقشة ضبط الجودة الخارجي",
  "مناقشة برامج السلامة الحيوية",
  "مناقشة إدارة النفايات الطبية",
  "مناقشة برامج مكافحة العدوى",
  "مناقشة تحديثات الأنظمة",
  "مناقشة برامج التدريب",
  "مناقشة مؤشرات الأداء",
  "مناقشة برنامج عينتي",
  "مناقشة اعتماد المختبر",
  "مناقشة التوسع في الخدمات",
  "مناقشة إدخال أجهزة جديدة",
  "مناقشة تحسين العمليات",
  "مناقشة رضا العملاء",
  "مناقشة كفاءة الموظفين",
  "مناقشة المخزون والمستلزمات",
  "مناقشة التوثيق والسجلات",
  "مناقشة الخطط المستقبلية"
];

// ===== بنك البرامج التدريبية =====
const TRAINING_PROGRAMS = [
  "ضبط الجودة الداخلي",
  "ضبط الجودة الخارجي",
  "معايرة الأجهزة المخبرية",
  "السلامة الحيوية",
  "إدارة النفايات الطبية",
  "مكافحة العدوى",
  "سحب الدم",
  "التعامل مع العينات",
  "أجهزة التحاليل",
  "الفحوصات المتخصصة",
  "إدارة الوقت",
  "مهارات التواصل",
  "خدمة العملاء",
  "إدارة المخزون",
  "التوثيق والسجلات",
  "أنظمة المعلومات",
  "إدارة المخاطر",
  "القيادة والتغيير",
  "الإسعافات الأولية",
  "الحريق والطوارئ"
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
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch(e) {
    return '';
  }
}

function getGregorianDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
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

// ===== قراءة Excel =====
document.getElementById('excelFile')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      document.getElementById('excelResult').innerHTML = `
        <p style="color:green; margin-top:10px;">✅ تم قراءة الملف بنجاح</p>
        <p>عدد الصفوف: ${json.length}</p>
        <p>عدد الأعمدة: ${json[0]?.length || 0}</p>
      `;
    } catch(err) {
      document.getElementById('excelResult').innerHTML = `
        <p style="color:red; margin-top:10px;">❌ خطأ في قراءة الملف</p>
      `;
    }
  };
  reader.readAsArrayBuffer(file);
});

// ===== توليد محضر اجتماع =====
function generateMeeting() {
  const topicCount = 4;
  const shuffled = [...MEETING_TOPICS].sort(() => 0.5 - Math.random());
  const selectedTopics = shuffled.slice(0, topicCount);
  
  const empCount = 8;
  const regularStaff = STAFF.filter(s => s.role !== "رئيس قسم المختبر");
  const shuffledEmp = [...regularStaff].sort(() => 0.5 - Math.random());
  const selectedEmp = shuffledEmp.slice(0, empCount);
  
  const gregorian = getGregorianDate();
  const hijri = getHijriDate();
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر");
  
  const meetingHTML = `
    <div class="meeting-paper" id="meetingPaper">
      
      <div class="meeting-header">
        <div class="meeting-header-text">
          <h3>تجمع عسير الصحي</h3>
          <h4>القطاع الصحي ومستشفى سبت العلايا العام</h4>
        </div>
        <img src="logo.svg" alt="شعار تجمع عسير الصحي" class="meeting-logo">
      </div>
      
      <h2 class="meeting-title">محضر اجتماع - قسم المختبر</h2>
      
      <table class="meeting-info-table">
        <tr><td class="label">الموضوع</td><td>مناقشة خطة العمل داخل قسم المختبر</td></tr>
        <tr><td class="label">المكان</td><td>مستشفى سبت العلايا - قسم المختبر</td></tr>
        <tr><td class="label">التاريخ</td><td>${hijri} الموافق ${gregorian}</td></tr>
        <tr><td class="label">الزمن</td><td>10:00 صباحاً</td></tr>
      </table>
      
      <h3 class="meeting-section-title">أجندة الاجتماع:</h3>
      <ol class="meeting-agenda">
        ${selectedTopics.map(t => `<li>${t}</li>`).join('')}
      </ol>
      
      <h3 class="meeting-section-title">التوصيات:</h3>
      <table class="meeting-recommendations">
        <thead><tr><th>التوصية</th></tr></thead>
        <tbody>
          <tr><td>متابعة تنفيذ ما ورد في جدول الأعمال</td></tr>
          <tr><td>رفع تقرير مفصل للإدارة</td></tr>
          <tr><td>تحديد موعد الاجتماع القادم</td></tr>
          <tr><td>التواصل مع الإدارات المعنية لتنفيذ التوصيات</td></tr>
        </tbody>
      </table>
      
      <table class="meeting-signatures">
        <thead>
          <tr><th>الرقم</th><th>الاسم</th><th>التوقيع</th></tr>
        </thead>
        <tbody>
          ${selectedEmp.map((e, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${e.name}</td>
              <td class="signature-cell"></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="head-signature">
        <p><strong>رئيس قسم المختبر:</strong></p>
        <p>${headOfDept.name}</p>
        <p style="margin-top:30px;">التوقيع: _______________________</p>
      </div>
      
      <div class="meeting-footer">
        <img src="logo.svg" alt="شعار تجمع عسير الصحي" class="footer-logo">
        <p>تجمع عسير الصحي</p>
        <p>Aseer Health Cluster</p>
      </div>
      
    </div>
    
    <button onclick="window.print()" class="btn-primary" style="margin-top:20px;">🖨️ طباعة المحضر</button>
  `;
  
  document.getElementById('meetingResult').innerHTML = meetingHTML;
  
  const counter = document.getElementById('stat-meetings');
  if (counter) counter.textContent = (parseInt(counter.textContent) || 0) + 1;
}

// ===== توليد مؤشر التدريب =====
function generateTraining() {
  const progCount = 2 + Math.floor(Math.random() * 2);
  const shuffledProg = [...TRAINING_PROGRAMS].sort(() => 0.5 - Math.random());
  const selectedProg = shuffledProg.slice(0, progCount);
  
  const empCount = 3 + Math.floor(Math.random() * 3);
  const regularStaff = STAFF.filter(s => s.role !== "رئيس قسم المختبر");
  const shuffledEmp = [...regularStaff].sort(() => 0.5 - Math.random());
  const selectedEmp = shuffledEmp.slice(0, empCount);
  
  const gregorian = getGregorianDate();
  const hijri = getHijriDate();
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر");
  
  const trainingHTML = `
    <div class="meeting-paper" id="trainingPaper">
      
      <div class="meeting-header">
        <div class="meeting-header-text">
          <h3>تجمع عسير الصحي</h3>
          <h4>القطاع الصحي ومستشفى سبت العلايا العام</h4>
        </div>
        <img src="logo.svg" alt="شعار تجمع عسير الصحي" class="meeting-logo">
      </div>
      
      <h2 class="meeting-title">مؤشر التدريب - قسم المختبر</h2>
      
      <table class="meeting-info-table">
        <tr><td class="label">الموضوع</td><td>خطة التدريب الشهرية</td></tr>
        <tr><td class="label">المكان</td><td>مستشفى سبت العلايا - قسم المختبر</td></tr>
        <tr><td class="label">التاريخ</td><td>${hijri} الموافق ${gregorian}</td></tr>
        <tr><td class="label">الزمن</td><td>10:00 صباحاً</td></tr>
      </table>
      
      <h3 class="meeting-section-title">البرامج التدريبية:</h3>
      <ol class="meeting-agenda">
        ${selectedProg.map(p => `<li>${p}</li>`).join('')}
      </ol>
      
      <h3 class="meeting-section-title">الموظفون الحاضرون:</h3>
      <table class="meeting-signatures">
        <thead>
          <tr><th>الرقم</th><th>الاسم</th><th>التوقيع</th></tr>
        </thead>
        <tbody>
          ${selectedEmp.map((e, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${e.name}</td>
              <td class="signature-cell"></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="head-signature">
        <p><strong>رئيس قسم المختبر:</strong></p>
        <p>${headOfDept.name}</p>
        <p style="margin-top:30px;">التوقيع: _______________________</p>
      </div>
      
      <div class="meeting-footer">
        <img src="logo.svg" alt="شعار تجمع عسير الصحي" class="footer-logo">
        <p>تجمع عسير الصحي</p>
        <p>Aseer Health Cluster</p>
      </div>
      
    </div>
    
    <button onclick="window.print()" class="btn-primary" style="margin-top:20px;">🖨️ طباعة</button>
  `;
  
  document.getElementById('trainingResult').innerHTML = trainingHTML;
  
  const counter = document.getElementById('stat-training');
  if (counter) counter.textContent = (parseInt(counter.textContent) || 0) + 1;
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

// ===== فتح نموذج =====
function openModel(id) {
  if (id === 'meeting-model') {
    document.querySelector('[data-tab="meetings"]').click();
    return;
  }
  if (id === 'training-model') {
    document.querySelector('[data-tab="training"]').click();
    return;
  }
  alert(`📊 سيتم فتح النموذج: ${id}\n(قيد التطوير - سيتم إضافته قريباً)`);
}

// ===== التشغيل =====
document.addEventListener('DOMContentLoaded', () => {
  renderStaff();
  loadSettings();
});
