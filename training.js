// ===== قائمة الدورات من ملف المستخدم =====
const TRAINING_COURSES = [
  "Laboratory Safety", "Biosafety Levels & Biosafety Cabinets", "Infection Control in the Laboratory",
  "Personal Protective Equipment (PPE)", "Chemical Safety & SDS", "Fire Safety & Emergency Response",
  "Spill Management", "Needle Stick & Sharps Injury Management", "Laboratory Waste Management",
  "Internal Quality Control (IQC)", "Westgard Rules", "Levey-Jennings Charts",
  "External Quality Assessment (EQA)", "CBAHI Laboratory Standards", "ISO 15189 Overview",
  "Document Control & SOPs", "Non-Conformance & Corrective Action", "Incident Reporting (OVR)",
  "Method Validation & Verification", "Measurement Uncertainty", "Calibration & Verification",
  "Pre-analytical Errors", "Specimen Collection & Order of Draw", "Patient Identification",
  "Specimen Labeling", "Specimen Rejection Criteria", "Specimen Transport & Storage",
  "Phlebotomy Techniques", "Blood Culture Collection", "Urine Specimen Collection",
  "Post-analytical Errors", "Critical Values Reporting", "Result Verification & Validation",
  "Renal Function Tests", "Liver Function Tests", "Lipid Profile",
  "Cardiac Markers", "Diabetes Testing & HbA1c", "Thyroid Function Tests",
  "Hormones & Fertility Tests", "Tumor Markers", "Iron Studies",
  "Vitamin D & B12", "Therapeutic Drug Monitoring (TDM)", "Point of Care Testing (POCT)",
  "Complete Blood Count (CBC)", "Peripheral Blood Smear", "Anemia Classification",
  "Hemoglobinopathies", "Coagulation Tests (PT, APTT, INR)", "D-Dimer & Fibrinogen",
  "Platelet Disorders", "Malaria Parasite Detection", "Blood Donation Requirements",
  "Donor Selection & Deferral", "ABO & Rh Blood Grouping", "Crossmatching",
  "Antibody Screening & Identification", "Direct & Indirect Coombs Test",
  "Blood Components Preparation", "Blood Storage & Transport", "Transfusion Reactions",
  "Massive Transfusion Protocol", "Hemovigilance", "Stool Analysis",
  "Urine Analysis", "Urine Culture", "Gram Stain",
  "Culture Media Preparation", "Blood Culture Processing", "Antimicrobial Susceptibility Testing",
  "Multi-Drug Resistant Organisms", "MRSA Screening", "Tuberculosis & AFB Stain",
  "Parasitology", "CSF Analysis", "Body Fluid Analysis",
  "Hepatitis Serology", "HIV Testing", "CRP & Rheumatoid Factor",
  "Pregnancy Tests (hCG)", "ELISA Principles", "PCR Principles",
  "COVID-19 & Influenza Testing", "Communication Skills", "Patient Rights & Confidentiality",
  "Teamwork & Leadership", "Time Management", "Inventory & Supply Management",
  "Professional Ethics", "Laboratory Data Management", "New Staff Orientation"
];

// ===== توليد جدول الأسابيع =====
function renderTrainingWeeks() {
  const tbody = document.getElementById('trainingWeeksTable');
  if (!tbody) return;
  
  const month = parseInt(document.getElementById('trainingMonth').value) || 9;
  const year = document.getElementById('trainingYear').value || 2026;
  
  const weeks = [
    { name: 'الأسبوع الأول', date: `${year}-${String(month).padStart(2,'0')}-01`, hours: 4 },
    { name: 'الأسبوع الثاني', date: `${year}-${String(month).padStart(2,'0')}-08`, hours: 2 },
    { name: 'الأسبوع الثالث', date: `${year}-${String(month).padStart(2,'0')}-15`, hours: 2 },
    { name: 'الأسبوع الرابع', date: `${year}-${String(month).padStart(2,'0')}-22`, hours: 2 }
  ];
  
  tbody.innerHTML = weeks.map((w, i) => `
    <tr>
      <td>${w.name}</td>
      <td>
        <select id="training-course-${i}" style="width:100%;padding:6px;">
          ${TRAINING_COURSES.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </td>
      <td><input type="number" id="training-hours-${i}" value="${w.hours}" style="width:80px;"></td>
      <td><input type="date" id="training-date-${i}" value="${w.date}"></td>
    </tr>
  `).join('');
  
  // اختيار عشوائي للدورات
  for (let i = 0; i < 4; i++) {
    const select = document.getElementById(`training-course-${i}`);
    if (select) {
      const randomIdx = Math.floor(Math.random() * TRAINING_COURSES.length);
      select.value = TRAINING_COURSES[randomIdx];
    }
  }
}

