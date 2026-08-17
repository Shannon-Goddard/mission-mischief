/**
 * Mission Mischief — Mission Upload Handler
 */

let uploadedFile = null;
let processedResult = null;

window.showMissionCamera = function(missionId) {
  const mission = Missions.getMission(missionId);

  const modal = document.createElement('div');
  modal.id = 'missionUploadModal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.95); z-index: 2000;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 20px; overflow-y: auto;
  `;

  modal.innerHTML = `
    <div style="text-align: center; color: #04aa6d; margin-bottom: 20px;">
      <h2>Mission ${mission.id}: ${mission.title}</h2>
      <p>${mission.description}</p>
      <p><strong>Hashtag:</strong> ${mission.hashtag}</p>
    </div>
    <div style="background: #222; border-radius: 8px; padding: 15px; width: 100%; max-width: 500px;">
      <div style="margin-bottom: 15px;">
        <label style="display: block; color: #04aa6d; margin-bottom: 8px; font-weight: bold;">📁 Upload Photo/Video:</label>
        <input type="file" id="missionFile" accept="image/*,video/*"
          style="width: 100%; padding: 8px; background: #333; color: #fff; border: 1px solid #04aa6d; border-radius: 4px;">
      </div>
      <div id="previewContainer" style="display: none; margin-bottom: 20px;">
        <div style="position: relative; background: #111; border-radius: 4px; overflow: hidden;">
          <img id="previewImage" style="width: 100%; height: auto; display: none;">
          <video id="previewVideo" controls style="width: 100%; height: auto; display: none;"></video>
        </div>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
        <button onclick="processUpload()" id="processBtn" disabled
          style="background: #666; color: #fff; padding: 8px 12px; border: none; border-radius: 4px; cursor: not-allowed; flex: 1; min-width: 120px;">
          🎭 PROCESS
        </button>
        <button onclick="downloadResult()" id="downloadBtn" disabled
          style="background: #666; color: #fff; padding: 8px 12px; border: none; border-radius: 4px; display: none; flex: 1; min-width: 100px;">
          💾 SAVE
        </button>
        <button onclick="closeMissionUpload()"
          style="background: #666; color: #fff; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; flex: 1; min-width: 80px;">
          ❌ CLOSE
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById('missionFile').addEventListener('change', handleFileUpload);
  window.currentUploadMission = mission;
};

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  uploadedFile = file;
  const previewContainer = document.getElementById('previewContainer');
  const previewImage = document.getElementById('previewImage');
  const previewVideo = document.getElementById('previewVideo');
  const processBtn = document.getElementById('processBtn');

  previewContainer.style.display = 'block';

  if (file.type.startsWith('image/')) {
    previewImage.style.display = 'block';
    previewVideo.style.display = 'none';
    previewImage.src = URL.createObjectURL(file);
  } else if (file.type.startsWith('video/')) {
    previewImage.style.display = 'none';
    previewVideo.style.display = 'block';
    previewVideo.src = URL.createObjectURL(file);
  }

  processBtn.disabled = false;
  processBtn.style.background = '#04aa6d';
  processBtn.style.color = '#000';
  processBtn.style.cursor = 'pointer';
}

window.processUpload = function() {
  if (!uploadedFile) return;

  const btn = document.getElementById('processBtn');
  btn.disabled = true;
  btn.textContent = '⏳ PROCESSING...';

  setTimeout(() => {
    if (uploadedFile.type.startsWith('image/')) {
      processImage();
    } else {
      showToast('Video downloaded — add overlays via screen recording', 'info');
      enableDownload('mission-video-' + Date.now() + '.mp4', true);
    }
    btn.textContent = '🎭 PROCESS';
    btn.disabled = false;
  }, 1000);
};

function processImage() {
  const img = document.getElementById('previewImage');
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  canvas.toBlob(blob => {
    processedResult = blob;
    enableDownload('mission-photo-' + Date.now() + '.jpg');
  });
}

function enableDownload(filename, isVideo = false) {
  const downloadBtn = document.getElementById('downloadBtn');
  downloadBtn.disabled = false;
  downloadBtn.style.background = '#04aa6d';
  downloadBtn.style.color = '#000';
  downloadBtn.style.cursor = 'pointer';
  downloadBtn.style.display = 'inline-block';
  downloadBtn.setAttribute('data-filename', filename);
  downloadBtn.setAttribute('data-is-video', isVideo);
  showToast('Ready to download!', 'success');
}

window.downloadResult = function() {
  const btn = document.getElementById('downloadBtn');
  const filename = btn.getAttribute('data-filename');
  const isVideo = btn.getAttribute('data-is-video') === 'true';
  const source = isVideo ? uploadedFile : processedResult;
  if (!source) return;

  const url = URL.createObjectURL(source);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

window.closeMissionUpload = function() {
  document.getElementById('missionUploadModal')?.remove();
  uploadedFile = null;
  processedResult = null;
  window.currentUploadMission = null;
};
