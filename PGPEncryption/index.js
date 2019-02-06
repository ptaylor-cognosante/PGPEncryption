'use strict';

var PUBLICKEY = process.env.PUBLICKEY;
var returnValue;

const AWS = require('aws-sdk');
const openpgp = require('openpgp');
openpgp.initWorker({ path: 'openpgp.worker.js' }); // set the relative web worker path

exports.handler = (event, context, callback) => {

    var plaintext = event.Records[0].data;

    if (PUBLICKEY != 'NA') {
        let fileBuffer = Buffer.from(plaintext);
        const fileForOpenpgpjs = new Uint8Array(fileBuffer);
        const options = {
            message: openpgp.message.fromText(fileForOpenpgpjs),
            publicKeys: (openpgp.key.readArmored(PUBLICKEY)).keys // for encryption
        };
        openpgp.encrypt(options).then(cipherText => {
            returnValue = cipherText.message.packets.write();
            return returnValue;
        });
    } else {
        return returnValue;
    }

    callback(returnValue);
};