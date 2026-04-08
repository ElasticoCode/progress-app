import { pool } from "../config/db";

// タスク一覧取得コントローラー
export const getTasks = async (req, res) => {
    const userId = req.user.id; // ログインユーザーのID取得

    try {
        // 更新日時の降順で取得
        const result = await pool.query(
            "SELECT * FROM projects WHERE user_id = $1 ORDER BY updated_at DESC",
            [userId]
        );

        res.status(200).json({
            message: "タスク一覧の取得に成功しました。",
            projects: result.rows
        });
    } catch (error) {
        console.error("getTasks error:", error);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
};