// ===== اختيار عشوائي =====
function randomizeTraining() {
  for (let i = 0; i < 4; i++) {
    const select = document.getElementById(`training-course-${i}`);
    if (select) {
      const randomIdx = Math.floor(Math.random() * TRAINING_COURSES.length);
      select.value = TRAINING_COURSES[randomIdx];
    }
  }
}

// ===== توليد التدريب =====
function generateTraining() {
  const monthIndex = parseInt(document.getElementById('trainingMonth').value);
  const year = document.getElementById('trainingYear').value;
  const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const monthName = monthNames[monthIndex - 1];
  
  const weeks = [];
  for (let i = 0; i < 4; i++) {
    weeks.push({
      name: ['الأسبوع الأول','الأسبوع الثاني','الأسبوع الثالث','الأسبوع الرابع'][i],
      course: document.getElementById(`training-course-${i}`).value,
      hours: parseInt(document.getElementById(`training-hours-${i}`).value),
      date: document.getElementById(`training-date-${i}`).value
    });
  }
  
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر") || STAFF[0];
  const regularStaff = STAFF.filter(s => s.role !== "رئيس قسم المختبر");
  
  window.trainingWeeks = weeks;
  window.trainingMeta = { monthName, year, headOfDept, regularStaff };
  
  // عرض المعاينة
  let weeksHTML = weeks.map((w, i) => `
    <div class="meeting-paper" style="page-break-after: always;margin-bottom:30px;">
      <div class="meeting-header">
        <div class="meeting-header-text">
          <h3>تجمع عسير الصحي</h3>
          <h4>القطاع الصحي ومستشفى سبت العلايا العام</h4>
        </div>
        <img src="logo.svg" class="meeting-logo" onerror="this.style.display='none'">
      </div>
      
      <h2 class="meeting-title">بيان بالتدريب اليومي الداخلي بقسم المختبر - ${w.name}</h2>
      
      <table class="meeting-info-table">
        <tr><td class="label">الشهر</td><td>${monthName} ${year}</td></tr>
        <tr><td class="label">الأسبوع</td><td>${w.name}</td></tr>
        <tr><td class="label">التاريخ</td><td>${w.date}</td></tr>
        <tr><td class="label">الموضوع</td><td>${w.course}</td></tr>
        <tr><td class="label">عدد الساعات</td><td>${w.hours}</td></tr>
        <tr><td class="label">الوقت</td><td>1:00 مساءً</td></tr>
      </table>
      
      <h3 class="meeting-section-title">الموظفون الحاضرون:</h3>
      <table class="meeting-signatures" style="font-size:10px;">
        <thead>
          <tr><th>م</th><th>الاسم</th><th>الرقم الوظيفي</th><th>الفئة</th><th>التوقيع</th></tr>
        </thead>
        <tbody>
          ${regularStaff.map((e, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${e.name}</td>
              <td>${e.emp}</td>
              <td>${e.role.includes('أخصائي') ? 'أخصائي' : 'فني'}</td>
              <td></td>
            </tr>
          `).join('')}
          <tr style="background:#f0f4f8;font-weight:bold;">
            <td colspan="3">المجموع</td>
            <td colspan="2">${regularStaff.length * w.hours} ساعة</td>
          </tr>
        </tbody>
      </table>
      
      <div class="head-signature">
        <p><strong>رئيس قسم المختبر:</strong></p>
        <p>${headOfDept.name}</p>
        <p style="margin-top:20px;">التوقيع: _______________________</p>
        <p>التاريخ: _______________________</p>
      </div>
    </div>
  `).join('');
  
  // التقرير الشهري
  const monthlyReport = `
    <div class="meeting-paper" style="page-break-after: always;margin-bottom:30px;">
      <div class="meeting-header">
        <div class="meeting-header-text">
          <h3>تجمع عسير الصحي</h3>
          <h4>القطاع الصحي ومستشفى سبت العلايا العام</h4>
        </div>
        <img src="logo.svg" class="meeting-logo" onerror="this.style.display='none'">
      </div>
      
      <h2 class="meeting-title">تقرير المتابعة الشهرية للتدريب - ${monthName} ${year}</h2>
      
      <table class="meeting-info-table" style="font-size:10px;">
        <thead>
          <tr>
            <th>م</th>
            <th>المنطقة/التجمع</th>
            <th>اسم الدورة</th>
            <th>المجال</th>
            <th>الساعات</th>
            <th>التنفيذ</th>
            <th>التاريخ</th>
            <th>عدد المتدربين</th>
            <th>الجنس</th>
            <th>الجنسية</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${weeks.map((w, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>مستشفى سبت العلاية العام</td>
              <td>${w.course}</td>
              <td>صحي</td>
              <td>${w.hours}</td>
              <td>حضوري</td>
              <td>${w.date}</td>
              <td>${regularStaff.length}</td>
              <td>ذكور: ${Math.round(regularStaff.length * 0.4)} / إناث: ${Math.round(regularStaff.length * 0.6)}</td>
              <td>سعودي: ${Math.round(regularStaff.length * 0.9)}</td>
              <td>${regularStaff.length}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="head-signature">
        <p><strong>رئيس قسم المختبر:</strong></p>
        <p>${headOfDept.name}</p>
        <p style="margin-top:20px;">التوقيع: _______________________</p>
      </div>
    </div>
  `;
  
  document.getElementById('training-result').innerHTML = weeksHTML + monthlyReport;
  
  const counter = document.getElementById('stat-training');
  if (counter) counter.textContent = (parseInt(counter.textContent) || 0) + 1;
}

// ===== حفظ التدريب Excel (5 أوراق) =====
function saveTrainingExcel() {
  if (!window.trainingWeeks) {
    alert('⚠️ قم بتوليد النموذج أولاً');
    return;
  }
  
  const { monthName, year, headOfDept, regularStaff } = window.trainingMeta;
  const wb = XLSX.utils.book_new();
  
  // 4 أوراق للأسابيع
  window.trainingWeeks.forEach((w, idx) => {
    const rows = [
      [`بيان بالتدريب اليومي الداخلي بقسم المختبر - ${w.name}`],
      [`الشهر: ${monthName} ${year}`],
      [],
      ['التاريخ', w.date, '', 'الموضوع', w.course],
      [],
      ['م', 'الاسم', 'الرقم الوظيفي', 'الفئة', 'عدد الساعات', 'التوقيع'],
      ...regularStaff.map((e, i) => [
        i + 1,
        e.name,
        e.emp,
        e.role.includes('أخصائي') ? 'أخصائي' : 'فني',
        w.hours,
        ''
      ]),
      [],
      ['', '', 'المجموع', '', regularStaff.length * w.hours],
      [],
      ['رئيس قسم المختبر', headOfDept.name]
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, w.name);
  });
  
  // ورقة التقرير الشهري
  const reportRows = [
    [`تقرير المتابعة الشهرية للتدريب - ${monthName} ${year}`],
    [],
    ['م', 'المنطقة/التجمع', 'اسم الدورة', 'المجال', 'الساعات', 'التنفيذ', 'التاريخ', 'عدد المتدربين'],
    ...window.trainingWeeks.map((w, i) => [
      i + 1, 'مستشفى سبت العلاية العام', w.course, 'صحي', w.hours, 'حضوري', w.date, regularStaff.length
    ])
  ];
  
  const reportWs = XLSX.utils.aoa_to_sheet(reportRows);
  XLSX.utils.book_append_sheet(wb, reportWs, 'التقرير الشهري');
  
  XLSX.writeFile(wb, `تدريب_المختبر_${year}-${String(parseInt(document.getElementById('trainingMonth').value)).padStart(2,'0')}.xlsx`);
}

// ===== التشغيل =====
document.addEventListener('DOMContentLoaded', () => {
  renderTrainingWeeks();
  document.getElementById('trainingMonth')?.addEventListener('change', renderTrainingWeeks);
  document.getElementById('trainingYear')?.addEventListener('change', renderTrainingWeeks);
});
