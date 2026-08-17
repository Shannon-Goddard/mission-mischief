/**
 * Mission Mischief — Cheater Redemption Zone
 */

let processedClownImage = null;
let beerProofImage = null;

function loadCheaterMissions() {
  const container = document.getElementById('cheaterMissionsList');
  if (!container) return;

  container.innerHTML = Missions.missionData.map(mission => `
    <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 5px; background: #333; border-radius: 4px;">
      <input type="checkbox" id="cheat-${mission.id}" onchange="toggleMissionCheat(${mission.id})" style="margin-right: 10px;">
      <label for="cheat-${mission.id}" style="color: #fff; font-size: 13px; cursor: pointer; flex: 1;">
        Mission ${mission.id}: ${mission.title}
      </label>
    </div>
  `).join('');

  document.getElementById('clownSelfie')?.addEventListener('change', function() {
    const btn = document.getElementById('clownBtn');
    if (this.files[0]) {
      btn.disabled = false;
      btn.style.background = '#ff4444';
      btn.style.cursor = 'pointer';
    }
  });

  document.getElementById('beerProof')?.addEventListener('change', function() {
    const btn = document.getElementById('beerBtn');
    if (this.files[0]) {
      btn.disabled = false;
      btn.style.background = '#ff4444';
      btn.style.cursor = 'pointer';
    }
  });
}

window.toggleCheaterMissions = function() {
  const list = document.getElementById('cheaterMissionsList');
  const toggle = document.getElementById('cheaterToggle');
  const expanded = list.style.display !== 'none';
  list.style.display = expanded ? 'none' : 'block';
  toggle.textContent = expanded ? '▼' : '▲';
};

window.toggleMissionCheat = function(missionId) {
  const checkbox = document.getElementById(`cheat-${missionId}`);
  if (!checkbox.checked) return;

  const user = Storage.getUser();
  user.completedMissions = user.completedMissions.filter(id => id !== missionId);

  if (user.missionPoints?.[missionId]) {
    delete user.missionPoints[missionId];
    user.totalPoints = Object.values(user.missionPoints).reduce((sum, p) => sum + p, 0);
  }

  user.honorScore = Math.max(0, (user.honorScore || 100) - 10);
  user.isCheater = true;
  Storage.saveUser(user);
  showToast(`Mission ${missionId} marked incomplete. Honor deducted.`, 'warning');
  window.loadUserStats?.();
  window.loadMissions?.();
};

window.processClownSelfie = function() {
  const file = document.getElementById('clownSelfie').files[0];
  if (!file) return;

  const btn = document.getElementById('clownBtn');
  btn.textContent = '⏳ PROCESSING...';
  btn.disabled = true;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const mayhemClown = new Image();
    const finalize = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2.2;
      const r = Math.min(canvas.width, canvas.height) / 25;

      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.fill();

      ctx.font = `bold ${canvas.width / 15}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('CLOWN', cx, canvas.height - 50);

      canvas.toBlob(blob => {
        processedClownImage = blob;
        btn.innerHTML = '✅ CLOWN READY — TAP TO DOWNLOAD';
        btn.disabled = false;
        btn.onclick = downloadClownSelfie;
        showToast('Clown selfie ready! 🤡', 'success');
      });
    };

    mayhemClown.onload = function() {
      const size = Math.min(canvas.width, canvas.height) / 4;
      ctx.drawImage(mayhemClown, canvas.width - size - 20, canvas.height - size - 20, size, size);
      finalize();
    };
    mayhemClown.onerror = finalize;
    mayhemClown.src = '../assets/images/mascot/mayhem-excited.png';
  };

  img.src = URL.createObjectURL(file);
};

function downloadClownSelfie() {
  if (!processedClownImage) return;
  const url = URL.createObjectURL(processedClownImage);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mission-mischief-clown-selfie.jpg';
  a.click();
  URL.revokeObjectURL(url);
}

window.uploadBeerProof = function() {
  const file = document.getElementById('beerProof').files[0];
  if (!file) return;

  beerProofImage = file;
  const btn = document.getElementById('beerBtn');
  btn.innerHTML = '✅ BEER PROOF READY — TAP TO DOWNLOAD';
  btn.disabled = false;
  btn.onclick = downloadBeerProof;
  showToast('Beer proof ready! 🍺', 'success');
};

function downloadBeerProof() {
  if (!beerProofImage) return;
  const url = URL.createObjectURL(beerProofImage);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mission-mischief-beer-proof.jpg';
  a.click();
  URL.revokeObjectURL(url);
}
