import "../css/errorPopup.css";
import { IoAlertCircleSharp } from "react-icons/io5";

const ErrorPopup = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="sb-error-overlay" onClick={onClose}>
      <div className="sb-error-box" onClick={(e) => e.stopPropagation()}>
        <div className="sb-error-header">
          <IoAlertCircleSharp className="sb-error-icon" />
          <h3>Error</h3>
          <button className="sb-close-button" onClick={onClose}>×</button>
        </div>
        <div className="sb-error-body">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
