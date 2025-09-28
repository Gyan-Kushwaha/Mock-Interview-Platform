const mongoose = require("mongoose");

const healthCheck = async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const isDBConnected = dbState === 1;

    if (isDBConnected) {
        res.status(200).json({
            success: true,
            message: "Server is running and database is connected.",
            database: "connected",
        });
    } else {
        res.status(500).json({
            success: false,
            message: "Server is running but database is not connected.",
            database: "disconnected",
        });
    }
};

module.exports = { healthCheck };