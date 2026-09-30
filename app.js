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
  { id: 11, name: "سعد عيد سعيد ال سعد القرني", emp: "7707014", role: "فني مختبر" },
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
  "مناقشة التحديات في التموين الخاص ببرنامج عيني",
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
  "مناقشة برنامج عيني",
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

// ===== عرض الفريق =====
function renderStaff() {
  const tbody = document.getElementById('staffTable');
  if (!tbody) return;
  tbody.innerHTML = STAFF.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.emp}</td>
      <td>${s.role}</td>
    </tr>
  `).join('');
  document.getElementById('stat-staff').textContent = STAFF.length;
}

// ===== قراءة Excel =====
document.getElementById('excelFile')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    document.getElementById('excelResult').innerHTML = `
      <p style="color:green; margin-top:10px;">✅ تم قراءة الملف بنجاح</p>
      <p>عدد الصفوف: ${json.length}</p>
      <p>عدد الأعمدة: ${json[0]?.length || 0}</p>
    `;
  };
  reader.readAsArrayBuffer(file);
});

// ===== توليد محضر =====
function generateMeeting() {
  const count = 4 + Math.floor(Math.random() * 2);
  const shuffled = [...MEETING_TOPICS].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  const today = new Date().toLocaleDateString('ar-SA');
  document.getElementById('meetingResult').innerHTML = `
    <div class="card" style="margin-top:20px;">
      <h3>📝 محضر اجتماع - ${today}</h3>
      <h4>جدول الأعمال:</h4>
      <ol>${selected.map(t => `<li>${t}</li>`).join('')}</ol>
      <h4>التوصيات:</h4>
      <ul>
        <li>متابعة تنفيذ ما ورد في جدول الأعمال</li>
        <li>رفع تقرير مفصل للإدارة</li>
        <li>تحديد موعد الاجتماع القادم</li>
      </ul>
      <button onclick="window.print()" class="btn-primary" style="margin-top:15px;">🖨️ طباعة</button>
    </div>
  `;
  document.getElementById('stat-meetings').textContent = 
    (parseInt(document.getElementById('stat-meetings').textContent) || 0) + 1;
}

// ===== توليد تدريب =====
function generateTraining() {
  const progCount = 2 + Math.floor(Math.random() * 2);
  const shuffledProg = [...TRAINING_PROGRAMS].sort(() => 0.5 - Math.random());
  const selectedProg = shuffledProg.slice(0, progCount);
  const empCount = 3 + Math.floor(Math.random() * 3);
  const shuffledEmp = [...STAFF].sort(() => 0.5 - Math.random());
  const selectedEmp = shuffledEmp.slice(0, empCount);
  const today = new Date().toLocaleDateString('ar-SA');
  document.getElementById('trainingResult').innerHTML = `
    <div class="card" style="margin-top:20px;">
      <h3>🎓 خطة التدريب - ${today}</h3>
      <h4>البرامج التدريبية:</h4>
      <ul>${selectedProg.map(p => `<li>${p}</li>`).join('')}</ul>
      <h4>الموظفون المرشحون:</h4>
      <ul>${selectedEmp.map(e => `<li>${e.name} (${e.emp})</li>`).join('')}</ul>
      <button onclick="window.print()" class="btn-primary" style="margin-top:15px;">🖨️ طباعة</button>
    </div>
  `;
  document.getElementById('stat-training').textContent = 
    (parseInt(document.getElementById('stat-training').textContent) || 0) + 1;
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
  alert(`📊 سيتم فتح النموذج: ${id}\n(قيد التطوير - سيتم إضافته قريباً)`);
}

// ===== التشغيل =====
renderStaff();
loadSettings();
