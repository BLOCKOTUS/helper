/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Helper extends Contract {

    async initLedger() {
      
    }

    getCreatorId(ctx) {
        const clientId = ctx.clientIdentity.getID();
        const mspId = ctx.clientIdentity.getMSPID();
        const id = `${mspId}::${clientId}`;
        return id;
    }

    getTimestamp(ctx) {
        const timestamp = ctx.stub.getTxTimestamp();
        return `${timestamp.seconds}${timestamp.nanos}`;
    }

}

module.exports = Helper;
