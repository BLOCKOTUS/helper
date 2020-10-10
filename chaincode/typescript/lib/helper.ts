/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

import { Context, Contract } from 'fabric-contract-api';

export class Helper extends Contract {

    public async initLedger() {
      console.log('initLedger');
    }

    public getCreatorId(ctx: Context): string {
        const clientId = ctx.clientIdentity.id;
        const mspId = ctx.clientIdentity.mspId;
        const id = `${mspId}::${clientId}`;
        return id;
    }

    public getTimestamp(ctx: Context): string {
        const timestamp = ctx.stub.getTxTimestamp();
        return `${timestamp.seconds}${timestamp.nanos}`;
    }

}
