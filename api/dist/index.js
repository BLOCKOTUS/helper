"use strict";

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendSignedTransactionProposal = exports.getContractAndGateway = void 0;

require("regenerator-runtime/runtime.js");

var _fabricNetwork = require("fabric-network");

var _fabricCommon = require("fabric-common");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _hyperledgerFabricOfflineTransactionSigning = require("hyperledger-fabric-offline-transaction-signing");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var WALLET_PATH = _path["default"].join(__dirname, '..', '..', '..', '..', 'wallet');

var CCP_PATH = _path["default"].resolve(__dirname, '..', '..', '..', '..', 'network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
/**
 * Retrieve contract and gateway from the network.
 * Those two objects are used by other API to submit each transaction to the network.
 */


var getContractAndGateway = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var user, chaincode, contract, ccp, walletPath, wallet, identity, gateway, network;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = _ref.user, chaincode = _ref.chaincode, contract = _ref.contract;
            // load the network configuration
            ccp = JSON.parse(_fs["default"].readFileSync(CCP_PATH, 'utf8')); // Create a new file system based wallet for managing identities.

            walletPath = _path["default"].join(WALLET_PATH, "".concat(user.username, ".id"));

            _fs["default"].writeFileSync(walletPath, JSON.stringify(user.wallet));

            _context.next = 6;
            return _fabricNetwork.Wallets.newFileSystemWallet(WALLET_PATH);

          case 6:
            wallet = _context.sent;
            _context.next = 9;
            return wallet.get(user.username);

          case 9:
            identity = _context.sent;

            if (identity) {
              _context.next = 12;
              break;
            }

            throw new Error("An identity for the user \"".concat(user.username, "\" does not exist in the wallet"));

          case 12:
            // Create a new gateway for connecting to our peer node.
            gateway = new _fabricNetwork.Gateway();
            _context.next = 15;
            return gateway.connect(ccp, {
              identity: identity,
              discovery: {
                enabled: true,
                asLocalhost: true
              }
            });

          case 15:
            _context.next = 17;
            return gateway.getNetwork('mychannel');

          case 17:
            network = _context.sent;

            if (network) {
              _context.next = 20;
              break;
            }

            throw new Error("Could not get the network.");

          case 20:
            return _context.abrupt("return", {
              contract: network.getContract(chaincode, contract),
              gateway: gateway,
              network: network
            });

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getContractAndGateway(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getContractAndGateway = getContractAndGateway;

var sendSignedTransactionProposal = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {
    var username, user, chaincode, contract, fcn, args, walletPath, wallet, identity, provider, ccp, client, userContext, _yield$getContractAnd, network, channel, result;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            username = _ref3.username, user = _ref3.user, chaincode = _ref3.chaincode, contract = _ref3.contract, fcn = _ref3.fcn, args = _ref3.args;
            console.log('in send sign'); // Create a new file system based wallet for managing identities.

            walletPath = _path["default"].join(WALLET_PATH, "".concat(user.username, ".id"));

            _fs["default"].writeFileSync(walletPath, JSON.stringify(user.wallet));

            _context2.next = 6;
            return _fabricNetwork.Wallets.newFileSystemWallet(WALLET_PATH);

          case 6:
            wallet = _context2.sent;
            _context2.next = 9;
            return wallet.get(username);

          case 9:
            identity = _context2.sent;
            // build a user object for authenticating with the CA
            provider = wallet.getProviderRegistry().getProvider(identity.type);
            ccp = JSON.parse(_fs["default"].readFileSync(CCP_PATH, 'utf8'));
            client = new _fabricCommon.Client(ccp);
            _context2.next = 15;
            return provider.getUserContext(user.wallet, username);

          case 15:
            userContext = _context2.sent;
            _context2.next = 18;
            return getContractAndGateway({
              user: user,
              chaincode: chaincode,
              contract: contract
            });

          case 18:
            _yield$getContractAnd = _context2.sent;
            network = _yield$getContractAnd.network;
            channel = network.getChannel(); // return proposal response

            console.log('just before sending');
            _context2.next = 24;
            return (0, _hyperledgerFabricOfflineTransactionSigning.sendProposal)({
              client: client,
              channel: channel,
              user: userContext,
              privateKeyPEM: user.wallet.credentials.privateKey,
              chaincode: chaincode,
              fcn: fcn,
              args: args
            })["catch"](function (e) {
              throw new Error(e);
            }).then(function (res) {
              return result = res;
            });

          case 24:
            console.log('just after sending');
            return _context2.abrupt("return", result);

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function sendSignedTransactionProposal(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.sendSignedTransactionProposal = sendSignedTransactionProposal;