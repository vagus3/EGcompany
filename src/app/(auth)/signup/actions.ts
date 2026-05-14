"use server";

import { Prisma } from "@prisma/client";
import { z } from "zod";

import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db/prisma";

export type SignUpState = {
  ok: boolean;
  message: string;
};

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Full name is required."),
  email: z.string().trim().email("Use a valid corporate email.").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  language: z.enum(["ko", "en"]).default("ko"),
  theme: z.literal("light").default("light"),
  conduct: z.literal("on", {
    error: "You must acknowledge the code of conduct.",
  }),
});

export async function signUpAction(
  _previousState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    language: formData.get("language") ?? "ko",
    theme: formData.get("theme") ?? "light",
    conduct: formData.get("conduct"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Check the submitted information.",
    };
  }

  const { name, email, password, language, theme } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return { ok: false, message: "A user with this email already exists." };
    }

    await prisma.user.create({
      data: {
        email,
        name,
        language,
        theme,
        passwordHash: await hashPassword(password),
      },
    });

    return { ok: true, message: "Registration complete. User information was saved." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "A user with this email already exists." };
    }

    return { ok: false, message: "Registration failed. Try again shortly." };
  }
}
