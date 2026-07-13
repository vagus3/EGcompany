"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import { PRETEXT_FOUND_LETTERS_STORAGE_KEY } from "@/lib/terminal-data";
import PretextEndingChallenge from "../PretextEndingChallenge";

export default function PretextPageClient() {
  const router = useRouter();
  const completedRef = useRef(false);

  function handleComplete(letters: string[]) {
    if (completedRef.current) return;
    completedRef.current = true;
    // 메인 터미널 페이지로 돌아가면 거기서 서버에 완료 처리를 요청하는데, 그때
    // 실제로 찾은 글자 순서를 같이 보내 서버가 검증할 수 있도록 넘겨준다.
    try {
      window.sessionStorage.setItem(PRETEXT_FOUND_LETTERS_STORAGE_KEY, JSON.stringify(letters));
    } catch {}
    router.replace("/portals/security/terminal?pretextComplete=1");
  }

  return <PretextEndingChallenge onComplete={handleComplete} />;
}
