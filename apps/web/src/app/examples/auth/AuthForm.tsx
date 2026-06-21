"use client";
import Link from "next/link";
import { Card, Button, Input, Toggle, Alert } from "@chromatic/ui";

export function AuthForm() {
  return (
    <Card className="w-full">
      <div className="mb-6 space-y-2 text-center">
        <Link href="/examples" className="inline-flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-accentSweep" />
          <span className="font-heading font-semibold tracking-tight text-text-primary">
            Chromatic
          </span>
        </Link>
        <h1 className="mt-4 font-heading text-2xl font-bold text-text-primary">
          Sign in
        </h1>
        <p className="font-body text-sm text-text-secondary">
          Use your team email to access the design studio.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Work email" placeholder="kas@team.dev" type="email" />
        <Input label="Password" placeholder="••••••••" type="password" />
        <div className="flex items-center justify-between">
          <Toggle label="Remember me" />
          <Link
            href="#"
            className="font-body text-sm text-primary-500 hover:text-primary-400"
          >
            Forgot password?
          </Link>
        </div>
        <Button variant="primary" type="submit" className="w-full">
          Sign in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-text-muted">
        <span className="h-px flex-1 bg-border-default" />
        <span>OR</span>
        <span className="h-px flex-1 bg-border-default" />
      </div>

      <div className="space-y-2">
        <Button variant="ghost" className="w-full">
          Continue with GitHub
        </Button>
        <Button variant="ghost" className="w-full">
          Continue with Google
        </Button>
      </div>

      <Alert tone="info" className="mt-6">
        Demo only &mdash; no credentials are sent or stored.
      </Alert>

      <p className="mt-6 text-center font-body text-sm text-text-secondary">
        New to Chromatic?{" "}
        <Link href="#" className="text-primary-500 hover:text-primary-400">
          Create an account
        </Link>
      </p>
    </Card>
  );
}