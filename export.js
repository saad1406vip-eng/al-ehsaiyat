// ===== طباعة احترافية عبر iframe مع الخلفية الجديدة =====
function printModel(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('⚠️ قم بتوليد النموذج أولاً');
    return;
  }

  // جمع كل عناصر الطباعة
  let allPapersHTML = '';
  const parentSection = element.closest('.tab-content') || element.closest('section');
  
  if (parentSection) {
    const allPapers = parentSection.querySelectorAll('.meeting-paper');
    if (allPapers.length > 0) {
      allPapers.forEach(paper => { allPapersHTML += paper.outerHTML; });
    } else {
      allPapersHTML = element.outerHTML;
    }
  } else {
    allPapersHTML = element.outerHTML;
  }

  // إنشاء حاوية وهمية لفصل الـ HTML وحذف الترويسة القديمة بأمان
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = allPapersHTML;

  // حذف الترويسة القديمة (الشعار والخطوط الزرقاء) من داخل الحاوية
  const oldHeaders = tempDiv.querySelectorAll('.meeting-header');
  oldHeaders.forEach(h => h.remove());

  // استخراج الكود النظيف
  const cleanPrintContent = tempDiv.innerHTML;

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
        
        html, body { 
          background: white; 
          color: #1a2b4a; 
          direction: rtl;
          width: 100%;
          height: auto;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .meeting-paper {
          /* استخدام الخلفية الجديدة */
          background-image: url('BG.PNG');
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center center;
          
          /* إعدادات الصفحة A4 أفقي */
          width: 297mm;
          height: 210mm;
          margin: 0 auto;
          padding: 35mm 15mm 35mm 15mm; /* ترك مساحة للشعار أعلى وأسفل */
          
          font-size: 12px;
          page-break-after: always;
          page-break-inside: avoid;
          display: block;
          box-sizing: border-box;
          position: relative;
        }
        .meeting-paper:last-child { page-break-after: auto; }
        
        .meeting-title {
          text-align: center;
          color: #1a3a6b;
          font-size: 16px;
          margin: 0 0 15px 0;
          padding: 6px;
          background: #f0f4f8;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
        }
        
        .meeting-info-table, .meeting-recommendations, .meeting-signatures {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          border: 2px solid #1a3a6b;
        }
        .meeting-info-table td, .meeting-recommendations td, .meeting-signatures td,
        .meeting-recommendations th, .meeting-signatures th {
          padding: 6px 8px;
          border: 1px solid #1a3a6b;
          font-size: 11px;
        }
        .meeting-info-table .label, .meeting-recommendations th, .meeting-signatures th {
          background: #1a3a6b;
          color: white;
          font-weight: bold;
        }
        
        .meeting-section-title {
          color: #1a3a6b;
          font-size: 14px;
          margin: 12px 0 8px;
          padding-right: 8px;
          border-right: 4px solid #1a3a6b;
        }
        .meeting-agenda { padding-right: 20px; margin-bottom: 15px; }
        .meeting-agenda li { padding: 4px 0; font-size: 11px; }
        
        .head-signature {
          margin-top: 15px;
          padding: 12px;
          border: 2px solid #1a3a6b;
          border-radius: 8px;
          text-align: center;
          background: rgba(248, 250, 252, 0.8);
          page-break-inside: avoid;
        }
        .head-signature p { margin: 4px 0; font-size: 12px; color: #1a3a6b; font-weight: bold; }
        
        /* ===== إعدادات الطباعة ===== */
        @media print {
          html, body { 
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
          
          @page { 
            size: A4 landscape; 
            margin: 0; /* إزالة هوامش المتصفح لتغطية الصورة كاملة */
          }
        }
      </style>
    </head>
    <body>
      ${cleanPrintContent}
    </body>
    </html>
  `);
  iframeDoc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch(e) {
      console.error('خطأ في الطباعة:', e);
      alert('⚠️ حدث خطأ في الطباعة');
    }
    
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2000);
  }, 1000);
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
