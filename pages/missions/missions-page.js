/**
 * Mission Mischief - Missions Page
 * Handles: mission list, filters, cards, submit, hashtags, buy-in
 */

let currentFilter = 'all';

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

function setFilter(filter) {
  currentFilter = filter;
  ['all', 'available', 'completed'].forEach(f => {
    const btn = document.getElementById('filter' + f.charAt(0).toUpperCase() + f.slice(1));
    if (btn) btn.classList.toggle('completed', f === filter);
  });
  loadMissions(filter);
}

function loadMissions(filter = currentFilter) {
  const user = Storage.getUser();
  let missions = Missions.getAvailableMissions(user);

  if (filter === 'available') {
    missions = missions.filter(m => !Missions.isMissionCompleted(m.id, user));
  } else if (filter === 'completed') {
    missions = missions.filter(m => Missions.isMissionCompleted(m.id, user));
  }

  const container = document.getElementById('missionsContainer');
  if (missions.length === 0) {
    container.innerHTML = '<p style="color:#555; text-align:center; padding:30px;">No missions here yet.</p>';
    return;
  }
  container.innerHTML = missions.map(m => createMissionCard(m, user)).join('');
}

function createMissionCard(mission, user) {
  const isCompleted = Missions.isMissionCompleted(mission.id, user);
  const submission = Storage.getSubmission(mission.id);
  const submissionClass = submission ? 'submitted' : (isCompleted ? 'completed' : '');
  const statusText = submission ? 'submitted' : (isCompleted ? 'completed' : 'available');
  const badgeState = mission.badgeId ? Missions.getBadgeState(mission.badgeId, user) : 'locked';
  const typeClass = mission.type === 'prank' ? 'prank-mission' : 'goodwill-mission';

  let actions = '';
  if (!isCompleted) {
    if (mission.id === 4) {
      actions = `
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <button class="mission-btn" onclick="selectBuyIn('recycling')" style="background:#28a745; color:#fff; border-color:#28a745;">🌍 Green Warrior</button>
          <button class="mission-btn" onclick="selectBuyIn('cleanup')" style="background:#6c757d; color:#fff; border-color:#6c757d;">🗑️ Oscar</button>
          <button class="mission-btn" onclick="selectBuyIn('referral')" style="background:#007bff; color:#fff; border-color:#007bff;">🎵 Bye Bye Bye</button>
          <button class="mission-btn" onclick="selectBuyIn('nothing')" style="background:#dc3545; color:#fff; border-color:#dc3545;">🤡 Do Nothing</button>
        </div>`;
    }
    if (mission.id === 2) {
      actions += `<button class="mission-btn" onclick="printCard()" style="background:#666; border-color:#666; color:#fff;">🖨️ Print Card</button> `;
    }
    actions += `
      <button class="mission-btn" onclick="startMissionCapture(${mission.id})">🎭 Upload Proof</button>
      <button class="mission-btn" onclick="DirectSubmission.showSubmissionForm(${mission.id})" style="background:#04aa6d; color:#000; border-color:#04aa6d;">⚡ Submit Mission</button>
    `;
  }

  return `
    <div class="mission-card ${submissionClass} ${typeClass}" data-mission-id="${mission.id}">
      <div class="mission-header" onclick="toggleMissionDetails(${mission.id})" style="cursor:pointer;">
        <div style="display:flex; gap:8px; align-items:center;">
          <div class="mission-number">${mission.id}</div>
          <div class="mission-type ${mission.type}">${mission.type.toUpperCase()}</div>
          <div class="mission-status ${submissionClass}">${statusText}</div>
          ${submission ? `<div style="color:#04aa6d; font-size:11px;">+${submission.points}pts</div>` : ''}
        </div>
        <div id="expand-${mission.id}" style="color:#04aa6d; font-size:12px; transition:transform 0.2s;">▼</div>
      </div>
      <div class="mission-title" onclick="toggleMissionDetails(${mission.id})" style="cursor:pointer;">${mission.title}</div>
      <div class="mission-location">${mission.location}</div>
      <div class="mission-description">${mission.description}</div>

      <div id="details-${mission.id}" style="display:none; margin-top:15px; padding-top:15px; border-top:1px solid #333;">
        ${submission ? `
          <div style="background:rgba(4,170,109,0.1); padding:10px; border-radius:4px; margin-bottom:12px;">
            <div style="color:#04aa6d; font-weight:bold; margin-bottom:4px;">✅ SUBMITTED</div>
            <div style="font-size:12px; color:#ccc;">${submission.points} pts · ${new Date(submission.timestamp).toLocaleString()}</div>
            ${submission.proofUrl ? `<a href="${submission.proofUrl}" target="_blank" style="color:#04aa6d; font-size:11px;">View Proof</a>` : ''}
          </div>
        ` : ''}
        ${mission.badgeId && Missions.badges[mission.badgeId] ? `
          <div class="mission-badge-info" style="margin-bottom:10px;">
            <span class="badge-name">${Missions.badges[mission.badgeId].name} Badge</span>
            <span class="badge-state ${badgeState}">${badgeState.toUpperCase()}</span>
          </div>
        ` : ''}
        ${mission.proof ? `<div style="margin-bottom:10px; padding:8px; background:rgba(4,170,109,0.1); border-radius:4px; font-size:13px;"><strong>Proof:</strong> ${mission.proof}</div>` : ''}
        <div style="margin-bottom:10px; font-family:monospace; color:#04aa6d; font-size:12px;">${mission.hashtag}</div>
        <div style="margin-bottom:15px;">
          <label style="display:block; color:#04aa6d; margin-bottom:5px; font-size:12px; font-weight:bold;">Points Earned:</label>
          <select id="points-${mission.id}" style="background:#333; color:#fff; border:1px solid #04aa6d; border-radius:4px; padding:5px; font-size:12px; width:120px;" onchange="updateMissionPoints(${mission.id})">
            ${getPointsOptions(mission)}
          </select>
        </div>
        <div class="mission-actions">${actions}</div>
      </div>
    </div>
  `;
}

