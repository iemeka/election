import { useEffect, useState } from "react";
import Axios from "axios";
import { baseurl } from "./baseurl";

export default function PollingUnit() {
  const [allPollingUnits, setAllPollingUnits] = useState([]);

  const [onePollingUnit, setOnePollingUnit] = useState([]);
  const [unitId, setUnitId] = useState(null);

  const getParties = (idx) => {
    Axios.get(baseurl + `polling_units/polling_unit/${idx}`).then(
      (response) => {
        setOnePollingUnit(response.data);
        setUnitId(idx);
      }
    );
  };

  useEffect(() => {
    Axios.get(baseurl + "polling_units").then((response) => {
      setAllPollingUnits(response.data.rows);
    });
  }, []);

  const scroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="main-content">
      <div className="title">
        <h3>Polling Unit Result</h3>
      </div>
      {allPollingUnits.length === 0 ? (
        <span>Loading...</span>
      ) : (
        allPollingUnits.map((item) =>
          item.polling_unit_name === null ? null : item.polling_unit_name.trim()
              .length === 0 ? null : (
            <div key={item.uniqueid} className="list-item">
              <p onClick={() => getParties(item.uniqueid)}>
                {item.polling_unit_name}
                <button>view result</button>
              </p>
              <div
                className="sub-list"
                style={{
                  display: unitId === item.uniqueid ? "block" : "none",
                }}
              >
                {Object.keys(onePollingUnit).length === 0 ? (
                  <div className="no-data">No data</div>
                ) : (
                  onePollingUnit.map((item, i) => (
                    <p key={i}>
                      <span>{item.party_abbreviation}</span>{" "}
                      <span>{item.party_score}</span>
                    </p>
                  ))
                )}
              </div>
            </div>
          )
        )
      )}
      <button className="scroll" onClick={() => scroll()}>Up</button>
    </div>
  );
}
