import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, test, expect } from "vitest";

import SignUpPage from "../pages/SignUpPage";

vi.mock("../services/api", () => ({
  createUser: vi.fn(),
}));

describe("SignUpPage", () => {

  test("shows validation message when fields are empty", async () => {

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    const createAccountButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await userEvent.click(createAccountButton);

    expect(
      screen.getByText("Please complete all fields.")
    ).toBeInTheDocument();
  });

  test("shows password mismatch message", async () => {

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    await userEvent.type(
      screen.getByPlaceholderText("Choose a username"),
      "demarquis"
    );

    await userEvent.type(
      screen.getByPlaceholderText("you@example.com"),
      "test@example.com"
    );

    await userEvent.type(
      screen.getByPlaceholderText("Create a password"),
      "Password123"
    );

    await userEvent.type(
      screen.getByPlaceholderText("Confirm your password"),
      "DifferentPassword"
    );

    const createAccountButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await userEvent.click(createAccountButton);

    expect(
      screen.getAllByText("Passwords do not match.")[0]
    ).toBeInTheDocument();
  });

});