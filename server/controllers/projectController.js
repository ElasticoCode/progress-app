import { pool } from "../config/db.js";

// プロジェクト作成コントローラー
export const createProject = async (req, res) => {
    const { name, description = "" } = req.body;

    // バリデーション
    if (!name) {
        return res.status(400).json({ message: "プロジェクト名は必須です。" });
    }

    // 認証チェック
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "認証情報が不正です。" });
    }

    try {
        // ログインユーザーのID取得
        const userId = req.user.id;

        const result = await pool.query(
            "INSERT INTO projects (user_id, name, description) VALUES ($1, $2, $3) RETURNING *",
            [userId, name, description]
        );

        const project = result.rows[0];

        res.status(201).json({
            message: "プロジェクトの作成に成功しました。",
            project: {
                id: project.id,
                user_id: project.user_id,
                name: project.name,
                description: project.description,
                created_at: project.created_at,
                updated_at: project.updated_at
            }
        });

    } catch (error) {
        console.error(error);

        if (error.code === '23503') {
            return res.status(400).json({ message: "ユーザーが存在しません。" });
        }

        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
};