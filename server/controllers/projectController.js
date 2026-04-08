import { pool } from "../config/db.js";

// プロジェクト一覧取得コントローラー
export const getProjects = async (req, res) => {
    const userId = req.user.id; // ログインユーザーのID取得

    try {
        // 更新日時の降順で取得
        const result = await pool.query(
            "SELECT * FROM projects WHERE user_id = $1 ORDER BY updated_at DESC",
            [userId]
        );

        res.status(200).json({
            message: "プロジェクト一覧の取得に成功しました。",
            projects: result.rows
        });
    } catch (error) {
        console.error("getProjects error:", error);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
};

// プロジェクト作成コントローラー
export const createProject = async (req, res) => {
    const userId = req.user.id; // ログインユーザーのID取得
    const { name, description } = req.body;

    try {
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
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
};

// プロジェクト削除コントローラー
export const deleteProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.user.id; // ログインユーザーのID取得

    try {
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

// プロジェクト更新コントローラー
export const updateProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.user.id; // ログインユーザーのID取得
    const { name, description } = req.body;

    try {
        // 更新項目を動的に組み立て
        const fields = [];
        const values = [];
        let index = 1;

        if (name !== undefined) {
            fields.push(`name = $${index++}`);
            values.push(name);
        }

        if (description !== undefined) {
            fields.push(`description = $${index++}`);
            values.push(description);
        }

        // 更新対象がない
        if (fields.length === 0) {
            return res.status(400).json({ message: "更新する項目がありません。" });
        }

        values.push(projectId, userId);

        const query = `
            UPDATE projects
            SET ${fields.join(", ")}
            WHERE id = $${index++} AND user_id = $${index}
            RETURNING *
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "プロジェクトが存在しないか権限がありません。" });
        }

        const updatedProject = result.rows[0];

        res.status(200).json({
            message: "プロジェクトの更新に成功しました。",
            project: updatedProject
        });
    } catch (error) {
        console.error("updateProject error:", error);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
};