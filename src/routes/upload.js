const express = require("express");
const md5 = require("md5");
const formData = require("express-form-data");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const uploadRoute = express.Router();


uploadRoute.post("/", (req, res, next) => {
  
  let uploadFile = req.files.file;
  const name = uploadFile.name;
  const md5_filename = md5(uploadFile);
  const saveAs = `${md5_filename}_${name}`;

  uploadFile.mv(`src/files/${saveAs}`, (err) => {
       if(err) {
        console.log(err)
       }
  });

//  res.send({message: 'success'})
});


module.exports = uploadRoute;
