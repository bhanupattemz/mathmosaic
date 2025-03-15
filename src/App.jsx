import { useState } from 'react'
import GenpuzzleImages from "./GenpuzzleImages"
import Genpuzzle from './GenPuzzle'
import './App.css'

function App() {
  const findShiftNum = (arr) => {
    if(!arr) return 0
    const original = [0, 1, 2, 3];
    return (original.indexOf(arr[0]) + original.length) % original.length;
  };
  const [gridSize, setGridSize] = useState(4)
  const [sol, setSol] = useState(Genpuzzle(gridSize))
  const puzzleImages = GenpuzzleImages(gridSize)
  if(!sol){
    return <div>Loading...</div>
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: "10px" }}>
      {puzzleImages.map((img, index) => (
        <img key={index} src={img} alt={`Grid ${index}`} width={50} height={50} style={{ transform: `rotate(${findShiftNum(sol[index]) * 90}deg)` }} />
      ))}
    </div>
  )
}

export default App
