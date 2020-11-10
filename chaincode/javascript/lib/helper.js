/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Helper extends Contract {

    async initLedger() {
      
    }

    /**
     * Create a standard unique id for each users of each organization of the network.
     * It is shared with other organs.
     * It makes the id management more consistent across the organs/chaincode.
     */
    getCreatorId(ctx) {
        const clientId = ctx.clientIdentity.getID();
        const mspId = ctx.clientIdentity.getMSPID();
        const id = `${mspId}::${clientId}`;
        return id;
    }

    /**
     * Retrieve the timestamp of a transaction.
     * It is shared with other organs.
     * It makes the id management more consistent across the organs/chaincode.
     */
    getTimestamp(ctx) {
        const timestamp = ctx.stub.getTxTimestamp();
        return `${timestamp.seconds}${timestamp.nanos}`;
    }

}

module.exports = Helper;
