require("dotenv").config();
const ErrorCode = require("../entities/errorcode");
const hash = require("../entities/hash");
const db = require("../use-cases/model");
var getIP = require('ipware')().get_ip;
const moment = require("moment");
const jwt = require("jsonwebtoken");
const config = process.env;
const auth = {
  authenticate: (req, res, next)  => {
    const { Authentication, Authorization } = req.headers;

    if (!Authorization) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, config.TOKEN_KEY);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    next();
  }
}

module.exports = auth;