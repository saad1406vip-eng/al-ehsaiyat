// ===== الأقسام الثابتة لإحصائية عسير =====
const Aseer_DEPTS = [
  { ar: 'المناعة', en: 'Immunology', key: 'Immunology' },
  { ar: 'فيروسات', en: 'Virology', key: 'Virology' },
  { ar: 'الفيروسات بنك الدم', en: 'Virology in Blood Bank', key: null },
  { ar: 'الطفيليات', en: 'Parasitology', key: 'Parasitology' },
  { ar: 'البول', en: 'Urine', key: 'Urine' },
  { ar: 'البكتيريا', en: 'Bacteriology', key: 'Microbiology' },
  { ar: 'الهرمونات', en: 'Hormones', key: 'Hormones' },
  { ar: 'الكيمياء الحيوية', en: 'Biochemistry', key: 'Biochemistry' },
  { ar: 'السموم', en: 'Toxicology (TDM)', key: null },
  { ar: 'المصليات', en: 'Serology', key: 'Serology' },
  { ar: 'الوراثة', en: 'Genetics', key: null },
  { ar: 'التشريح النسيجي', en: 'Histology', key: 'Histopathology' },
  { ar: 'أمراض الدم', en: 'Hematology', key: 'Hematology' },
  { ar: 'الجزيئات الحيوية', en: 'Molecular Biology', key: null },
  { ar: 'الدرن', en: 'T.B', key: null },
  { ar: 'علم الخلايا', en: 'Cytology', key: null },
  { ar: 'التدفق الخلوي', en: 'Flowcytometry', key: null },
  { ar: 'الوراثة الخلوية', en: 'Cytogenatics', key: null },
  { ar: 'أخرى', en: 'Others', key: null }
];

// ===== الأرقام الثابتة =====
const FIXED_NUMBERS = {
  'Hormones': 2310,
  'Biochemistry': 2711,
  'Virology': 1746,
  'Hematology': 1095,
  'Parasitology': 287,
  'Serology': 190,
  'Microbiology': 173
};

// ===== عرض جدول أقسام عسير =====
function renderAseerDepts() {
  const tbody = document.getElementById('aseerDeptsBody');
  if (!tbody) return;
  tbody.innerHTML = Aseer_DEPTS.map((d, i) => `
    <tr>
      <td>${i + 1}. ${d.ar} (${d.en})</td>
      <td><input type="number" id="aseer-dept-${i}" value="0" onchange="updateAseerTotal()"></td>
    </tr>
  `).join('') + `
    <tr style="background:#f0f4f8;font-weight:bold;">
      <td>المجموع</td>
      <td><span id="aseer-dept-total">0</span></td>
    </tr>
  `;
}

function updateAseerTotal() {
  let total = 0;
  Aseer_DEPTS.forEach((d, i) => {
    total += parseInt(document.getElementById(`aseer-dept-${i}`)?.value || 0);
  });
  const el = document.getElementById('aseer-dept-total');
  if (el) el.textContent = total.toLocaleString();
}

