import { stdin, stdout } from "node:process";

/**
 * Reads a secret from a TTY without echoing it. Refuses to run when stdin is not
 * interactive so a password can never arrive from a pipe or CI variable.
 */
export async function readSecret(prompt: string): Promise<string> {
  if (!stdin.isTTY) throw new Error("Input rahasia memerlukan terminal interaktif.");
  stdout.write(prompt);
  const wasRaw = stdin.isRaw;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");
  try {
    return await new Promise<string>((resolve, reject) => {
      let value = "";
      const onData = (chunk: string) => {
        for (const character of chunk) {
          if (character === "\u0003") {
            stdin.off("data", onData);
            reject(new Error("Dibatalkan."));
            return;
          }
          if (character === "\r" || character === "\n") {
            stdin.off("data", onData);
            resolve(value);
            return;
          }
          if (character === "\u007f" || character === "\b")
            value = Array.from(value).slice(0, -1).join("");
          else if (character >= " ") {
            if (value.length + character.length > 128) {
              stdin.off("data", onData);
              reject(new Error("Kata sandi terlalu panjang."));
              return;
            }
            value += character;
          }
        }
      };
      stdin.on("data", onData);
    });
  } finally {
    stdin.setRawMode(wasRaw);
    stdin.pause();
    stdout.write("\n");
  }
}
