/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignInFlow } from "../types";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

interface SignUpCard {
  setState: (state: SignInFlow) => void;
}

export function SignUpCard({ setState }: SignUpCard) {
  const { signIn } = useAuthActions();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => setPending(false));
  };

  const onPasswordSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match!")
      return;
    }
    setPending(true);
    signIn("password", { email, password, flow: "signUp" })
      .catch(() => {
        setError("Something went wrong!");
      })
      .finally(() => setPending(false));
  }



  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0 pb-2">
        <CardTitle>Sign up to continue</CardTitle>
      </CardHeader>
      <CardDescription className="pb-1">
        Use your email or another service to continue
      </CardDescription>
      {!!error && (
        <div className="flex items-center bg-destructive/10 text-destructive p-2 gap-x-2 rounded-xl mb-3">
          <TriangleAlert />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignUp} className="space-y-2.5">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            type="password"
            required
          />
          <Button className="w-full" size="lg" disabled={pending} type="submit">
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            className="w-full relative"
            size="lg"
            disabled={pending}
            onClick={() => {}}
            variant={"outline"}
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Continue with Google
          </Button>
          <Button
            className="w-full relative"
            size="lg"
            disabled={pending}
            onClick={() => handleSignUp("github")}
            variant={"outline"}
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => {
              setState("signIn");
            }}
          >
            Log In
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
