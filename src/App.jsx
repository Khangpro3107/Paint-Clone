import { useEffect, useLayoutEffect, useRef, useState } from "react";
import getStroke from "perfect-freehand";
import {
  drawCircle,
  drawEllipse,
  drawSquare,
  drawLine,
  drawRectangle,
  distance,
  getCenter,
} from "./utils";

const App = () => {
  const [elements, setElements] = useState([]);
  const [tool, setTool] = useState("selection");
  const [action, setAction] = useState("none");
  const [selectedElement, setSelectedElement] = useState(null);

  const createElement = (index, x1, y1, x2, y2, type = null) => {
    if (type) return { index, x1, y1, x2, y2, type };
    return { index, x1, y1, x2, y2, type: tool };
  };

  const updateElement = (index, x1, y1, x2, y2, type) => {
    const newElement = createElement(index, x1, y1, x2, y2, type);
    const newElements = [...elements];
    newElements[index] = newElement;
    setElements(newElements);
  };

  const isWithinElement = (x, y, element) => {
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

  const getElementAtPosition = (currentX, currentY, elements) => {
    return elements.find((element) =>
      isWithinElement(currentX, currentY, element)
    );
  };

  const handleMouseDown = (e) => {
    const boundaryRect = document
      .getElementById("canvas")
      .getBoundingClientRect();
    const { clientX, clientY } = e;
    const currentX = clientX - boundaryRect.left;
    const currentY = clientY - boundaryRect.top;
    const index = elements.length;
    if (tool === "selection") {
      const element = getElementAtPosition(currentX, currentY, elements);
      if (element) {
        const offsetX = currentX - element.x1 
        const offsetY = currentY - element.y1
        setSelectedElement({...element, offsetX, offsetY});
        setAction("moving");
      }
    } else {
      setAction("drawing");
      const element = createElement(
        index,
        currentX,
        currentY,
        currentX,
        currentY
      );
      setElements([...elements, element]);
    }
  };

  const handleMouseMove = (e) => {
    if (action === "none") return;
    const boundaryRect = document
      .getElementById("canvas")
      .getBoundingClientRect();
    const { clientX, clientY } = e;
    const currentX = clientX - boundaryRect.left;
    const currentY = clientY - boundaryRect.top;
    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1, type } = elements[index];
      updateElement(index, x1, y1, currentX, currentY, type);
    } else if (action === "moving") {
      e.target.style.cursor = "move"
      const { index, x1, y1, x2, y2, type, offsetX, offsetY } = selectedElement;
      updateElement(
        index,
        currentX - offsetX,
        currentY - offsetY,
        currentX - offsetX + Math.abs(x2 - x1),
        currentY - offsetY + Math.abs(y2 - y1),
        type
      );
    }
  };

  const handleMouseUp = (e) => {
    if (action === "drawing") {
      e.target.style.cursor = "default"
      const index = elements.length - 1
      const createdElement = elements[index]
      const {x1, y1, x2, y2, type} = createdElement
      updateElement(index, Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2), type)
    }
    console.log(elements)
    setAction("none");
    setSelectedElement(null);
  };

  const draw = (element, context) => {
    const { x1, y1, x2, y2, type } = element;
    switch (type) {
      case "line":
        drawLine(x1, y1, x2, y2, context);
        break;
      case "rectangle":
        drawRectangle(x1, y1, x2, y2, context);
        break;
      case "circle":
        drawCircle(x1, y1, x2, y2, context);
        break;
      case "ellipse":
        drawEllipse(x1, y1, x2, y2, context);
        break;
      case "square":
        drawSquare(x1, y1, x2, y2, context);
        break;
    }
  };

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    elements.forEach((element) => {
      draw(element, context);
    });
  }, [elements]);

  return (
    <>
      <p className="text-red-500">Don't be stressed! Relax!</p>
      <div className="toolbar-container">
        <select name="tool" onChange={(e) => setTool(e.target.value)}>
          {[
            "Selection",
            "Line",
            "Rectangle",
            "Square",
            "Circle",
            "Ellipse",
          ].map((item) => (
            <option value={item.toLowerCase()} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <canvas
        id="canvas"
        className="border-2 border-indigo-500"
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseUp={(e) => handleMouseUp(e)}
        onMouseMove={(e) => handleMouseMove(e)}
        width={window.innerWidth / 2}
        height={window.innerHeight / 2}
      ></canvas>
    </>
  );
};

export default App;
