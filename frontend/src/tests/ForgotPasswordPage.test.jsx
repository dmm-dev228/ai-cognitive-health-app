import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";

import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import { forgotPassword } from "../services/api";

vi.mock("../services/api", () => ({
  forgotPassword: vi.fn(),
}));

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows validation message when email is empty", async () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: /send reset link/i,
      })
    );

    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(forgotPassword).not.toHaveBeenCalled();
  });

  test("calls forgot password API and shows success message", async () => {
    forgotPassword.mockResolvedValue(
      "If an account exists with that email, a reset link has been sent."
    );

    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    await userEvent.type(
      screen.getByPlaceholderText("you@example.com"),
      "test@example.com"
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: /send reset link/i,
      })
    );

    expect(forgotPassword).toHaveBeenCalledWith("test@example.com");

    expect(
      await screen.findByText(
        "If an account exists with that email, a reset link has been sent."
      )
    ).toBeInTheDocument();
  });
});