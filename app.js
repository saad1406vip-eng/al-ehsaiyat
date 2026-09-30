// ===== التبويبات =====
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// ===== مستمعو الملفات =====
document.addEventListener('DOMContentLoaded', () => {
  // عسير
  document.getElementById('aseerFile')?.addEventListener('change', (e) => {
    if (e.target.files[0]) readAseerFile(e.target.files[0]);
  });
  document.getElementById('vidaFileAseer')?.addEventListener('change', (e) => {
    if (e.target.files[0]) readVidaFile(e.target.files[0], 'vidaFileAseerResult');
  });
  document.getElementById('vidaFileLab')?.addEventListener('change', (e) => {
    if (e.target.files[0]) readVidaFile(e.target.files[0], 'vidaFileLabResult');
  });
  document.getElementById('labFile')?.addEventListener('change', (e) => {
    if (e.target.files[0]) readLabFile(e.target.files[0]);
  });
});
