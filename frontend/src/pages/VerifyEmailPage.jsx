import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/api";

/*
 * VerifyEmailPage
 * ---------------
 * Handles email verification after a user clicks the email link.
 */
function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setMessage("Missing verification token.");
            return;
        }

        const confirmEmail = async () => {
            try {
                const data = await verifyEmail(token);

                if (data.token && data.userId) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("userId", data.userId);

                    setMessage("Email verified successfully. Redirecting you to CogniHaven...");

                    setTimeout(() => {
                        window.location.href = "/journal";
                    }, 2000);
                } else {
                    setMessage("Email verification failed.");
                }
            } catch (err) {
                console.error("Email verification failed:", err);
                setMessage("Email verification failed.");
            }
        };

        confirmEmail();
    }, [searchParams]);

    return (
        <section>
            <h2>Email Verification</h2>
            <p>{message}</p>

            <Link to="/login">Go to Login</Link>
        </section>
    );
}

export default VerifyEmailPage;