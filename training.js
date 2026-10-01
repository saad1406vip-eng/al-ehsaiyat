const TRAINING_COURSES = [
  "Laboratory Safety", "Biosafety Levels & Biosafety Cabinets", "Infection Control",
  "Personal Protective Equipment (PPE)", "Chemical Safety & SDS", "Fire Safety",
  "Spill Management", "Needle Stick & Sharps Injury Management", "Laboratory Waste Management",
  "Internal Quality Control (IQC)", "Westgard Rules", "Levey-Jennings Charts",
  "External Quality Assessment (EQA)", "CBAHI Laboratory Standards", "ISO 15189 Overview",
  "Document Control & SOPs", "Non-Conformance & Corrective Action", "Incident Reporting",
  "Method Validation & Verification", "Measurement Uncertainty", "Calibration",
  "Pre-analytical Errors", "Specimen Collection & Order of Draw", "Patient Identification",
  "Specimen Labeling", "Specimen Rejection Criteria", "Specimen Transport & Storage",
  "Phlebotomy Techniques", "Blood Culture Collection", "Urine Specimen Collection",
  "Post-analytical Errors", "Critical Values Reporting", "Result Verification",
  "Renal Function Tests", "Liver Function Tests", "Lipid Profile",
  "Cardiac Markers", "Diabetes & HbA1c", "Thyroid Function Tests",
  "Hormones & Fertility Tests", "Tumor Markers", "Iron Studies",
  "Vitamin D & B12", "Therapeutic Drug Monitoring (TDM)", "Point of Care Testing",
  "Complete Blood Count (CBC)", "Peripheral Blood Smear", "Anemia Classification",
  "Hemoglobinopathies", "Coagulation Tests (PT, APTT, INR)", "D-Dimer & Fibrinogen",
  "Platelet Disorders", "Malaria Parasite Detection", "Blood Donation Requirements",
  "Donor Selection & Deferral", "ABO & Rh Blood Grouping", "Crossmatching",
  "Antibody Screening & Identification", "Direct & Indirect Coombs Test",
  "Blood Components Preparation", "Blood Storage & Transport", "Transfusion Reactions",
  "Massive Transfusion Protocol", "Hemovigilance", "Stool Analysis",
  "Urine Analysis", "Urine Culture", "Gram Stain",
  "Culture Media Preparation", "Blood Culture Processing", "Antimicrobial Susceptibility",
  "Multi-Drug Resistant Organisms", "MRSA Screening", "Tuberculosis & AFB Stain",
  "Parasitology", "CSF Analysis", "Body Fluid Analysis",
  "Hepatitis Serology", "HIV Testing", "CRP & Rheumatoid Factor",
  "Pregnancy Tests (hCG)", "ELISA Principles", "PCR Principles",
  "COVID-19 & Influenza Testing", "Communication Skills", "Patient Rights",
  "Teamwork & Leadership", "Time Management", "Inventory Management",
  "Professional Ethics", "Laboratory Data Management", "New Staff Orientation"
];

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
      <td><select id="training-course-${i}" style="width:100%;padding:6px;">
        ${TRAINING_COURSES.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select></td>
      <td><input type="number" id="training-hours-${i}" value="${w.hours}" style="width:80px;"></td>
      <td><input type="date" id="training-date-${i}" value="${w.date}"></td>
    </tr>
  `).join('');
  
  for (let i = 0; i < 4; i++) {
    const sel = document.getElementById(`training-course-${i}`);
    if (sel) sel.value = TRAINING_COURSES[Math.floor(Math.random() * TRAINING_COURSES.length)];
  }
}

function renderTrainingStaffSelect() {
  const container = document.getElementById('trainingStaffSelect');
  if (!container) return;
  const regularStaff = STAFF.filter(s => s.role !== "رئيس قسم المختبر");
  container.innerHTML = `
    <table class="input-table">
      <thead><tr><th>اختيار</th><th>الاسم</th><th>المسمى</th></tr></thead>
      <tbody>
        ${regularStaff.map(s => `
          <tr>
            <td><input type="checkbox" class="training-staff-check" value="${s.name}" checked></td>
            <td>${s.name}</td>
            <td>${s.role}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

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
  
  const selectedNames = [...document.querySelectorAll('.training-staff-check:checked')].map(c => c.value);
  const selectedStaff = STAFF.filter(s => selectedNames.includes(s.name));
  
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر") || STAFF[0];
  
  window.trainingWeeks = weeks;
  window.trainingMeta = { monthName, year, headOfDept, selectedStaff };
  
  let weeksHTML = weeks.map((w, i) => `
    <div class="meeting-paper" style="page-break-after: always;margin-bottom:30px;">
      <div class="meeting-header">
        <div class="meeting-header-text">
          <h3>تجمع عسير الصحي</h3>
          <h4>القطاع الصحي ومستشفى سبت العلايا العام</h4>
        </div>
        <img src="logo.svg" class="meeting-logo" onerror="this.style.display='none'">
      </div>
      
      <h2 class="meeting-title">بيان بالتدريب اليومي الداخلي - ${w.name}</h2>
      
      <table class="meeting-info-table">
        <tr><td class="label">الشهر</td><td>${monthName} ${year}</td></tr>
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
          ${selectedStaff.map((e, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${e.name}</td>
              <td>${e.emp}</td>
              <td>${e.role}</td>
              <td></td>
            </tr>
          `).join('')}
          <tr style="background:#f0f4f8;font-weight:bold;">
            <td colspan="3">المجموع</td>
            <td colspan="2">${selectedStaff.length * w.hours} ساعة</td>
          </tr>
        </tbody>
      </table>
      
      <div class="head-signature">
        <p><strong>رئيس قسم المختبر:</strong></p>
        <p>${headOfDept.name}</p>
        <p style="margin-top:20px;">التوقيع: _______________________</p>
      </div>
    </div>
  `).join('');
  
  const monthlyReport = `
    <div class="meeting-paper" id="training-result-paper" style="page-break-after: always;">
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
            <th>م</th><th>المنطقة</th><th>الدورة</th><th>المجال</th>
            <th>الساعات</th><th>التنفيذ</th><th>التاريخ</th>
            <th>عدد المتدربين</th><th>الجنس</th><th>الجنسية</th><th>الإجمالي</th>
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
              <td>${selectedStaff.length}</td>
              <td>ذكور: ${selectedStaff.length}</td>
              <td>سعودي: ${Math.round(selectedStaff.length * 0.9)}</td>
              <td>${selectedStaff.length}</td>
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

function saveTrainingExcel() {
  if (!window.trainingWeeks) { alert('⚠️ قم بتوليد النموذج أولاً'); return; }
  const { monthName, year, headOfDept, selectedStaff } = window.trainingMeta;
  const wb = XLSX.utils.book_new();
  
  window.trainingWeeks.forEach((w) => {
    const rows = [
      [`بيان بالتدريب اليومي الداخلي - ${w.name}`],
      [`الشهر: ${monthName} ${year}`], [],
      ['التاريخ', w.date, '', 'الموضوع', w.course],
      ['عدد الساعات', w.hours], [],
      ['م', 'الاسم', 'الرقم الوظيفي', 'الفئة', 'الساعات', 'التوقيع'],
      ...selectedStaff.map((e, i) => [i + 1, e.name, e.emp, e.role, w.hours, '']),
      [], ['', '', 'المجموع', '', selectedStaff.length * w.hours], [],
      ['رئيس قسم المختبر', headOfDept.name]
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, w.name);
  });
  
  const reportRows = [
    [`تقرير المتابعة الشهرية للتدريب - ${monthName} ${year}`], [],
    ['م', 'المنطقة', 'الدورة', 'المجال', 'الساعات', 'التنفيذ', 'التاريخ', 'المتدربون'],
    ...window.trainingWeeks.map((w, i) => [i+1, 'مستشفى سبت العلاية العام', w.course, 'صحي', w.hours, 'حضوري', w.date, selectedStaff.length])
  ];
  const reportWs = XLSX.utils.aoa_to_sheet(reportRows);
  XLSX.utils.book_append_sheet(wb, reportWs, 'التقرير الشهري');
  
  XLSX.writeFile(wb, `تدريب_المختبر_${year}-${String(parseInt(document.getElementById('trainingMonth').value)).padStart(2,'0')}.xlsx`);
}

document.addEventListener('DOMContentLoaded', () => {
  renderTrainingWeeks();
  renderTrainingStaffSelect();
  document.getElementById('trainingMonth')?.addEventListener('change', renderTrainingWeeks);
  document.getElementById('trainingYear')?.addEventListener('change', renderTrainingWeeks);
});
