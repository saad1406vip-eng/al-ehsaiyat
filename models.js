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
      <div style="margin-top:10px;padding:15px;background:#e6f7e6;border-radius:8px;">
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
  
  const monthIndex = parseInt(document.getElementById('aseerMonth').value);
  const year = document.getElementById('aseerYear').value;
  const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const monthName = monthNames[monthIndex - 1];
  
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر") || STAFF[0];
  
  // معاينة
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
  
  // إضافة الشهر الجديد لملف عسير
  if (window.aseerWorkbook) {
    addNewMonthToAseer(window.aseerWorkbook, monthIndex, {
      vidaTotal,
      manual,
      grandTotal
    });
  }
  
  // عرض النموذج الكامل
  let allMonthsHTML = '';
  const monthsData = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  
  allMonthsHTML = `
    <table class="meeting-info-table" style="font-size:12px;">
      <thead>
        <tr>
          <th>البند</th>
          ${monthsData.map(m => `<th>${m}</th>`).join('')}
          <th>المجموع</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>عدد المستفيدين</strong></td>
          ${monthsData.map((m, i) => `<td>${i === monthIndex - 1 ? grandTotal.toLocaleString() : '-'}</td>`).join('')}
          <td><strong>${grandTotal.toLocaleString()}</strong></td>
        </tr>
      </tbody>
    </table>
  `;
  
  document.getElementById('aseer-result').innerHTML = `
    <div class="meeting-paper" id="aseer-result-paper">
      <div class="meeting-header">
        <div class="meeting-header-text">
          <h3>المملكة العربية السعودية</h3>
          <h4>وزارة الصحة - تجمع عسير الصحي</h4>
          <h4>مستشفى سبت العلاية العام</h4>
        </div>
        <img src="logo.svg" class="meeting-logo" onerror="this.style.display='none'">
      </div>
      
      <h2 class="meeting-title">إحصائية خدمات المختبر - ${monthName} ${year}</h2>
      
      <h3 class="meeting-section-title">عدد المستفيدين من خدمات المختبرات</h3>
      <table class="meeting-info-table">
        <tr><td class="label">إجمالي المستفيدين</td><td>${grandTotal.toLocaleString()}</td></tr>
        <tr><td class="label">سعودي (تقديري ${getRatio('saudiRatio')}%)</td><td>${Math.round(grandTotal * getRatio('saudiRatio') / 100).toLocaleString()}</td></tr>
        <tr><td class="label">غير سعودي</td><td>${Math.round(grandTotal * (100 - getRatio('saudiRatio')) / 100).toLocaleString()}</td></tr>
        <tr><td class="label">ذكر</td><td>${Math.round(grandTotal * (100 - getRatio('femaleRatio')) / 100).toLocaleString()}</td></tr>
        <tr><td class="label">أنثى</td><td>${Math.round(grandTotal * getRatio('femaleRatio') / 100).toLocaleString()}</td></tr>
      </table>
      
      <h3 class="meeting-section-title">تفاصيل العيادات اليدوية</h3>
      <table class="meeting-info-table">
        <tr><td class="label">عيادة الصحة العامة</td><td>${manual.phTotal.toLocaleString()}</td></tr>
        <tr><td class="label">عيادة فحص الزواج</td><td>${manual.marriageTotal.toLocaleString()}</td></tr>
      </table>
      
      <h3 class="meeting-section-title">تفاصيل الأقسام (من فيدا)</h3>
      <table class="meeting-info-table" style="font-size:11px;">
        <thead>
          <tr>
            <th>القسم</th>
            <th>ER</th>
            <th>OPD</th>
            <th>IPD</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${window.vidaParsedData ? Object.keys(window.vidaParsedData.data).map(dept => {
            const d = window.vidaParsedData.data[dept];
            const er = d.erSaudiM + d.erSaudiF + d.erNsaudiM + d.erNsaudiF;
            const opd = d.opdSaudiM + d.opdSaudiF + d.opdNsaudiM + d.opdNsaudiF;
            const ip = d.ipSaudiM + d.ipSaudiF + d.ipNsaudiM + d.ipNsaudiF;
            return `<tr><td>${dept}</td><td>${er}</td><td>${opd}</td><td>${ip}</td><td><strong>${d.total}</strong></td></tr>`;
          }).join('') : ''}
          <tr style="background:#f0f4f8;font-weight:bold;">
            <td>الإجمالي</td>
            <td>${window.vidaParsedData?.totals?.ER || 0}</td>
            <td>${window.vidaParsedData?.totals?.OPD || 0}</td>
            <td>${window.vidaParsedData?.totals?.IP || 0}</td>
            <td>${vidaTotal}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="head-signature">
        <p><strong>رئيس قسم المختبر:</strong></p>
        <p>${headOfDept.name}</p>
        <p style="margin-top:20px;">التوقيع: _______________________</p>
        <p>التاريخ: ${getGregorianDate()}</p>
      </div>
    </div>
  `;
}

