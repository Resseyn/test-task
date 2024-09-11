import { Button, Card, CardContent, CardHeader, Input } from "@mui/material";
import { useState } from "react";
import { authenticate } from "@/lib/actions";
import { Error } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export function SignInCard() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const formAction = async (formData: FormData) => {
    setIsPending(true);
    setErrorMessage(null);

    try {
      const error = await authenticate(formData);
      if (!error) {
        router.push("/");
      } else {
        setErrorMessage(error);
      }
    } catch (error) {
      setErrorMessage("Неизвестная ошибка");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0 pb-2">
        <p>Log in to continue</p>
      </CardHeader>
      <div className="pb-4 pt-0">Введите логин и пароль для продолжения</div>

      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" action={formAction}>
          <div className="flex flex-col gap-6">
            <Input
              disabled={isPending}
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              type="username"
              required
            />
            <Input
              disabled={isPending}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              required
            />
            {!!errorMessage && (
              <div className="flex items-center bg-red-300 text-destructive p-2 gap-x-2 rounded-xl mb-3">
                <Error />
                <p>{errorMessage}</p>
              </div>
            )}
            <Button className="w-full" disabled={isPending} type="submit">
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
