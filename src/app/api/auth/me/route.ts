import { getCurrentUser } from "@/lib/auth/session";
import { getOrCreateTerminalState } from "@/lib/terminal-state";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ user: null, adminTestRequired: false, adminTestPassed: false });
  }

  const terminalState = await getOrCreateTerminalState(user.id);

  return Response.json({
    user: {
      email: user.email,
      name: user.name,
    },
    adminTestRequired: terminalState.adminTestRequired,
    adminTestPassed: terminalState.adminTestPassed,
  });
}
