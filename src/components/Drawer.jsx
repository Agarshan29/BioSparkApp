import React, { useCallback, useRef } from 'react';

function Drawer({ isOpen, children, width, setWidth }) {
  const isResizing = useRef(false);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing.current) return;
    const newWidth = Math.min(Math.max(e.clientX, 250), 600);
    setWidth(newWidth);
  }, [setWidth]);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    isResizing.current = true;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white shadow-lg border-r z-20 flex transition-transform duration-300 ease-in-out ${
        isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
      }`}
      style={{ width: `${width}px` }}
    >
      <div className="flex-grow overflow-y-auto">
        {children}
      </div>

      <div
        className="w-1 bg-gray-200 cursor-col-resize hover:bg-gray-300 transition-colors duration-150"
        onMouseDown={handleMouseDown}
        title="Resize Notes Panel"
      ></div>
    </div>
  );
}

export default Drawer;