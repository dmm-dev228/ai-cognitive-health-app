import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/api";

function SignUpPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignUp = async () => {
        const data = await createUser({
            username,
            email,
            password
        });
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (data.id) {
            setMessage("Account created successfully. Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } else {
            setMessage(data.message || "Sign up failed.");
        }
    };

    return (
        <section>
            <h2>Create Account</h2>

            <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
            />

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
            <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm Password"
            />

            <button onClick={handleSignUp}>Sign Up</button>

            {message && <p>{message}</p>}
        </section>
    );
}

export default SignUpPage;