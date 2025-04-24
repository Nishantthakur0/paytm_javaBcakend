
import { JWT_PASSWORD } from "./config.js";
import jwt from "jsonwebtoken";

export const middleware = (req,res,next) => {
    const headers = req.header("Authorization");
    const decoded = jwt.verify(String(headers), JWT_PASSWORD)
    if (decoded) {
        req.userId = decoded.userId;
        next()
    }else{
        return res.json({
            message: "User Does not exist"
        })
    }
}
