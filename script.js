// Handles loading the events for <model-viewer>'s slotted progress bar
const modelViewer = document.querySelector('model-viewer');
const arButton = document.getElementById('ar-button');
const arPrompt = document.getElementById('ar-prompt');

// Check if Quick Look is supported
const isQuickLookSupported = () => {
  const userAgent = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
};

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
  console.log('Device detected:', device);
  
  try {
    if (device === 'ios') {
      // For iOS, we'll let Quick Look handle the AR view
      console.log('Using Quick Look for iOS');
      // The model-viewer component will handle the Quick Look activation
    } else {
      // For other devices, use the standard AR activation
      if (modelViewer.canActivateAR) {
        await modelViewer.activateAR();
        console.log('AR activated for non-iOS device');
      } else {
        throw new Error('AR не поддерживается на этом устройстве');
      }
    }
    arPrompt.style.display = 'none';
  } catch (error) {
    console.error('Error starting AR:', error);
    alert(`AR не поддерживается на этом устройстве: ${error.message}`);
  }
});

// Detect AR support and update UI accordingly
function updateARButton() {
  const device = detectDevice();
  const quickLookSupported = isQuickLookSupported();
  
  console.log('Device:', device);
  console.log('Quick Look supported:', quickLookSupported);
  
  if (device === 'ios') {
    if (quickLookSupported) {
      arButton.style.display = 'block';
      arPrompt.innerHTML = 'Нажмите кнопку AR для просмотра в Quick Look';
    } else {
      arButton.style.display = 'none';
      arPrompt.innerHTML = 'AR не поддерживается на этом устройстве';
    }
  } else if (modelViewer.canActivateAR) {
    arButton.style.display = 'block';
    arPrompt.innerHTML = 'Нажмите кнопку AR для просмотра модели';
  } else {
    arButton.style.display = 'none';
    arPrompt.innerHTML = 'AR не поддерживается на этом устройстве';
  }
}

// Device detection function
function detectDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios';
  } else if (/android/i.test(userAgent)) {
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

// AR specific events
modelViewer.addEventListener('ar-status', (event) => {
  console.log('AR Status:', event.detail.status);
});

modelViewer.addEventListener('ar-tracking', (event) => {
  console.log('AR Tracking:', event.detail.status);
});

modelViewer.addEventListener('error', (event) => {
  console.error('Model Viewer Error:', event.detail);
});

// Initialize AR button state
updateARButton();

// Add load event listener
window.addEventListener('load', () => {
  updateARButton();
});