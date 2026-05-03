import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const data = await loginUser({
            email,
            password
        });

        console.log("LOGIN DATA:", data);

        if (data.token) {
            localStorage.setItem("token", data.token);

            if (data.userId) {
                localStorage.setItem("userId", data.userId);
            }

            setMessage("Login successful.");
            window.location.href = "/journal";
        } else {
            setMessage(data.message || "Login failed. Missing token or user ID.");
        }
    };

    return (
        <section>
            <h2>Login</h2>

            <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
            />

            <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
            />

            <button onClick={handleLogin}>Login</button>

            {message && <p>{message}</p>}
        </section>
    );
}

export default LoginPage;