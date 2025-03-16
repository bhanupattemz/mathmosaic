import loadingImg from "../assets/loading.gif"

export default function PuzzleAnimation() {
 

  return (
    <div
      id="puzzleContainer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#fff",
      }}
    >
      <img src={loadingImg} alt="loading" style={{width:"250px"}}/>
    </div>
  );
}
