/**
 * Mission Mischief - Social Media Integration
 */

const Social = {
  // Generate social media sharing URLs
  generateShareURL(platform, mission, userHandle) {
    const baseText = `Just completed: ${mission.title} ${mission.hashtag}`;
    const text = userHandle ? `${baseText} by ${userHandle}` : baseText;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct posting via URL
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`
    };
    
    return urls[platform] || '';
  },

  // Copy hashtag to clipboard
  copyHashtag(hashtag) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hashtag).then(() => {
        showToast(`Copied ${hashtag} to clipboard!`, 'success');
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = hashtag;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(`Copied ${hashtag} to clipboard!`, 'success');
    }
  },

  // Generate QR code URL (using a free service)
  generateQRCode(data) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
  },

  // Share mission completion
  shareMissionComplete(mission, userHandle) {
    if (navigator.share) {
      // Use native sharing if available (mobile)
      navigator.share({
        title: 'Mission Mischief',
        text: `Just completed: ${mission.title} ${mission.hashtag}`,
        url: window.location.href
      });
    } else {
      // Show sharing options
      this.showShareModal(mission, userHandle);
    }
  },

  // Show sharing modal
  showShareModal(mission, userHandle) {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
      <div class="share-content">
        <h3>Share Your Mission</h3>
        <p>${mission.title}</p>
        <div class="share-buttons">
          <button onclick="window.open('${this.generateShareURL('twitter', mission, userHandle)}', '_blank')">
            Twitter
          </button>
          <button onclick="window.open('${this.generateShareURL('facebook', mission, userHandle)}', '_blank')">
            Facebook
          </button>
          <button onclick="Social.copyHashtag('${mission.hashtag}')">
            Copy Hashtag
          </button>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="close-btn">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
};

window.Social = Social;