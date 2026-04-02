import express from "express";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();
const app = express();
const PORT = 5000;

app.use(express.json());

////////////////////////////////////////////////////////////////////////////////////////////////////
// ユーザー情報をすべて取得するAPI
app.get("/users", (req, res) => {
    pool.query("SELECT * FROM users", (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
});

// 特定のユーザーを取得するAPI
app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
});

// ユーザーを追加するAPI(教材)
app.post("/users", (req, res) => {
    const { name, email, password_hash } = req.body;
    // ユーザーが既に存在しているか確認
    pool.query("SELECT s FROM users s WHERE s.email = $1", [email], (error, results) => {
        if (error) throw error;
        if (results.rows.length) {
            return res.send("すでにユーザーが存在しています。");
        }

        pool.query("INSERT INTO users (name, email, password_hash) values ($1, $2, $3)",
            [name, email, password_hash],
            (error, results) => {
                if (error) throw error;
                res.status(201).send("ユーザーの作成に成功しました。");
            }
        );
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////////

// ユーザー新規登録API
app.post("/register", async (req, res) => {
    // 登録情報の受け取り
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
    } catch (err) {
        console.error(err);

        // UNIQUE制約違反の対応（重要） ← DBでエラーを検知する
        if (err.code === "23505") {
            return res.status(400).send("すでにユーザーが存在しています。");
        }

        res.status(500).send("サーバーエラーが発生しました。");
    }
});

// ユーザーログインAPI
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});