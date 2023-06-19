import {
  faArrowPointer,
  faEraser,
  faPencil,
  faSlash,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle, faSquareFull } from "@fortawesome/free-regular-svg-icons";
import { images } from "../assets/index";

export const tools = [
  { tool: "Selection", icon: faArrowPointer },
  { tool: "Freehand", icon: faPencil },
  { tool: "Line", icon: faSlash },
  { tool: "Rectangle", icon: images.rectangle },
  { tool: "Square", icon: faSquareFull },
  { tool: "Ellipse", icon: images.ellipse },
  { tool: "Circle", icon: faCircle },
  { tool: "Eraser", icon: faEraser },
];
export const initialColors = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#0000ff",
  "#ffff00",
  "#00ffff",
  "#ff00ff",
  "#ee82ee",
  "#a52a2a",
  "#ffd700",
  "#f5f5dc",
  "#00ff00",
  "#008000"
];