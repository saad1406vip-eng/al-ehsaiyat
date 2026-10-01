// ===== طباعة =====
function printModel(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('⚠️ قم بتوليد النموذج أولاً');
    return;
  }

  // إضافة كلاس الطباعة للجسم
  document.body.classList.add('printing');
  document.body.setAttribute('data-print-target', elementId);

  // تحديث قاعدة CSS للطباعة
  const style = document.getElementById('print-style') || document.createElement('style');
  style.id = 'print-style';
  style.innerHTML = `
    @media print {
      body * { visibility: hidden; }
      #${elementId}, #${elementId} * { visibility: visible; }
      #${elementId} {
        position: absolute;
        top: 0; right: 0; left: 0;
        width: 100%;
        padding: 10mm;
        border: none;
        font-size: 11px;
      }
      @page { size: A4 landscape; margin: 8mm; }
    }
  `;
  if (!document.getElementById('print-style')) document.head.appendChild(style);

  setTimeout(() => {
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing');
      document.body.removeAttribute('data-print-target');
    }, 1000);
  }, 100);
}

// ===== تصدير Excel عام =====
function exportToExcelTable(data, filename, sheetName) {
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet1');
  XLSX.writeFile(wb, filename);
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
