import React, { useEffect, useState, useCallback, Fragment } from "react";
import { CheckSolution } from "../SolvePuzzle";
import "../App.css"
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function DragDrop({ urls, rotations, gridData, solution, setKey }) {
  const [dragItems, setDragItems] = useState([]);
  const [gridItems, setGridItems] = useState(Array(urls.length).fill(null));
  const [solved, setSolved] = useState(false);
  const [curr, setCurr] = useState(null);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [touchItem, setTouchItem] = useState(null);
  const [touchSource, setTouchSource] = useState(false);
  const [touchStartPos, setTouchStartPos] = useState(null);
  
  console.log(dragItems)
  const handleDragStart = useCallback((e, index, isFromDropZone = false) => {
    e.dataTransfer.setData("index", index);
    e.dataTransfer.setData("isFromDropZone", isFromDropZone);
  }, []);

  const handleTouchStart = useCallback((e, index, isFromDropZone = false) => {
    e.preventDefault();
   
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setTouchItem({ index, isFromDropZone });
    setTouchSource(isFromDropZone ? false : true);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (touchItem) {
      e.preventDefault();
    }
  }, [touchItem]);

  const handleTouchEnd = useCallback((e, dropIndex) => {
    if (touchItem) {
      const { index: dragIndex, isFromDropZone } = touchItem;
      
      if (dragIndex !== dropIndex || !isFromDropZone) {
        if (!isFromDropZone) {
          if (gridItems[dropIndex] !== null) {
            setDragItems(prev => [...prev, gridItems[dropIndex]]);
          }
          setGridItems(prev => prev.map((item, inx) =>
            inx === dropIndex ? dragItems[dragIndex] : item
          ));
          setDragItems(prev => prev.filter((_, inx) => inx !== dragIndex));
        } else {
          setGridItems(prev => {
            const newData = [...prev];
            const temp = newData[dropIndex];
            newData[dropIndex] = newData[dragIndex];
            newData[dragIndex] = temp;
            return newData;
          });
        }
        setCount(prev => prev + 1);
      }
      setTouchItem(null);
      setTouchStartPos(null);
    }
  }, [dragItems, gridItems, touchItem]);

  const handleTouchEndSource = useCallback((e) => {
    if (touchItem && touchItem.isFromDropZone) {
      const { index: dragIndex } = touchItem;
      if (gridItems[dragIndex]) {
        setDragItems(prev => [...prev, gridItems[dragIndex]]);
        setGridItems(prev => prev.map((item, inx) =>
          inx === dragIndex ? null : item
        ));
        setCount(prev => prev + 1);
      }
      setTouchItem(null);
      setTouchStartPos(null);
    }
  }, [gridItems, touchItem]);

  const handleDrop = useCallback(
    (e, dropIndex) => {
      e.preventDefault();
      const dragIndex = parseInt(e.dataTransfer.getData("index"));
      const isFromDropZone = e.dataTransfer.getData("isFromDropZone") === "true";

      if (!isFromDropZone) {
        if (gridItems[dropIndex] !== null) {
          setDragItems(prev => [...prev, gridItems[dropIndex]]);
        }
        setGridItems(prev => prev.map((item, inx) =>
          inx === dropIndex ? dragItems[dragIndex] : item
        ));
        setDragItems(prev => prev.filter((_, inx) => inx !== dragIndex));
      } else {
        setGridItems(prev => {
          const newData = [...prev];
          const temp = newData[dropIndex];
          newData[dropIndex] = newData[dragIndex];
          newData[dragIndex] = temp;
          return newData;
        });
      }
      setCount(prev => prev + 1);
    },
    [dragItems, gridItems]
  );

  const handleDragToSource = useCallback((e) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("index"));
    const isFromDropZone = e.dataTransfer.getData("isFromDropZone") === "true";

    if (isFromDropZone && gridItems[dragIndex]) {
      setDragItems(prev => [...prev, gridItems[dragIndex]]);
      setGridItems(prev => prev.map((item, inx) =>
        inx === dragIndex ? null : item
      ));
      setCount(prev => prev + 1);
    }
  }, [gridItems]);
  const rightRotate = useCallback((idx) => {
    if (idx === undefined || idx === null) return;

    if (gridItems[idx]) {
      setGridItems(prev => prev.map((item, inx) => {
        if (inx === idx && item) {
          return {
            ...item,
            rotations: (item.rotations || 0) + 1,
            data: [item.data[3], item.data[0], item.data[1], item.data[2]]
          };
        }
        return item;
      }));
    }
    setCount(prev => prev + 1);
  }, [gridItems]);

  const leftRotate = useCallback((idx) => {
    if (idx === undefined || idx === null) return;

    if (gridItems[idx]) {
      setGridItems(prev => prev.map((item, inx) => {
        if (inx === idx && item) {
          return {
            ...item,
            rotations: (item.rotations || 0) - 1,
            data: [item.data[1], item.data[2], item.data[3], item.data[0]]
          };
        }
        return item;
      }));
    }
    setCount(prev => prev + 1);
  }, [gridItems]);

  useEffect(() => {
    if (dragItems.length === 0 && gridItems.every((item) => item !== null)) {
      if (CheckSolution(gridItems)) {
        setSolved(true);
        let data = JSON.parse(localStorage.getItem("games") || "[]");
        let score = Math.ceil((gridItems.length * 10 / count) * 100)
        data.unshift({ size: Math.sqrt(gridItems.length), count: count, date: Date.now(), score });
        localStorage.setItem("games", JSON.stringify(data));
      }
    }
  }, [dragItems, gridItems]);
  const handleRefresh = () => {
    setKey(prev => prev + 1);
    setDragItems([]);
    setGridItems(Array(urls.length).fill(null));
    setSolved(false);
    setCurr(null);
    setCount(0);
  };

  useEffect(() => {
    if (urls && gridData && rotations) {
      setDragItems(urls.map((item, inx) => ({
        image: item,
        rotations: rotations[inx],
        data: gridData[inx]
      })));
    }
  }, [urls, gridData, rotations]);

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
          <p style={{ fontSize: "16px", color: "#555" }}>
          Each time you view a hint, your move count will increase by 2.
          </p>
          <div className="solution-images">
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.sqrt(solution.length)}, 0fr)`, gap: "0px" }}>
              {solution.map((img, index) => (
                <img key={index} src={img} alt={`Grid ${index}`} />
              ))}
            </div>
          </div>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>}
      <Dialog
        open={solved}
        onClose={() => {
          setSolved(false);
          setCount(0);
        }}
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
            "Great job! You solved it in <b>{count}</b> moves and earned a Score of <b>{Math.ceil((gridItems.length * 10 / count) * 100)}</b>! Keep going!"
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSolved(false);
              handleRefresh()
            }}
            sx={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              "&:hover": { backgroundColor: "#388E3C" },
            }}
          >
            Close
          </Button>

        </DialogActions>
      </Dialog>
      <div className="drag-drop-container">
        <div className="count-container">
          <p><b>Count:</b> {count}</p>
        </div>
        <div className="count-container">
          <p style={{ color: "green", cursor: "pointer" }} onClick={() => {setOpen(true);setCount(prev=>prev+2)}}>HINT!</p>
        </div>
        <div className="drag-drop-div">
          <div
            className="drag-source"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDragToSource}
            onTouchEnd={handleTouchEndSource}
            onTouchMove={handleTouchMove}
          >
            {dragItems.map((item, index) => (
              <div
                key={`source-${index}`}
                className={`drag-item ${touchItem && touchItem.index === index && !touchItem.isFromDropZone ? "touch-dragging" : ""}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index, false)}
                onTouchStart={(e) => handleTouchStart(e, index, false)}
              >
                <img
                  src={item.image}
                  alt="puzzle"
                  style={{
                    transform: `rotate(${(item.rotations || 0) * 90}deg)`,
                    opacity: touchItem && touchItem.index === index && !touchItem.isFromDropZone ? 0.5 : 1
                  }}
                />
              </div>
            ))}
          </div>
          <div>
          <div className="rotate-buttons">
                <button onClick={() => leftRotate(curr)}>Rotate Left {<FaArrowRotateLeft />}</button>
                <button onClick={() => rightRotate(curr)}>Rotate Right {<FaArrowRotateRight />}</button>
              </div>
            <div className="drop-container">
              <div
                className="drop-grid"
                style={{
                  gridTemplateColumns: `repeat(${Math.sqrt(urls.length)}, 0fr)`,
                }}
              >
                {gridItems.map((item, index) => (
                  <div
                    key={`drop-${index}`}
                    className={`drop-cell ${curr === index ? "active" : ""} ${touchItem && !touchSource ? "touch-active" : ""}`}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    onTouchEnd={() => handleTouchEnd(null, index)}
                    onTouchMove={handleTouchMove}
                    onClick={() => {
                      if (item) {
                        setCurr(prev => (prev === index ? null : index));
                      }
                    }}
                    onDoubleClick={() => {
                      if (item) {
                        rightRotate(index);
                      }
                    }}
                  >
                    {item && (
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, index, true)} 
                        onTouchStart={(e) => handleTouchStart(e, index, true)}
                        style={{ 
                          width: "100%", 
                          height: "100%" 
                        }}
                      >
                        <img
                          src={item.image}
                          alt="puzzle"
                          style={{
                            transform: `rotate(${(item.rotations || 0) * 90}deg)`,
                            opacity: touchItem && touchItem.index === index && touchItem.isFromDropZone ? 0.5 : 1
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
        <button className="solve-button" onClick={() => handleRefresh()}>
          Refresh
        </button>

      </div>
    </Fragment>
  );
}