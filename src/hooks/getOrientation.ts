window.addEventListener('deviceorientation', handleOrientation);

function handleOrientation(event) {
  const alpha = event.alpha; // Rotation around the Z-axis
  const beta = event.beta;   // Rotation around the X-axis
  const gamma = event.gamma; // Rotation around the Y-axis

  // Update the compass needle based on alpha value
  const needle = document.getElementById('needle');
  if (needle) {
    needle.style.transform = `rotate(${alpha}deg)`;
  }

  // Log beta and gamma values if needed for further calculations
  console.log(`beta: ${beta}, gamma: ${gamma}`);
}

// Check if DeviceOrientationEvent is supported
if (window.DeviceOrientationEvent) {
  console.log('DeviceOrientationEvent is supported');
} else {
  alert('DeviceOrientationEvent is not supported on your device/browser.');
}
