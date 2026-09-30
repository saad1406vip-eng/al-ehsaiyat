const TRAINING_PROGRAMS = [
  "Stool Analysis", "Pre-analytical Errors", "Blood Donation Requirements",
  "Laboratory Safety", "ضبط الجودة الداخلي", "ضبط الجودة الخارجي",
  "معايرة الأجهزة المخبرية", "السلامة الحيوية", "إدارة النفايات الطبية",
  "مكافحة العدوى", "سحب الدم", "التعامل مع العينات",
  "أجهزة التحاليل", "الفحوصات المتخصصة", "إدارة الوقت",
  "مهارات التواصل", "خدمة العملاء", "إدارة المخزون",
  "التوثيق والسجلات", "أنظمة المعلومات", "إدارة المخاطر",
  "القيادة والتغيير", "الإسعافات الأولية", "الحريق والطوارئ"
];

function generateTraining() {
  const month = document.getElementById('training-month').value;
  const week = document.getElementById('training-week').value;
  
  const program = TRAINING_PROGRAMS[Math.floor(Math.random() * TRAINING_PROGRAMS.length)];
  
  const count = 3 + Math.floor(Math.random() * 3);
  const regularStaff = STAFF.filter(s => s.role !== "رئيس قسم المختبر");
  const selected = [...regularStaff].sort(() => 0.5 - Math.random()).slice(0, count);
  
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر");
  const gregorian = getGregorianDate();
  const hijri = getHijriDate();
  
  const html = `
    <div class="meeting-paper">
      <div class="meeting-header">
        <div class="meeting-header-text">
          <h3>تجمع عسير الصحي</h3>
          <h4>القطاع الصحي ومستشفى سبت العلايا العام</h4>
        </div>
        <img src="logo.svg" class="meeting-logo">
      </div>

      <h2 class="meeting-title">مؤشر التدريب - الأسبوع ${week}</h2>

      <table class="meeting-info-table">
        <tr><td class="label">الموضوع</td><td>${program}</td></tr>
        <tr><td class="label">المكان</td><td>مستشفى سبت العلايا - قسم المختبر</td></tr>
        <tr><td class="label">التاريخ</td><td>${hijri} الموافق ${gregorian}</td></tr>
        <tr><td class="label">الزمن</td><td>1:00 مساءً</td></tr>
        <tr><td class="label">عدد الساعات</td><td>2 ساعات</td></tr>
      </table>

      <h3 class="meeting-section-title">الموظفون الحاضرون:</h3>
      <table class="meeting-signatures">
        <thead><tr><th>الرقم</th><th>الاسم</th><th>التوقيع</th></tr></thead>
        <tbody>
          ${selected.map((e, i) => `
            <tr><td>${i + 1}</td><td>${e.name}</td><td></td></tr>
          `).join('')}
        </tbody>
      </table>

      <div class="head-signature">
        <p><strong>رئيس قسم المختبر:</strong></p>
        <p>${headOfDept.name}</p>
        <p style="margin-top:30px;">التوقيع: _______________________</p>
      </div>
    </div>
    
    <div class="action-buttons">
      <button onclick="window.print()" class="btn-secondary">🖨️ طباعة</button>
      <button onclick="exportToPDF('training-paper')" class="btn-secondary">📄 PDF</button>
    </div>
  `;

  document.getElementById('training-result').innerHTML = html;
  const counter = document.getElementById('stat-training');
  if (counter) counter.textContent = (parseInt(counter.textContent) || 0) + 1;
}
