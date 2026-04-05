import { validationResult } from "express-validator";

// 共通エラーハンドラ
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "バリデーションエラー",
            errors: errors.array()
        });
    }

    next(); // 次へ進む
};