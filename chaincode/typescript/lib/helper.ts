/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

import { Context, Contract } from 'fabric-contract-api';

export class Helper extends Contract {

    public async initLedger() {
      console.log('initLedger');
    }

    /**
     * Construct a standard unique id for each users of each organization of the network.
     * It is shared with other organs.
     * It makes the id management more consistent across the organs/chaincode.
     */
    public getCreatorId(ctx: Context): string {
        const clientId = ctx.clientIdentity.getID();
        const mspId = ctx.clientIdentity.getMSPID();
        const id = `${mspId}::${clientId}`;
        return id;
    }

    /**
     * Retrieve the timestamp of a transaction.
     * It is shared with other organs.
     * It makes the timestamp management more consistent across the organs/chaincode.
     */
    public getTimestamp(ctx: Context): string {
        const timestamp = ctx.stub.getTxTimestamp();
        return `${timestamp.seconds}${timestamp.nanos}`;
    }

}
