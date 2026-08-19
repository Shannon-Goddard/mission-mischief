/**
 * Mission Mischief - Dashboard
 * Handles: auth check, stats, badges display
 */

function checkAuth() {
  if (!Storage.isUnlocked()) {
    window.location.replace('../../unlock.html');
    return false;
  }
  if (!Storage.isFAFOCompleted()) {
    window.location.replace('../../core-game-files/funny-tos.html');
    return false;
  }
  return true;
}

function loadUserInfo() {
  const user = Storage.getUser();
  document.getElementById('userInfo').textContent = user.userName || '';
}

function loadUserStats() {
  const user = Storage.getUser();
  const stats = Storage.getUserStats();
  const badgeStates = Missions.getAllBadgeStates(user);
  const earnedBadges = Object.values(badgeStates).filter(b => b.state !== 'locked').length;

  document.getElementById('userStats').innerHTML = `
    <div class="stat-card">
      <span class="stat-number">${stats.completedMissions}</span>
      <span class="stat-label">Completed</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">${stats.totalSubmissions}</span>
      <span class="stat-label">Submitted</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">${earnedBadges}</span>
      <span class="stat-label">Badges</span>
    </div>
    <div class="stat-card">
      <span class="stat-number" style="color:${stats.honorColor}">${stats.honorScore}</span>
      <span class="stat-label">Honor</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">${stats.totalPoints}</span>
      <span class="stat-label">Points</span>
    </div>
  `;
}

function loadBadges() {
  const user = Storage.getUser();
  const container = document.getElementById('badgesContainer');
  const badgeStates = Missions.getAllBadgeStates(user);
  const earned = Object.entries(badgeStates).filter(([, b]) => b.state !== 'locked');

  if (earned.length === 0) {
    container.innerHTML = '<p style="color:#555; font-size:13px;">No badges yet — complete missions to earn them.</p>';
    return;
  }

  container.innerHTML = earned.map(([id, b]) => `
    <img src="${b.icon}" alt="${id}" title="${id}"
         style="width:40px; height:40px; object-fit:contain;"
         onerror="this.style.display='none'">
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  if (!checkAuth()) return;
  loadUserInfo();
  loadUserStats();
  loadBadges();

  // Back to top
  window.addEventListener('scroll', () => {
    const btn = document.getElementById('backToTop');
    btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });
  document.getElementById('backToTop').addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
