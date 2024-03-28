const mongoose = require('mongoose');

function connectDB(connectStr){
    return mongoose.connect(connectStr);
};

module.exports = connectDB;