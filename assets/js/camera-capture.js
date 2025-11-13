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

    // Set canvas size to match video
    const videoWidth = this.video.videoWidth || 1280;
    const videoHeight = this.video.videoHeight || 720;
    this.canvas.width = videoWidth;
    this.canvas.height = videoHeight;

    const ctx = this.canvas.getContext('2d');
    
    // Clear canvas first
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    
    // Draw video frame
    ctx.drawImage(this.video, 0, 0, videoWidth, videoHeight);
    
    // Apply grayscale filter to entire canvas
    const imageData = ctx.getImageData(0, 0, videoWidth, videoHeight);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = gray;     // Red
      data[i + 1] = gray; // Green
      data[i + 2] = gray; // Blue
    }
    
    ctx.putImageData(imageData, 0, 0);
    
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
    const boardHeight = Math.max(120, canvas.height * 0.15);
    const boardY = canvas.height - boardHeight - 20;
    const boardX = 20;
    const boardWidth = canvas.width - 40;
    
    // Black background with high opacity
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(boardX, boardY, boardWidth, boardHeight);
    
    // Green border
    ctx.strokeStyle = '#04aa6d';
    ctx.lineWidth = 4;
    ctx.strokeRect(boardX, boardY, boardWidth, boardHeight);
    
    // Calculate responsive font sizes
    const baseFontSize = Math.max(12, canvas.width * 0.02);
    const headerFontSize = Math.max(14, canvas.width * 0.025);
    const titleFontSize = Math.max(16, canvas.width * 0.03);
    
    // Header text
    ctx.fillStyle = '#04aa6d';
    ctx.font = `bold ${titleFontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('MISSION MISCHIEF BOOKING', canvas.width / 2, boardY + titleFontSize + 10);
    
    // Date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    
    ctx.font = `bold ${headerFontSize}px Arial, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${dateStr} - ${timeStr}`, canvas.width / 2, boardY + titleFontSize + headerFontSize + 20);
    
    // Crime details
    ctx.font = `${baseFontSize}px Arial, sans-serif`;
    ctx.fillStyle = '#04aa6d';
    ctx.fillText('CRIME: Agreeing to Terms of Service', canvas.width / 2, boardY + titleFontSize + headerFontSize + baseFontSize + 35);
    ctx.fillText('SENTENCE: Complete 50 Missions of Mischief', canvas.width / 2, boardY + titleFontSize + headerFontSize + baseFontSize + 55);
    
    // Add height measurement lines on the right
    const lineX = canvas.width - 60;
    const lineHeight = canvas.height * 0.6;
    const lineY = (canvas.height - lineHeight) / 2;
    
    ctx.strokeStyle = '#04aa6d';
    ctx.lineWidth = 2;
    
    // Draw measurement lines
    for (let i = 0; i <= 4; i++) {
      const y = lineY + (lineHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(lineX, y);
      ctx.lineTo(lineX + 30, y);
      ctx.stroke();
      
      // Height labels
      ctx.fillStyle = '#04aa6d';
      ctx.font = `${baseFontSize}px Arial, sans-serif`;
      ctx.textAlign = 'right';
      const heights = ['6\'0"', '5\'6"', '5\'0"', '4\'6"', '4\'0"'];
      ctx.fillText(heights[i], lineX - 5, y + 4);
    }
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