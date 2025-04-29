import express from "express";
import { middleware } from "../src/middleware.js";
import { Accountmodel } from "../src/db.js";
import mongoose from "mongoose";
const accountrouter = express.Router();
accountrouter.get("/balance",middleware,async (req,res) => {
    const account = await Accountmodel.findOne({
        userId: req.userId
    })
    res.json({
        balance: account.balance
    })
})

accountrouter.post("/transfer",middleware, async(req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const {amount,to} = req.body;
    const account = await Accountmodel.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount ){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }
    const toaccount = await Accountmodel.findOne({ userId: to }).session(session)
    if (!toaccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid Account"
        })
    }
    await Accountmodel.updateOne({ userId: req.userId },{$inc: {balance: -amount} }).session(session)
    await Accountmodel.updateOne({ userId: to },{$inc: {balance: amount}}).session(session)
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    })

});
export{accountrouter}