export const drawLine = (x1, y1, x2, y2, context) => {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.closePath();
  context.stroke();
}

export const drawRectangle = (x1, y1, x2, y2, context) => {
  context.beginPath();
  const upperLeftX = Math.min(x1, x2);
  const upperLeftY = Math.min(y1, y2);
  const width = Math.abs(x1 - x2);
  const height = Math.abs(y1 - y2);
  context.rect(upperLeftX, upperLeftY, width, height);
  context.stroke();
};

export const drawSquare = (x1, y1, x2, y2, context) => {
  context.beginPath();
  const upperLeftX = Math.min(x1, x2);
  const upperLeftY = Math.min(y1, y2);
  const width = Math.min(Math.abs(x1 - x2), Math.abs(y1 - y2));
  context.rect(upperLeftX, upperLeftY, width, width);
  context.stroke();
};

export const drawCircle = (x1, y1, x2, y2, context) => {
  context.beginPath();
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const radius = Math.min(Math.abs(x1 - x2), Math.abs(y1 - y2)) / 2;
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  context.stroke();
};

export const drawEllipse = (x1, y1, x2, y2, context) => {
  context.beginPath();
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const radiusX = Math.abs(x1 - x2) / 2;
  const radiusY = Math.abs(y1 - y2) / 2;
  context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  context.stroke();
};

export const getCenter = (element) => {
  const {x1, y1, x2, y2, type} = element
  return {x: x1 + Math.abs(x2 - x1) / 2, y: y1 + Math.abs(y2 - y1) / 2}
}

export const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}