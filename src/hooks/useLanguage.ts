"use client";

import { useSyncExternalStore } from "react";

export type Language = "ko" | "en";

const LANG_KEY = "eg-language";
const LANG_EVENT = "eg-language-change";

function getSnapshot(): Language {
  return window.localStorage.getItem(LANG_KEY) === "en" ? "en" : "ko";
}

function getServerSnapshot(): Language {
  return "ko";
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(LANG_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LANG_EVENT, onChange);
  };
}

export function useLanguage(): Language {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
