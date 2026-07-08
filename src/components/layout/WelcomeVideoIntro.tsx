"use client";

export function WelcomeVideoIntro({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="fixed inset-0 z-200 bg-black">
      <video
        src="/EGCompany_webVideo.mp4"
        autoPlay
        playsInline
        onEnded={onComplete}
        onError={onComplete}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
