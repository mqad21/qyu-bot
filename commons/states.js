const { WA_STATUS } = require("./constants.js");

module.exports = {
  connection: {
    status: WA_STATUS.DISCONNECTED,
    reason: "First time",
    isReconnecting: false,
    qrString: ""
  },
};
