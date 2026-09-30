// ===== قراءة ملف عسير =====
async function readAseerFile(file) {
  try {
    const data = new Uint8Array(await file.arrayBuffer());
    const workbook = XLSX.read(data, { type: 'array' });
    window.aseerWorkbook = workbook;
    
    const sheet = workbook.Sheets['التجمع الصحي'];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    window.aseerData = {
      hospital: json[3]?.[0] || 'مستشفى سبت العلاية العام',
      year: json[2]?.[1] || 2026
    };
    
    document.getElementById('aseerFileResult').innerHTML = `
      <div style="margin-top:10px;padding:15px;background:#f0f4f8;border-radius:8px;">
        <p style="color:green;">✅ تم قراءة ملف عسير</p>
        <p><strong>المستشفى:</strong> ${window.aseerData.hospital}</p>
        <p><strong>السنة:</strong> ${window.aseerData.year}</p>
      </div>
    `;
    
  } catch(err) {
    document.getElementById('aseerFileResult').innerHTML = `
      <p style="color:red;">❌ خطأ: ${err.message}</p>
    `;
  }
}

// ===== حساب العيادات اليدوية =====
function calculateManual() {
  const phVisitors = parseInt(document.getElementById('ph-visitors').value) || 0;
  const phTests = parseInt(document.getElementById('ph-tests').value) || 0;
  const phTotal = phVisitors * phTests * 30;
  
  const marriageVisitors = parseInt(document.getElementById('marriage-visitors').value) || 0;
  const marriageTests = parseInt(document.getElementById('marriage-tests').value) || 0;
  const marriageTotal = marriageVisitors * marriageTests * 30;
  
  const grandTotal = phTotal + marriageTotal;
  
  document.getElementById('ph-total').textContent = phTotal.toLocaleString();
  document.getElementById('marriage-total').textContent = marriageTotal.toLocaleString();
  document.getElementById('manual-grand-total').textContent = grandTotal.toLocaleString();
  
  return { phTotal, marriageTotal, grandTotal };
}

// ===== توليد نموذج عسير =====
function generateAseerModel() {
  const manual = calculateManual();
  const vidaTotal = window.vidaParsedData?.totals?.grand || 0;
  const grandTotal = vidaTotal + manual.grandTotal;
  
  document.getElementById('previewResult').innerHTML = `
    <table class="input-table">
      <tr><td>من فيدا</td><td>${vidaTotal.toLocaleString()}</td></tr>
      <tr><td>عيادة الصحة العامة</td><td>${manual.phTotal.toLocaleString()}</td></tr>
      <tr><td>عيادة فحص الزواج</td><td>${manual.marriageTotal.toLocaleString()}</td></tr>
      <tr style="background:#f0f4f8;font-weight:bold;">
        <td>الإجمالي</td>
        <td>${grandTotal.toLocaleString()}</td>
      </tr>
    </table>
  `;
  
  if (window.aseerWorkbook && window.vidaParsedData) {
    addNewMonthToAseer(window.aseerWorkbook, {
      vidaData: window.vidaParsedData,
      manualData: manual
    });
  }
  
  displayAseerModel(grandTotal, vidaTotal, manual);
}

// ===== إضافة الشهر الجديد =====
function addNewMonthToAseer(workbook, data) {
  const monthIndex = parseInt(document.getElementById('aseerMonth').value);
  const sheet = workbook.Sheets['التجمع الصحي'];
  const col = String.fromCharCode(66 + monthIndex);
  
  const totalPatients = data.vidaData.totals.grand + data.manualData.grandTotal;
  
  sheet[col + '6'] = { v: totalPatients, t: 'n' };
  sheet[col + '8'] = { v: Math.round(totalPatients * 0.7), t: 'n' };
  sheet[col + '9'] = { v: Math.round(totalPatients * 0.3), t: 'n' };
  sheet[col + '11'] = { v: Math.round(totalPatients * 0.4), t: 'n' };
  sheet[col + '12'] = { v: Math.round(totalPatients * 0.6), t: 'n' };
  
  const deptData = data.vidaData.data;
  
  sheet[col + '15'] = { v: deptData['Immunology']?.total || 0, t: 'n' };
  sheet[col + '16'] = { v: deptData['Virology']?.total || 0, t: 'n' };
  sheet[col + '17'] = { v: 0, t: 'n' };
  sheet[col + '18'] = { v: deptData['Parasitology']?.total || 0, t: 'n' };
  sheet[col + '19'] = { v: deptData['Urine']?.total || 0, t: 'n' };
  sheet[col + '20'] = { v: deptData['Microbiology']?.total || 0, t: 'n' };
  sheet[col + '21'] = { v: deptData['Hormones']?.total || 0, t: 'n' };
  sheet[col + '22'] = { v: deptData['Biochemistry']?.total || 0, t: 'n' };
  sheet[col + '23'] = { v: 0, t: 'n' };
  sheet[col + '24'] = { v: deptData['Serology']?.total || 0, t: 'n' };
  sheet[col + '25'] = { v: 0, t: 'n' };
  sheet[col + '26'] = { v: deptData['Histopathology']?.total || 0, t: 'n' };
  sheet[col + '27'] = { v: deptData['Hematology']?.total || 0, t: 'n' };
  sheet[col + '28'] = { v: 0, t: 'n' };
  sheet[col + '29'] = { v: 0, t: 'n' };
  sheet[col + '30'] = { v: 0, t: 'n' };
  sheet[col + '31'] = { v: 0, t: 'n' };
  sheet[col + '32'] = { v: 0, t: 'n' };
  sheet[col + '33'] = { v: 0, t: 'n' };
  
  console.log('✅ تم إضافة الشهر إلى ملف عسير');
}

