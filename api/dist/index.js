"use strict";

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContractAndGateway = void 0;

require("regenerator-runtime/runtime.js");

var _fabricNetwork = require("fabric-network");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _hyperledgerFabricOfflineTransactionSigning = require("hyperledger-fabric-offline-transaction-signing");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// need types
console.log({
  dd: _hyperledgerFabricOfflineTransactionSigning.createUser
});

var WALLET_PATH = _path["default"].join(__dirname, '..', '..', '..', '..', 'wallet');

var CCP_PATH = _path["default"].resolve(__dirname, '..', '..', '..', '..', 'network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
/**
 * Retrieve contract and gateway from the network.
 * Those two objects are used by other API to submit each transaction to the network.
 */


var getContractAndGateway = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var username, chaincode, contract, ccp, wallet, identity, gateway, network;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            username = _ref.username, chaincode = _ref.chaincode, contract = _ref.contract;
            // load the network configuration
            ccp = JSON.parse(_fs["default"].readFileSync(CCP_PATH, 'utf8')); // Create a new file system based wallet for managing identities.

            _context.next = 4;
            return _fabricNetwork.Wallets.newFileSystemWallet(WALLET_PATH);

          case 4:
            wallet = _context.sent;
            _context.next = 7;
            return wallet.get(username);

          case 7:
            identity = _context.sent;

            if (identity) {
              _context.next = 10;
              break;
            }

            throw new Error("An identity for the user \"".concat(username, "\" does not exist in the wallet"));

          case 10:
            // Create a new gateway for connecting to our peer node.
            gateway = new _fabricNetwork.Gateway();
            _context.next = 13;
            return gateway.connect(ccp, {
              identity: identity,
              discovery: {
                enabled: true,
                asLocalhost: true
              }
            });

          case 13:
            _context.next = 15;
            return gateway.getNetwork('mychannel');

          case 15:
            network = _context.sent;

            if (network) {
              _context.next = 18;
              break;
            }

            throw new Error("Could not get the network.");

          case 18:
            return _context.abrupt("return", {
              contract: network.getContract(chaincode, contract),
              gateway: gateway
            });

          case 19:
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