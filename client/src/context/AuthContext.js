// Reactで「ログイン状態（認証）」をアプリ全体で共有する仕組み

import { createContext, useContext, useState, useEffect } from "react";

// Context作成
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // ログインユーザー情報を管理するState (null：未ログイン)
    const [user, setUser] = useState(null);

    // アプリ起動時にローカルストレージからトークンを確認してユーザー情報をセット
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // トークンがあればユーザー情報をセット (ここでは簡略化のためトークン自体をユーザー情報として扱う)
            setUser({ token });
        }
    }, []);

    // ログイン成功時にトークン保存
    const login = (token) => {
        localStorage.setItem("token", token);
        setUser({ token });
    };

    // ログアウト時にトークン削除 (完全ログアウト)
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        // 全コンポーネントでuser, login, logoutを使えるようにする
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// カスタムフック：useAuth()で簡単にContextを利用できるようにする
export const useAuth = () => useContext(AuthContext);