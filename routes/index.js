import express from "express";
import { usersrouter } from "./users.js";
import { accountrouter } from "./accounts.js"
const router = express.Router();
router.use("/users",usersrouter);
router.use("/account",accountrouter);

export default router;