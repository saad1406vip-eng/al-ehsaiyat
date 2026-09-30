// ===== طباعة =====
function printModel(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('⚠️ قم بتوليد النموذج أولاً');
    return;
  }
  
  // إخفاء كل شيء ما عدا العنصر المطلوب
  const originalDisplay = document.body.style.display;
  
  // فتح نافذة طباعة
  window.print();
}

// ===== التشغيل =====
document.addEventListener('DOMContentLoaded', () => {
  // لا شيء
});
