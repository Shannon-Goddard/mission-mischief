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
          @page { size: letter portrait; margin: 0.25in; }
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .sheet { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(5, 1fr); gap: 5px; width: 8in; height: 10.5in; }
          .card { border: 2px solid #04aa6d; padding: 8px; border-radius: 4px; font-size: 8px; }
          .qr-code { width: 40px; height: auto; float: right; object-fit: contain; }
          h1 { color: #04aa6d; margin: 0; font-size: 10px; }
          .handle { font-size: 9px; margin: 2px 0; }
          p { margin: 1px 0; line-height: 1.1; }
          strong { font-size: 7px; }
        </style>
      </head>
      <body>
        <div class="sheet">
        ${Array(15).fill().map(() => `<div class="card">
          <h1>🎭 MISSION MISCHIEF 🎭</h1>
          <div class="handle">@${userData.userName.replace(/[^a-z0-9]/gi, '')}</div>
          <p><strong>Player:</strong> ${userData.userName}</p>
          <p><strong>Location:</strong> ${userData.city}, ${userData.state}, ${userData.country}</p>
          <img class="qr-code" src="${userData.qrCodeData}" alt="QR Code" />
          
          <div style="border: 2px dashed #04aa6d; padding: 10px; margin: 10px 0; text-align: center;">
            <p><strong>🏆 FOUND A CARD? EARN REWARDS! 🏆</strong></p>
            <p>Join Game → Scan QR → Report Card Found → Get Points!</p>
          </div>
          
          <p><strong>Real-World Scavenger Hunt Game</strong></p>
          <p>✅ Complete missions in public</p>
          <p>📱 Post proof on social media</p>
          <p>🎯 Find cards for bonus points</p>
          <p>🍺 Community justice trials</p>
          
          <p><strong>Join at: missionmischief.com</strong></p>
          <p><strong>#MISSIONMISCHIEF #REALWORLDGAME</strong></p>
        </div>`).join('')}
        </div>
      </body>
      </html>
    `;
  }
};

window.PrintHandler = PrintHandler;