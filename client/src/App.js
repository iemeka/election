import react, { useEffect, useState } from "react";
import "./App.css";

import Axios from "axios";

function App() {
  const [allPollingUnits, setAllPollingUnits] = useState([]);
  const [allLga, setAllLga] = useState([]);
  const [allWards, setWards] = useState([]);
  const [onePollingUnit, setOnePollingUnit] = useState([]);
  const [oneLga, setOneLga] = useState([]);
  const [unitId, setUnitId] = useState(null);
  const [lgaId, setLgaId] = useState(null);
  const [puName, setpuName] = useState("");
  const [partyResults, setPartyResults] = useState([]);
  const [partyAbb, setPartyAbb] = useState("");
  const [partyScore, setPartyScore] = useState("");
  const [postLgaId, setPostLgaId] = useState(0);
  const [postWardId, setPostWardId] = useState(0);

  const savePary = () => {
    // party max lenght is 4 else data base returns error.
    if (partyScore.length === 0 || partyAbb.length === 0 || isNaN(Number(partyScore))) return;
    setPartyResults([...partyResults, { abbr: partyAbb, score: Number(partyScore) }]);
    setPartyAbb("");
    setPartyScore("");
  };

  useEffect(() => {
    Axios.get("http://localhost:5000/polling_units").then((response) => {
      setAllPollingUnits(response.data.rows);
    });
    Axios.get("http://localhost:5000/lga").then((response) => {
      setAllLga(response.data);
    });
    Axios.get("http://localhost:5000/ward").then((response) => {
      setWards(response.data);
    });
  }, []);

  const getParties = (idx) => {
    Axios.get(`http://localhost:5000/polling_units/polling_unit/${idx}`).then(
      (response) => {
        console.log(response.data);
        setOnePollingUnit(response.data);
        setUnitId(idx);
      }
    );
  };

  const getTotalResult = (idx) => {
    Axios.get(`http://localhost:5000/lga/polling_units/${idx}`).then(
      (response) => {
        console.log(response.data);
        setOneLga(response.data);
        setLgaId(idx);
      }
    );
  };

  const createNewUnit = () => {
    // do validataions.
    Axios.post(`http://localhost:5000/new_polling_unit`,{wardId:Number(postWardId), lgaId:Number(postLgaId), pollingUnitName:puName,partyResults:partyResults}).then(
      (response) => {
        console.log(response)
      }
    );
  }

  return (
    <div className="App">
      <div className="top"></div>
      <div className="content">
        <div className="allPollingUnits" style={{ display: "none" }}>
          {allPollingUnits.map((item) => (
            <div>
              <p onClick={() => getParties(item.uniqueid)}>
                {item.polling_unit_name}
              </p>
              <div
                className="parties"
                style={{
                  height: "auto",
                  background: "lightgrey",
                  display: unitId === item.uniqueid ? "block" : "none",
                }}
              >
                {onePollingUnit.map((item) => (
                  <p>
                    <span>{item.party_abbreviation}</span>{" "}
                    <span>{item.party_score}</span>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="allLga" style={{ display: "none" }}>
          {allLga.map((item) => (
            <div>
              <p onClick={() => getTotalResult(item.lga_id)}>{item.lga_name}</p>
              <div
                style={{
                  height: "auto",
                  background: "lightgrey",
                  display: lgaId === item.lga_id ? "block" : "none",
                }}
              >
                {Object.keys(oneLga).length !== 0
                  ? Object.keys(oneLga).map((item) => (
                      <p>
                        <span>{item}</span> <span>{oneLga[item]}</span>
                      </p>
                    ))
                  : "No Data"}
              </div>
            </div>
          ))}
        </div>
        <div className="new-unit">
          <div>
            <label for="lga">Select Local Government</label>
            <select onChange={(e)=> setPostLgaId(e.target.value)} name="lga" id="lga">
              {allLga.map((item) => (
                <option value={item.lga_id} >{item.lga_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label for="ward">Select Ward</label>
            <select  onClick={(e)=> setPostWardId(e.target.value)} name="ward" id="ward">
              {allWards.map((item) => (
                <option value={item.ward_id}>{item.ward_name}</option>
              ))}
            </select>
          </div>
          <div>
            Polling unit name
            <input type="text" onChange={(e) => setpuName(e.target.value)} />
          </div>
          <div>
            <div className="party-box">
              <span>added Parties</span>
              {partyResults.map((item) => (
                <p>
                  {item.abbr}-{item.score}
                </p>
              ))}
            </div>
            name
            <input
              type="text"
              value={partyAbb}
              onChange={(e) => {
                setPartyAbb(e.target.value);
              }}
            />
            score
            <input
              type="text"
              value={partyScore}
              onChange={(e) => {
                setPartyScore(e.target.value);
              }}
            />
            <button onClick={() => savePary()}>add party</button>
          </div>
          <button onClick={() => createNewUnit()}>Create</button>
        </div>
      </div>
    </div>
  );
}

export default App;
