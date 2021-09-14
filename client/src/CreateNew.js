import react, { useEffect, useState } from "react";
import Axios from "axios";
import "./CreateNew.css";
import { baseurl } from "./baseurl";

export default function CreateNew() {
  const [allLga, setAllLga] = useState([]);
  const [allWards, setWards] = useState([]);
  const [errMsg, setErrorMsg] = useState("");
  const [puName, setpuName] = useState("");
  const [partyResults, setPartyResults] = useState([]);
  const [partyAbb, setPartyAbb] = useState("");
  const [partyScore, setPartyScore] = useState("");
  const [postLgaId, setPostLgaId] = useState(0);
  const [postWardId, setPostWardId] = useState(0);

  const savePary = () => {
    // party max lenght is 4 else data base returns error.
    if (
      partyScore.length === 0 ||
      partyAbb.length === 0 ||
      partyAbb.length > 4 ||
      isNaN(Number(partyScore))
    )
      return;
    setPartyResults([
      ...partyResults,
      { abbr: partyAbb, score: Number(partyScore) },
    ]);
    setPartyAbb("");
    setPartyScore("");
  };

  useEffect(() => {
    Axios.get(baseurl + "lga").then((response) => {
      setAllLga(response.data);
    });
    Axios.get(baseurl + "ward").then((response) => {
      setWards(response.data);
    });
  }, []);

  const validInputs = () => {
    if (puName.trim().length === 0 || partyResults.length === 0) {
      setErrorMsg(
        "Invalid Input. Please enter valid values in all text box. Note that party abbrevition should contain a maximum of 4 characters"
      );
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const createNewUnit = () => {
    if (validInputs()) {
      Axios.post(baseurl + `new_polling_unit`, {
        wardId: Number(postWardId),
        lgaId: Number(postLgaId),
        pollingUnitName: puName,
        partyResults: partyResults,
      }).then((response) => {
        console.log(response);
        setErrorMsg("New Polling Unit added Successfully!");
      });
    }
  };

  return (
    <div className="App">
      <div className="new-unit">
        <div>{errMsg}</div>
        <div>
          <label htmlFor="lga">Select Local Government</label>
          <select
            onChange={(e) => setPostLgaId(e.target.value)}
            name="lga"
            id="lga"
          >
            {allLga.map((item) => (
              <option key={item.lga_id} value={item.lga_id}>
                {item.lga_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ward">Select Ward</label>
          <select
            onClick={(e) => setPostWardId(e.target.value)}
            name="ward"
            id="ward"
          >
            {allWards.map((item, i) => (
              <option key={i} value={item.ward_id}>
                {item.ward_name}
              </option>
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
            {partyResults.map((item, i) => (
              <p key={i}>
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
  );
}
