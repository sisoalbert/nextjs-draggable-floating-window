"use client";
import React, { useState, useEffect, useRef } from "react";

interface Position {
  x: number;
  y: number;
}

const FloatingWindow: React.FC = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [currentSize, setCurrentSize] = useState<{
    width: number;
    height: number;
  }>({ width: 200, height: 150 });
  const [initialMousePosition, setInitialMousePosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const targetClassName =
      event.target instanceof Element ? event.target.className : "";
    if (targetClassName.includes("resize-handle")) {
      setIsResizing(true);
    } else {
      setIsDragging(true);
      setInitialMousePosition({
        x: event.clientX - currentPosition.x,
        y: event.clientY - currentPosition.y,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        setCurrentPosition({
          x: event.clientX - initialMousePosition.x,
          y: event.clientY - initialMousePosition.y,
        });
      } else if (isResizing) {
        setCurrentSize({
          width:
            event.clientX - windowRef.current!.getBoundingClientRect().left,
          height:
            event.clientY - windowRef.current!.getBoundingClientRect().top,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, currentPosition, initialMousePosition]);

  return (
    <div
      ref={windowRef}
      style={{
        position: "fixed",
        backgroundColor: "white",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
        padding: "20px",
        zIndex: 1000,
        cursor: isDragging || isResizing ? "move" : "default",
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        width: `${currentSize.width}px`,
        height: `${currentSize.height}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="resize-handle"
        style={{
          position: "absolute",
          width: "10px",
          height: "10px",
          background: "gray",
          bottom: 0,
          right: 0,
          cursor: "se-resize",
        }}
        onMouseDown={handleMouseDown}
      />
      <h3>Floating Window</h3>
      <p>
        This is a floating window that can be dragged and resized around the
        screen.
      </p>
    </div>
  );
};

export default FloatingWindow;
