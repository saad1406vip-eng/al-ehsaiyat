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

let selectedTrainingStaff = [];

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

// ===== Modal =====
let currentModalMode = 'training';

function openStaffModal() {
  currentModalMode = 'training';
  document.getElementById('staffModalTitle').textContent = '👥 اختيار الموظفين للتدريب';
  showStaffModal(selectedTrainingStaff);
}

function openMeetingStaffModal() {
  currentModalMode = 'meeting';
  document.getElementById('staffModalTitle').textContent = '👥 اختيار الموظفين للمحضر';
  showStaffModal(selectedMeetingStaff);
}

function showStaffModal(selectedNames) {
  const modal = document.getElementById('staffModal');
  const content = document.getElementById('staffModalContent');
  const regularStaff = STAFF.filter(s => s.role !== "رئيس قسم المختبر");
  
  content.innerHTML = `
    <table class="input-table">
      <thead><tr><th>اختيار</th><th>الاسم</th><th>المسمى</th></tr></thead>
      <tbody>
        ${regularStaff.map(s => `
          <tr>
            <td><input type="checkbox" class="staff-modal-check" value="${s.name}" ${selectedNames.includes(s.name) ? 'checked' : ''}></td>
            <td>${s.name}</td>
            <td>${s.role}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  modal.classList.add('active');
}

function closeStaffModal() {
  document.getElementById('staffModal').classList.remove('active');
}

function selectAllStaff() {
  document.querySelectorAll('.staff-modal-check').forEach(c => c.checked = true);
}

function deselectAllStaff() {
  document.querySelectorAll('.staff-modal-check').forEach(c => c.checked = false);
}

function confirmStaffSelection() {
  const selected = [...document.querySelectorAll('.staff-modal-check:checked')].map(c => c.value);
  
  if (currentModalMode === 'training') {
    selectedTrainingStaff = selected;
    const preview = document.getElementById('selectedStaffPreview');
    preview.textContent = selected.length === 0 
      ? 'لم يتم اختيار أي موظف — سيتم استخدام كل الفريق'
      : `✅ تم اختيار ${selected.length} موظف`;
  } else {
    selectedMeetingStaff = selected;
    const preview = document.getElementById('meetingStaffPreview');
    preview.textContent = selected.length === 0 
      ? 'لم يتم اختيار أي موظف — سيتم استخدام 8 موظفين تلقائياً'
      : `✅ تم اختيار ${selected.length} موظف`;
  }
  
  closeStaffModal();
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
  
  let staffList = [];
  if (selectedTrainingStaff.length > 0) {
    staffList = STAFF.filter(s => selectedTrainingStaff.includes(s.name));
  } else {
    staffList = STAFF.filter(s => s.role !== "رئيس قسم المختبر");
  }
  
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر") || STAFF[0];
  
  window.trainingWeeks = weeks;
  window.trainingMeta = { monthName, year, headOfDept, staffList };
  
  // ===== التقرير الشهري (أولاً) =====
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
              <td>${staffList.length}</td>
              <td>ذكور: ${staffList.length}</td>
              <td>سعودي: ${Math.round(staffList.length * 0.9)}</td>
              <td>${staffList.length}</td>
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
  
  // ===== 4 أسابيع (بدون توقيع) =====
  let weeksHTML = weeks.map((w) => `
    <div class="meeting-paper" style="page-break-after: always;">
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
      <table class="meeting-signatures" style="font-size:11px;">
        <thead>
          <tr><th>م</th><th>الاسم</th><th>الرقم الوظيفي</th><th>الفئة</th><th>التوقيع</th></tr>
        </thead>
        <tbody>
          ${staffList.map((e, idx) => `
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
            <td colspan="2">${staffList.length * w.hours} ساعة</td>
          </tr>
        </tbody>
      </table>
    </div>
  `).join('');
  
  // الترتيب: التقرير الشهري أولاً ثم الأسابيع
  document.getElementById('training-result').innerHTML = monthlyReport + weeksHTML;
  
  const counter = document.getElementById('stat-training');
  if (counter) counter.textContent = (parseInt(counter.textContent) || 0) + 1;
}

// ===== حفظ Excel =====
function saveTrainingExcel() {
  if (!window.trainingWeeks) { alert('⚠️ قم بتوليد النموذج أولاً'); return; }
  const { monthName, year, headOfDept, staffList } = window.trainingMeta;
  const wb = XLSX.utils.book_new();
  
  window.trainingWeeks.forEach((w) => {
    const rows = [
      [`بيان بالتدريب اليومي الداخلي - ${w.name}`],
      [`الشهر: ${monthName} ${year}`], [],
      ['التاريخ', w.date, '', 'الموضوع', w.course],
      ['عدد الساعات', w.hours], [],
      ['م', 'الاسم', 'الرقم الوظيفي', 'الفئة', 'الساعات', 'التوقيع'],
      ...staffList.map((e, i) => [i + 1, e.name, e.emp, e.role, w.hours, '']),
      [], ['', '', 'المجموع', '', staffList.length * w.hours], [],
      ['رئيس قسم المختبر', headOfDept.name]
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, w.name);
  });
  
  const reportRows = [
    [`تقرير المتابعة الشهرية للتدريب - ${monthName} ${year}`], [],
    ['م', 'المنطقة', 'الدورة', 'المجال', 'الساعات', 'التنفيذ', 'التاريخ', 'المتدربون'],
    ...window.trainingWeeks.map((w, i) => [i+1, 'مستشفى سبت العلاية العام', w.course, 'صحي', w.hours, 'حضوري', w.date, staffList.length])
  ];
  const reportWs = XLSX.utils.aoa_to_sheet(reportRows);
  XLSX.utils.book_append_sheet(wb, reportWs, 'التقرير الشهري');
  
  XLSX.writeFile(wb, `تدريب_المختبر_${year}-${String(parseInt(document.getElementById('trainingMonth').value)).padStart(2,'0')}.xlsx`);
}

document.addEventListener('DOMContentLoaded', () => {
  renderTrainingWeeks();
  document.getElementById('trainingMonth')?.addEventListener('change', renderTrainingWeeks);
  document.getElementById('trainingYear')?.addEventListener('change', renderTrainingWeeks);
});
