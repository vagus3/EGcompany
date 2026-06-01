"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import PretextEndingChallenge from "../PretextEndingChallenge";

export default function PretextPageClient() {
  const router = useRouter();
  const completedRef = useRef(false);

  function handleComplete() {
    if (completedRef.current) return;
    completedRef.current = true;
    router.replace("/portals/security/terminal?pretextComplete=1");
  }

  return <PretextEndingChallenge onComplete={handleComplete} />;
}
