const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scale = 200; // Scale factor for projection
const d = 2; // Distance to the projection plane

canvas.width = 800;
canvas.height = 600;

// Project a 3D point onto the 2D canvas
function project({ x, y, z }) {
  return {
    x: canvas.width / 2 + (d * x / z) * scale,
    y: canvas.height / 2 - (d * y / z) * scale,
  };
}

// Draw the XOZ plane
function drawXOZPlane() {
  const gridSize = 10; // Number of lines in each direction
  const step = 1; // Distance between grid lines in 3D space

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 0.5;

  // Draw grid lines parallel to the X-axis
  for (let z = -gridSize; z <= gridSize; z++) {
    ctx.beginPath();
    let start = project({ x: -gridSize, y: 0, z });
    let end = project({ x: gridSize, y: 0, z });
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  // Draw grid lines parallel to the Z-axis
  for (let x = -gridSize; x <= gridSize; x++) {
    ctx.beginPath();
    let start = project({ x, y: 0, z: -gridSize });
    let end = project({ x, y: 0, z: gridSize });
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  // Draw the X and Z axes
  ctx.strokeStyle = "#f00";
  ctx.lineWidth = 2;

  // X-axis
  ctx.beginPath();
  let xStart = project({ x: -gridSize, y: 0, z: 0 });
  let xEnd = project({ x: gridSize, y: 0, z: 0 });
  ctx.moveTo(xStart.x, xStart.y);
  ctx.lineTo(xEnd.x, xEnd.y);
  ctx.stroke();

  // Z-axis
  ctx.beginPath();
  let zStart = project({ x: 0, y: 0, z: -gridSize });
  let zEnd = project({ x: 0, y: 0, z: gridSize });
  ctx.moveTo(zStart.x, zStart.y);
  ctx.lineTo(zEnd.x, zEnd.y);
  ctx.stroke();
}

// Draw the plane
drawXOZPlane();
