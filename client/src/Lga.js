import { useEffect, useState } from "react";
import { baseurl } from "./baseurl";
import Axios from "axios";

export default function Lga() {
  const [allLga, setAllLga] = useState([]);
  const [oneLga, setOneLga] = useState([]);
  const [lgaId, setLgaId] = useState(null);

  const getTotalResult = (idx) => {
    Axios.get(baseurl + `lga/polling_units/${idx}`).then((response) => {
      setOneLga(response.data);
      setLgaId(idx);
    });
  };
  useEffect(() => {
    Axios.get(baseurl + "lga").then((response) => {
      setAllLga(response.data);
    });
  }, []);
  return (
    <div className="main-content">
      <div className="title">
        <h3>local government Result</h3>
      </div>
      {allLga.length === 0 ? (
        <span>Loading...</span>
      ) : (
        allLga.map((item) => (
          <div key={item.lga_id} className="list-item">
            <p onClick={() => getTotalResult(item.lga_id)}>
              {item.lga_name} <button>view result</button>
            </p>
            <div className="sub-list"
              style={{
                display: lgaId === item.lga_id ? "block" : "none",
              }}
            >
              {Object.keys(oneLga).length !== 0
                ? Object.keys(oneLga).map((item,i) => (
                    <p key={i}>
                      <span>{item}</span> <span>{oneLga[item]}</span>
                    </p>
                  ))
                : <div className="no-data">No data</div> }
            </div>
          </div>
        ))
      )}
    </div>
  );
}
