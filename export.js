// ===== طباعة احترافية عبر iframe =====
function printModel(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('⚠️ قم بتوليد النموذج أولاً');
    return;
  }

  // جمع كل عناصر الطباعة
  let printContent = '';
  const parentSection = element.closest('.tab-content') || element.closest('section');
  
  if (parentSection) {
    const allPapers = parentSection.querySelectorAll('.meeting-paper');
    if (allPapers.length > 1) {
      allPapers.forEach(paper => { printContent += paper.outerHTML; });
    } else {
      printContent = element.outerHTML;
    }
  } else {
    printContent = element.outerHTML;
  }

  // إنشاء iframe مؤقت للطباعة
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>طباعة</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, sans-serif; }
        body { background: white; color: #1a2b4a; direction: rtl; }
        
        .meeting-paper {
          background: white;
          padding: 10mm;
          margin: 0;
          border: none;
          font-size: 11px;
          page-break-after: always;
          page-break-inside: avoid;
          display: block;
          width: 100%;
        }
        .meeting-paper:last-child { page-break-after: auto; }
        
        .meeting-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #1a3a6b;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        .meeting-header-text h3 { color: #1a3a6b; font-size: 16px; margin-bottom: 4px; }
        .meeting-header-text h4 { color: #333; font-size: 12px; font-weight: normal; }
        .meeting-logo { width: 110px; height: auto; }
        
        .meeting-title {
          text-align: center;
          color: #1a3a6b;
          font-size: 14px;
          margin: 12px 0;
          padding: 6px;
          background: #f0f4f8;
          border-radius: 6px;
        }
        
        .meeting-info-table, .meeting-recommendations, .meeting-signatures {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
          border: 2px solid #1a3a6b;
        }
        .meeting-info-table td, .meeting-recommendations td, .meeting-signatures td,
        .meeting-recommendations th, .meeting-signatures th {
          padding: 5px 8px;
          border: 1px solid #1a3a6b;
          font-size: 10px;
        }
        .meeting-info-table .label, .meeting-recommendations th, .meeting-signatures th {
          background: #1a3a6b;
          color: white;
          font-weight: bold;
        }
        
        .meeting-section-title {
          color: #1a3a6b;
          font-size: 13px;
          margin: 10px 0 6px;
          padding-right: 8px;
          border-right: 4px solid #1a3a6b;
        }
        .meeting-agenda { padding-right: 20px; margin-bottom: 12px; }
        .meeting-agenda li { padding: 4px 0; font-size: 11px; }
        
        .head-signature {
          margin-top: 15px;
          padding: 12px;
          border: 2px solid #1a3a6b;
          border-radius: 8px;
          text-align: center;
          background: #f8fafc;
          page-break-inside: avoid;
        }
        .head-signature p { margin: 4px 0; font-size: 12px; color: #1a3a6b; }
        
        @page { size: A4 landscape; margin: 8mm; }
      </style>
    </head>
    <body>
      ${printContent}
    </body>
    </html>
  `);
  iframeDoc.close();

  // انتظر ثم اطبع
  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch(e) {
      console.error('خطأ في الطباعة:', e);
      alert('⚠️ حدث خطأ في الطباعة');
    }
    
    // إزالة iframe
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2000);
  }, 700);
}

// ===== تصدير Excel =====
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
