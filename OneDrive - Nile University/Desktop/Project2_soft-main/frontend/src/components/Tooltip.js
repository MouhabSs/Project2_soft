import React, { useState, useRef } from "react";

export default function Tooltip({ children, text, position = "top", ariaLabel }) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef();

  function show() {
    timeoutRef.current = setTimeout(() => setVisible(true), 250);
  }
  function hide() {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  }

  return (
    <span className="tooltip-wrapper" onMouseEnter={show} onFocus={show} onMouseLeave={hide} onBlur={hide} tabIndex={0} aria-label={ariaLabel || text}>
      {children}
      {visible && (
        <span className={`tooltip-box tooltip-${position} fade-in`} role="tooltip">{text}</span>
      )}
    </span>
  );
}