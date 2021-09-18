const states = require("../commons/states.js");
const conn = require("../index.js");

const waController = new Object();

waController.getStatus = (req, res) => {
  res
    .json({
      success: true,
      message: "WA connection status received.",
      data: states.connection,
    })
    .status(200);
};

waController.connect = async (req, res) => {
  if (conn.state == "close") {
    await conn.connect();
    res.json({
      success: true,
      message: "WA is connecting.",
    });
  }
  res.json({
    success: false,
    message: "WA is connecting.",
  });
};

module.exports = waController;
