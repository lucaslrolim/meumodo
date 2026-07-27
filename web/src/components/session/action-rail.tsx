"use client";

import { useRef } from "react";
import { Heart, Export } from "@phosphor-icons/react/ssr";
import { likeBurst } from "@/lib/motion";

/** Reaction rail for the answered card: like + share only, and only after
 * the student has answered (wireframe `#study` answer view). Deliberately
 * two items in a compact stack rather than a tall five-item column — the
 * borrowed idea is "react to what you just saw", not TikTok's rail itself.
 * Hint, tutor and source stay in the CTA row where they belong. */
export function ActionRail({
  liked,
  likeCount,
  onLike,
  onShare,
}: {
  liked: boolean;
  likeCount: number;
  onLike: () => void;
  onShare: () => void;
}) {
  const heartRef = useRef<HTMLSpanElement>(null);

  const handleLike = () => {
    onLike();
    if (heartRef.current) likeBurst(heartRef.current);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleLike}
        aria-pressed={liked}
        aria-label="Curtir este card"
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-heading font-bold text-[13px] transition-colors ${
          liked
            ? "border-mm-heart/40 bg-mm-heart-soft text-mm-heart"
            : "border-mm-border text-mm-ink-2"
        }`}
      >
        <span ref={heartRef} className="inline-flex">
          <Heart size={15} weight={liked ? "fill" : "regular"} />
        </span>
        {likeCount}
      </button>
      <button
        type="button"
        onClick={onShare}
        aria-label="Compartilhar este card"
        className="flex items-center justify-center rounded-full border border-mm-border p-2 text-mm-ink-2 transition-transform active:scale-90"
      >
        <Export size={15} weight="regular" />
      </button>
    </div>
  );
}