// ===== حفظ ملف عسير =====
function saveAseerExcel() {
  if (!window.aseerWorkbook) {
    alert('⚠️ ارفع ملف عسير أولاً');
    return;
  }
  
  const monthIndex = parseInt(document.getElementById('aseerMonth').value);
  const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const monthName = monthNames[monthIndex - 1];
  
  XLSX.writeFile(window.aseerWorkbook, `مستشفى سبت العلاية العام - نموذج الاحصائيات الشهرية - ${monthName}.xlsx`);
}

// ===== عرض النموذج =====
function displayAseerModel(grandTotal, vidaTotal, manual) {
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر");
  const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const monthIndex = parseInt(document.getElementById('aseerMonth').value);
  const monthName = monthNames[monthIndex - 1];
  
  document.getElementById('aseer-result').innerHTML = `
    <div class="meeting-paper" id="aseer-result-paper">
      <div class="meeting-header">
        <div class="meeting-header-text">
          <h3>المملكة العربية السعودية</h3>
          <h4>وزارة الصحة - تجمع عسير الصحي</h4>
          <h4>مستشفى سبت العلاية العام</h4>
        </div>
        <img src="logo.svg" class="meeting-logo">
      </div>
      
      <h2 class="meeting-title">إحصائية الفحوصات المخبرية - ${monthName} ${document.getElementById('aseerYear').value}</h2>
      
      <h3 class="meeting-section-title">عدد المستفيدين</h3>
      <table class="meeting-info-table">
        <tr><td class="label">الإجمالي</td><td>${grandTotal.toLocaleString()}</td></tr>
        <tr><td class="label">من فيدا</td><td>${vidaTotal.toLocaleString()}</td></tr>
        <tr><td class="label">من العيادات اليدوية</td><td>${manual.grandTotal.toLocaleString()}</td></tr>
      </table>
      
      <h3 class="meeting-section-title">العيادات اليدوية</h3>
      <table class="meeting-info-table">
        <tr><td class="label">عيادة الصحة العامة</td><td>${manual.phTotal.toLocaleString()}</td></tr>
        <tr><td class="label">عيادة فحص الزواج</td><td>${manual.marriageTotal.toLocaleString()}</td></tr>
      </table>
      
      <div class="head-signature">
        <p><strong>رئيس قسم المختبر:</strong></p>
        <p>${headOfDept.name}</p>
        <p style="margin-top:30px;">التوقيع: _______________________</p>
      </div>
    </div>
  `;
}

