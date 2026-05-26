const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({

    userMessage: {
        type: String,
        required: true,
    },
    aiResponse: {
        type: String,
        required: true,
    },
    emotion: {
        type: String,
        default: "calm",
    },
    confidence: {
       type : Number,
       default: 100,
    },
    status: {
        type: String,
        status: ["open", "resolved", "escalated"],
        default: "open",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Ticket", ticketSchema);