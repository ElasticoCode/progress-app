import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../validators/authValidator.js";

const router = express.Router();

// ユーザー新規登録API
router.post("/register", validateRegister, registerUser);

// ユーザーログインAPI
router.post("/login", validateLogin, loginUser);

export default router;