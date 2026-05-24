export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const connectToDatabase = (await import("./lib/db")).default;
    await connectToDatabase();
  }
}
