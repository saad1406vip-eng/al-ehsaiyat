// ===== تصدير Excel =====
function exportToExcel(modelId) {
  const resultDiv = document.getElementById(modelId + '-result');
  if (!resultDiv || !resultDiv.innerHTML) {
    alert('⚠️ قم بتوليد النموذج أولاً');
    return;
  }

  const table = document.createElement('table');
  const rows = resultDiv.querySelectorAll('tr');
  
  rows.forEach(row => {
    const newRow = table.insertRow();
    row.querySelectorAll('td, th').forEach(cell => {
      const newCell = newRow.insertCell();
      newCell.textContent = cell.textContent.trim();
    });
  });

  const wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(wb, `احصائية_${modelId}_${getGregorianDate().replace(/\//g, '-')}.xlsx`);
}

// ===== تصدير PDF =====
async function exportToPDF(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('⚠️ قم بتوليد النموذج أولاً');
    return;
  }

  try {
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`احصائية_${elementId}_${getGregorianDate().replace(/\//g, '-')}.pdf`);
  } catch(err) {
    alert('❌ خطأ في التصدير: ' + err.message);
  }
}

// ===== طباعة =====
function printModel(modelId) {
  const element = document.getElementById(modelId + '-result');
  if (!element || !element.innerHTML) {
    alert('⚠️ قم بتوليد النموذج أولاً');
    return;
  }
  window.print();
}
