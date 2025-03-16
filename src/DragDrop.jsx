import React, { useEffect, useState, useCallback, Fragment } from "react";
import { CheckSolution } from "./SolvePuzzle";
import "./App.css"
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function DragDrop({ urls, rotations, gridData, setRotation, solution }) {
  const [state, setState] = useState({
    dragItems: urls,
    droppedItems: Array(urls.length).fill(null),
    griddata: [...gridData],
    solved: false,
    curr: null,
    count: 0
  });
  const [open, setOpen] = useState(false)

  const { dragItems, droppedItems, griddata, solved, curr, count } = state;
  console.log(gridData)

  const handleDragStart = useCallback((e, index, isFromDropZone = false) => {
    e.dataTransfer.setData("index", index);
    e.dataTransfer.setData("isFromDropZone", isFromDropZone);
  }, []);

  const handleDrop = useCallback(
    (e, dropIndex) => {
      e.preventDefault();

      const dragIndex = parseInt(e.dataTransfer.getData("index"));
      const isFromDropZone = e.dataTransfer.getData("isFromDropZone") === "true";

      setState((prev) => {
        const newState = { ...prev };
        const newDragItems = [...newState.dragItems];
        const newDroppedItems = [...newState.droppedItems];
        const newGriddata = [...newState.griddata];
        const newRotations = [...rotations];
        if (!isFromDropZone) {
          if (newDroppedItems[dropIndex] !== null) {
            newDragItems.push(newDroppedItems[dropIndex].url);
            newRotations.push(newDroppedItems[dropIndex].rotations);
            newGriddata.push(newDroppedItems[dropIndex].data);
          }
          
          newDroppedItems[dropIndex] = {
            data: newGriddata[dragIndex],
            url: newDragItems[dragIndex],
            rotations: newRotations[dragIndex],
          };

          newDragItems.splice(dragIndex, 1);
          newRotations.splice(dragIndex, 1);
          newGriddata.splice(dragIndex, 1);
        } else {
          const temp = newDroppedItems[dropIndex];
          newDroppedItems[dropIndex] = newDroppedItems[dragIndex];
          newDroppedItems[dragIndex] = temp;
        }

        return {
          ...newState,
          dragItems: newDragItems,
          droppedItems: newDroppedItems,
          griddata: newGriddata,
          count: prev.count + 1
        };
      });
    },
    [rotations]
  );

  const handleDragToSource = useCallback((e) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("index"));
    const isFromDropZone = e.dataTransfer.getData("isFromDropZone") === "true";

    if (isFromDropZone && droppedItems[dragIndex]) {
      setState((prev) => {
        const newState = { ...prev };
        const newDragItems = [...newState.dragItems];
        const newDroppedItems = [...newState.droppedItems];
        const newGriddata = [...newState.griddata];
        const newRotations = [...rotations];

        newDragItems.push(newDroppedItems[dragIndex].url);
        newRotations.push(newDroppedItems[dragIndex].rotations);
        newGriddata.push(newDroppedItems[dragIndex].data);
        newDroppedItems[dragIndex] = null;

        return {
          ...newState,
          dragItems: newDragItems,
          droppedItems: newDroppedItems,
          griddata: newGriddata,
        };
      });
    }
  }, [droppedItems, rotations]);

  const rightRotate = useCallback((idx, n = 1) => {
    const rotationCount = n % 4;
    if (rotationCount === 0 || !droppedItems[idx]) return;

    setState((prev) => {
      const newState = { ...prev };
      const newDroppedItems = [...newState.droppedItems];
      const item = { ...newDroppedItems[idx] };

      item.rotations = (item.rotations + rotationCount + 4) % 4;
      if (item.data) {
        const cellData = [...item.data];
        for (let i = 0; i < rotationCount; i++) {
          const temp = cellData.pop();
          cellData.unshift(temp);
        }
        item.data = cellData;
      }

      newDroppedItems[idx] = item;
      return { ...newState, droppedItems: newDroppedItems, count: prev.count + 1 };
    });
  }, [droppedItems]);

  const leftRotate = useCallback((idx, n = 1) => {
    const rotationCount = n % 4;
    if (rotationCount === 0 || !droppedItems[idx]) return;

    setState((prev) => {
      const newState = { ...prev };
      const newDroppedItems = [...newState.droppedItems];
      const item = { ...newDroppedItems[idx] };

      item.rotations = (item.rotations - rotationCount + 4) % 4;
      if (item.data) {
        const cellData = [...item.data];
        for (let i = 0; i < rotationCount; i++) {
          const temp = cellData.shift();
          cellData.push(temp);
        }
        item.data = cellData;
      }

      newDroppedItems[idx] = item;
      return { ...newState, droppedItems: newDroppedItems, count: prev.count + 1 };
    });
  }, [droppedItems]);

  useEffect(() => {
    if (dragItems.length === 0 && droppedItems.every((item) => item !== null)) {
      
      if (CheckSolution(droppedItems)) {
        setState((prev) => ({ ...prev, solved: true }));
      }
    }
  }, [dragItems, droppedItems]);



  useEffect(() => {
    if (solved) {
      let data = JSON.parse(localStorage.getItem("games")) || []
      data.unshift({ size: Math.sqrt(droppedItems.length), count: count, date: Date.now() })
      localStorage.setItem("games", JSON.stringify(data))
    }
  }, [solved])

  return (
    <Fragment>
      {solution &&
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            "& .MuiDialog-paper": {
              minWidth: "250px",
              minHeight: "200px",
              textAlign: "center",
              padding: "20px",
              borderRadius: "12px",
            },
          }}
        >
          <DialogTitle>HINT</DialogTitle>
          <div className="solution-images">
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.sqrt(solution.length)}, 0fr)`, gap: "0px" }}>
              {solution.map((img, index) => (
                <img key={index} src={img} alt={`Grid ${index}`}/>
              ))}
            </div>
          </div>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>}
      <Dialog
        open={solved}
        onClose={() => setState((prev) => ({ ...prev, solved: false }))}
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "300px",
            minHeight: "200px",
            textAlign: "center",
            padding: "20px",
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle>
          <FaCheckCircle style={{ transform: "translateY(5px)", marginRight: "10px" }} color="green" size={32} />
          Success!
        </DialogTitle>
        <DialogContent>
          <p style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>
            The puzzle was solved successfully!
          </p>
          <p style={{ fontSize: "16px", color: "#555" }}>
            You completed it in <b>{count}</b> moves.
          </p>
        </DialogContent>
        <DialogActions>
          <a href="/">
            <Button
              onClick={() => setState((prev) => ({ ...prev, solved: false }))}
              sx={{
                backgroundColor: "#4CAF50",
                color: "#fff",
                "&:hover": { backgroundColor: "#388E3C" },
              }}
            >
              Close
            </Button>
          </a>

        </DialogActions>
      </Dialog>
      <div className="drag-drop-container">
        <div className="count-container">
          <p><b>Count:</b> {count}</p>
        </div>
        <div className="count-container">
          <p style={{ color: "green", cursor: "pointer" }} onClick={() => setOpen(true)}>HINT!</p>
        </div>
        <div className="drag-drop-div">
          <div
            className="drag-source"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDragToSource}
          >
            {dragItems.map((item, index) => (
              <div
                key={`source-${index}`}
                className="drag-item"
                draggable
                onDragStart={(e) => handleDragStart(e, index, false)}
              >
                <img
                  src={item}
                  alt="puzzle"
                  style={{
                    transform: `rotate(${rotations[index] * 90}deg)`,
                  }}
                />
              </div>
            ))}
          </div>
          <div>
            {isFinite(curr + 1) && (
              <div className="rotate-buttons">
                <button onClick={() => leftRotate(curr)}>Rotate Left {<FaArrowRotateLeft />}</button>
                <button onClick={() => rightRotate(curr)}>Rotate Right {<FaArrowRotateRight />}</button>
              </div>
            )}

            <div className="drop-container">
              <div
                className="drop-grid"
                style={{
                  gridTemplateColumns: `repeat(${Math.sqrt(urls.length)}, 0fr)`,
                }}
              >
                {Array(urls.length)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      key={`drop-${index}`}
                      className={`drop-cell ${curr === index ? "active" : ""}`}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => {
                        if (droppedItems[index]) {
                          setState((prev) => ({
                            ...prev,
                            curr: prev.curr === index ? null : index,
                          }));
                        }
                      }}
                      onDoubleClick={() => {
                        if (droppedItems[index]) {
                          rightRotate(index);
                        }
                      }}
                    >
                      {droppedItems[index] && (
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, index, true)}
                          style={{ width: "100%", height: "100%" }}
                        >
                          <img
                            src={droppedItems[index].url}
                            alt="puzzle"
                            style={{
                              transform: `rotate(${droppedItems[index].rotations * 90}deg)`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {solved && (
          <div className="solved-message">Puzzle Solved!</div>
        )}
        <a href="/">
          <button className="solve-button">
            Referesh
          </button>
        </a>
      </div>
    </Fragment>

  );
}