/**
 * Mission Mischief - Jail Page
 * Handles: cheater mission list, clown selfie, beer proof
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

function loadCheaterMissions() {
  const container = document.getElementById('step1List');
  container.innerHTML = Missions.missionData.map(m => `
    <div style="display:flex; align-items:center; margin-bottom:8px; padding:6px 8px; background:#222; border-radius:4px;">
      <input type="checkbox" id="cheat-${m.id}" onchange="toggleMissionCheat(${m.id})" style="margin-right:10px; flex-shrink:0;">
      <label for="cheat-${m.id}" style="color:#fff; font-size:13px; cursor:pointer;">
        ${m.id}. ${m.title}
      </label>
    </div>
  `).join('');
}

window.toggleStep = function(listId, iconId) {
  const list = document.getElementById(listId);
  const icon = document.getElementById(iconId);
  const open = list.style.display === 'none';
  list.style.display = open ? 'block' : 'none';
  icon.textContent = open ? '▲' : '▼';
};

window.toggleMissionCheat = function(missionId) {
  const checked = document.getElementById(`cheat-${missionId}`).checked;
  if (!checked) return;
  const user = Storage.getUser();
  user.completedMissions = user.completedMissions.filter(id => id !== missionId);
  if (user.missionPoints && user.missionPoints[missionId]) {
    delete user.missionPoints[missionId];
    user.totalPoints = Object.values(user.missionPoints).reduce((s, p) => s + p, 0);
  }
  user.honorScore = Math.max(0, (user.honorScore || 100) - 10);
  user.isCheater = true;
  Storage.saveUser(user);
  showToast(`Mission ${missionId} marked incomplete. -10 honor.`, 'warning');
};

// --- Clown Selfie ---
window.processClownSelfie = function() {
  const a = document.createElement('a');
  a.href = '../../assets/images/ui/clown-redemption.png';
  a.download = 'mission-mischief-clown.png';
  a.click();
  showToast('Downloaded! Post with #missionmischiefclown 🤡', 'success');
};

function downloadClownSelfie() {
  window.processClownSelfie();
}

// --- Beer Proof ---
let beerProofFile = null;

window.uploadBeerProof = function() {
  beerProofFile = document.getElementById('beerProof').files[0];
  if (!beerProofFile) return;
  const btn = document.getElementById('beerBtn');
  btn.textContent = '💾 DOWNLOAD BEER PROOF';
  btn.disabled = false;
  btn.onclick = downloadBeerProof;
  showToast('Beer proof ready! Post with #missionmischiefpaidbail', 'success');
};

function downloadBeerProof() {
  if (!beerProofFile) return;
  const url = URL.createObjectURL(beerProofFile);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mission-mischief-beer-proof.jpg';
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!checkAuth()) return;
  document.getElementById('userInfo').textContent = Storage.getUser().userName || '';
  loadCheaterMissions();

  window.addEventListener('scroll', () => {
    const btn = document.getElementById('backToTop');
    btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });
  document.getElementById('backToTop').addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
