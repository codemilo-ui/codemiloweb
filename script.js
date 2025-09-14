// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Start the WebGL fluid background
startFluidSimulation({
  canvas: document.getElementById('fluid'),
  densityDissipation: 0.98,
  velocityDissipation: 0.99,
  pressureIterations: 20,
  curl: 30,
  splatRadius: 0.005,
  colorPalette: [
    [0.0, 0.8, 1.0],
    [0.4, 0.0, 1.0],
    [1.0, 0.0, 0.8]
  ]
});
