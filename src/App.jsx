import React, { Fragment, useEffect, useState, useCallback } from "react";
import add from "./assets/symbols/add.png";
import multi from "./assets/symbols/multi.png";
import sub from "./assets/symbols/sub.png";
import divide from "./assets/symbols/divide.png";
import randomColor from "randomcolor";
import DragDrop from "./components/DragDrop";
import Loader from "./components/Loading";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [gridSize, setGridSize] = useState(3);
  const [gridImages, setGridImages] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [rotations, setRotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solution, setSolution] = useState([]);
  const [randomized, setRandomized] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const symbols = [add, sub, multi, divide];
  const cellSize = 200 / gridSize;

  const shiftArray = (arr, n) => [...arr.slice(-n), ...arr.slice(0, -n)];

  const randomRotate = useCallback(() => {
    setSolution([...gridImages]);
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
    setRandomized(true);
    setLoading(false)
  }, [gridData, gridImages, gridSize]);

  const transformToGridCells = (grid) => {
    const result = [];
    for (let i = 0; i < grid.length - 2; i += 2) {
      for (let j = 0; j < grid[i].length; j++) {
        if (j < grid[i + 1].length - 1 && j < grid[i + 2].length) {
          result.push([grid[i][j], grid[i + 1][j + 1], grid[i + 2][j], grid[i + 1][j]]);
        }
      }
    }
    return result;
  };

  const extractGridImages = useCallback((canvas) => {
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
  }, [cellSize, gridSize]);

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
    setRandomized(false);
    setLoading(true);
    setInitialized(false);

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
      setInitialized(true);
    };

    drawAllSymbols();
  }, [gridSize, extractGridImages]);

  useEffect(() => {
    if (!randomized && initialized && gridImages.length === gridSize * gridSize && gridData.length === gridSize * gridSize) {
      randomRotate();
    }
  }, [gridData, gridImages, gridSize, randomRotate, randomized, initialized]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Header setGridSize={setGridSize} />
      <main>
        <div className="genpuzzle">
          <div className="grid-container">
            <DragDrop urls={gridImages} rotations={rotations} gridData={gridData} setRotations={setRotations} solution={solution} />
          </div>
        </div>
      </main>
      <Footer />
    </Fragment>
  );
}

export default App;