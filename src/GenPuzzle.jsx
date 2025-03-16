import React, { useEffect, useState } from "react";
import add from "./assets/symbols/add.png";
import multi from "./assets/symbols/multi.png";
import sub from "./assets/symbols/sub.png";
import divide from "./assets/symbols/divide.png";
import randomColor from "randomcolor";
import DragDrop from "./DragDrop";
import "./App.css";
import Loader from "./Loading";

export default function Genpuzzle({ gridSize = 3 }) {
  const [gridImages, setGridImages] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [filled, setFilled] = useState(false);
  const [randomized, setRandomized] = useState(false);
  const [rotations, setRotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solution, setSolution] = useState([]);

  const symbols = [add, sub, multi, divide];
  const cellSize = 200 / gridSize;

  const shiftArray = (arr, n) => {
    return [...arr.slice(-n), ...arr.slice(0, -n)];
  };

  const randomRotate = () => {
    setSolution([...gridImages]);
    setLoading(true);
    let indices = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    const shuffledGrid = [];
    const shuffledImages = [];
    const newRotations = [];

    while (indices.length > 0) {
      const randIndex = Math.floor(Math.random() * indices.length);
      const selectedIndex = indices[randIndex];
      const randomRotation = Math.floor(Math.random() * 4);
      newRotations.push(randomRotation);
      shuffledGrid.push(shiftArray(gridData[selectedIndex], randomRotation));
      shuffledImages.push(gridImages[selectedIndex]);
      indices.splice(randIndex, 1);
    }

    setGridImages(shuffledImages);
    setGridData(shuffledGrid);
    setRotations(newRotations);
    setLoading(false);
  };

  const transformToGridCells = (grid) => {
    const result = [];
    console.log(grid)
    for (let i = 0; i < grid.length - 2; i += 2) {
      for (let j = 0; j < grid[i].length; j++) {
        if (j < grid[i + 1].length - 1 && j < grid[i + 2].length) {
          result.push([grid[i][j], grid[i + 1][j + 1], grid[i + 2][j], grid[i + 1][j]]);
        }
      }
    }
    return result;
  };

  const extractGridImages = (canvas) => {
    const ctx = canvas.getContext("2d");
    let images = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = cellSize;
        tempCanvas.height = cellSize;
        const tempCtx = tempCanvas.getContext("2d");

        tempCtx.drawImage(canvas, col * cellSize, row * cellSize, cellSize, cellSize, 0, 0, cellSize, cellSize);
        images.push(tempCanvas.toDataURL());
      }
    }

    setGridImages(images);
  };

  const drawOrientedSymbol = (ctx, symbolIndex, x, y) => {
    const img = new Image();
    img.src = symbols[symbolIndex];
    
    return new Promise((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, x, y, 32, 32);
        resolve();
      };
    });
  };

  useEffect(() => {
    if (!filled) {
      setFilled(true);
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = randomColor();
      ctx.fillRect(0, 0, 200, 200);

      let num = gridSize + 1;
      let yPos = -16;
      const symbolsData = [];
      const newGridData = [];

      for (let i = 0; i < 2 * gridSize + 1; i++) {
        num = num === gridSize ? gridSize + 1 : gridSize;
        let xPos = num % 2 !== (gridSize % 2 === 0 ? 0 : 1) ? -16 : 200 / (gridSize * 2) - 16;

        const row = [];
        for (let j = 0; j < num; j++) {
          const n = Math.floor(Math.random() * symbols.length);
          row.push(n);
          symbolsData.push({ symbolIndex: n, xPos, yPos });
          xPos += 200 / gridSize;
        }

        newGridData.push(row);
        yPos += 200 / (gridSize * 2);
      }

      const transformedData = transformToGridCells(newGridData);
      setGridData(transformedData);

      const drawAllSymbols = async () => {
        for (const symbolData of symbolsData) {
          await drawOrientedSymbol(ctx, symbolData.symbolIndex, symbolData.xPos, symbolData.yPos);
        }
        extractGridImages(canvas);
      };
      
      drawAllSymbols();
    }
  }, [gridSize, filled]);

  useEffect(() => {
    if (gridImages.length === gridSize * gridSize && gridData.length === gridSize * gridSize && !randomized) {
      setRandomized(true);
      randomRotate();
    }
  }, [gridData, gridImages]);
  
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="genpuzzle">
      <div className="grid-container">
        <DragDrop urls={gridImages} rotations={rotations} gridData={gridData} setRotations={setRotations} solution={solution} />
      </div>
    </div>
  );
}