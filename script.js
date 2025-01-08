const video = document.getElementById('qr-video');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');
const copyButton = document.getElementById('copy-button');

let scanning = false;

// Get access to the camera
async function getCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        video.play();
        scanning = true;
        requestAnimationFrame(scanQRCode);
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Error accessing camera. Please ensure camera permissions are granted.');
    }
}

//Scan QR code using jsQR library
function scanQRCode() {
  if (!scanning) return;
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    const canvasElement = document.createElement('canvas');
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    const canvasContext = canvasElement.getContext('2d');
    canvasContext.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert"
    });
    if(qrCode){
        scanning = false;
        resultText.innerText = qrCode.data;
        resultContainer.classList.remove('hidden');
    }
  }
  requestAnimationFrame(scanQRCode);
}

// Copy QR code result to clipboard
copyButton.addEventListener('click', async () => {
  if (resultText.innerText) {
    try {
        await navigator.clipboard.writeText(resultText.innerText);
        alert('Copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy. Please try again.')
    }
  }
});

getCamera();
