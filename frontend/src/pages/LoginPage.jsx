import { useState } from "react";
import { loginUser, resendVerificationEmail } from "../services/api";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showResend, setShowResend] = useState(false);

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
            setShowResend(false);
            window.location.href = "/journal";
        } else {
            const errorMessage =
                data.message || "Invalid email or password.";

            setMessage(errorMessage);

            if (errorMessage.toLowerCase().includes("verify")) {
                setShowResend(true);
            } else {
                setShowResend(false);
            }
        }
    };

    const handleResendVerification = async () => {
        if (!email.trim()) {
            setMessage("Please enter your email first.");
            return;
        }

        const result = await resendVerificationEmail(email);

        setMessage(result || "Verification email sent. Please check your inbox.");
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

            {showResend && (
                <button onClick={handleResendVerification}>
                    Resend Verification Email
                </button>
            )}
        </section>
    );
}

export default LoginPage;