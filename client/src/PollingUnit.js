import react, { useEffect, useState } from "react";
import "./PollingUnits.css";
import Axios from "axios";
import { baseurl } from "./baseurl";

export default function PollingUnit() {
  const [allPollingUnits, setAllPollingUnits] = useState([]);

  const [onePollingUnit, setOnePollingUnit] = useState([]);
  const [unitId, setUnitId] = useState(null);

  const getParties = (idx) => {
    Axios.get(baseurl+`polling_units/polling_unit/${idx}`).then(
      (response) => {
        console.log(response.data);
        setOnePollingUnit(response.data);
        setUnitId(idx);
      }
    );
  };

  useEffect(() => {
    Axios.get(baseurl+"polling_units").then((response) => {
      setAllPollingUnits(response.data.rows);
    });

  }, []);

  return (
    <div className="allPollingUnits">
      {allPollingUnits.map((item) => (
        <div key={item.uniqueid}>
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
            {Object.keys(onePollingUnit).length === 0 ? "No data" :onePollingUnit.map((item) => (
              <p>
                <span>{item.party_abbreviation}</span>{" "}
                <span>{item.party_score}</span>
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
