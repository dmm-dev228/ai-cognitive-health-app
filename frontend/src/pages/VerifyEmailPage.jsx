import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/api";

/*
 * VerifyEmailPage
 * ---------------
 * Handles email verification after a user clicks the email link.
 * If verification succeeds, the user is automatically logged in
 * and redirected to the journal page.
 */
function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Verifying your email...");
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setMessage("Missing verification token.");
            setStatus("error");
            return;
        }

        const confirmEmail = async () => {
            try {
                const data = await verifyEmail(token);

                console.log("VERIFY EMAIL DATA:", data);

                if (data.token && data.userId) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("userId", data.userId);

                    setMessage("Email verified successfully. Redirecting you to your journal...");
                    setStatus("success");

                    setTimeout(() => {
                        window.location.href = "/journal";
                    }, 2000);
                } else {
                    if (localStorage.getItem("token")) {
                        setMessage("Email verified successfully. Redirecting you to your journal...");
                        setStatus("success");

                        setTimeout(() => {
                            window.location.href = "/journal";
                        }, 1500);

                        return;
                    }

                    setMessage(data.message || "Email verification failed.");
                    setStatus("error");
                }
            } catch (err) {
                if (localStorage.getItem("token")) {
                    setMessage("Email verified successfully. Redirecting you to your journal...");
                    setStatus("success");

                    setTimeout(() => {
                        window.location.href = "/journal";
                    }, 1500);

                    return;
                }

                setMessage("Email verification failed. The link may be invalid or expired.");
                setStatus("error");
            }
        };

        confirmEmail();
    }, [searchParams]);

    return (
        <section>
            <h2>Email Verification</h2>
            <p>{message}</p>

            {status === "loading" && <p>Please wait...</p>}

            {status === "success" && (
                <p>You are being signed in automatically.</p>
            )}

            {status === "error" && (
                <Link to="/login">Go to Login</Link>
            )}
        </section>
    );
}

export default VerifyEmailPage;