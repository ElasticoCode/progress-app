import { pool } from "../config/db.js";

// プロジェクト作成コントローラー
export const createProject = async (req, res) => {
    const { name, description = "" } = req.body;

    // バリデーション
    if (!name) {
        return res.status(400).json({ message: "プロジェクト名は必須です。" });
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
        console.error("createProject error:", error);

        if (error.code === '23503') {
            return res.status(400).json({ message: "ユーザーが存在しません。" });
        }

        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
};

// プロジェクト削除コントローラー
export const deleteProject = async (req, res) => {
    const projectId = Number(req.params.id);

    if (isNaN(projectId)) {
        return res.status(400).json({ message: "無効なプロジェクトIDです。" });
    }

    try {
        // ログインユーザーのID取得
        const userId = req.user.id;

        const result = await pool.query(
            "DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *",
            [projectId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "プロジェクトが存在しないか権限がありません。" });
        }

        const deletedProject = result.rows[0];

        res.status(200).json({
            message: "プロジェクトの削除に成功しました。",
            project: deletedProject
        });
    } catch (error) {
        console.error("deleteProject error:", error);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
};
