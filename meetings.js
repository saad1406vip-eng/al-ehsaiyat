const MEETING_TOPICS = [
  "مناقشة آلية العمل خلال الشهر", "مناقشة الصعوبات التي تواجه الموظفين",
  "مناقشة الإحصائية الشهرية", "مناقشة التحديات في التموين",
  "مناقشة خطة العمل المستقبلية", "مناقشة نتائج الجولات التفتيشية",
  "مناقشة تقارير الجودة", "مناقشة شكاوى المرضى", "مناقشة اقتراحات الموظفين",
  "مناقشة احتياجات القسم", "مناقشة برامج الصيانة الوقائية", "مناقشة معايرة الأجهزة",
  "مناقشة ضبط الجودة الداخلي", "مناقشة ضبط الجودة الخارجي",
  "مناقشة برامج السلامة الحيوية", "مناقشة إدارة النفايات الطبية",
  "مناقشة برامج مكافحة العدوى", "مناقشة تحديثات الأنظمة",
  "مناقشة برامج التدريب", "مناقشة مؤشرات الأداء", "مناقشة برنامج عينتي",
  "مناقشة اعتماد المختبر", "مناقشة التوسع في الخدمات",
  "مناقشة إدخال أجهزة جديدة", "مناقشة تحسين العمليات",
  "مناقشة رضا العملاء", "مناقشة كفاءة الموظفين",
  "مناقشة المخزون والمستلزمات", "مناقشة التوثيق والسجلات",
  "مناقشة الخطط المستقبلية"
];

function renderMeetingStaffSelect() {
  const container = document.getElementById('meetingStaffSelect');
  if (!container) return;
  const regularStaff = STAFF.filter(s => s.role !== "رئيس قسم المختبر");
  container.innerHTML = `
    <table class="input-table">
      <thead><tr><th>اختيار</th><th>الاسم</th><th>المسمى</th></tr></thead>
      <tbody>
        ${regularStaff.map((s, i) => `
          <tr>
            <td><input type="checkbox" class="meeting-staff-check" value="${s.name}" ${i < 8 ? 'checked' : ''}></td>
            <td>${s.name}</td>
            <td>${s.role}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p style="color:#64748b;font-size:13px;margin-top:10px;">اختر من 3 إلى 10 موظفين</p>
  `;
}

function generateMeeting() {
  const topicCount = 4;
  const selectedTopics = [...MEETING_TOPICS].sort(() => 0.5 - Math.random()).slice(0, topicCount);
  
  let selectedNames = [...document.querySelectorAll('.meeting-staff-check:checked')].map(c => c.value);
  if (selectedNames.length === 0) {
    const regularStaff = STAFF.filter(s => s.role !== "رئيس قسم المختبر");
    selectedNames = regularStaff.slice(0, 8).map(s => s.name);
  }
  const selectedEmp = STAFF.filter(s => selectedNames.includes(s.name));
  
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر") || STAFF[0];
  
  document.getElementById('meetingResult').innerHTML = `
    <div class="meeting-paper" id="meeting-paper">
      <div class="meeting-header">
        <div class="meeting-header-text">
          <h3>تجمع عسير الصحي</h3>
          <h4>القطاع الصحي ومستشفى سبت العلايا العام</h4>
        </div>
        <img src="logo.svg" class="meeting-logo" onerror="this.style.display='none'">
      </div>
      
      <h2 class="meeting-title">محضر اجتماع - قسم المختبر</h2>
      
      <table class="meeting-info-table">
        <tr><td class="label">الموضوع</td><td>مناقشة خطة العمل داخل قسم المختبر</td></tr>
        <tr><td class="label">المكان</td><td>مستشفى سبت العلايا - قسم المختبر</td></tr>
        <tr><td class="label">التاريخ</td><td>${getHijriDate()} الموافق ${getGregorianDate()}</td></tr>
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
        <thead><tr><th>الرقم</th><th>الاسم</th><th>التوقيع</th></tr></thead>
        <tbody>
          ${selectedEmp.map((e, i) => `<tr><td>${i + 1}</td><td>${e.name}</td><td></td></tr>`).join('')}
        </tbody>
      </table>
      
      <div class="head-signature">
        <p><strong>رئيس قسم المختبر:</strong></p>
        <p>${headOfDept.name}</p>
        <p style="margin-top:20px;">التوقيع: _______________________</p>
      </div>
    </div>
    
    <div class="action-buttons">
      <button onclick="printModel('meeting-paper')" class="btn-secondary">🖨️ طباعة A4</button>
    </div>
  `;
  
  const counter = document.getElementById('stat-meetings');
  if (counter) counter.textContent = (parseInt(counter.textContent) || 0) + 1;
}

document.addEventListener('DOMContentLoaded', renderMeetingStaffSelect);
