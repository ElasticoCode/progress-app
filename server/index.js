import express from "express";
import { pool } from "./db.js";

const app = express();
const PORT = 5000;

app.use(express.json());

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

// ユーザーを追加するAPI
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});