import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, test, expect } from "vitest";

import LoginPage from "../pages/LoginPage";
import { loginUser } from "../services/api";

vi.mock("../services/api", () => ({
  loginUser: vi.fn(),
  resendVerificationEmail: vi.fn(),
}));

describe("LoginPage", () => {

  test("shows validation message when email and password are empty", async () => {

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", {
      name: /login/i,
    });

    await userEvent.click(loginButton);

    expect(
      screen.getByText(
        "Please enter your email and password."
      )
    ).toBeInTheDocument();
  });

});

test("calls login API when user submits valid credentials", async () => {
  loginUser.mockResolvedValue({
    token: null,
    message: "Invalid email or password.",
  });

  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  await userEvent.type(
    screen.getByPlaceholderText("you@example.com"),
    "test@example.com"
  );

  await userEvent.type(
    screen.getByPlaceholderText("Enter your password"),
    "Password123"
  );

  await userEvent.click(
    screen.getByRole("button", { name: /login/i })
  );

  expect(loginUser).toHaveBeenCalledWith({
    email: "test@example.com",
    password: "Password123",
  });

  expect(
    await screen.findByText("Invalid email or password.")
  ).toBeInTheDocument();
});