import { check, validationResult } from "express-validator";

// ユーザー新規登録API
export const validateRegister = [
    check("display_name").notEmpty().withMessage("表示名は必須です。"),

    check("email")
        .notEmpty().withMessage("メールアドレスは必須です。")
        .isEmail().withMessage("有効なメールアドレスを入力してください。"),

    check("password")
        .notEmpty().withMessage("パスワードは必須です。")
        .isLength({ min: 8 }).withMessage("パスワードは8文字以上である必要があります。"),

    check("confirmPassword").notEmpty().withMessage("確認用パスワードは必須です。"),

    // パスワードと確認用パスワードが一致するかのカスタムバリデーション
    check("password").custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
            throw new Error("パスワードが一致しません");
        }
        return true;
    }),

    // エラーをまとめて返すミドルウェア
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // 次へ進む
    }
];

// ユーザーログインAPI
export const validateLogin = [
    check("email")
        .notEmpty().withMessage("メールアドレスは必須です。")
        .isEmail().withMessage("有効なメールアドレスを入力してください。"),

    check("password")
        .notEmpty().withMessage("パスワードは必須です。")
];