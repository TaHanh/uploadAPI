// config/initializers/server.js

var express = require('express');
var path = require('path');
// Local dependecies
var config = require('nconf');

// create the express app
// configure middlewares
var bodyParser = require('body-parser');
var morgan = require('morgan');
const cors = require('cors');
var logger = require('winston');
var app;
var path = require('path');
var fs = require('fs');

var start = function () {
    'use strict';

    return new Promise((fulfill, reject) => {
        // Configure express 
        global.baseUpPath = path.join(__dirname, '../../', config.get('UPLOAD_FOLDER'));

        if (!fs.existsSync(global.baseUpPath)) {
            fs.mkdirSync(global.baseUpPath);
        }


        app = express();
        app.use(cors());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(bodyParser.json());

        app.use(morgan('dev'));

        logger.info('[SERVER] Initializing routes');
        require('../../app/controllers/index')(app);

        app.use(express.static(path.join(__dirname, 'public')));

        // Error handler???
        app.use(function (err, req, res, next) {
            logger.error(err);
            res
                .status(err.status || 500)
                .json({
                    message: err.message,
                    error: (app.get('env') === 'development' ? err.stack : {})
                });
            // next(err);
        });

        app.listen(config.get('NODE_PORT'));
        logger.info('[SERVER] Listening on port ' + config.get('NODE_PORT'));

        fulfill();
    });
};

module.exports = start;