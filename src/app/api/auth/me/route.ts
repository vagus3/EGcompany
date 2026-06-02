import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ user: null });
  }

  return Response.json({
    user: {
      email: user.email,
      name: user.name,
    },
  });
}
