import React from "react";

interface AlertProps {
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  return (
    <div
      style={alertStyle}
      onClick={onClose} // Close alert when clicked
    >
      {message}
    </div>
  );
};

// Styles for the alert notification
const alertStyle: React.CSSProperties = {
  position: "fixed",
  top: "20px",
  right: "20px",
  backgroundColor: "rgba(255, 0, 0, 0.8)",
  color: "white",
  padding: "15px",
  borderRadius: "5px",
  cursor: "pointer", // Indicating that it can be clicked
  zIndex: 9999,
};

export default Alert;
