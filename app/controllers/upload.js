'use strict';

var express = require('express');
var router = express.Router();
var logger = require('winston');
var config = require('nconf');
var multer = require('multer');
var fs = require('fs');

const RESPONSE = require('../constance/RESPONSE');
const ERRORCODE = require('../constance/ERRORCODE');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, global.baseUpPath);
  },
  filename: function (req, file, cb) {
    cb(null, (Date.now() / 1000 | 0) + '_' + file.originalname);
  }
});

var upload = multer({
  storage: storage
}).array('file[]');

router.post('/', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.json({
        code: RESPONSE.CODE_ERR_WITH_MESS,
        ERRORCODE: ERRORCODE.EXCEPTION,
        err
      });
    }
    let ret = [];
    if (req.files && req.files.length > 0) {
      ret = req.files.map((f) => {
        return config.get('BASE_IMG_URL') + f.filename;
      });
    }
    res.json({code: RESPONSE.CODE_OK_WITH_MESS, data: ret});
  });
});

router.get('/:file', (req, res) => {
  try {

    var img = fs.readFileSync(global.baseUpPath + '/' + req.params.file);

    res.end(img, 'binary');
  } catch (err) {
    res.status(404).json({
      code: config.CODE_ERR_WITH_MESS,
      message: err
    });
  }
});

module.exports = function (appRoute) {
  appRoute.use(router);
};
