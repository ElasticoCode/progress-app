import { useState } from "react";
import { api } from "../api/client";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const data = await api("/auth/login", "POST", { email, password });

            localStorage.setItem("token", data.token);
            alert("ログイン成功");
        } catch (err) {
            alert("ログイン失敗: " + err.message);
        }
    };

    return (
        <div>
            <h2>ログイン</h2>
            <input
                type="email"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>ログイン</button>
        </div>
    );
};

export default Login;