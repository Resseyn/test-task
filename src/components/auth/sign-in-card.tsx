interface SignInCard {
  setState: (state: SignInFlow) => void;
}

export function SignInCard({ setState }: SignInCard) {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => setPending(false));
  };

  function handlePasswordSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("Invalid email or password!");
      })
      .finally(() => setPending(false));
  }

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0 pb-2">
        <CardTitle>Log in to continue</CardTitle>
      </CardHeader>
      <CardDescription className="pb-1 pt-0">Use your email or another service to continue</CardDescription>
      {!!error && (
        <div className="flex items-center bg-destructive/10 text-destructive p-2 gap-x-2 rounded-xl mb-3">
          <TriangleAlert />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={handlePasswordSignIn}>
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
          <Button className="w-full" size="lg" disabled={pending} type="submit">
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button className="w-full relative" size="lg" disabled={pending} onClick={() => {}} variant={"outline"}>
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Continue with Google
          </Button>
          <Button
            className="w-full relative"
            size="lg"
            disabled={pending}
            onClick={() => handleSignIn("github")}
            variant={"outline"}
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don't have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => {
              setState("signUp");
            }}
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
