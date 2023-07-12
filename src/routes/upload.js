const express = require("express");
const fs = require("fs");

const uploadRoute = express.Router();

uploadRoute.post("/", async (req, res, next) => {
  console.log(req.files)
  let uploadFile = req.files.file;
  const name = uploadFile.name;
  const md5_filename = uploadFile.md5;
  const saveAs = `${md5_filename}_${name}`;
  await uploadFile.mv(`src/files/${saveAs}`);

//  res.send({message: 'success'})
});


module.exports = uploadRoute;
