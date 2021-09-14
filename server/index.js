const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./dbConfig");
const async = require("async");

//middleware
app.use(cors());
app.use(express.json()); // allows us to get access to request . body.

// ROUTES;

// 1
// Get all polling unit name;
// select uniqueid, polling_unit_name from polling_unit where uniqueid < \\28;
app.get("/polling_units", (req, res) => {
  const sQuery = "SELECT uniqueid, polling_unit_name FROM polling_unit;";
  pool.query(sQuery, (err, result) => {
    res.send(result);
  });
});

// Get all parties in a polling unit
// select party_abbreviation, party_score from announced_pu_results where polling_unit_uniqueid = '8';
app.get("/polling_units/polling_unit/:pUid", (req, res) => {
  let pUid = req.params.pUid;
  const sQuery =
    "SELECT party_abbreviation, party_score FROM announced_pu_results WHERE polling_unit_uniqueid = $1;";
  pool.query(sQuery, [pUid], (err, result) => {
    res.send(result.rows);
  });
});

// 2
// Get list of all local government;
// select lga_id, lga_name from lga;
app.get("/lga", (req, res) => {
  pool.query("SELECT lga_id, lga_name FROM lga", (err, result) => {
    res.send(result.rows);
  });
});

// Get list of all wards;
// select lga_id, lga_name from lga;
app.get("/ward", (req, res) => {
  pool.query("SELECT ward_id, ward_name FROM ward", (err, result) => {
    res.send(result.rows);
  });
});

// middleware for /lga/polling_units
const getUids = (req, res, next) => {
  const lgaId = req.params.lgaId;
  const pollingUnitsId = [];
  const sQuery =
    "SELECT uniqueid, polling_unit_name FROM polling_unit WHERE lga_id = $1;";
  pool.query(sQuery, [lgaId], (err, res) => {
    for (let row of res.rows) {
      pollingUnitsId.push(row.uniqueid);
    }
    req.puid = pollingUnitsId;
    next();
  });
};

// Get all parties in that polling unit
// select party_abbreviation, party_score from announced_pu_results where polling_unit_uniqueid = uniqueid;
const processUids = (req, res, next) => {
  const parties = {};
  const arr = req.puid;
  async.eachSeries(
    arr,
    function (i, callback) {
      const sQuery = `SELECT party_abbreviation, party_score FROM announced_pu_results WHERE polling_unit_uniqueid = $1`;
      pool.query(sQuery, [i], (reqErr, ires) => {
        for (let party of ires.rows) {
          parties[party.party_abbreviation.trim()] =
            (parties[party.party_abbreviation.trim()] | 0) + party.party_score;
        }
        callback(null);
      });
    },
    (err) => {
      if (err) console.log(err.message);
      res.send(parties);
    }
  );
};

// Get all polling unit under a local government
app.get("/lga/polling_units/:lgaId", getUids, processUids, (req, res) => {
  console.log(req);
});

// new Polling unit and result.
//"uniqueid", "polling_unit_id", "ward_id", "lga_id", "uniquewardid", "polling_unit_number", "polling_unit_name", "polling_unit_description", "lat", "long", "entered_by_user", "date_entered", "user_ip_address")
// New polling unit name, select local government, select ward, auto generate rest or put rubish - check database file for query

//  ("result_id", "polling_unit_uniqueid", "party_abbreviation", "party_score", "entered_by_user", "date_entered", "user_ip_address")
// input party abb and score. polling_unit uiniqueid should equal uniqueid. autogerate the rest.

const createPollingUnit = (req, res, next) => {
  const unitId = Math.floor(Math.random() * 15);
  const { wardId, lgaId, pollingUnitName } = req.body;
  const iQuery =
    "INSERT INTO polling_unit (polling_unit_id, ward_id, lga_id,polling_unit_name) VALUES ($1,$2,$3,$4)";
  pool.query(
    iQuery,
    [unitId, wardId, lgaId, pollingUnitName],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        req.unitId = unitId;
        next();
      }
    }
  );
};

const enterPartyResult = (req, res, next) => {
  // party abbreviation - upper case.
  // asyn iteration to add result for all party. [{party:score}, .., ..]
  const { partyResults } = req.body; // party score - [{abbr:abbr,score:score},..]

  const iQuery =
    "INSERT INTO announced_pu_results (polling_unit_uniqueid, party_abbreviation, party_score, entered_by_user, date_entered, user_ip_address) VALUES ($1, $2, $3, 'emeka', '2021-04-26', '192.168')";

  async.eachSeries(
    partyResults,
    function (party, callback) {
      pool.query(
        iQuery,
        [req.unitId, party.abbr.toUpperCase(), party.score],
        (reqErr, result) => {
          // console.log(result, reqErr);
          callback(null);
        }
      );
    },
    (err) => {
      if (err) console.log(err.message);

      res.send("success!!");
    }
  );
};

app.post("/new_polling_unit", createPollingUnit, enterPartyResult);

app.listen(5000, () => {
  console.log("running on port 5000");
});
