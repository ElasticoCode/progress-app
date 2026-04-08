import { pool } from "../config/db.js";

// タスク一覧取得コントローラー
export const getTasks = async (req, res) => {
    const userId = req.user.id; // ログインユーザーのID取得
    const { project_id } = req.body;

    try {
        // プロジェクト所有者の確認
        const projectResult = await pool.query(
            "SELECT id FROM projects WHERE id = $1 AND user_id = $2",
            [project_id, userId]
        );
        if (projectResult.rows.length === 0) {
            return res.status(403).json({ message: "このプロジェクトにタスクを作成する権限がありません。" });
        }

        // 更新日時の降順で取得
        const result = await pool.query(
            "SELECT * FROM tasks WHERE user_id = $1 ORDER BY updated_at DESC",
            [userId]
        );

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
            // task: {
            //     id: task.id,
            //     project_id: task.project_id,
            //     name: task.name,
            //     description: task.description,
            //     start_date: task.start_date,
            //     end_date: task.end_date,
            //     progress: task.progress,
            //     created_at: task.created_at,
            //     updated_at: task.updated_at
            // }
        });

    } catch (error) {
        console.error("createTasks error:", error);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
};