export function playSound(src: string, options?: { loop?: boolean }) {
  if (typeof window === "undefined") return undefined;

  const audio = new Audio(src);
  if (options?.loop) audio.loop = true;
  void audio.play().catch(() => {});
  return audio;
}
