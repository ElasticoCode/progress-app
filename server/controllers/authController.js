import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { pool } from "../db.js";

export const registerUser = async (req, res) => {
    const { display_name, email, password } = req.body;
    const saltRounds = 10;

    try {
        // パスワードのハッシュ化
        const password_hash = await bcrypt.hash(password, saltRounds);

        //ユーザーをデータベースに保存
        const result = await pool.query(
            "INSERT INTO users (display_name, email, password_hash) values ($1, $2, $3) RETURNING *",
            [display_name, email, password_hash]);

        const user = result.rows[0];

        // JWTの発行
        const token = JWT.sign({ userId: user.id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "24h" });
        return res.status(201).json({ token });
    } catch (error) {
        console.error(err);

        // UNIQUE制約違反の対応（重要） ← DBでエラーを検知する
        if (err.code === "23505") {
            return res.status(400).send("すでにユーザーが存在しています。");
        }

        res.status(500).send("サーバーエラーが発生しました。");
    }
};