const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

router.post("/" , async(req , res) => {
    try{
    const {userMessage , aiResponse , status} = req.body;
    const ticket = await Ticket.create({userMessage , aiResponse , status });
    res.status(201).json(ticket);
    } catch(error) {
        res.status(500).json({error : error.message});
    };
});


router.get("/" , async(req , res) => {
  try {
    const tickets = await Ticket.find().sort({createdAt: -1});
    res.json(tickets);
  } catch(error) {
    res.status(500).json({ error: error.message });
  };
});


router.patch("/:id" , async(req , res) => {
    try{
            const ticket = await Ticket.findByIdAndUpdate( 
                req.params.id,
                {status : req.body.status},
                {new : true}
            );
            res.json(ticket);
        } catch(error) {
            res.status(500).json({error : error.message});
        };
    });


    module.exports = router;