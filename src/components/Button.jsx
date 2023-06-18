import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = ({ icon, color, borderColor, onClick }) => {
  return (
    <div
      style={{ borderColor: borderColor ? borderColor : "gray" }}
      className="w-7 h-7 border-[3px]"
    >
      <button
        style={color && { backgroundColor: color }}
        className="w-full h-full"
        onClick={onClick}
      >
        {icon &&
          (typeof icon === "string" ? (
            <img src={icon} className="" />
          ) : (
            <FontAwesomeIcon icon={icon} className="" />
          ))}
      </button>
    </div>
  );
};

export default Button;
