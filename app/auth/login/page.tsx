"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

const signupSchema = loginSchema.extend({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long.")
    .max(50, "Name must be 50 characters or fewer."),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function LoginPage() {
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [signupMessage, setSignupMessage] = useState<string | null>(null);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const handleLoginSubmit = loginForm.handleSubmit(async (values) => {
    setLoginMessage(null);
    await new Promise((resolve) => setTimeout(resolve, 350));
    setLoginMessage(
      `Stubbed login successful for ${values.email}. Backend integration pending.`,
    );
  });

  const handleSignupSubmit = signupForm.handleSubmit(async (values) => {
    setSignupMessage(null);
    await new Promise((resolve) => setTimeout(resolve, 350));
    setSignupMessage(
      `Stubbed signup successful. Welcome aboard, ${values.name}!`,
    );
  });

  const {
    register: registerLogin,
    formState: { errors: loginErrors, isSubmitting: isLoggingIn },
  } = loginForm;

  const {
    register: registerSignup,
    formState: { errors: signupErrors, isSubmitting: isSigningUp },
  } = signupForm;

  return (
    <section className="container mx-auto grid min-h-[calc(100vh-10rem)] items-center gap-12 py-12 lg:grid-cols-[1.05fr_minmax(0,1fr)] lg:py-20">
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
            Sign in to keep your kitchen organized
          </h1>
          <p className="text-muted-foreground text-lg">
            Access your saved recipes, plan upcoming meals, and collaborate with
            your household in one place. Authentication is simulated while we
            wire up the real backend.
          </p>
        </div>
        <dl className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
          <div className="rounded-lg border border-border/70 bg-neutral-50 p-4">
            <dt className="font-medium text-foreground">Personalize meals</dt>
            <dd>Favorite, tag, and sort recipes tailored to your taste.</dd>
          </div>
          <div className="rounded-lg border border-border/70 bg-neutral-50 p-4">
            <dt className="font-medium text-foreground">Sync across devices</dt>
            <dd>Recipes stay available offline with IndexedDB storage.</dd>
          </div>
        </dl>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <Card>
          <CardHeader className="space-y-4">
            <div>
              <CardTitle className="text-2xl pb-1">Welcome back</CardTitle>
              <CardDescription>
                Enter your details to get cooking!
              </CardDescription>
            </div>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="space-y-8">
            <TabsContent value="login" className="mt-0 space-y-4">
              <form className="grid gap-4" onSubmit={handleLoginSubmit}>
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="login-email">
                    Email
                  </label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...registerLogin("email")}
                  />
                  {loginErrors.email ? (
                    <p className="text-sm text-destructive">
                      {loginErrors.email.message}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="login-password"
                  >
                    Password
                  </label>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...registerLogin("password")}
                  />
                  {loginErrors.password ? (
                    <p className="text-sm text-destructive">
                      {loginErrors.password.message}
                    </p>
                  ) : null}
                </div>

                <Button type="submit" disabled={isLoggingIn}>
                  {isLoggingIn ? "Validating…" : "Log in"}
                </Button>
              </form>
              {loginMessage ? (
                <p className="text-sm text-muted-foreground">{loginMessage}</p>
              ) : null}
            </TabsContent>

            <TabsContent value="signup" className="mt-0 space-y-4">
              <form className="grid gap-4" onSubmit={handleSignupSubmit}>
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="signup-name">
                    Name
                  </label>
                  <Input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Taylor Cook"
                    {...registerSignup("name")}
                  />
                  {signupErrors.name ? (
                    <p className="text-sm text-destructive">
                      {signupErrors.name.message}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="signup-email">
                    Email
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...registerSignup("email")}
                  />
                  {signupErrors.email ? (
                    <p className="text-sm text-destructive">
                      {signupErrors.email.message}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="signup-password"
                  >
                    Password
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Create a secure password"
                    {...registerSignup("password")}
                  />
                  {signupErrors.password ? (
                    <p className="text-sm text-destructive">
                      {signupErrors.password.message}
                    </p>
                  ) : null}
                </div>

                <Button type="submit" disabled={isSigningUp}>
                  {isSigningUp ? "Submitting…" : "Create account"}
                </Button>
              </form>
              {signupMessage ? (
                <p className="text-sm text-muted-foreground">{signupMessage}</p>
              ) : null}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </section>
  );
}
