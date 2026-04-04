import express from "express";
import { registerUser } from "../controllers/authController.js";
import { validateRegister } from "../validators/authValidator.js";

const router = express.Router();

router.post("/register", validateRegister, registerUser);

export default router;