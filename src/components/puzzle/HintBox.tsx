"use client";

import { useTextLayout } from "@/lib/pretext/useTextLayout";
import { motion, AnimatePresence } from "framer-motion";

interface HintBoxProps {
  hint: string;
  visible: boolean;
  containerWidth?: number;
}

export default function HintBox({ hint, visible, containerWidth = 320 }: HintBoxProps) {
  // PreText.js로 DOM 없이 텍스트 높이를 미리 계산 → 애니메이션 height가 정확함
  const { height, lineCount } = useTextLayout(hint, {
    font: '14px "Inter", sans-serif',
    containerWidth: containerWidth - 32, // padding 제외
    lineHeight: 22,
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: height + 48 }} // 계산된 정확한 높이
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ width: containerWidth }}
          className="overflow-hidden rounded-lg border border-yellow-500/30 bg-yellow-900/20 backdrop-blur-sm"
        >
          <div className="p-4">
            <p className="text-xs font-semibold text-yellow-400 mb-2">💡 힌트</p>
            <p className="text-sm text-yellow-100 leading-relaxed">{hint}</p>
            {lineCount > 3 && (
              <p className="text-xs text-yellow-500/60 mt-2">{lineCount}줄</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