// ===== توليد بنك الدم =====
function generateBloodBank() {
  const data = {
    donorsTotal: document.getElementById('bb-donors-total')?.value || 0,
    donorsSaudi: document.getElementById('bb-donors-saudi')?.value || 0,
    donorsNSaudi: document.getElementById('bb-donors-nsaudi')?.value || 0,
    firstTime: document.getElementById('bb-first-time')?.value || 0,
    moreThanOne: document.getElementById('bb-more-than-one')?.value || 0,
    collectedSame: document.getElementById('bb-collected-same')?.value || 0,
    collectedOther: document.getElementById('bb-collected-other')?.value || 0,
    sentOther: document.getElementById('bb-sent-other')?.value || 0,
    totalUnits: document.getElementById('bb-total-units')?.value || 0,
    packedRBC: document.getElementById('bb-packed-rbc')?.value || 0,
    ffp: document.getElementById('bb-ffp')?.value || 0,
    cryo: document.getElementById('bb-cryo')?.value || 0,
    pc: document.getElementById('bb-pc')?.value || 0,
    whole: document.getElementById('bb-whole')?.value || 0,
    dispPacked: document.getElementById('bb-disp-packed')?.value || 0,
    dispPlatelets: document.getElementById('bb-disp-platelets')?.value || 0,
    dispFFP: document.getElementById('bb-disp-ffp')?.value || 0,
    dispCryo: document.getElementById('bb-disp-cryo')?.value || 0,
    dispPRBC: document.getElementById('bb-disp-prbc')?.value || 0,
    dispPLT: document.getElementById('bb-disp-plt')?.value || 0,
    dispIrrPRBC: document.getElementById('bb-disp-irr-prbc')?.value || 0,
    dispIrrPLT: document.getElementById('bb-disp-irr-plt')?.value || 0,
    dispOthers: document.getElementById('bb-disp-others')?.value || 0,
    cmMatched: document.getElementById('bb-cm-matched')?.value || 0,
    cmMismatched: document.getElementById('bb-cm-mismatched')?.value || 0,
    bg: document.getElementById('bb-bg')?.value || 0,
    as: document.getElementById('bb-as')?.value || 0,
    ai: document.getElementById('bb-ai')?.value || 0,
    hbv: document.getElementById('bb-hbv')?.value || 0,
    hcv: document.getElementById('bb-hcv')?.value || 0,
    hiv: document.getElementById('bb-hiv')?.value || 0,
    htlv: document.getElementById('bb-htlv')?.value || 0,
    cmv: document.getElementById('bb-cmv')?.value || 0,
    std: document.getElementById('bb-std')?.value || 0,
    malaria: document.getElementById('bb-malaria')?.value || 0
  };

  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر");
  const gregorian = getGregorianDate();
  const hijri = getHijriDate();

  const html = `
    <div class="meeting-paper" id="bb-result-paper">
      <div class="meeting-header">
        <div class="meeting-header-text">
          <h3>المملكة العربية السعودية</h3>
          <h4>وزارة الصحة - الإدارة العامة للإحصاء والمعلومات</h4>
          <h4>نموذج رقم (GDSI-15-1): إحصائيات خدمات بنك الدم</h4>
        </div>
        <img src="logo.svg" class="meeting-logo">
      </div>

      <h2 class="meeting-title">إحصائيات خدمات بنك الدم - ${gregorian}</h2>
      <p style="text-align:center;margin-bottom:20px;">${hijri}</p>

      <h3 class="meeting-section-title">المتبرعون (Blood Donors)</h3>
      <table class="meeting-info-table">
        <tr><td class="label">إجمالي عدد المتبرعين</td><td>${data.donorsTotal}</td></tr>
        <tr><td class="label">سعودي</td><td>${data.donorsSaudi}</td></tr>
        <tr><td class="label">غير سعودي</td><td>${data.donorsNSaudi}</td></tr>
        <tr><td class="label">تبرع لأول مرة</td><td>${data.firstTime}</td></tr>
        <tr><td class="label">تبرع أكثر من مرة</td><td>${data.moreThanOne}</td></tr>
      </table>

      <h3 class="meeting-section-title">تفاصيل الفحوص والوحدات</h3>
      <table class="meeting-info-table">
        <tr><td class="label">وحدات مجمعة في نفس البنك</td><td>${data.collectedSame}</td></tr>
        <tr><td class="label">وحدات مجمعة من بنوك أخرى</td><td>${data.collectedOther}</td></tr>
        <tr><td class="label">وحدات مرسلة لبنوك أخرى</td><td>${data.sentOther}</td></tr>
        <tr><td class="label">إجمالي عدد الوحدات</td><td>${data.totalUnits}</td></tr>
      </table>

      <h3 class="meeting-section-title">مشتقات الدم المحضرة</h3>
      <table class="meeting-info-table">
        <tr><td class="label">Packed RBC</td><td>${data.packedRBC}</td></tr>
        <tr><td class="label">FFP</td><td>${data.ffp}</td></tr>
        <tr><td class="label">Cryo.ppt</td><td>${data.cryo}</td></tr>
        <tr><td class="label">PC</td><td>${data.pc}</td></tr>
      </table>

      <h3 class="meeting-section-title">الوحدات المصروفة</h3>
      <table class="meeting-info-table">
        <tr><td class="label">Whole Blood</td><td>${data.whole}</td></tr>
        <tr><td class="label">Packed RBC</td><td>${data.dispPacked}</td></tr>
        <tr><td class="label">Conc. Platelets</td><td>${data.dispPlatelets}</td></tr>
        <tr><td class="label">FFP</td><td>${data.dispFFP}</td></tr>
        <tr><td class="label">Cryoprecipitate</td><td>${data.dispCryo}</td></tr>
        <tr><td class="label">PRBCs Leukocyte Filtered</td><td>${data.dispPRBC}</td></tr>
        <tr><td class="label">Platelets Conc. Leukocyte Filtered</td><td>${data.dispPLT}</td></tr>
        <tr><td class="label">Irradiated PRBCs</td><td>${data.dispIrrPRBC}</td></tr>
        <tr><td class="label">Irradiated Platelets</td><td>${data.dispIrrPLT}</td></tr>
        <tr><td class="label">Others</td><td>${data.dispOthers}</td></tr>
      </table>

      <h3 class="meeting-section-title">فحوص الدم</h3>
      <table class="meeting-info-table">
        <tr><td class="label">Cross Matching - Matched</td><td>${data.cmMatched}</td></tr>
        <tr><td class="label">Cross Matching - Mismatched</td><td>${data.cmMismatched}</td></tr>
        <tr><td class="label">Blood Grouping & Rh Factor</td><td>${data.bg}</td></tr>
        <tr><td class="label">Antibody Screening</td><td>${data.as}</td></tr>
        <tr><td class="label">Antibody Identification</td><td>${data.ai}</td></tr>
        <tr><td class="label">Hepatitis B</td><td>${data.hbv}</td></tr>
        <tr><td class="label">Hepatitis C</td><td>${data.hcv}</td></tr>
        <tr><td class="label">HIV</td><td>${data.hiv}</td></tr>
        <tr><td class="label">HTLV</td><td>${data.htlv}</td></tr>
        <tr><td class="label">CMV</td><td>${data.cmv}</td></tr>
        <tr><td class="label">Other STD</td><td>${data.std}</td></tr>
        <tr><td class="label">Malaria & Other Parasites</td><td>${data.malaria}</td></tr>
      </table>

      <div class="head-signature">
        <p><strong>رئيس قسم المختبر:</strong></p>
        <p>${headOfDept.name}</p>
        <p style="margin-top:30px;">التوقيع: _______________________</p>
      </div>
    </div>
  `;

  document.getElementById('bb-result').innerHTML = html;
}

