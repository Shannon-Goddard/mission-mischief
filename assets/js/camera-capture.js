/**
 * Mission Mischief - Enhanced Camera Capture System
 */

class MugshotCamera {
  constructor() {
    this.stream = null;
    this.video = null;
    this.canvas = null;
    this.isActive = false;
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (!this.video) {
        this.video = document.createElement('video');
        this.video.id = 'mugshotVideo';
        this.video.autoplay = true;
        this.video.playsInline = true;
        this.video.muted = true;
        
        this.video.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          max-width: 400px;
          height: 60%;
          object-fit: cover;
          border-radius: 8px;
          filter: grayscale(100%) contrast(1.2);
          z-index: 1999;
        `;
        
        const cameraView = document.querySelector('.mugshot-camera-view');
        cameraView.appendChild(this.video);
      }
      
      this.video.srcObject = this.stream;
      this.isActive = true;
      
      const cameraBtn = document.querySelector('.mugshot-btn[onclick="requestCameraPermission()"]');
      if (cameraBtn) {
        cameraBtn.textContent = '📹 CAMERA ACTIVE';
        cameraBtn.style.background = 'rgba(4, 170, 109, 0.9)';
      }
      
      return true;
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('📸 Camera permission required to take mugshot! Please allow camera access and try again.');
      return false;
    }
  }

  takePhoto() {
    if (!this.isActive || !this.video) {
      alert('📸 Please start camera first!');
      return;
    }
    
    if (typeof triggerFlash === 'function') {
      triggerFlash();
    }

    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
    }

    this.canvas.width = this.video.videoWidth || 1280;
    this.canvas.height = this.video.videoHeight || 720;

    const ctx = this.canvas.getContext('2d');
    
    // Draw video frame with grayscale filter
    ctx.filter = 'grayscale(100%) contrast(120%)';
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    
    ctx.filter = 'none';
    
    // Add booking board overlay
    this.addBookingOverlay(ctx);
    
    this.showPhotoPreview();
  }

  showPhotoPreview() {
    if (this.video) {
      this.video.style.display = 'none';
    }
    
    const previewImg = document.createElement('img');
    previewImg.id = 'mugshotPreview';
    previewImg.src = this.canvas.toDataURL('image/jpeg', 0.9);
    previewImg.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      max-width: 400px;
      height: 60%;
      object-fit: cover;
      border-radius: 8px;
      z-index: 1999;
    `;
    
    const cameraView = document.querySelector('.mugshot-camera-view');
    cameraView.appendChild(previewImg);
    
    const controls = document.querySelector('.mugshot-controls');
    controls.innerHTML = `
      <button class="mugshot-btn" onclick="retakeMugshot()">
        🔄 RETAKE
      </button>
      <button class="mugshot-btn" onclick="downloadMugshot()">
        💾 DOWNLOAD
      </button>
      <button class="mugshot-btn" id="continueBtn" onclick="completeFAFOAndContinue()" disabled style="opacity: 0.5; cursor: not-allowed;">
        ✅ DOWNLOAD FIRST
      </button>
    `;
  }

  addBookingOverlay(ctx) {
    const canvas = this.canvas;
    const boardHeight = 120;
    const boardY = canvas.height - boardHeight - 20;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(20, boardY, canvas.width - 40, boardHeight);
    
    ctx.strokeStyle = '#04aa6d';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, boardY, canvas.width - 40, boardHeight);
    
    ctx.fillStyle = '#04aa6d';
    ctx.font = 'bold 16px Courier New';
    ctx.textAlign = 'center';
    
    ctx.fillText('MISSION MISCHIEF BOOKING', canvas.width / 2, boardY + 25);
    
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    
    ctx.font = 'bold 14px Courier New';
    ctx.fillText(`${dateStr} - ${timeStr}`, canvas.width / 2, boardY + 50);
    
    ctx.font = '12px Courier New';
    ctx.fillText('CRIME: Agreeing to Terms of Service', canvas.width / 2, boardY + 75);
    ctx.fillText('SENTENCE: Complete 50 Missions of Mischief', canvas.width / 2, boardY + 95);
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.video) {
      this.video.remove();
      this.video = null;
    }
    
    this.isActive = false;
  }
}

const mugshotCamera = new MugshotCamera();

window.requestCameraPermission = async function() {
  await mugshotCamera.startCamera();
};

window.takeMugshotPhoto = function() {
  mugshotCamera.takePhoto();
};

window.retakeMugshot = function() {
  const preview = document.getElementById('mugshotPreview');
  if (preview) preview.remove();
  
  if (mugshotCamera.video) {
    mugshotCamera.video.style.display = 'block';
  }
  
  const controls = document.querySelector('.mugshot-controls');
  controls.innerHTML = `
    <button class="mugshot-btn" onclick="requestCameraPermission()">
      📹 START CAMERA
    </button>
    <button class="mugshot-btn" onclick="takeMugshotPhoto()">
      📸 TAKE MUGSHOT
    </button>
  `;
};

window.downloadMugshot = function() {
  if (mugshotCamera.canvas) {
    // Create final canvas with B&W overlay and sign
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = mugshotCamera.canvas.width;
    finalCanvas.height = mugshotCamera.canvas.height;
    const ctx = finalCanvas.getContext('2d');
    
    // Draw the original mugshot (already B&W with booking overlay)
    ctx.drawImage(mugshotCamera.canvas, 0, 0);
    
    finalCanvas.toBlob(async (blob) => {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      try {
        if (isMobile) {
          const file = new File([blob], `mission-mischief-mugshot-${Date.now()}.jpg`, { type: 'image/jpeg' });
          
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Mission Mischief Mugshot',
              text: 'My Mission Mischief FAFO mugshot!',
              files: [file]
            });
            console.log('📱 Mugshot shared via Web Share API');
          } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mission-mischief-mugshot.jpg';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert('📱 Mugshot downloaded! Check your Downloads folder.');
            console.log('💾 Mobile download fallback used');
          }
        } else {
          downloadFallback(blob);
        }
        
        // Enable continue button after successful download
        enableContinueButton();
        
      } catch (error) {
        console.log('⚠️ Save failed, using download fallback:', error);
        downloadFallback(blob);
        enableContinueButton();
      }
    }, 'image/jpeg', 0.9);
  } else {
    alert('📸 No mugshot to save! Take a photo first.');
  }
};

function enableContinueButton() {
  const continueBtn = document.getElementById('continueBtn');
  if (continueBtn) {
    continueBtn.disabled = false;
    continueBtn.style.opacity = '1';
    continueBtn.style.cursor = 'pointer';
    continueBtn.textContent = '✅ CONTINUE TO GAME';
    continueBtn.style.background = '#04aa6d';
  }
}

function downloadFallback(blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mission-mischief-mugshot-${Date.now()}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log('💾 Mugshot downloaded (fallback)');
  enableContinueButton();
}

window.closeMugshotCamera = function() {
  mugshotCamera.stopCamera();
  document.getElementById('mugshotCameraOverlay').style.display = 'none';
  if (typeof stopLiveClock === 'function') stopLiveClock();
};