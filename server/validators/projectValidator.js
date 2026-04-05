import { body } from "express-validator";
import { handleValidationErrors } from "./validationResultHandler.js";

export const validateCreateProject = [
    body("name")
        .exists({ checkNull: true }).withMessage("プロジェクト名は必須です。")
        .bail()
        .isString().withMessage("プロジェクト名は文字列である必要があります。")
        .bail()
        .trim().isLength({ min: 1, max: 100 }).withMessage("プロジェクト名は1〜100文字で入力してください。"),

    // エラーをまとめて返す
    handleValidationErrors
];

export const validateUpdateProjectName = [
    body("name")
        .exists({ checkNull: true }).withMessage("プロジェクト名は必須です。")
        .bail()
        .isString().withMessage("プロジェクト名は文字列である必要があります。")
        .bail()
        .trim().isLength({ min: 1, max: 100 }).withMessage("プロジェクト名は1〜100文字で入力してください。"),

    // エラーをまとめて返す
    handleValidationErrors
];