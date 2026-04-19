"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: next-auth signIn 연결
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">로그인</h1>
            <p className="text-gray-400 text-sm mt-1">계정에 접속하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2.5 font-semibold text-sm transition-colors"
            >
              로그인
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            계정이 없으신가요?{" "}
            <Link href="/register" className="text-blue-400 hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
