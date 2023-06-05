require("dotenv").config({ path: "../.env" });
const jwt = require('jsonwebtoken');
const db = require("../use-cases/model");

const jwtMiddleware = async (req, res, next) => {

  try {
    const token = req.headers.Authorization?.split(' ')[1] || req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const auth = await db.models.authModel.findOne({ where: { auth_string: token} });
    if (!auth) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = jwtMiddleware;