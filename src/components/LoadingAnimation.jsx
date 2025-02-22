// src/components/LoadingAnimation.js
import React, { useRef, useEffect } from "react";

const LoadingAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Safeguard against null canvas

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context for canvas");
      return;
    }

    // Set up canvas dimensions (full window or fixed size)
    const setCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    setCanvasSize(); // Initial size set

    // Handle window resize
    const handleResize = () => {
      setCanvasSize();
      // Trigger a redraw
      animate();
    };
    window.addEventListener("resize", handleResize);

    // Animation parameters (matching your p5.js code)
    const shearAngle = -Math.PI * 0.125; // -22.5 degrees in radians
    const count = 10; // Number of rectangles
    const w = 50; // Width of each rectangle
    const h = 50; // Height of each rectangle
    const gap = 12; // Gap between rectangles
    const totalWidth = count * w + (count - 1) * gap;
    const halfWidth = totalWidth * 0.5;
    const halfHeight = h * 0.5;

    // Animation loop
    let animationFrameId;

    const animate = () => {
      if (!ctx) return; // Ensure context exists

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      ctx.fillStyle = "black"; // Background color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Translate to center
      ctx.save();
      ctx.translate(canvas.width * 0.5 - halfWidth, canvas.height * 0.5);
      ctx.transform(1, 0, Math.tan(shearAngle), 1, 0, 0); // Shear transform

      const time = Date.now() * 0.005; // Animation speed
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const s = Math.sin((time - t * Math.PI * 0.75) % (2 * Math.PI)); // Wavy motion
        const weight = Math.map(s, -1, 1, 2, 8); // Map sine wave to stroke weight
        const x = t * totalWidth;
        const y = s * 8 - halfHeight;

        ctx.strokeStyle = "white"; // Rectangle color
        ctx.lineWidth = weight;
        ctx.strokeRect(x, y, w, h);
      }

      ctx.restore(); // Restore context
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Utility function to map values (similar to p5.js map)
  Math.map = function (value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1000, // Ensure it overlays other content
        background: "black", // Explicitly set background to ensure visibility
      }}
    />
  );
};

export default LoadingAnimation;
