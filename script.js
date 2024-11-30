// Определяем, является ли устройство iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Handles loading the events for <model-viewer>'s slotted progress bar
const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
    event.target.removeEventListener('progress', onProgress);
  } else {
    progressBar.classList.remove('hide');
  }
};

// Добавляем прогресс-бар только для не-iOS устройств
if (!isIOS) {
  document.querySelector('model-viewer').addEventListener('progress', onProgress);
}

// Handle AR button click
const arButton = document.getElementById('ar-button');
const modelViewer = document.querySelector('model-viewer');

if (isIOS) {
  // Отключаем AR функционал model-viewer для iOS
  modelViewer.removeAttribute('ar');
  modelViewer.removeAttribute('ar-modes');
  
  // Настраиваем кнопку AR для прямого открытия USDZ
  arButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.location = 'GLB Shigan 4.2  .usdz';
  });
}