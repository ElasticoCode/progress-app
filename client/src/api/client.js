// フロントからバックエンドAPIを呼び出す共通関数
// 認証トークンをここで一元管理
// 全APIで使い回せる

// APIの共通のURL(バックエンド側)を定義
const BASE_URL = "http://localhost:5000/api";

export const api = async (endpoint, method = "GET", body = null) => {
    // ログイン時に保存したJWTを取得
    const token = localStorage.getItem("token");

    // fetch：ブラウザからサーバーにHTTPリクエストを送るための標準機能
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: body ? JSON.stringify(body) : null,
    });

    // ステータスコードが成功でない場合はエラーを投げる
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message ?? "サーバーエラー");
    }

    return res.json();
};