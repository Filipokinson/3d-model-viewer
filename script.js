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
      // iOS specific handling using Quick Look
      console.log('Activating Quick Look AR for iOS');
      if (modelViewer.canActivateAR) {
        await modelViewer.activateAR();
        arPrompt.style.display = 'none';
      } else {
        throw new Error('Quick Look AR not supported on this iOS device');
      }
    } else if (device === 'android') {
      // Android specific handling using Scene Viewer
      console.log('Activating Scene Viewer AR for Android');
      if (modelViewer.canActivateAR) {
        await modelViewer.activateAR();
        arPrompt.style.display = 'none';
      } else {
        throw new Error('Scene Viewer AR not supported on this Android device');
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
  const device = detectDevice();
  
  if (device === 'ios') {
    // Always show AR button on iOS as we're using Quick Look
    arButton.style.display = 'block';
    arPrompt.innerHTML = 'Нажмите кнопку AR для просмотра в Quick Look AR';
  } else if (!modelViewer.canActivateAR) {
    arButton.style.display = 'none';
    arPrompt.innerHTML = 'AR не поддерживается на этом устройстве';
  } else {
    arButton.style.display = 'block';
    if (device === 'android') {
      arPrompt.innerHTML = 'Нажмите кнопку AR для просмотра в Scene Viewer';
    }
  }
}

// Device detection function
function detectDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    console.log('iOS device detected');
    return 'ios';
  } else if (/android/i.test(userAgent)) {
    console.log('Android device detected');
    return 'android';
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
  
  // iOS specific: Check if running in standalone mode
  if (window.navigator.standalone) {
    document.body.classList.add('ios-standalone');
  }
});