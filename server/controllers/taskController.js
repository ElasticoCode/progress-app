import { pool } from "../config/db.js";

// タスク一覧取得コントローラー
export const getTasks = async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.user.id; // ログインユーザーのID取得

    try {
        const result = await pool.query(
            `
            SELECT t.id, t.name, t.description,t.start_date, t.end_date, t.updated_at, t.progress
            FROM tasks t
            JOIN projects p ON t.project_id = p.id
            WHERE t.project_id = $1 AND p.user_id = $2
            `,
            [projectId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ message: "タスクが存在しない、または閲覧権限がありません。" });
        }

        res.status(200).json({
            message: "タスク一覧の取得に成功しました。",
            tasks: result.rows
        });
    } catch (error) {
        console.error("getTasks error:", error);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
};

// タスク作成コントローラー
export const createTask = async (req, res) => {
    const userId = req.user.id; // ログインユーザーのID取得
    const { project_id, name, description , start_date, end_date  } = req.body;

    try {
        // プロジェクト所有者の確認
        const projectResult = await pool.query(
            "SELECT id FROM projects WHERE id = $1 AND user_id = $2",
            [project_id, userId]
        );
        if (projectResult.rows.length === 0) {
            return res.status(403).json({ message: "このプロジェクトにタスクを作成する権限がありません。" });
        }

        // タスクの作成
        const result = await pool.query(
            "INSERT INTO tasks (project_id, name, description, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [project_id, name, description, start_date, end_date]
        );

        const task = result.rows[0];

        res.status(201).json({
            message: "タスクの作成に成功しました。",
            task
        });

    } catch (error) {
        console.error("createTasks error:", error);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
};