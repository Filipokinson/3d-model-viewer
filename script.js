// Handles loading the events for <model-viewer>'s slotted progress bar
const modelViewer = document.querySelector('model-viewer');
const arButton = document.getElementById('ar-button');
const arPrompt = document.getElementById('ar-prompt');

// Initialize WebXR features
if ('xr' in navigator) {
  navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
    if (supported) {
      console.log('WebXR AR is supported');
    } else {
      console.log('WebXR AR is not supported');
    }
  });
}

const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
    event.target.removeEventListener('progress', onProgress);
    console.log('3D Model loaded successfully');
  } else {
    progressBar.classList.remove('hide');
  }
};

// Add event listeners
modelViewer.addEventListener('progress', onProgress);

// Enhanced AR interaction with platform-specific handling
arButton.addEventListener('click', async () => {
  const device = detectDevice();
  
  try {
    if (device === 'ios') {
      // iOS specific handling
      if (modelViewer.canActivateAR) {
        await modelViewer.activateAR();
        arPrompt.style.display = 'none';
      } else {
        throw new Error('AR not supported on this iOS device');
      }
    } else if (device === 'android') {
      // Android specific handling
      if (modelViewer.canActivateAR) {
        await modelViewer.activateAR();
        arPrompt.style.display = 'none';
      } else {
        throw new Error('AR not supported on this Android device');
      }
    } else {
      throw new Error('AR may not be supported on this device');
    }
    console.log('AR session started successfully');
  } catch (error) {
    console.error('Error starting AR:', error);
    alert(`AR не поддерживается на этом устройстве: ${error.message}`);
  }
});

// Detect AR support and update UI accordingly
function updateARButton() {
  if (!modelViewer.canActivateAR) {
    arButton.style.display = 'none';
    arPrompt.innerHTML = 'AR не поддерживается на этом устройстве';
  } else {
    arButton.style.display = 'block';
    const device = detectDevice();
    if (device === 'ios') {
      arPrompt.innerHTML = 'Нажмите кнопку AR для просмотра в дополненной реальности (iOS)';
    } else if (device === 'android') {
      arPrompt.innerHTML = 'Нажмите кнопку AR для просмотра в дополненной реальности (Android)';
    }
  }
}

// Device detection function
function detectDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  if (/android/i.test(userAgent)) {
    console.log('Android device detected');
    return 'android';
  } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    console.log('iOS device detected');
    return 'ios';
  }
  return 'other';
}

// Model interaction events
modelViewer.addEventListener('camera-change', () => {
  console.log('Camera position changed');
});

modelViewer.addEventListener('model-visibility', (event) => {
  console.log('Model visibility changed:', event.detail.visible);
});

// Initialize AR button state
updateARButton();

// Add load event listener
window.addEventListener('load', () => {
  updateARButton();
});