// ===== دالة مساعدة =====
function getRatio(key) {
  const s = JSON.parse(localStorage.getItem('ehsaiyatSettings') || '{}');
  return s[key] || 70;
}

// ===== إضافة الشهر لملف عسير =====
function addNewMonthToAseer(workbook, monthIndex, data) {
  const sheet = workbook.Sheets['التجمع الصحي'];
  if (!sheet) return;
  
  const col = String.fromCharCode(66 + monthIndex);
  
  sheet[col + '6'] = { v: data.grandTotal, t: 'n' };
  sheet[col + '8'] = { v: Math.round(data.grandTotal * 0.7), t: 'n' };
  sheet[col + '9'] = { v: Math.round(data.grandTotal * 0.3), t: 'n' };
  sheet[col + '11'] = { v: Math.round(data.grandTotal * 0.4), t: 'n' };
  sheet[col + '12'] = { v: Math.round(data.grandTotal * 0.6), t: 'n' };
  
  const deptData = window.vidaParsedData?.data || {};
  const deptRows = {
    'Immunology': 15, 'Virology': 16, 'Virology in Blood Bank': 17,
    'Parasitology': 18, 'Urine': 19, 'Bacteriology': 20,
    'Hormones': 21, 'Biochemistry': 22, 'Toxicology': 23,
    'Serology': 24, 'Genetics': 25, 'Histopathology': 26,
    'Hematology': 27, 'Molecular Biology': 28, 'T.B': 29,
    'Cytology': 30, 'Flowcytometry': 31, 'Cytogenatics': 32, 'Others': 33
  };
  
  for (const [dept, row] of Object.entries(deptRows)) {
    let value = deptData[dept]?.total || 0;
    sheet[col + row] = { v: value, t: 'n' };
  }
  
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
  XLSX.writeFile(window.aseerWorkbook, `إحصائيات_خدمات_المختبر_عسير_${monthNames[monthIndex-1]}.xlsx`);
}

