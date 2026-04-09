import { param, body } from "express-validator";

export const validateGetTasks = [
    param("projectId")
        // 0より大きい整数かをチェックする
        .isInt({ gt: 0 }).withMessage("有効なプロジェクトIDを指定してください。")
];

export const validateCreateTask = [
    body("project_id")
        .trim().notEmpty().withMessage("プロジェクトIDは必須です。")
        .bail()
        .isInt().withMessage("プロジェクトIDは整数である必要があります。"),

    body("name")
        .trim().notEmpty().withMessage("タスク名は必須です。")
        .bail()
        .isLength({ min: 1, max: 255 }).withMessage("タスク名は1〜255文字で入力してください。"),

    body("description")
        .trim().optional()
        .isLength({ max: 1000 }).withMessage("説明は1000文字以内で入力してください。"),

    body("start_date")
        .trim().optional()
        .isISO8601().withMessage("日付形式が不正です。"),

    body("end_date")
        .trim().optional()
        .isISO8601().withMessage("日付形式が不正です。")
        .bail()
        .custom((value, { req }) => {
            if (req.body.start_date && value) {
                if (new Date(value) < new Date(req.body.start_date)) {
                    throw new Error("終了日は開始日以降である必要があります。");
                }
            }
            return true;
        })
];