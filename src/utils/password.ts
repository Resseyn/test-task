import crypto from "crypto";

function saltAndHashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

  return { salt, hash };
}

const credentials = { password: "your_password_here" };
const pwHash = saltAndHashPassword(credentials.password);
console.log(pwHash);
