import { useState, useRef, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResizableSidebarProps {
  children: ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
}

export function ResizableSidebar({
  children,
  defaultWidth = 400,
  minWidth = 300,
  maxWidth = 600,
  className,
}: ResizableSidebarProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
      setWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "relative bg-background border-r",
        isMobile ? "w-full lg:w-auto" : "",
        className
      )}
      style={isMobile ? {} : { width: `${width}px`, flexShrink: 0 }}
    >
      {children}

      {/* Resize handle - only show on desktop */}
      {!isMobile && (
        <div
          ref={resizerRef}
          className={cn(
            "absolute top-0 right-0 w-1 h-full cursor-col-resize bg-slate-600 hover:bg-primary/70 transition-colors",
            "before:absolute before:content-[''] before:w-3 before:h-full before:-left-1 before:top-0",
            isResizing && "bg-primary",
          )}
          onMouseDown={handleMouseDown}
        />
      )}

      {/* Resize indicator */}
      {isResizing && !isMobile && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-lg"
            style={{ left: `${width}px` }}
          />
        </div>
      )}
    </div>
  );
}
