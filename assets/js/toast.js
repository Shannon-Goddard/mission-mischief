/**
 * Mission Mischief — Toast Notifications
 */

function showToast(message, type = 'info') {
  const existing = document.getElementById('mm-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'mm-toast';
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#04aa6d' : type === 'error' ? '#ff6b6b' : type === 'warning' ? '#ffd700' : '#333'};
    color: ${type === 'success' ? '#000' : type === 'warning' ? '#000' : '#fff'};
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 10000;
    font-size: 14px;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideIn 0.2s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

window.showToast = showToast;
