import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function PuzzleAnimation() {
  const controls = {
    br: useAnimation(),
    bl: useAnimation(),
    tl: useAnimation(),
    tr: useAnimation(),
  };

  useEffect(() => {
    async function animatePieces() {
      while (true) {
        await Promise.all([
          controls.br.start({ scale: 0.7, transition: { duration: 0.5, ease: "easeOut" } }),
          controls.bl.start({ scale: 0.7, transition: { duration: 0.5, ease: "easeOut" } }),
          controls.tl.start({ scale: 0.7, transition: { duration: 0.5, ease: "easeOut" } }),
          controls.tr.start({ scale: 0.7, transition: { duration: 0.5, ease: "easeOut" } }),
        ]);

        await Promise.all([
          controls.br.start({ scale: 1, transition: { duration: 0.5, ease: "easeInOut" } }),
          controls.bl.start({ scale: 1, transition: { duration: 0.5, ease: "easeInOut" } }),
          controls.tl.start({ scale: 1, transition: { duration: 0.5, ease: "easeInOut" } }),
          controls.tr.start({ scale: 1, transition: { duration: 0.5, ease: "easeInOut" } }),
        ]);
      }
    }

    animatePieces();
  }, []);

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
      <motion.svg
        version="1.1"
        id="puzzle"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="224 -224 512 512"
        style={{ width: "120px", cursor: "pointer" }}
        animate={{
          rotate: [0, 360], // Full circular rotation
          x: [0, 50, 0, -50, 0], // Moves left & right
          y: [0, 50, 0, -50, 0], // Moves up & down
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.path
          id="br"
          className="piece"
          fill="#84DCC6"
          d="M660,17c0-33-27-60-60-60c-33,0-60,27-60,60c0,5.1,0.6,10.2,1.8,15H525h-45v61.9
      c4.9-1.2,9.9-1.9,15-1.9c33.1,0,60,26.9,60,60s-26.9,60-60,60c-5.1,0-10.1-0.6-15-1.9V288h211c24.9,0,45-20.1,45-45V32h-77.8
      C659.4,27.2,660,22.1,660,17z"
          animate={controls.br}
        />
        <motion.path
          id="bl"
          className="piece"
          fill="#FFA69E"
          d="M495,212c33.1,0,60-26.9,60-60s-26.9-60-60-60c-5.1,0-10.1,0.6-15,1.9V32h-15h-46.9
      c1.2,4.9,1.9,9.9,1.9,15c0,33.1-26.9,60-60,60s-60-26.9-60-60c0-5.1,0.6-10.1,1.9-15H224v211c0,24.9,20.1,45,45,45h196h15v-77.9
      C484.9,211.4,489.9,212,495,212z"
          animate={controls.bl}
        />
        <motion.path
          id="tl"
          className="piece"
          fill="#FF686B"
          d="M300,47c0,33.1,26.9,60,60,60s60-26.9,60-60c0-5.1-0.6-10.1-1.9-15H465h15v-61.8
      c-4.8,1.2-9.9,1.8-15,1.8c-33,0-60-27-60-60c0-33,27-60,60-60c5.1,0,10.2,0.6,15,1.8V-224H269c-24.9,0-45,20.1-45,45V32h77.9
      C300.6,36.9,300,41.9,300,47z"
          animate={controls.tl}
        />
        <motion.path
          id="tr"
          className="piece"
          fill="#A5FFD6"
          d="M691-224H525h-45v77.8c-4.8-1.2-9.9-1.8-15-1.8c-33,0-60,27-60,60c0,33,27,60,60,60
      c5.1,0,10.2-0.6,15-1.8V32h45h16.8c-1.2-4.8-1.8-9.9-1.8-15c0-33,27-60,60-60c33,0,60,27,60,60c0,5.1-0.6,10.2-1.8,15H736v-211
      C736-203.9,715.9-224,691-224z"
          animate={controls.tr}
        />
      </motion.svg>
    </div>
  );
}
