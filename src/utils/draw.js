export const drawLine = (
  x1,
  y1,
  x2,
  y2,
  strokeColor,
  fillColor,
  strokeWidth,
  context
) => {
  context.strokeStyle = strokeColor;
  context.lineWidth = strokeWidth;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.closePath();
  context.stroke();
};

export const drawRectangle = (
  x1,
  y1,
  x2,
  y2,
  strokeColor,
  fillColor,
  strokeWidth,
  context
) => {
  context.strokeStyle = strokeColor;
  context.fillStyle = fillColor;
  context.lineWidth = strokeWidth;
  context.beginPath();
  const upperLeftX = Math.min(x1, x2);
  const upperLeftY = Math.min(y1, y2);
  const width = Math.abs(x1 - x2);
  const height = Math.abs(y1 - y2);
  context.rect(upperLeftX, upperLeftY, width, height);
  context.stroke();
  if (fillColor) context.fill();
};

export const drawSquare = (
  x1,
  y1,
  x2,
  y2,
  strokeColor,
  fillColor,
  strokeWidth,
  context
) => {
  context.strokeStyle = strokeColor;
  context.fillStyle = fillColor;
  context.lineWidth = strokeWidth;
  context.beginPath();
  const upperLeftX = Math.min(x1, x2);
  const upperLeftY = Math.min(y1, y2);
  const width = Math.min(Math.abs(x1 - x2), Math.abs(y1 - y2));
  context.rect(upperLeftX, upperLeftY, width, width);
  context.stroke();
  if (fillColor) context.fill();
};

export const drawCircle = (
  x1,
  y1,
  x2,
  y2,
  strokeColor,
  fillColor,
  strokeWidth,
  context
) => {
  context.strokeStyle = strokeColor;
  context.fillStyle = fillColor;
  context.lineWidth = strokeWidth;
  context.beginPath();
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const radius = Math.min(Math.abs(x1 - x2), Math.abs(y1 - y2)) / 2;
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  context.stroke();
  if (fillColor) context.fill();
};

export const drawEllipse = (
  x1,
  y1,
  x2,
  y2,
  strokeColor,
  fillColor,
  strokeWidth,
  context
) => {
  context.strokeStyle = strokeColor;
  context.fillStyle = fillColor;
  context.lineWidth = strokeWidth;
  context.beginPath();
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const radiusX = Math.abs(x1 - x2) / 2;
  const radiusY = Math.abs(y1 - y2) / 2;
  context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  context.stroke();
  if (fillColor) context.fill();
};

export const drawFreehand = (
  points,
  strokeColor,
  fillColor,
  strokeWidth,
  context
) => {
  context.strokeStyle = strokeColor;
  context.lineWidth = strokeWidth;
  context.lineJoin = "round";
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
  }
};

export const draw = (element, context) => {
  const {
    x1,
    y1,
    x2,
    y2,
    strokeColor,
    fillColor,
    strokeWidth,
    type,
    points,
  } = element;
  switch (type) {
    case "line":
      drawLine(x1, y1, x2, y2, strokeColor, fillColor, strokeWidth, context);
      break;
    case "rectangle":
      drawRectangle(
        x1,
        y1,
        x2,
        y2,
        strokeColor,
        fillColor,
        strokeWidth,
        context
      );
      break;
    case "circle":
      drawCircle(
        x1,
        y1,
        x2,
        y2,
        strokeColor,
        fillColor,
        strokeWidth,
        context
      );
      break;
    case "ellipse":
      drawEllipse(
        x1,
        y1,
        x2,
        y2,
        strokeColor,
        fillColor,
        strokeWidth,
        context
      );
      break;
    case "square":
      drawSquare(
        x1,
        y1,
        x2,
        y2,
        strokeColor,
        fillColor,
        strokeWidth,
        context
      );
      break;
    case "freehand":
    case "eraser":
      drawFreehand(points, strokeColor, fillColor, strokeWidth, context);
      break;
  }
};