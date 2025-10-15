/**
 * Mission Mischief - Cross-Platform Print Handler
 */

const PrintHandler = {
  // Detect platform and print method
  printCard(userData) {
    const userAgent = navigator.userAgent;
    
    if (this.isAndroidWebView()) {
      this.androidPrint(userData);
    } else if (this.isIOSWebView()) {
      this.iosPrint(userData);
    } else {
      this.webPrint(userData);
    }
  },

  // Android WebView detection
  isAndroidWebView() {
    return /Android/.test(navigator.userAgent) && /wv/.test(navigator.userAgent);
  },

  // iOS WebView detection  
  isIOSWebView() {
    return /iPhone|iPad/.test(navigator.userAgent) && !window.MSStream;
  },

  // Android print handler
  androidPrint(userData) {
    if (window.Android && window.Android.printCard) {
      // Native Android method
      window.Android.printCard(JSON.stringify(userData));
    } else {
      // Fallback to web print
      this.webPrint(userData);
    }
  },

  // iOS print handler
  iosPrint(userData) {
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.printCard) {
      // Native iOS method
      window.webkit.messageHandlers.printCard.postMessage(userData);
    } else {
      // Fallback to web print
      this.webPrint(userData);
    }
  },

  // Web fallback print
  webPrint(userData) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(this.generateCardHTML(userData));
    printWindow.document.close();
    printWindow.print();
  },

  // Generate printable card HTML
  generateCardHTML(userData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Mission Mischief Card</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .card { border: 2px solid #04aa6d; padding: 20px; border-radius: 8px; }
          .qr-code { width: 100px; height: 100px; float: right; }
          h1 { color: #04aa6d; margin: 0; }
          .handle { font-size: 18px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>MISSION MISCHIEF</h1>
          <div class="handle">${userData.userHandle}</div>
          <p>Player: ${userData.userName}</p>
          <img class="qr-code" src="${userData.qrCodeData}" alt="QR Code" />
          <p><strong>IF FOUND...</strong></p>
          <p>You have stumbled upon a game of cunning, chaos, and questionable morals.</p>
          <p><strong>DO NOT KEEP THIS CARD.</strong></p>
          <p>SCAN HERE to discover the Mission and join the chaos.</p>
          <p>#MISSIONMISCHIEF</p>
        </div>
      </body>
      </html>
    `;
  }
};

window.PrintHandler = PrintHandler;