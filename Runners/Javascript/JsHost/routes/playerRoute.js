const express = require("express");
const router = express.Router();

router.post("/load", (req, res, next) => {
  res.json({ "message" : "POST request to the test homepage" })
});

router.post("/init", (req, res, next) => {
  res.json({ "message" : "DELETE request to the test homepage" })
});

router.post("/movenext", (req, res, next) => {
    res.json({ "message" : "DELETE request to the test homepage" })
});

router.get("/name", (req, res, next) => {
    res.send("GET request to the test homepage");
});

module.exports = router