window.toggleMissionDetails = function(missionId) {
  const details = document.getElementById(`details-${missionId}`);
  const icon = document.getElementById(`expand-${missionId}`);
  const open = details.style.display === 'none';
  details.style.display = open ? 'block' : 'none';
  icon.textContent = open ? '▲' : '▼';
};

function getPointsOptions(mission) {
  const points = mission.points;
  let opts = '<option value="0" selected>0 (default)</option>';
  if (typeof points === 'number') {
    opts += `<option value="${points}">${points}</option>`;
  } else if (typeof points === 'string') {
    if (points.includes('-')) {
      const [min, max] = points.split('-').map(p => parseInt(p));
      for (let i = min; i <= max; i++) opts += `<option value="${i}">${i}</option>`;
    } else if (points === '?') {
      for (let i = 1; i <= 50; i++) opts += `<option value="${i}">${i}</option>`;
    } else if (points.includes('/')) {
      points.split('/').map(p => parseInt(p.trim())).filter(p => !isNaN(p))
        .forEach(p => { opts += `<option value="${p}">${p}</option>`; });
    } else {
      const matches = points.match(/\d+/g);
      if (matches) matches.forEach(p => { opts += `<option value="${p}">${p}</option>`; });
    }
  }
  return opts;
}

window.updateMissionPoints = function(missionId) {
  const points = parseInt(document.getElementById(`points-${missionId}`).value) || 0;
  const user = Storage.getUser();
  if (!user.missionPoints) user.missionPoints = {};
  user.missionPoints[missionId] = points;
  user.totalPoints = Object.values(user.missionPoints).reduce((s, p) => s + p, 0);
  Storage.saveUser(user);
  showToast(`Mission ${missionId} points set to ${points}`, 'success');
};

window.selectBuyIn = function(buyInId) {
  const user = Storage.getUser();
  user.currentBuyIn = buyInId;
  if (!user.completedBuyIns) user.completedBuyIns = [];
  if (!user.completedBuyIns.includes(buyInId)) user.completedBuyIns.push(buyInId);
  Storage.saveUser(user);
  showToast(`Selected: ${Missions.buyIns[buyInId].title}`, 'success');
  setTimeout(() => {
    Storage.completeMission(4);
    loadMissions();
  }, 800);
};

function startMissionCapture(missionId) {
  const mission = Missions.getMission(missionId);
  const user = Storage.getUser();
  const buyInBadges = { recycling: 'captain-planet-color.png', cleanup: 'oscar-the-grouch-color.png', referral: 'justin-timberlake-color.png' };
  const buyInBadge = (missionId === 4 && user.currentBuyIn) ? (buyInBadges[user.currentBuyIn] || null) : null;
  sessionStorage.setItem('currentMission', JSON.stringify({
    id: missionId,
    title: mission.title,
    hashtags: generateMissionHashtags(mission, user),
    buyInBadge
  }));
  window.location.href = '../../core-game-files/badge-overlay.html';
}

function generateMissionHashtags(mission, user) {
  const userTag = `#missionmischiefuser${(user.userName || '').replace(/[^a-z0-9]/gi, '')}`;
  let loc = '';
  if (user.country) loc += ` #missionmischiefcountry${user.country.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  if (user.state)   loc += ` #missionmischiefstate${user.state.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  if (user.city)    loc += ` #missionmischiefcity${user.city.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  return `${mission.hashtag} ${userTag}${loc} #missionmischief #realworldgame`;
}

function printCard() {
  const user = Storage.getUser();
  if (user.userName && user.qrCodeData && window.PrintHandler) {
    PrintHandler.printCard(user);
    showToast('Card sent to printer! 🖨️', 'success');
  } else {
    showToast('Complete your profile first!', 'error');
  }
}

// Expose for DirectSubmission callbacks
window.loadMissions = loadMissions;

document.addEventListener('DOMContentLoaded', () => {
  if (!checkAuth()) return;
  document.getElementById('userInfo').textContent = Storage.getUser().userName || '';
  loadMissions();

  window.addEventListener('scroll', () => {
    const btn = document.getElementById('backToTop');
    btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });
  document.getElementById('backToTop').addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
