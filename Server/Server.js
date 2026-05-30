const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const chatRoute = require("./routes/chat");
const ticketRoute = require("./routes/ticket");
const memoryRoute = require("./routes/memory");


dotenv.config();
// console.log("MONGO:", process.env.MONGO_URI);
// console.log("GEMINI:", process.env.GEMINI_API_KEY ? "loaded" : "missing");
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/chat" , chatRoute);
app.use("/api/tickets" , ticketRoute);
app.use("/api/memory" , memoryRoute);




app.get("/", (req , res) => {
      res.json({ message: "Smart Dest API is running"});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT , () => {
    console.log(`server is running on port ${PORT}`);
});