import React, { useEffect, useRef, useState } from "react";
import add from "./assets/symbols/add.png";
import multi from "./assets/symbols/multi.png";
import sub from "./assets/symbols/sub.png";
import divide from "./assets/symbols/divide.png";
import randomColor from "randomcolor";

export default function Genpuzzle(gridSize = 3) {

  const filledRef = useRef(false);
  const symbols = [add, multi, divide, sub];
  const [gridImages, setGridImages] = useState([]);
  const cellSize = 200 / gridSize;

  const extractGridImages = (canvas) => {
    const ctx = canvas.getContext("2d");
    let images = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = cellSize;
        tempCanvas.height = cellSize;
        const tempCtx = tempCanvas.getContext("2d");

        tempCtx.drawImage(
          canvas,
          col * cellSize,
          row * cellSize,
          cellSize,
          cellSize,
          0,
          0,
          cellSize,
          cellSize
        );

        images.push(tempCanvas.toDataURL());
      }
    }

    setGridImages(images);
  };

  useEffect(() => {
    if (!filledRef.current) {
      filledRef.current = true;
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = randomColor();
      ctx.fillRect(0, 0, 200, 200);

      let num = Math.random() < 0.5 ? gridSize : gridSize + 1;
      let yPos = -16;

      const images = [];

      for (let i = 0; i < (2 * gridSize + 1); i++) {
        num = num === gridSize ? gridSize + 1 : gridSize;
        let xPos = (num % 2 !== (gridSize % 2 === 0 ? 0 : 1)) ? -16 : (200 / (gridSize * 2) - 16);
        for (let j = 0; j < num; j++) {
          const img = new Image();
          const n = Math.floor(Math.random() * symbols.length);
          img.src = symbols[n];
          images.push({ img, xPos, yPos });
          xPos += 200 / gridSize;
        }
        yPos += 200 / (gridSize * 2);
      }

      let loadedCount = 0;
      images.forEach(({ img, xPos, yPos }) => {
        img.onload = () => {
          ctx.drawImage(img, xPos, yPos, 32, 32);
          loadedCount++;
          if (loadedCount === images.length) extractGridImages(canvas);
        };
      });
    }
  }, []);

  return gridImages;
}
