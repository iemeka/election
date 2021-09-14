import { useState } from "react";
import "./App.css";
import CreateNew from "./CreateNew";
import Lga from "./Lga";
import PollingUnit from "./PollingUnit";

function App() {
  const [content, setContent] = useState(null);
  return (
    <div className="container">
      <div>
        <button onClick={() => setContent(<PollingUnit />)}>
          polling unit result
        </button>
        <button onClick={() => setContent(<Lga />)}>government result</button>
        <button onClick={() => setContent(<CreateNew />)}>
          create polling unit
        </button>
      </div>
      <div>{content}</div>
    </div>
  );
}

export default App;
