import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

// ユーザー新規登録コントローラー
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

        // jwtの発行
        const token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "24h" });
        return res.status(201).json({ token });
    } catch (error) {
        console.error("registerUser error:", error);

        // UNIQUE制約違反の対応（重要） ← DBでエラーを検知する
        if (error.code === "23505") {
            return res.status(400).send("すでにユーザーが存在しています。");
        }

        res.status(500).send("サーバーエラーが発生しました。");
    }
};

// ユーザーログインコントローラー
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // ユーザーをデータベースから取得
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({error: "メールアドレスまたはパスワードが間違っています"});
        }

        const user = result.rows[0];

        // パスワードチェック
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({error: "メールアドレスまたはパスワードが間違っています"});
        }

        // jwtの発行
        const token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "24h" });

        // レスポンス
        res.json({
            token,
            user: {
                id: user.id,
                display_name: user.display_name
            }
        });
    } catch (error) {
        console.error("loginUser error:", error);
        res.status(500).send("サーバーエラーが発生しました。");
    }
};