"use client";

import { Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <Button
      color="inherit"
      startIcon={<LoginIcon />}
      onClick={() => void signIn("tcss460", { callbackUrl: "/search" })}
    >
      Sign in
    </Button>
  );
}
