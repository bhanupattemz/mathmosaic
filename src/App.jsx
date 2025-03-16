import { Fragment, useEffect, useState } from 'react'
import Genpuzzle from "./Genpuzzle.jsx"
import './App.css'
import Header from "./Header"
import Footer from "./Footer"
function App() {
  const [gridSize, setGridSize] = useState(2);

  return (
    <Fragment>
      <Header setGridSize={setGridSize} />
      <main>
        <Genpuzzle key={gridSize} gridSize={gridSize} />
      </main>
      <Footer />
    </Fragment>
  );
}


export default App