// ===== قراءة ملف عسير =====
async function readAseerFile(file) {
  try {
    const data = new Uint8Array(await file.arrayBuffer());
    const workbook = XLSX.read(data, { type: 'array' });
    window.aseerWorkbook = workbook;
    const sheet = workbook.Sheets['التجمع الصحي'];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    document.getElementById('aseerFileResult').innerHTML = `
      <div style="margin-top:10px;padding:15px;background:#e6f7e6;border-radius:8px;">
        <p style="color:green;">✅ تم قراءة ملف عسير</p>
        <p><strong>المستشفى:</strong> ${json[3]?.[0] || ''}</p>
      </div>
    `;
  } catch(err) {
    document.getElementById('aseerFileResult').innerHTML = `<p style="color:red;">❌ ${err.message}</p>`;
  }
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
      <div style="margin-top:10px;padding:15px;background:#e6f7e6;border-radius:8px;">
        <p style="color:green;">✅ تم قراءة ملف فيدا</p>
        <p><strong>عدد الأقسام:</strong> ${parsed.divisions.length}</p>
        <p><strong>الإجمالي:</strong> ${parsed.totals.grand.toLocaleString()}</p>
      </div>
    `;
    autoFillAseerFromVida();
    autoFillLabFromVida();
  } catch(err) {
    document.getElementById(resultDivId).innerHTML = `<p style="color:red;">❌ ${err.message}</p>`;
  }
}

function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const rows = [];
  for (const line of lines) {
    if (line.includes('Sabt Al Alaya') || line.includes('Generated on')) continue;
    rows.push(line.split(',').map(c => c.trim().replace(/"/g, '')));
  }
  return rows;
}

function analyzeVidaData(rows) {
  let headerIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === 'Division' || rows[i][0]?.includes('Division')) { headerIndex = i; break; }
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
      erSaudiM: values[0] || 0, erSaudiF: values[1] || 0, erNsaudiM: values[2] || 0, erNsaudiF: values[3] || 0,
      ipSaudiM: values[4] || 0, ipSaudiF: values[5] || 0, ipNsaudiM: values[6] || 0, ipNsaudiF: values[7] || 0,
      opdSaudiM: values[8] || 0, opdSaudiF: values[9] || 0, opdNsaudiM: values[10] || 0, opdNsaudiF: values[11] || 0,
      total: values[12] || 0
    };
    totals.ER += data[division].erSaudiM + data[division].erSaudiF + data[division].erNsaudiM + data[division].erNsaudiF;
    totals.IP += data[division].ipSaudiM + data[division].ipSaudiF + data[division].ipNsaudiM + data[division].ipNsaudiF;
    totals.OPD += data[division].opdSaudiM + data[division].opdSaudiF + data[division].opdNsaudiM + data[division].opdNsaudiF;
    totals.grand += data[division].total;
  }
  return { data, totals, divisions: Object.keys(data) };
}

// ===== ملء تلقائي من فيدا =====
function autoFillAseerFromVida() {
  const vida = window.vidaParsedData?.data || {};
  Aseer_DEPTS.forEach((d, i) => {
    const el = document.getElementById(`aseer-dept-${i}`);
    if (!el) return;
    let value = 0;
    if (d.key && vida[d.key]) value = vida[d.key].total || 0;
    if (d.key && FIXED_NUMBERS[d.key]) value += FIXED_NUMBERS[d.key];
    el.value = value;
  });
  updateAseerTotal();
}

// ===== توليد نموذج عسير =====
function generateAseerModel() {
  const monthIndex = parseInt(document.getElementById('aseerMonth').value);
  const year = document.getElementById('aseerYear').value;
  const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const monthName = monthNames[monthIndex - 1];
  
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر") || STAFF[0];
  
  // جمع الأرقام
  let total = 0;
  const deptValues = Aseer_DEPTS.map((d, i) => {
    const v = parseInt(document.getElementById(`aseer-dept-${i}`)?.value || 0);
    total += v;
    return { ...d, value: v };
  });
  
  // توزيع نسبي
  const saudi = Math.round(total * getRatio('saudiRatio') / 100);
  const nsaudi = total - saudi;
  const male = Math.round(total * (100 - getRatio('femaleRatio')) / 100) || Math.round(total * 0.4);
  const female = total - male;
  
  window.aseerData = { deptValues, total, saudi, nsaudi, male, female, monthName, year };
  
  document.getElementById('aseer-result').innerHTML = `
    <div class="meeting-paper" id="aseer-result-paper">
      <div class="meeting-header">
        <div class="meeting-header-text">
          <h3>المملكة العربية السعودية - وزارة الصحة</h3>
          <h4>تجمع عسير الصحي - مستشفى سبت العلاية العام</h4>
        </div>
        <img src="logo.svg" class="meeting-logo" onerror="this.style.display='none'">
      </div>
      
      <h2 class="meeting-title">إحصائية خدمات المختبر - ${monthName} ${year}</h2>
      
      <h3 class="meeting-section-title">عدد المستفيدين</h3>
      <table class="meeting-info-table">
        <tr><td class="label">إجمالي المستفيدين</td><td>${total.toLocaleString()}</td></tr>
        <tr><td class="label">سعودي</td><td>${saudi.toLocaleString()}</td></tr>
        <tr><td class="label">غير سعودي</td><td>${nsaudi.toLocaleString()}</td></tr>
        <tr><td class="label">ذكر</td><td>${male.toLocaleString()}</td></tr>
        <tr><td class="label">أنثى</td><td>${female.toLocaleString()}</td></tr>
      </table>
      
      <h3 class="meeting-section-title">أقسام المختبر</h3>
      <table class="meeting-info-table" style="font-size:11px;">
        <thead>
          <tr><th>القسم</th><th>Department</th><th>العدد</th></tr>
        </thead>
        <tbody>
          ${deptValues.map(d => `<tr><td>${d.ar}</td><td>${d.en}</td><td>${d.value.toLocaleString()}</td></tr>`).join('')}
          <tr style="background:#f0f4f8;font-weight:bold;">
            <td colspan="2">المجموع</td>
            <td>${total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="head-signature">
        <p><strong>رئيس قسم المختبر:</strong></p>
        <p>${headOfDept.name}</p>
        <p style="margin-top:20px;">التوقيع: _______________________</p>
      </div>
    </div>
  `;
}

// ===== حفظ Excel عسير =====
function saveAseerExcel() {
  if (!window.aseerData) { alert('⚠️ قم بتوليد النموذج أولاً'); return; }
  const d = window.aseerData;
  const rows = [
    [`إحصائية خدمات المختبر - ${d.monthName} ${d.year}`], [],
    ['إجمالي المستفيدين', d.total],
    ['سعودي', d.saudi], ['غير سعودي', d.nsaudi],
    ['ذكر', d.male], ['أنثى', d.female], [],
    ['القسم', 'Department', 'العدد'],
    ...d.deptValues.map(x => [x.ar, x.en, x.value]),
    ['', 'المجموع', d.total]
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'إحصائية عسير');
  XLSX.writeFile(wb, `إحصائية_عسير_${d.monthName}_${d.year}.xlsx`);
}

// ===== بنك الدم =====
function toggleBBMode() {
  const mode = document.querySelector('input[name="bb-mode"]:checked').value;
  document.getElementById('bb-manual').style.display = mode === 'manual' ? 'block' : 'none';
  document.getElementById('bb-auto').style.display = mode === 'auto' ? 'block' : 'none';
}

function simulateBBData() {
  const lastData = JSON.parse(localStorage.getItem('bbData') || 'null');
  const factor = getSeasonalFactor(new Date().getMonth() + 1);
  const baseData = lastData || {
    donorsTotal: 58, donorsSaudi: 51, donorsNSaudi: 7,
    firstTime: 51, moreThanOne: 7,
    collectedSame: 58, collectedOther: 63, sentOther: 54, totalUnits: 58,
    packedRBC: 59, ffp: 17, cryo: 0, pc: 0,
    dispFFP: 28, dispPRBC: 44, dispPLT: 27,
    taintFFP: 6, taintPRBC: 17,
    cmMatched: 44, bg: 102, hbv: 58, hcv: 58, hiv: 58, htlv: 58, std: 58, malaria: 58
  };
  const variance = () => 0.9 + Math.random() * 0.2;
  const simulated = {};
  for (const [key, val] of Object.entries(baseData)) {
    simulated[key] = Math.round(val * factor * variance());
  }
  
  const keys = ['donors-total','donors-saudi','donors-nsaudi','first-time','more-than-one',
    'collected-same','collected-other','sent-other','total-units','packed-rbc','ffp','cryo','pc',
    'whole','disp-packed','disp-platelets','disp-ffp','disp-cryo','disp-prbc','disp-plt','disp-irr-prbc','disp-irr-plt','disp-others',
    'taint-whole','taint-packed','taint-platelets','taint-ffp','taint-cryo','taint-prbc','taint-plt',
    'cm-matched','cm-mismatched','bg','as','ai','hbv','hcv','hiv','htlv','cmv','std','malaria'];
  
  const dataKeys = ['donorsTotal','donorsSaudi','donorsNSaudi','firstTime','moreThanOne',
    'collectedSame','collectedOther','sentOther','totalUnits','packedRBC','ffp','cryo','pc',
    'whole','dispPacked','dispPlatelets','dispFFP','dispCryo','dispPRBC','dispPLT','dispIrrPRBC','dispIrrPLT','dispOthers',
    'taintWhole','taintPacked','taintPlatelets','taintFFP','taintCryo','taintPRBC','taintPLT',
    'cmMatched','cmMismatched','bg','as','ai','hbv','hcv','hiv','htlv','cmv','std','malaria'];
  
  keys.forEach((k, i) => {
    const el = document.getElementById('bb-' + k);
    if (el && simulated[dataKeys[i]] !== undefined) el.value = simulated[dataKeys[i]];
  });
  
  document.querySelector('input[name="bb-mode"][value="manual"]').checked = true;
  toggleBBMode();
  alert('✅ تم توليد المحاكاة');
}

function generateBloodBank() {
  const getVal = (id) => parseInt(document.getElementById('bb-' + id)?.value || 0);
  const data = {
    donorsTotal: getVal('donors-total'), donorsSaudi: getVal('donors-saudi'), donorsNSaudi: getVal('donors-nsaudi'),
    firstTime: getVal('first-time'), moreThanOne: getVal('more-than-one'),
    collectedSame: getVal('collected-same'), collectedOther: getVal('collected-other'),
    sentOther: getVal('sent-other'), totalUnits: getVal('total-units'),
    packedRBC: getVal('packed-rbc'), ffp: getVal('ffp'), cryo: getVal('cryo'), pc: getVal('pc'),
    whole: getVal('whole'), dispPacked: getVal('disp-packed'), dispPlatelets: getVal('disp-platelets'),
    dispFFP: getVal('disp-ffp'), dispCryo: getVal('disp-cryo'), dispPRBC: getVal('disp-prbc'),
    dispPLT: getVal('disp-plt'), dispIrrPRBC: getVal('disp-irr-prbc'), dispIrrPLT: getVal('disp-irr-plt'),
    dispOthers: getVal('disp-others'),
    taintWhole: getVal('taint-whole'), taintPacked: getVal('taint-packed'), taintPlatelets: getVal('taint-platelets'),
    taintFFP: getVal('taint-ffp'), taintCryo: getVal('taint-cryo'), taintPRBC: getVal('taint-prbc'),
    taintPLT: getVal('taint-plt'),
    cmMatched: getVal('cm-matched'), cmMismatched: getVal('cm-mismatched'),
    bg: getVal('bg'), as: getVal('as'), ai: getVal('ai'),
    hbv: getVal('hbv'), hcv: getVal('hcv'), hiv: getVal('hiv'),
    htlv: getVal('htlv'), cmv: getVal('cmv'), std: getVal('std'), malaria: getVal('malaria')
  };
  
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر") || STAFF[0];
  localStorage.setItem('bbData', JSON.stringify(data));
  
  document.getElementById('bb-result').innerHTML = `
    <div class="meeting-paper" id="bb-result-paper">
      <div class="meeting-header">
        <div class="meeting-header-text">
          <h3>المملكة العربية السعودية - وزارة الصحة</h3>
          <h4>الإدارة العامة للإحصاء والمعلومات</h4>
          <h4>نموذج رقم (GDSI-15-1): إحصائيات خدمات بنك الدم</h4>
        </div>
        <img src="logo.svg" class="meeting-logo" onerror="this.style.display='none'">
      </div>
      
      <h2 class="meeting-title">إحصائيات خدمات بنك الدم - ${getGregorianDate()}</h2>
      
      <h3 class="meeting-section-title">Blood Donors / المتبرعون بالدم</h3>
      <table class="meeting-info-table">
        <tr><td class="label">إجمالي عدد المتبرعين</td><td>${data.donorsTotal}</td></tr>
        <tr><td class="label">سعودي</td><td>${data.donorsSaudi}</td></tr>
        <tr><td class="label">غير سعودي</td><td>${data.donorsNSaudi}</td></tr>
        <tr><td class="label">تبرع لأول مرة</td><td>${data.firstTime}</td></tr>
        <tr><td class="label">تبرع أكثر من مرة</td><td>${data.moreThanOne}</td></tr>
      </table>
      
      <h3 class="meeting-section-title">Details of Tests / تفاصيل الفحوص والوحدات</h3>
      <table class="meeting-info-table">
        <tr><td class="label">وحدات مجمعة في نفس البنك</td><td>${data.collectedSame}</td></tr>
        <tr><td class="label">وحدات مجمعة من بنوك أخرى</td><td>${data.collectedOther}</td></tr>
        <tr><td class="label">وحدات مرسلة لبنوك أخرى</td><td>${data.sentOther}</td></tr>
        <tr><td class="label">إجمالي عدد الوحدات</td><td>${data.totalUnits}</td></tr>
      </table>
      
      <h3 class="meeting-section-title">Prepared Blood Derivatives / مشتقات الدم المحضرة</h3>
      <table class="meeting-info-table">
        <tr><td class="label">Packed RBC</td><td>${data.packedRBC}</td></tr>
        <tr><td class="label">FFP</td><td>${data.ffp}</td></tr>
        <tr><td class="label">Cryo.ppt</td><td>${data.cryo}</td></tr>
        <tr><td class="label">PC</td><td>${data.pc}</td></tr>
      </table>
      
      <h3 class="meeting-section-title">Dispensed, Tainted & Expired Units</h3>
      <table class="meeting-info-table" style="font-size:11px;">
        <thead><tr><th>النوع</th><th>مصروف</th><th>تالف/منتهي</th></tr></thead>
        <tbody>
          <tr><td>Whole Blood</td><td>${data.whole || '-'}</td><td>${data.taintWhole || '-'}</td></tr>
          <tr><td>Packed RBC</td><td>${data.dispPacked || '-'}</td><td>${data.taintPacked || '-'}</td></tr>
          <tr><td>Conc. Platelets</td><td>${data.dispPlatelets || '-'}</td><td>${data.taintPlatelets || '-'}</td></tr>
          <tr><td>FFP</td><td>${data.dispFFP || '-'}</td><td>${data.taintFFP || '-'}</td></tr>
          <tr><td>Cryoprecipitate</td><td>${data.dispCryo || '-'}</td><td>${data.taintCryo || '-'}</td></tr>
          <tr><td>PRBCs Leukocyte Filtered</td><td>${data.dispPRBC || '-'}</td><td>${data.taintPRBC || '-'}</td></tr>
          <tr><td>Platelets Conc. Leukocyte Filtered</td><td>${data.dispPLT || '-'}</td><td>${data.taintPLT || '-'}</td></tr>
          <tr><td>Irradiated PRBCs</td><td>${data.dispIrrPRBC || '-'}</td><td>-</td></tr>
          <tr><td>Irradiated Platelets</td><td>${data.dispIrrPLT || '-'}</td><td>-</td></tr>
          <tr><td>Others</td><td>${data.dispOthers || '-'}</td><td>-</td></tr>
        </tbody>
      </table>
      
      <h3 class="meeting-section-title">Blood Tests / فحوص الدم</h3>
      <table class="meeting-info-table" style="font-size:11px;">
        <tbody>
          <tr><td>Cross Matching (Matched)</td><td>${data.cmMatched}</td></tr>
          <tr><td>Cross Matching (Mismatched)</td><td>${data.cmMismatched}</td></tr>
          <tr><td>Blood Grouping & Rh Factor</td><td>${data.bg}</td></tr>
          <tr><td>Antibody Screening</td><td>${data.as}</td></tr>
          <tr><td>Antibody Identification</td><td>${data.ai}</td></tr>
          <tr><td>Hepatitis B</td><td>${data.hbv}</td></tr>
          <tr><td>Hepatitis C</td><td>${data.hcv}</td></tr>
          <tr><td>HIV</td><td>${data.hiv}</td></tr>
          <tr><td>HTLV</td><td>${data.htlv}</td></tr>
          <tr><td>CMV</td><td>${data.cmv}</td></tr>
          <tr><td>Other STD</td><td>${data.std}</td></tr>
          <tr><td>Malaria & Other Parasites</td><td>${data.malaria}</td></tr>
        </tbody>
      </table>
      
      <div class="head-signature">
        <p><strong>رئيس قسم المختبر:</strong></p>
        <p>${headOfDept.name}</p>
        <p style="margin-top:20px;">التوقيع: _______________________</p>
      </div>
    </div>
  `;
}

function saveBBExcel() {
  const data = JSON.parse(localStorage.getItem('bbData') || '{}');
  const rows = [
    ['إحصائيات خدمات بنك الدم - GDSI-15-1'], [],
    ['البند', 'القيمة'],
    ['إجمالي المتبرعين', data.donorsTotal || 0],
    ['سعودي', data.donorsSaudi || 0],
    ['غير سعودي', data.donorsNSaudi || 0],
    ['تبرع لأول مرة', data.firstTime || 0],
    ['تبرع أكثر من مرة', data.moreThanOne || 0],
    [],
    ['الوحدات'],
    ['مجمعة في نفس البنك', data.collectedSame || 0],
    ['من بنوك أخرى', data.collectedOther || 0],
    ['مرسلة لبنوك أخرى', data.sentOther || 0],
    ['إجمالي الوحدات', data.totalUnits || 0],
    [],
    ['مشتقات الدم'],
    ['Packed RBC', data.packedRBC || 0],
    ['FFP', data.ffp || 0],
    ['Cryo.ppt', data.cryo || 0],
    ['PC', data.pc || 0],
    [],
    ['الوحدات المصروفة'],
    ['Whole Blood', data.whole || 0],
    ['Packed RBC', data.dispPacked || 0],
    ['Conc. Platelets', data.dispPlatelets || 0],
    ['FFP', data.dispFFP || 0],
    ['Cryoprecipitate', data.dispCryo || 0],
    ['PRBCs Leukocyte Filtered', data.dispPRBC || 0],
    ['Platelets Conc. Leukocyte Filtered', data.dispPLT || 0],
    ['Irradiated PRBCs', data.dispIrrPRBC || 0],
    ['Irradiated Platelets', data.dispIrrPLT || 0],
    ['Others', data.dispOthers || 0],
    [],
    ['الوحدات التالفة'],
    ['Whole Blood', data.taintWhole || 0],
    ['Packed RBC', data.taintPacked || 0],
    ['Conc. Platelets', data.taintPlatelets || 0],
    ['FFP', data.taintFFP || 0],
    ['Cryoprecipitate', data.taintCryo || 0],
    ['PRBCs Leukocyte Filtered', data.taintPRBC || 0],
    ['Platelets Conc. Leukocyte Filtered', data.taintPLT || 0],
    [],
    ['فحوص الدم'],
    ['Cross Matching Matched', data.cmMatched || 0],
    ['Cross Matching Mismatched', data.cmMismatched || 0],
    ['Blood Grouping & Rh', data.bg || 0],
    ['Antibody Screening', data.as || 0],
    ['Antibody Identification', data.ai || 0],
    ['Hepatitis B', data.hbv || 0],
    ['Hepatitis C', data.hcv || 0],
    ['HIV', data.hiv || 0],
    ['HTLV', data.htlv || 0],
    ['CMV', data.cmv || 0],
    ['Other STD', data.std || 0],
    ['Malaria', data.malaria || 0]
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'بنك الدم');
  XLSX.writeFile(wb, `بنك_الدم_${getGregorianDate().replace(/\//g,'-')}.xlsx`);
}

// ===== إحصائية مخبرية =====
const Lab_DEPTS = [
  { ar: 'المناعة', en: 'Immunology', vida: 'Immunology' },
  { ar: 'عدد الفحوصات الفيروسية للمرضى', en: 'Patient Virology Tests', vida: 'Virology' },
  { ar: 'عدد الفحوصات الفيروسية بنك الدم', en: 'T.T.D. Tests', vida: null },
  { ar: 'الطفيليات', en: 'Parasitology', vida: 'Parasitology' },
  { ar: 'تحليل البول', en: 'Urine Analysis', vida: 'Urine' },
  { ar: 'البكتيريا', en: 'Bacteriology', vida: 'Microbiology' },
  { ar: 'الهرمونات', en: 'Hormones', vida: 'Hormones' },
  { ar: 'الكيمياء الحيوية', en: 'Biochemistry', vida: 'Biochemistry' },
  { ar: 'السموم الإكلينيكية', en: 'Clinical Toxicology', vida: null },
  { ar: 'التفاعلات المصلية', en: 'Serology', vida: 'Serology' },
  { ar: 'الوراثة', en: 'Genetics', vida: null },
  { ar: 'تشريح الخلايا والأنسجة المريضة', en: 'Cyto&histopathology', vida: 'Histopathology' },
  { ar: 'أمراض الدم', en: 'Hematology', vida: 'Hematology' },
  { ar: 'الجزيئات الحيوية', en: 'Molecular Biology', vida: null },
  { ar: 'الدرن', en: 'T.B', vida: null },
  { ar: 'إحصائيات فحوصات خدمات نقل الدم', en: 'Blood Bank Service Tests', vida: 'Blood Banking' },
  { ar: 'أخرى', en: 'Others', vida: null }
];

function renderLabDepts() {
  const tbody = document.getElementById('labDeptsBody');
  if (!tbody) return;
  tbody.innerHTML = Lab_DEPTS.map((d, i) => `
    <tr>
      <td>${i + 1}. ${d.ar}</td>
      <td><input type="number" id="lab-er-${i}" value="0" onchange="updateLabTotal()"></td>
      <td><input type="number" id="lab-opd-${i}" value="0" onchange="updateLabTotal()"></td>
      <td><input type="number" id="lab-ip-${i}" value="0" onchange="updateLabTotal()"></td>
      <td><strong id="lab-tot-${i}">0</strong></td>
    </tr>
  `).join('') + `
    <tr style="background:#f0f4f8;font-weight:bold;">
      <td>الإجمالي</td>
      <td><span id="lab-er-total">0</span></td>
      <td><span id="lab-opd-total">0</span></td>
      <td><span id="lab-ip-total">0</span></td>
      <td><span id="lab-grand-total">0</span></td>
    </tr>
  `;
}

function updateLabTotal() {
  let erT = 0, opdT = 0, ipT = 0;
  Lab_DEPTS.forEach((d, i) => {
    const er = parseInt(document.getElementById(`lab-er-${i}`)?.value || 0);
    const opd = parseInt(document.getElementById(`lab-opd-${i}`)?.value || 0);
    const ip = parseInt(document.getElementById(`lab-ip-${i}`)?.value || 0);
    const tot = er + opd + ip;
    erT += er; opdT += opd; ipT += ip;
    const totEl = document.getElementById(`lab-tot-${i}`);
    if (totEl) totEl.textContent = tot.toLocaleString();
  });
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v.toLocaleString(); };
  set('lab-er-total', erT); set('lab-opd-total', opdT); set('lab-ip-total', ipT);
  set('lab-grand-total', erT + opdT + ipT);
}

function autoFillLabFromVida() {
  const vida = window.vidaParsedData?.data || {};
  Lab_DEPTS.forEach((d, i) => {
    if (!d.vida || !vida[d.vida]) return;
    const v = vida[d.vida];
    const er = v.erSaudiM + v.erSaudiF + v.erNsaudiM + v.erNsaudiF;
    const opd = v.opdSaudiM + v.opdSaudiF + v.opdNsaudiM + v.opdNsaudiF;
    const ip = v.ipSaudiM + v.ipSaudiF + v.ipNsaudiM + v.ipNsaudiF;
    const erEl = document.getElementById(`lab-er-${i}`);
    const opdEl = document.getElementById(`lab-opd-${i}`);
    const ipEl = document.getElementById(`lab-ip-${i}`);
    if (erEl) erEl.value = er;
    if (opdEl) opdEl.value = opd;
    if (ipEl) ipEl.value = ip;
  });
  updateLabTotal();
}

function generateLabModel() {
  const monthIndex = parseInt(document.getElementById('labMonth').value);
  const year = document.getElementById('labYear').value;
  const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const monthName = monthNames[monthIndex - 1];
  
  const rows = Lab_DEPTS.map((d, i) => {
    const er = parseInt(document.getElementById(`lab-er-${i}`)?.value || 0);
    const opd = parseInt(document.getElementById(`lab-opd-${i}`)?.value || 0);
    const ip = parseInt(document.getElementById(`lab-ip-${i}`)?.value || 0);
    return { ...d, er, opd, ip, tot: er + opd + ip };
  });
  
  const totals = {
    er: rows.reduce((s, r) => s + r.er, 0),
    opd: rows.reduce((s, r) => s + r.opd, 0),
    ip: rows.reduce((s, r) => s + r.ip, 0),
    grand: rows.reduce((s, r) => s + r.tot, 0)
  };
  
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر") || STAFF[0];
  window.labData = { rows, totals, monthName, year };
  
  document.getElementById('lab-result').innerHTML = `
    <div class="meeting-paper" id="lab-result-paper">
      <div class="meeting-header">
        <div class="meeting-header-text">
          <h3>المملكة العربية السعودية - وزارة الصحة</h3>
          <h4>مستشفى سبت العلاية العام - قسم المختبر</h4>
        </div>
        <img src="logo.svg" class="meeting-logo" onerror="this.style.display='none'">
      </div>
      
      <h2 class="meeting-title">إحصائية الفحوص المخبرية لشهر ${monthName} لعام ${year} م</h2>
      
      <table class="meeting-info-table" style="font-size:11px;">
        <thead>
          <tr><th>#</th><th>القسم</th><th>Department</th><th>ER</th><th>OPD</th><th>IP</th><th>Total</th></tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => `
            <tr><td>${i+1}</td><td>${r.ar}</td><td>${r.en}</td><td>${r.er}</td><td>${r.opd}</td><td>${r.ip}</td><td><strong>${r.tot}</strong></td></tr>
          `).join('')}
          <tr style="background:#f0f4f8;font-weight:bold;">
            <td colspan="3">الإجمالي</td>
            <td>${totals.er}</td><td>${totals.opd}</td><td>${totals.ip}</td><td>${totals.grand}</td>
          </tr>
        </tbody>
      </table>
      
      <h3 class="meeting-section-title">الفحوصات الفيروسية النوعية المحددة</h3>
      <table class="meeting-info-table" style="font-size:11px;">
        <thead><tr><th>الفحص</th><th>إيجابي</th><th>سلبي</th><th>الإجمالي</th></tr></thead>
        <tbody>
          <tr><td>MERS (كورونا الجديد)</td><td>0</td><td>0</td><td>0</td></tr>
          <tr><td>H1N1 (أنفلونزا الخنازير)</td><td>0</td><td>0</td><td>0</td></tr>
          <tr><td>أخرى (a)</td><td>0</td><td>0</td><td>0</td></tr>
          <tr><td>أخرى (b)</td><td>0</td><td>0</td><td>0</td></tr>
        </tbody>
      </table>
      
      <div class="head-signature">
        <p><strong>رئيس قسم المختبر:</strong></p>
        <p>${headOfDept.name}</p>
        <p style="margin-top:20px;">التوقيع: _______________________</p>
      </div>
    </div>
  `;
}

function saveLabExcel() {
  if (!window.labData) { alert('⚠️ قم بتوليد النموذج أولاً'); return; }
  const { rows, totals, monthName, year } = window.labData;
  const data = [
    [`إحصائية الفحوص المخبرية لشهر ${monthName} ${year}`], [],
    ['القسم', 'Department', 'ER', 'OPD', 'IP', 'Total'],
    ...rows.map(r => [r.ar, r.en, r.er, r.opd, r.ip, r.tot]),
    ['الإجمالي', 'Total', totals.er, totals.opd, totals.ip, totals.grand]
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'الإحصائية الشهرية');
  XLSX.writeFile(wb, `إحصائية_الفحوص_المخبرية_${monthName}_${year}.xlsx`);
}
