import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import { pool } from "./config/db.js";

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

// ユーザーを削除するAPI
app.delete("/users/:id", (req, res) => {
    const id = req.params.id;

    pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
        if (error) throw error;

        const isUserExist = results.rows.length > 0;
        if (!isUserExist) {
            return res.send("ユーザーが存在しません。");
        }

        pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
            if (error) throw error;
            res.status(200).json("ユーザーの削除に成功しました。");
        });
    });
});

// ユーザー情報を更新するAPI
app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    const display_name = req.body.display_name;

    pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
        if (error) throw error;

        // ユーザーが存在するか確認
        const isUserExist = results.rows.length > 0;
        if (!isUserExist) {
            return res.send("ユーザーが存在しません。");
        }

        // ユーザー情報の更新
        pool.query("UPDATE users SET display_name = $1 WHERE id = $2", [display_name, id], (error, results) => {
            if (error) throw error;
            res.status(200).json("ユーザー情報の更新に成功しました。");
        });
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////////

// ユーザー関連API
app.use("/auth", authRoutes);

// プロジェクト関連API
app.use("/api", projectRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});