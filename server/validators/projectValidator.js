import { param, body } from "express-validator";

export const validateCreateProject = [
    body("name")
        .notEmpty().withMessage("プロジェクト名は必須です。")
        .bail()
        .isString().withMessage("プロジェクト名は文字列である必要があります。")
        .bail()
        .trim().isLength({ min: 1, max: 100 }).withMessage("プロジェクト名は1〜100文字で入力してください。")
];

export const validateProjectId = [
    param("id")
        .isInt({ gt: 0 }).withMessage("有効なプロジェクトIDを指定してください。")
];

export const validateUpdateProject = [
    body("name")
        .optional()
        .isString().withMessage("プロジェクト名は文字列である必要があります。")
        .bail()
        .trim().isLength({ min: 1, max: 100 }).withMessage("プロジェクト名は1〜100文字で入力してください。"),

    body("description")
        .optional()
        .trim().isLength({ min: 1, max: 1000 }).withMessage("プロジェクトの説明は1〜1000文字で入力してください。")
];