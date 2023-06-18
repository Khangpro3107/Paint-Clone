export const getCenter = (element) => {
  const { x1, y1, x2, y2, type } = element;
  return { x: x1 + Math.abs(x2 - x1) / 2, y: y1 + Math.abs(y2 - y1) / 2 };
};

export const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

export const isWithinElement = (x, y, element) => {
  const { x1, y1, x2, y2, type } = element;
  const center = getCenter(element);
  switch (type) {
    case "line":
      if (
        distance(x1, y1, x, y) +
          distance(x2, y2, x, y) -
          distance(x1, y1, x2, y2) <=
        1
      )
        return true;
      return false;
    case "square":
    case "rectangle":
      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) return true;
      return false;
    case "circle":
      const radius = Math.min(Math.abs(x1 - x2), Math.abs(y1 - y2)) / 2;
      if (distance(x, y, center.x, center.y) <= radius) return true;
      return false;
    case "ellipse":
      const radiusX = Math.abs(x1 - x2) / 2;
      const radiusY = Math.abs(y1 - y2) / 2;
      const equation =
        Math.pow(x - center.x, 2) / Math.pow(radiusX, 2) +
        Math.pow(y - center.y, 2) / Math.pow(radiusY, 2);
      if (equation <= 1) return true;
      return false;
    default:
      break;
  }
};