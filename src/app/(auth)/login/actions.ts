"use server";

import { z } from "zod";

import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export type LoginState = {
  ok: boolean;
  message: string;
};

const loginSchema = z.object({
  email: z.string().trim().email("Use a valid corporate email.").toLowerCase(),
  password: z.string().min(1, "Password is required."),
});

export async function loginAction(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Check the submitted information.",
    };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    return { ok: false, message: "Invalid email or password." };
  }

  await createSession(user.id);

  return { ok: true, message: "Signed in." };
}
