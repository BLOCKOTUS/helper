import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';
import path from 'path';

const WALLET_PATH = path.join(__dirname, '..', '..', '..', '..', 'wallet');
const CCP_PATH = path.resolve(__dirname, '..', '..', '..', '..', 'network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');

/**
 * Retrieve contract and gateway from the network.
 * Those two objects are used by other API to submit each transaction to the network.
 */
export const getContractAndGateway = async ({username, chaincode, contract}) => {
    // load the network configuration
    const ccp = JSON.parse(fs.readFileSync(CCP_PATH, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(username);
    if (!identity) { throw new Error(`An identity for the user "${username}" does not exist in the wallet`); }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { identity, discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');
    if (!network) { throw new Error(`Could not get the network.`); }

    // Get the contract from the network.
    return {contract: network.getContract(chaincode, contract), gateway};
};