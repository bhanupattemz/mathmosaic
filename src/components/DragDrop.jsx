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
import { MdTipsAndUpdates } from "react-icons/md";

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
  const [touchCurrentPos, setTouchCurrentPos] = useState(null);
  const [touchOverElement, setTouchOverElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((e, index, isFromDropZone = false) => {
    e.dataTransfer.setData("index", index);
    e.dataTransfer.setData("isFromDropZone", isFromDropZone);
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback((e, index, isFromDropZone = false) => {
    e.stopPropagation();
    if (gridItems[index]) {
      setCurr(index)
    }
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setTouchCurrentPos({ x: touch.clientX, y: touch.clientY });
    setTouchItem({ index, isFromDropZone });
    setTouchSource(isFromDropZone ? false : true);
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!touchItem) return;

    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    setTouchCurrentPos({ x: touch.clientX, y: touch.clientY });
    const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
    const dropCell = elementsAtPoint.find(el =>
      el.classList.contains('drop-cell') ||
      el.closest('.drop-cell')
    );
    const dragSource = elementsAtPoint.find(el =>
      el.classList.contains('drag-source') ||
      el.closest('.drag-source')
    );

    if (dropCell) {
      const actualCell = dropCell.classList.contains('drop-cell') ?
        dropCell : dropCell.closest('.drop-cell');
      const dropIndex = parseInt(actualCell.getAttribute('data-index'));
      setTouchOverElement({ type: 'cell', index: dropIndex });
    } else if (dragSource) {
      setTouchOverElement({ type: 'source' });
    } else {
      setTouchOverElement(null);
    }
  }, [touchItem]);

  const handleTouchEnd = useCallback((e) => {
    if (!touchItem) return;
    e.preventDefault();
    e.stopPropagation();

    const { index: dragIndex, isFromDropZone } = touchItem;
    if (touchOverElement && touchOverElement.type === 'cell') {
      const dropIndex = touchOverElement.index;
      setCurr(dropIndex)
      if (dragIndex !== dropIndex) {
        setCount(prev => prev + 1);
      }
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

      }
    }
    else if (touchOverElement && touchOverElement.type === 'source' && isFromDropZone) {
      if (gridItems[dragIndex] !== null) {
        setDragItems(prev => [...prev, gridItems[dragIndex]]);
        setGridItems(prev => prev.map((item, inx) =>
          inx === dragIndex ? null : item
        ));
        setCount(prev => prev + 1);
      }
    }

    setTouchItem(null);
    setTouchStartPos(null);
    setTouchCurrentPos(null);
    setTouchOverElement(null);
    setIsDragging(false);
  }, [dragItems, gridItems, touchItem, touchOverElement]);

  const handleDrop = useCallback(
    (e, dropIndex) => {
      e.preventDefault();
      e.stopPropagation();

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
      setIsDragging(false);
    },
    [dragItems, gridItems]
  );

  const handleDragToSource = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const dragIndex = parseInt(e.dataTransfer.getData("index"));
    const isFromDropZone = e.dataTransfer.getData("isFromDropZone") === "true";

    if (isFromDropZone && gridItems[dragIndex]) {
      setDragItems(prev => [...prev, gridItems[dragIndex]]);
      setGridItems(prev => prev.map((item, inx) =>
        inx === dragIndex ? null : item
      ));
      setCount(prev => prev + 1);
    }
    setIsDragging(false);
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
  }, [dragItems, gridItems, count]);

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

  useEffect(() => {
    const handleDocumentTouchMove = (e) => {
      if (isDragging) {
        e.preventDefault();
        handleTouchMove(e);
      }
    };

    const handleDocumentTouchEnd = (e) => {
      if (isDragging) {
        handleTouchEnd(e);
      }
    };
    document.addEventListener('touchmove', handleDocumentTouchMove, { passive: false });
    document.addEventListener('touchend', handleDocumentTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleDocumentTouchMove);
      document.removeEventListener('touchend', handleDocumentTouchEnd);
    };
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  const TouchDragGhost = () => {
    if (!touchItem || !touchCurrentPos) return null;

    const item = touchItem.isFromDropZone ? gridItems[touchItem.index] : dragItems[touchItem.index];
    if (!item) return null;

    const ghostStyle = {
      position: 'fixed',
      left: touchCurrentPos.x - 40,
      top: touchCurrentPos.y - 40,
      zIndex: 1000,
      pointerEvents: 'none',
      opacity: 0.8,
      borderRadius: '4px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    };

    return (
      <div style={ghostStyle}>
        <img
          src={item.image}
          alt="dragging"
          style={{
            transform: `rotate(${(item.rotations || 0) * 90}deg)`,
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    );
  };

  return (
    <Fragment>
      {solution &&
       <Dialog
       open={open}
       onClose={() => setOpen(false)}
       sx={{
         "& .MuiDialog-paper": {
           minWidth: "300px",
           minHeight: "250px",
           textAlign: "center",
           padding: "24px",
           borderRadius: "16px",
           backgroundColor: "#ffffff",
           color: "#0a2540",
           boxShadow: "0 8px 32px rgba(10, 37, 64, 0.15)"
         },
       }}
     >
       <h3 style={{ 
         margin: "0px", 
         display: "flex", 
         alignItems: "center", 
         justifyContent: "center",
         fontSize: "28px",
         fontWeight: "600",
         color: "#1a73e8"
       }}>
         <MdTipsAndUpdates style={{ 
           marginRight: "12px", 
           color: "#1a73e8" 
         }} size={36} />
         HINT
       </h3>
     
       <p style={{ 
         fontSize: "16px", 
         color: "#4285f4", 
         margin: "20px 0",
         padding: "10px",
         backgroundColor: "rgba(66, 133, 244, 0.08)",
         borderRadius: "8px",
         fontWeight: "500"
       }}>
         Each time you view a hint, your move count will increase by 2.
       </p>
       
       <div className="solution-images" style={{
         padding: "10px",
         backgroundColor: "rgba(66, 133, 244, 0.05)",
         borderRadius: "8px",
         margin: "0 auto 20px",
         display: "inline-block"
       }}>
         <div style={{ 
           display: "grid", 
           gridTemplateColumns: `repeat(${Math.sqrt(solution.length)}, 0fr)`, 
           gap: "0px",
           boxShadow: "0 4px 12px rgba(26, 115, 232, 0.1)"
         }}>
           {solution.map((img, index) => (
             <img 
               key={index} 
               src={img} 
               alt={`Grid ${index}`}
               style={{
                 border: "1px solid rgba(26, 115, 232, 0.2)"
               }}
             />
           ))}
         </div>
       </div>
       
       <DialogActions sx={{ justifyContent: "center", paddingTop: "10px" }}>
         <Button 
           onClick={() => setOpen(false)}
           sx={{
             backgroundColor: "#1a73e8",
             color: "white",
             fontWeight: "bold",
             padding: "8px 24px",
             borderRadius: "8px",
             "&:hover": {
               backgroundColor: "#0d64d8",
             }
           }}
         >
           Got it!
         </Button>
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
            Great job! You solved it in <b>{count}</b> moves and earned a Score of <b>{Math.ceil((gridItems.length * 10 / count) * 100)}</b>! Keep going!
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
          <p style={{ color: "red", cursor: "pointer" }} onClick={() => { setOpen(true); setCount(prev => prev + 2) }}>HINT!</p>
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
                    className={`drop-cell ${curr === index ? "active" : ""} 
                      ${touchOverElement && touchOverElement.type === 'cell' && touchOverElement.index === index ? "touch-target" : ""}`}
                    data-index={index}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => {
                      if (!isDragging && item) {
                        setCurr(prev => (prev === index ? null : index));
                      }
                    }}
                    onDoubleClick={() => {
                      if (!isDragging && item) {
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
      {TouchDragGhost()}
    </Fragment>
  );
}