/**
 * Mission Mischief - Camera Capture System
 */

class MugshotCamera {
  constructor() {
    this.stream = null;
    this.video = null;
    this.canvas = null;
    this.isActive = false;
  }

  // Request camera permission and start video
  async startCamera() {
    try {
      // Request camera permission
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Create video element if it doesn't exist
      if (!this.video) {
        this.video = document.createElement('video');
        this.video.id = 'mugshotVideo';
        this.video.autoplay = true;
        this.video.playsInline = true;
        this.video.muted = true;
        
        // Style the video
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
        
        // Add to camera view
        const cameraView = document.querySelector('.mugshot-camera-view');
        cameraView.appendChild(this.video);
      }
      
      this.video.srcObject = this.stream;
      this.isActive = true;
      
      // Update button text
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

  // Take photo and show preview
  takePhoto() {
    if (!this.isActive || !this.video) {
      alert('📸 Please start camera first!');
      return;
    }
    
    // Trigger flash effect
    if (typeof triggerFlash === 'function') {
      triggerFlash();
    }

    // Create canvas if it doesn't exist
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
    }

    // Set canvas size to match video
    this.canvas.width = this.video.videoWidth || 1280;
    this.canvas.height = this.video.videoHeight || 720;

    const ctx = this.canvas.getContext('2d');
    
    // Draw video frame to canvas with grayscale filter
    ctx.filter = 'grayscale(100%) contrast(120%)';
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    
    // Reset filter for overlay drawing
    ctx.filter = 'none';
    
    // Add booking board overlay to the image
    this.addBookingOverlay(ctx);
    
    // Show captured image preview
    this.showPhotoPreview();
  }

  // Show photo preview with options
  showPhotoPreview() {
    // Hide video and show captured image
    if (this.video) {
      this.video.style.display = 'none';
    }
    
    // Create preview image
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
    
    // Update controls
    const controls = document.querySelector('.mugshot-controls');
    controls.innerHTML = `
      <button class="mugshot-btn" onclick="retakeMugshot()">
        🔄 RETAKE MUGSHOT
      </button>
      <button class="mugshot-btn" onclick="downloadMugshot()">
        📱 SAVE TO PHOTOS
      </button>
      <button class="mugshot-btn" id="continueBtn" onclick="saveMugshotAndContinue()" disabled style="background: #666; cursor: not-allowed;">
        ✅ CONTINUE TO GAME
      </button>
    `;
  }

  // Add booking board overlay to the captured image
  addBookingOverlay(ctx) {
    const canvas = this.canvas;
    
    // Booking board background
    const boardHeight = 120;
    const boardY = canvas.height - boardHeight - 20;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(20, boardY, canvas.width - 40, boardHeight);
    
    // Border
    ctx.strokeStyle = '#04aa6d';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, boardY, canvas.width - 40, boardHeight);
    
    // Text
    ctx.fillStyle = '#04aa6d';
    ctx.font = 'bold 16px Courier New';
    ctx.textAlign = 'center';
    
    // Header
    ctx.fillText('MISSION MISCHIEF BOOKING', canvas.width / 2, boardY + 25);
    
    // Date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    
    ctx.font = 'bold 14px Courier New';
    ctx.fillText(`${dateStr} - ${timeStr}`, canvas.width / 2, boardY + 50);
    
    // Crime info
    ctx.font = '12px Courier New';
    ctx.fillText('CRIME: Agreeing to Terms of Service', canvas.width / 2, boardY + 75);
    ctx.fillText('SENTENCE: Complete 50 Missions of Mischief', canvas.width / 2, boardY + 95);
  }

  // Stop camera and cleanup
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

// Global camera instance
const mugshotCamera = new MugshotCamera();

// Global functions for HTML onclick
window.requestCameraPermission = async function() {
  await mugshotCamera.startCamera();
};

window.takeMugshotPhoto = function() {
  mugshotCamera.takePhoto();
};

window.retakeMugshot = function() {
  // Remove preview image
  const preview = document.getElementById('mugshotPreview');
  if (preview) preview.remove();
  
  // Show video again
  if (mugshotCamera.video) {
    mugshotCamera.video.style.display = 'block';
  }
  
  // Reset controls
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

window.saveMugshotAndContinue = function() {
  // Complete FAFO first
  Storage.completeFAFO();
  console.log('✅ FAFO completed:', Storage.isFAFOCompleted());
  
  // Just navigate to app.html - no download
  console.log('🔄 Redirecting to app.html...');
  window.location.href = 'app.html';
};

window.downloadMugshot = function() {
  // Save mugshot - mobile optimized
  if (mugshotCamera.canvas) {
    mugshotCamera.canvas.toBlob(async (blob) => {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      try {
        if (isMobile) {
          // Mobile: Try multiple approaches
          const file = new File([blob], `mission-mischief-mugshot-${Date.now()}.jpg`, { type: 'image/jpeg' });
          
          // Try Web Share API first
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Mission Mischief Mugshot',
              text: 'My Mission Mischief FAFO mugshot!',
              files: [file]
            });
            console.log('📱 Mugshot shared via Web Share API');
          } else {
            // Fallback: Create download link with mobile-friendly name
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mission-mischief-mugshot.jpg';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Show mobile-specific instruction
            alert('📱 Mugshot downloaded! Check your Downloads folder or browser downloads.');
            console.log('💾 Mobile download fallback used');
          }
        } else {
          // Desktop: Standard download
          downloadFallback(blob);
        }
        
        // Enable continue button after save attempt
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
          continueBtn.disabled = false;
          continueBtn.style.background = 'rgba(4, 170, 109, 0.9)';
          continueBtn.style.cursor = 'pointer';
          console.log('✅ Continue button enabled after save');
        }
      } catch (error) {
        console.log('⚠️ Save failed, using download fallback:', error);
        downloadFallback(blob);
        
        // Still enable continue button
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
          continueBtn.disabled = false;
          continueBtn.style.background = 'rgba(4, 170, 109, 0.9)';
          continueBtn.style.cursor = 'pointer';
        }
      }
    }, 'image/jpeg', 0.9);
  } else {
    alert('📸 No mugshot to save! Take a photo first.');
  }
};

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
}

window.closeMugshotCamera = function() {
  mugshotCamera.stopCamera();
  document.getElementById('mugshotCameraOverlay').style.display = 'none';
  stopLiveClock();
};