"use server";

import { Prisma } from "@prisma/client";
import { randomBytes } from "node:crypto";
import { z } from "zod";

import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
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

function createEmployeeCode() {
  return `EG-${randomBytes(4).toString("hex").toUpperCase()}`;
}

async function createUserWithEmployeeCode({
  email,
  language,
  name,
  password,
  theme,
}: {
  email: string;
  language: "ko" | "en";
  name: string;
  password: string;
  theme: "light";
}) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.user.create({
        data: {
          email,
          name,
          employeeCode: createEmployeeCode(),
          notificationEmail: email,
          language,
          theme,
          passwordHash: await hashPassword(password),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        Array.isArray(error.meta?.target) &&
        error.meta.target.includes("employeeCode")
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Could not allocate a unique employee code.");
}

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

    const user = await createUserWithEmployeeCode({ email, language, name, password, theme });
    await createSession(user.id);

    return { ok: true, message: "Registration complete. User information was saved." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "A user with this email already exists." };
    }

    return { ok: false, message: "Registration failed. Try again shortly." };
  }
}