// ===== توليد إحصائية مخبرية =====
function generateLab() {
  document.getElementById('lab-result').innerHTML = `
    <div class="meeting-paper">
      <p style="text-align:center;padding:40px;color:#64748b;">
        📊 سيتم توليد النموذج بعد إدخال بيانات الأيام
      </p>
    </div>
  `;
}

function addLabDay() {
  const date = document.getElementById('lab-date').value;
  if (!date) { alert('⚠️ اختر التاريخ'); return; }
  
  const list = document.getElementById('lab-days-list');
  const dayDiv = document.createElement('div');
  dayDiv.className = 'card';
  dayDiv.style.background = '#f8fafc';
  dayDiv.innerHTML = `
    <h4>📅 ${date}</h4>
    <table class="input-table">
      <tr><td>Immunology</td><td><input type="number" class="lab-day-immunology"></td></tr>
      <tr><td>Virology</td><td><input type="number" class="lab-day-virology"></td></tr>
      <tr><td>Parasitology</td><td><input type="number" class="lab-day-parasitology"></td></tr>
      <tr><td>Urine</td><td><input type="number" class="lab-day-urine"></td></tr>
      <tr><td>Bacteriology</td><td><input type="number" class="lab-day-bact"></td></tr>
      <tr><td>Hormones</td><td><input type="number" class="lab-day-hormones"></td></tr>
      <tr><td>Biochemistry</td><td><input type="number" class="lab-day-biochem"></td></tr>
      <tr><td>Serology</td><td><input type="number" class="lab-day-sero"></td></tr>
      <tr><td>Hematology</td><td><input type="number" class="lab-day-hema"></td></tr>
      <tr><td>Blood Bank</td><td><input type="number" class="lab-day-bb"></td></tr>
    </table>
  `;
  list.appendChild(dayDiv);
}
