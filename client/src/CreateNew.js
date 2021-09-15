import { useEffect, useState } from "react";
import Axios from "axios";
import "./CreateNew.css";
import { baseurl } from "./baseurl";

export default function CreateNew() {
  const [allLga, setAllLga] = useState([]);
  const [allWards, setWards] = useState([]);
  const [msg, setMsg] = useState("");
  const [puName, setpuName] = useState("");
  const [partyResults, setPartyResults] = useState([]);
  const [partyAbb, setPartyAbb] = useState("");
  const [partyScore, setPartyScore] = useState("");
  const [postLgaId, setPostLgaId] = useState(1);
  const [postWardId, setPostWardId] = useState(1);

  const savePary = () => {
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
  }, []);

  useEffect(() => {
    Axios.get(baseurl + `ward/${postLgaId}`).then((response) => {
      setWards(response.data);
      setPostWardId(response.data[0].ward_id);
    });
  }, [postLgaId]);

  const validInputs = () => {
    if (puName.trim().length === 0 || partyResults.length === 0) {
      setMsg(
        "Invalid Input. Please enter valid values in all text box. Note that party abbrevition should contain a maximum of 4 characters"
      );
      return false;
    }
    setMsg("");
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
        setMsg("New Polling Unit added Successfully!");
        setPartyResults([]);
        setpuName("");
      });
    }
  };

  return (
    <form
      className="main-content"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="title">
        <h3>create polling unit</h3>
      </div>
      <div className="form-content">
        <div
          className="msg"
          style={{ display: msg.trim().length === 0 ? "none" : "block" }}
        >
          {msg}
        </div>
        <div className="select-lga">
          <label htmlFor="lga">Select Local Government</label>
          <select
            onChange={(e) => setPostLgaId(e.target.value)}
            name="lga"
            id="lga"
            className="first-three"
          >
            {allLga.map((item) => (
              <option key={item.lga_id} value={item.lga_id}>
                {item.lga_name}
              </option>
            ))}
          </select>
        </div>
        <div className="select-ward">
          <label htmlFor="ward">Select Ward</label>
          <select
            onClick={(e) => setPostWardId(e.target.value)}
            name="ward"
            className="first-three"
            id="ward"
          >
            {allWards.map((item, i) => (
              <option key={i} value={item.ward_id}>
                {item.ward_name}
              </option>
            ))}
          </select>
        </div>
        <div className="unit-name">
          <label>Polling unit name</label>
          <input
            type="text"
            value={puName}
            className="first-three"
            onChange={(e) => setpuName(e.target.value)}
          />
        </div>
        <div className="party-box">
          <label>Parties:</label>
          {partyResults.map((item, i) => (
            <p key={i}>
              <span>{item.abbr}</span> <span>{item.score}</span>
            </p>
          ))}
        </div>
        <div className="party-detail">
          <label>abbrevition</label>
          <input
            type="text"
            value={partyAbb}
            onChange={(e) => {
              setPartyAbb(e.target.value);
            }}
          />
        </div>
        <div className="party-detail">
          <label>score</label>
          <input
            type="text"
            value={partyScore}
            onChange={(e) => {
              setPartyScore(e.target.value);
            }}
          />
        </div>
        <div className="add-party">
          <button onClick={() => savePary()}>add party</button>
        </div>
      </div>
      <div className="submit">
        <button onClick={() => createNewUnit()}>Create</button>
      </div>
    </form>
  );
}
