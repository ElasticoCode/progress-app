import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

// 認証ミドルウェア
export const authMiddleware = async (req, res, next) => {
    // Authorizationヘッダー取得
    const authHeader = req.headers.authorization;

    // トークン存在チェック
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "認証トークンが必要です。" });
    }

    // "Bearer xxxx" からトークン抽出
    const token = authHeader.split(" ")[1];

    try {
        // jwt検証
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        // トークンにユーザーIDが含まれているか確認
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: "無効な認証トークンです。" });
        }

        // DBにユーザーが存在するか確認
        const result = await pool.query("SELECT id FROM users WHERE id = $1", [decoded.userId]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "ユーザーが存在しません。" });
        }

        // ユーザーidをリクエストオブジェクトに保存
        req.user = { id: decoded.userId };

        // 次のミドルウェアまたはルートハンドラーへ
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            // トークンの有効期限切れ
            return res.status(401).json({ error: "有効期限切れのトークンです。" });
        }

        if (error.name === "JsonWebTokenError") {
            // トークンの形式エラー(改ざん・形式不正など) ← 不正アクセス扱い
            return res.status(401).json({ error: "無効な認証トークンです。"});
        }

        return res.status(401).json({ error: "無効な認証トークンです。" });
    }
};