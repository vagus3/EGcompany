import { createEmployeeCardHtml, type EmployeeCardPayload } from "@/lib/employee-card";

export async function sendEmployeeCardEmail(payload: EmployeeCardPayload) {
  const html = createEmployeeCardHtml(payload);

  if (!process.env.RESEND_API_KEY) {
    console.info("[mock-email] employee card queued", {
      to: payload.email,
      employeeCode: payload.employeeCode,
      hintPromptCount: payload.hintPromptCount,
      rank: payload.rank,
    });

    return {
      id: `mock-${Date.now()}`,
      mode: "mock" as const,
      html,
    };
  }

  // Install `resend` and replace this branch when the production sender domain is ready.
  console.info("[email] RESEND_API_KEY exists, but Resend SDK is not installed yet.");

  return {
    id: `pending-resend-${Date.now()}`,
    mode: "pending-resend" as const,
    html,
  };
}
