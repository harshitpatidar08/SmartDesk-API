const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({

    sessionId : {
        type : String,
        required : true,
        unique : true,
    },
    summary :{
        type : String,
        default : "",
    },
    issueHistory : [{
            type : String,
        }],
    lastSeen : {
        type : Date,
        default : Date.now,
    },     
});

module.exports = mongoose.model("Memory", memorySchema);