// ===== توليد نموذج بنك الدم =====
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
    taintWhole: document.getElementById('bb-taint-whole')?.value || 0,
    taintPacked: document.getElementById('bb-taint-packed')?.value || 0,
    taintPlatelets: document.getElementById('bb-taint-platelets')?.value || 0,
    taintFFP: document.getElementById('bb-taint-ffp')?.value || 0,
    taintCryo: document.getElementById('bb-taint-cryo')?.value || 0,
    taintPRBC: document.getElementById('bb-taint-prbc')?.value || 0,
    taintPLT: document.getElementById('bb-taint-plt')?.value || 0,
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

  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر") || STAFF[0];
  const gregorian = getGregorianDate();
  
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
      
      <h2 class="meeting-title">إحصائيات خدمات بنك الدم - ${gregorian}</h2>
      
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
      
      <h3 class="meeting-section-title">Dispensed, Tainted & Expired Units / الوحدات المصروفة والتالفة</h3>
      <table class="meeting-info-table" style="font-size:11px;">
        <thead>
          <tr><th>النوع</th><th>مصروف</th><th>تالف/منتهي</th></tr>
        </thead>
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
        <p>التاريخ: ${gregorian}</p>
      </div>
    </div>
  `;
  
  localStorage.setItem('bbData', JSON.stringify(data));
}

// ===== تبديل وضع بنك الدم =====
function toggleBBMode() {
  const mode = document.querySelector('input[name="bb-mode"]:checked').value;
  document.getElementById('bb-manual').style.display = mode === 'manual' ? 'block' : 'none';
  document.getElementById('bb-auto').style.display = mode === 'auto' ? 'block' : 'none';
}

// ===== محاكاة بنك الدم =====
function simulateBBData() {
  const lastData = JSON.parse(localStorage.getItem('bbData') || 'null');
  const factor = getSeasonalFactor(new Date().getMonth() + 1);
  
  let baseData = lastData || {
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
  
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر") || STAFF[0];
  
  document.getElementById('bb-simulation').innerHTML = `
    <div style="margin-top:15px;padding:15px;background:#e6f7e6;border-radius:8px;">
      <p>✅ تم توليد محاكاة بنك الدم</p>
      <p><strong>معامل الموسمية:</strong> ${Math.round(factor * 100)}%</p>
      <p><strong>إجمالي المتبرعين:</strong> ${simulated.donorsTotal}</p>
    </div>
    <div class="meeting-paper" id="bb-sim-paper">
      <h3>محاكاة بنك الدم - ${getGregorianDate()}</h3>
      <table class="meeting-info-table">
        <tr><td class="label">إجمالي المتبرعين</td><td>${simulated.donorsTotal}</td></tr>
        <tr><td class="label">سعودي</td><td>${simulated.donorsSaudi}</td></tr>
        <tr><td class="label">غير سعودي</td><td>${simulated.donorsNSaudi}</td></tr>
        <tr><td class="label">تبرع لأول مرة</td><td>${simulated.firstTime}</td></tr>
        <tr><td class="label">تبرع أكثر من مرة</td><td>${simulated.moreThanOne}</td></tr>
      </table>
      <div class="head-signature">
        <p><strong>رئيس قسم المختبر:</strong></p>
        <p>${headOfDept.name}</p>
        <p style="margin-top:20px;">التوقيع: _______________________</p>
      </div>
    </div>
  `;
  
  // ملء الحقول
  for (const [key, val] of Object.entries(simulated)) {
    const el = document.getElementById('bb-' + key);
    if (el) el.value = val;
  }
  
  // التبديل إلى اليدوي
  document.querySelector('input[name="bb-mode"][value="manual"]').checked = true;
  toggleBBMode();
}

// ===== حفظ بنك الدم Excel =====
function saveBBExcel() {
  const data = JSON.parse(localStorage.getItem('bbData') || '{}');
  
  const rows = [
    ['إحصائيات خدمات بنك الدم - GDSI-15-1'],
    [],
    ['البند', 'القيمة'],
    ['إجمالي المتبرعين', data.donorsTotal || 0],
    ['سعودي', data.donorsSaudi || 0],
    ['غير سعودي', data.donorsNSaudi || 0],
    ['تبرع لأول مرة', data.firstTime || 0],
    ['تبرع أكثر من مرة', data.moreThanOne || 0],
    [],
    ['الوحدات', 'القيمة'],
    ['وحدات مجمعة في نفس البنك', data.collectedSame || 0],
    ['وحدات مجمعة من بنوك أخرى', data.collectedOther || 0],
    ['وحدات مرسلة لبنوك أخرى', data.sentOther || 0],
    [],
    ['مشتقات الدم', 'القيمة'],
    ['Packed RBC', data.packedRBC || 0],
    ['FFP', data.ffp || 0],
    ['Cryo.ppt', data.cryo || 0],
    ['PC', data.pc || 0],
    [],
    ['الوحدات المصروفة', 'القيمة'],
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
    ['الوحدات التالفة', 'القيمة'],
    ['Whole Blood', data.taintWhole || 0],
    ['Packed RBC', data.taintPacked || 0],
    ['Conc. Platelets', data.taintPlatelets || 0],
    ['FFP', data.taintFFP || 0],
    ['Cryoprecipitate', data.taintCryo || 0],
    ['PRBCs Leukocyte Filtered', data.taintPRBC || 0],
    ['Platelets Conc. Leukocyte Filtered', data.taintPLT || 0],
    [],
    ['فحوص الدم', 'القيمة'],
    ['Cross Matching Matched', data.cmMatched || 0],
    ['Cross Matching Mismatched', data.cmMismatched || 0],
    ['Blood Grouping & Rh Factor', data.bg || 0],
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

// ===== توليد إحصائية مخبرية =====
async function readLabFile(file) {
  try {
    const data = new Uint8Array(await file.arrayBuffer());
    const workbook = XLSX.read(data, { type: 'array' });
    window.labWorkbook = workbook;
    
    document.getElementById('labFileResult').innerHTML = `
      <div style="margin-top:10px;padding:15px;background:#e6f7e6;border-radius:8px;">
        <p style="color:green;">✅ تم قراءة ملف الإحصائية</p>
        <p><strong>عدد الأوراق:</strong> ${workbook.SheetNames.length}</p>
      </div>
    `;
  } catch(err) {
    document.getElementById('labFileResult').innerHTML = `
      <p style="color:red;">❌ خطأ: ${err.message}</p>
    `;
  }
}

function generateLabModel() {
  const monthIndex = parseInt(document.getElementById('labMonth').value);
  const year = document.getElementById('labYear').value;
  const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const monthName = monthNames[monthIndex - 1];
  
  const vida = window.vidaParsedData?.data || {};
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر") || STAFF[0];
  
  const depts = [
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
  
  let totalER = 0, totalOPD = 0, totalIP = 0, totalAll = 0;
  
  const rows = depts.map((d, i) => {
    const v = d.vida ? vida[d.vida] : null;
    const er = v ? (v.erSaudiM + v.erSaudiF + v.erNsaudiM + v.erNsaudiF) : 0;
    const opd = v ? (v.opdSaudiM + v.opdSaudiF + v.opdNsaudiM + v.opdNsaudiF) : 0;
    const ip = v ? (v.ipSaudiM + v.ipSaudiF + v.ipNsaudiM + v.ipNsaudiF) : 0;
    const total = er + opd + ip;
    
    totalER += er; totalOPD += opd; totalIP += ip; totalAll += total;
    
    return `<tr><td>${i+1}</td><td>${d.ar}</td><td>${d.en}</td><td>${er}</td><td>${opd}</td><td>${ip}</td><td><strong>${total}</strong></td></tr>`;
  }).join('');
  
  document.getElementById('labPreviewResult').innerHTML = `
    <table class="input-table">
      <tr><td>إجمالي ER</td><td>${totalER.toLocaleString()}</td></tr>
      <tr><td>إجمالي OPD</td><td>${totalOPD.toLocaleString()}</td></tr>
      <tr><td>إجمالي IP</td><td>${totalIP.toLocaleString()}</td></tr>
      <tr style="background:#f0f4f8;font-weight:bold;"><td>الإجمالي</td><td>${totalAll.toLocaleString()}</td></tr>
    </table>
  `;
  
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
          <tr>
            <th>#</th>
            <th>القسم</th>
            <th>Department</th>
            <th>الطوارئ ER</th>
            <th>العيادات OPD</th>
            <th>التنويم IP</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr style="background:#f0f4f8;font-weight:bold;">
            <td colspan="3">الإجمالي</td>
            <td>${totalER}</td>
            <td>${totalOPD}</td>
            <td>${totalIP}</td>
            <td>${totalAll}</td>
          </tr>
        </tbody>
      </table>
      
      <h3 class="meeting-section-title">الفحوصات الفيروسية النوعية المحددة</h3>
      <table class="meeting-info-table" style="font-size:11px;">
        <thead>
          <tr><th>الفحص</th><th>إيجابي</th><th>سلبي</th><th>الإجمالي</th></tr>
        </thead>
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
  
  window.labData = { totalER, totalOPD, totalIP, totalAll, depts, monthName, year };
}

function saveLabExcel() {
  if (!window.labData) {
    alert('⚠️ قم بتوليد النموذج أولاً');
    return;
  }
  
  const rows = [
    [`إحصائية الفحوص المخبرية لشهر ${window.labData.monthName} لعام ${window.labData.year} م`],
    [],
    ['القسم', 'Department', 'ER', 'OPD', 'IP', 'Total'],
    ...window.labData.depts.map(d => {
      const v = d.vida ? window.vidaParsedData.data[d.vida] : null;
      const er = v ? (v.erSaudiM + v.erSaudiF + v.erNsaudiM + v.erNsaudiF) : 0;
      const opd = v ? (v.opdSaudiM + v.opdSaudiF + v.opdNsaudiM + v.opdNsaudiF) : 0;
      const ip = v ? (v.ipSaudiM + v.ipSaudiF + v.ipNsaudiM + v.ipNsaudiF) : 0;
      return [d.ar, d.en, er, opd, ip, er + opd + ip];
    }),
    ['الإجمالي', 'Total', window.labData.totalER, window.labData.totalOPD, window.labData.totalIP, window.labData.totalAll]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'الإحصائية الشهرية');
  XLSX.writeFile(wb, `إحصائية_الفحوص_المخبرية_${window.labData.monthName}_${window.labData.year}.xlsx`);
}

// ===== توليد المحضر =====
const MEETING_TOPICS = [
  "مناقشة آلية العمل خلال الشهر", "مناقشة الصعوبات التي تواجه الموظفين",
  "مناقشة الإحصائية الشهرية للمحاليل والمستلزمات", "مناقشة التحديات في التموين",
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

function generateMeeting() {
  const topicCount = 4;
  const selectedTopics = [...MEETING_TOPICS].sort(() => 0.5 - Math.random()).slice(0, topicCount);
  
  const empCount = 8;
  const regularStaff = STAFF.filter(s => s.role !== "رئيس قسم المختبر");
  const selectedEmp = [...regularStaff].sort(() => 0.5 - Math.random()).slice(0, empCount);
  
  const headOfDept = STAFF.find(s => s.role === "رئيس قسم المختبر") || STAFF[0];
  const gregorian = getGregorianDate();
  const hijri = getHijriDate();
  
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

// ===== دوال التاريخ =====
function getHijriDate() {
  try {
    return new Date().toLocaleDateString('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch(e) { return ''; }
}

function getGregorianDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${today.getFullYear()}`;
}
