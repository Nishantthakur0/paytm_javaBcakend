import express from "express";
import { Usermodel } from "../src/db.js";
import { JWT_PASSWORD } from "../src/config.js";
import { middleware } from "../src/middleware.js";
import jwt from "jsonwebtoken";
import { z } from "zod";
const usersrouter = express.Router();
const signupschema = z.object({
    username: z.string(),
    password: z.string(),
    firstname: z.string(),
    lastname: z.string()
})
usersrouter.post("/signup",async(req,res)=>{
    const { success } = signupschema.safeParse(req.body); // Corrected typo
    if (!success) {
        return res.json({
            message: "Incorrect syntax"
        });
}
    const existinguser = await Usermodel.findOne({
        username: req.body.username
    })
    if (existinguser){
        return res.json({
            message: "User already exist"
        })
    }
    await Usermodel.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.password,
        lastname: req.body.lastname
    })
    res.json({
        message: "User Signed In"
    })

})
const signinschema = z.object({
    username: z.string().email(),
    password: z.string()
})
usersrouter.post("/signin",async (req,res) => {
    const {succes} = signinschema.safeParse(req.body);
    if(!succes){
        return res.json({
            message: "User already exist"
        })
    }
    const user = await Usermodel.findOne({
        username: req.body.username,
        password: req.body.password
    })
    if(user){
        const token = jwt.sign({
            userId: user._id 
        },JWT_PASSWORD)

        res.json({
            message: "User Logged In",
            token: token
        })
        return
    }

    res.json({
        message: "Error while logging in"
    })
})
const updateschema = z.object({
    password: z.string(),
    firstname: z.string(),
    lastname: z.string()
})
usersrouter.put("/",middleware,async(req,res) =>{
    const {sucess} = updateschema.safeParse(req.body);
    if (!sucess){
        res.json({
            message: "Error while Updating"
        })
    }
    try{
         await Usermodel.updateOne({
            userId: req.userId,
            $set: req.body
        })
        res.json({
            message: "Information Updated"
        })

    }catch(e){
        res.json({
            message: "Server error while updating"
        })

    }
    
})
usersrouter.get("/bulk",middleware,async (req,res) => {
    const filter = req.query.filter || "";
    const users = await Usermodel.find({
        $or: [{
            firstname: {
                "$regex": filter
            }
        },{
            lastname: {
                "$regex": filter
            }
        }]

    })
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        })) 
    })

})










export {usersrouter}