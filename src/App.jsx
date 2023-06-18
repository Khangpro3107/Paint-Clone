import { useEffect, useLayoutEffect, useState } from "react";
import Button from "./components/Button";
import {
  faArrowRotateBackward,
  faArrowRotateForward,
  faFill
} from "@fortawesome/free-solid-svg-icons";
import { tools, initialColors } from "./utils/lists";
import { draw } from "./utils/draw";
import { isWithinElement } from './utils/calculation';

const useHistory = (initialState) => {
  const [history, setHistory] = useState([initialState]);
  const [index, setIndex] = useState(0);

  const setState = (action, overwrite = false) => {
    const newState =
      typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  const undo = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };
  const redo = () => {
    if (index < history.length - 1) setIndex((prev) => prev + 1);
  };

  return [history[index], setState, undo, redo];
};

const App = () => {
  const [elements, setElements, undo, redo] = useHistory([]);
  const [coordinates, setCoordinates] = useState(null);
  const [tool, setTool] = useState("selection");
  const [action, setAction] = useState("none");
  const [selectedElement, setSelectedElement] = useState(null);
  const [globalFillColor, setGlobalFillColor] = useState("#ffffff");
  const [globalStrokeColor, setGlobalStrokeColor] = useState("#000000");
  const [globalStrokeWidth, setGlobalStrokeWidth] = useState(6);
  const [isFilled, setIsFilled] = useState(false);
  const [canvasSize, setCanvasSize] = useState({
    width: 1400,
    height: 600,
  });

  const createElement = (
    index,
    x1,
    y1,
    x2,
    y2,
    strokeColor,
    fillColor,
    strokeWidth,
    type = null,
    points = []
  ) => {
    if (type)
      return {
        index,
        x1,
        y1,
        x2,
        y2,
        strokeColor,
        fillColor,
        strokeWidth,
        type,
        points,
      };
    return {
      index,
      x1,
      y1,
      x2,
      y2,
      strokeColor,
      fillColor,
      strokeWidth,
      type: tool,
      points,
    };
  };
  const updateElement = (
    index,
    x1,
    y1,
    x2,
    y2,
    strokeColor,
    fillColor,
    strokeWidth,
    type,
    points = []
  ) => {
    const newElement = createElement(
      index,
      x1,
      y1,
      x2,
      y2,
      strokeColor,
      fillColor,
      strokeWidth,
      type,
      points
    );
    const newElements = [...elements];
    newElements[index] = newElement;
    setElements(newElements, true);
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
        const offsetX = currentX - element.x1;
        const offsetY = currentY - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
        setAction("moving");
        setElements((prevState) => prevState);
      }
    } else {
      setAction("drawing");
      if (tool === "freehand" || tool === "eraser") {
        const element = createElement(
          index,
          currentX,
          currentY,
          currentX,
          currentY,
          tool === "eraser" ? "#ffffff" : globalStrokeColor,
          isFilled ? globalFillColor : null,
          globalStrokeWidth,
          tool,
          [[currentX, currentY]]
        );
        setElements((prevState) => [...prevState, element]);
      } else {
        const element = createElement(
          index,
          currentX,
          currentY,
          currentX,
          currentY,
          globalStrokeColor,
          isFilled ? globalFillColor : null,
          globalStrokeWidth
        );
        setElements((prevState) => [...prevState, element]);
      }
    }
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const boundaryRect = document
      .getElementById("canvas")
      .getBoundingClientRect();
    const currentX = clientX - boundaryRect.left;
    const currentY = clientY - boundaryRect.top;
    setCoordinates({ x: Math.floor(currentX), y: Math.floor(currentY) });
    if (action === "none") return;
    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1, strokeColor, fillColor, strokeWidth, type, points } =
        elements[index];
      updateElement(
        index,
        x1,
        y1,
        currentX,
        currentY,
        strokeColor,
        fillColor,
        strokeWidth,
        type,
        [...points, [currentX, currentY]]
      );
    } else if (action === "moving") {
      e.target.style.cursor = "move";
      const {
        index,
        x1,
        y1,
        x2,
        y2,
        strokeColor,
        fillColor,
        strokeWidth,
        type,
        offsetX,
        offsetY,
      } = selectedElement;
      if (type !== "line") {
        updateElement(
          index,
          currentX - offsetX,
          currentY - offsetY,
          currentX - offsetX + Math.abs(x2 - x1),
          currentY - offsetY + Math.abs(y2 - y1),
          strokeColor,
          fillColor,
          strokeWidth,
          type
        );
      } else {
        let tempY = currentY - offsetY;
        if (y1 < y2) tempY += Math.abs(y2 - y1);
        else tempY -= Math.abs(y2 - y1);
        updateElement(
          index,
          currentX - offsetX,
          currentY - offsetY,
          currentX - offsetX + Math.abs(x2 - x1),
          tempY,
          strokeColor,
          fillColor,
          strokeWidth,
          type
        );
      }
    }
  };

  const handleMouseUp = (e) => {
    e.target.style.cursor = "default";
    if (action === "drawing") {
      const index = elements.length - 1;
      const createdElement = elements[index];
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
      } = createdElement;
      if (type !== "line")
        updateElement(
          index,
          Math.min(x1, x2),
          Math.min(y1, y2),
          Math.max(x1, x2),
          Math.max(y1, y2),
          strokeColor,
          fillColor,
          strokeWidth,
          type,
          points
        );
      else {
        if (x1 < x2 || (x1 === x2 && y1 < y2))
          updateElement(
            index,
            x1,
            y1,
            x2,
            y2,
            strokeColor,
            fillColor,
            strokeWidth,
            type
          );
        else
          updateElement(
            index,
            x2,
            y2,
            x1,
            y1,
            strokeColor,
            fillColor,
            strokeWidth,
            type
          );
      }
    }
    setAction("none");
    setSelectedElement(null);
  };

  const handleMouseLeave = (e) => {
    setAction("none");
    setSelectedElement(null);
    setCoordinates(null);
  };

  const handleClearCanvas = () => {
    setElements([]);
  };

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    elements.forEach((element) => {
      draw(element, context);
    });
  }, [elements, canvasSize]);

  useEffect(() => {
    const undoRedoFunction = (event) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        (event.key === "z" || event.key === "Z")
      ) {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  return (
    <>
      <div className="toolbar-container flex flex-row flex-wrap p-2 justify-evenly gap-x-5 bg-[#f0f0f0]">
        <div className="tools-container flex flex-row justify-start items-center gap-x-1 p-1 w-1/6 flex-wrap border-2 border-black rounded-md">
          {tools.map((toolItem) => (
            <Button
              onClick={() => setTool(toolItem.tool.toLowerCase())}
              key={toolItem.tool}
              icon={toolItem.icon}
              borderColor={tool === toolItem.tool.toLowerCase() && "black"}
            />
          ))}
        </div>
        <div className="colors-container w-2/5 flex flex-col gap-y-1 border-2 border-black rounded-md">
          <div className="flex flex-row gap-x-1 p-1">
            <div className="color-picker flex flex-row flex-wrap items-center w-[20%] justify-between">
              <label htmlFor="strokeColor" className="me-2">
                Stroke
              </label>
              <input
                id="strokeColor"
                className="w-[40px]"
                type="color"
                name="color"
                onChange={(e) => setGlobalStrokeColor(e.target.value)}
                value={globalStrokeColor}
              />
            </div>
            <div className="color-buttons flex flex-row flex-wrap gap-1">
              {initialColors.map((initialColor) => (
                <Button
                  onClick={() => setGlobalStrokeColor(initialColor)}
                  key={initialColor}
                  color={initialColor}
                />
              ))}
            </div>
          </div>
          <hr className="border-[1px] border-gray-300 w-[90%] m-auto" />
          <div className="flex flex-row gap-x-1 p-1">
            <div className="color-picker flex flex-row flex-wrap items-center w-[20%] justify-between">
              <div className="flex flex-row">
                <label className="me-2">Fill</label>
                <Button
                  onClick={() => setIsFilled((state) => !state)}
                  icon={faFill}
                  borderColor={isFilled ? "#000000" : null}
                />
              </div>
              {isFilled ? (
                <input
                  id="fillColor"
                  className="w-[40px]"
                  type="color"
                  name="color"
                  onChange={(e) => setGlobalFillColor(e.target.value)}
                  value={globalFillColor}
                />
              ) : null}
            </div>
            <div className="color-buttons flex flex-row flex-wrap gap-1">
              {isFilled
                ? initialColors.map((initialColor) => (
                    <Button
                      onClick={() => setGlobalFillColor(initialColor)}
                      key={initialColor}
                      color={initialColor}
                    />
                  ))
                : null}
            </div>
          </div>
        </div>
        <div className="other-tools flex flex-row gap-x-1 p-1">
          <Button icon={faArrowRotateBackward} onClick={undo} />
          <Button icon={faArrowRotateForward} onClick={redo} />
        </div>
        <div className="other-tools flex flex-col p-1">
          <label htmlFor="strokeWidth">Line width: {globalStrokeWidth}</label>
          <input
            type="range"
            max="16"
            min="3"
            id="strokeWidth"
            onChange={(e) => setGlobalStrokeWidth(e.target.value)}
            value={globalStrokeWidth}
          />
        </div>
        <form className="flex flex-col justify-around">
          <legend>
            Canvas size: {canvasSize.width} x {canvasSize.height}px
          </legend>
          <label htmlFor="canvasWidth">Width</label>
          <input
            id="canvasWidth"
            type="range"
            min="200"
            max="1400"
            onChange={(e) =>
              setCanvasSize({ ...canvasSize, width: e.target.value })
            }
            value={canvasSize.width}
          />
          <label htmlFor="canvasHeight">Height</label>
          <input
            id="canvasHeight"
            type="range"
            min="200"
            max="600"
            onChange={(e) =>
              setCanvasSize({ ...canvasSize, height: e.target.value })
            }
            value={canvasSize.height}
          />
        </form>
        <div className="">
          <button
            className="border-none rounded-md bg-red-100 p-2 text-red-500"
            onClick={handleClearCanvas}
          >
            Clear canvas
          </button>
        </div>
      </div>
      <canvas
        id="canvas"
        style={{ boxShadow: "10px 10px 15px -9px rgba(0,0,0,0.75)" }}
        className="mt-1 ms-1"
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseUp={(e) => handleMouseUp(e)}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseLeave={(e) => handleMouseLeave(e)}
        width={canvasSize.width}
        height={canvasSize.height}
      ></canvas>
      <div className="fixed bottom-0 w-full h-[50px] bg-[#f0f0f0] flex flex-row flex-wrap items-center p-2">
        <div className="h-full w-[30%] flex flex-row items-center">
          {coordinates ? (
            <p>{`${coordinates.x}, ${coordinates.y} px`}</p>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default App;