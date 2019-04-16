// config/initializers/database.js
const mongoose    = require('mongoose');
const nconf = require('nconf');
const logger = require('winston');


module.exports = function () {
    'use strict';
    return new Promise((fulfill, reject) => {

    // Initialize the component here then call the callback
    // More logic
        let dbAuth = {user: nconf.get('database').user,pass:nconf.get('database').password};
    
        mongoose.connect(nconf.get('database').server,dbAuth).then(
            ()=>{
                logger.info('[APP] Connect DB Success');
                //Load data from db go here



                fulfill();
            })
            .catch((err)=>{
                logger.error(err);
                reject(err);
            });
    });
};