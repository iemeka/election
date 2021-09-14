import react, { useEffect, useState } from "react";
import { baseurl } from "./baseurl";
import "./Lga.css";
import Axios from "axios";

export default function Lga() {
  const [allLga, setAllLga] = useState([]);
  const [oneLga, setOneLga] = useState([]);
  const [lgaId, setLgaId] = useState(null);

  const getTotalResult = (idx) => {
    Axios.get(baseurl+`lga/polling_units/${idx}`).then(
      (response) => {
        console.log(response.data);
        setOneLga(response.data);
        setLgaId(idx);
      }
    );
  };
  useEffect(() => {
    Axios.get(baseurl+"lga").then((response) => {
      setAllLga(response.data);
    });
  }, []);
  return (
    <div className="allLga">
      {allLga.map((item) => (
        <div key={item.lga_id}>
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
  );
}
