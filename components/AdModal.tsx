"use client";

import { useEffect, useState } from "react";

interface AdModalProps {
  onComplete: () => void;
}

const DURATION = 10;

export default function AdModal({ onComplete }: AdModalProps) {
  const [timeLeft, setTimeLeft] = useState(DURATION);

  useEffect(() => {
    // Push AdSense unit once the modal mounts
    try {
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
    } catch {
      // AdSense blocked or not loaded
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const elapsed = DURATION - timeLeft;
  const progress = (elapsed / DURATION) * 100;
  const canPass = timeLeft === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl w-full max-w-[520px] overflow-hidden shadow-2xl">

        {/* ── Ad zone ── */}
        <div className="bg-[#F6F7F9] px-6 pt-5 pb-6 flex flex-col items-center min-h-[280px]">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.18em] mb-4 self-start w-full text-center">
            Publicité
          </p>
          <div className="w-full flex-1 flex items-center justify-center">
            <ins
              className="adsbygoogle"
              style={{ display: "block", width: "100%", minHeight: "200px" }}
              data-ad-client="ca-pub-8073783780020241"
              data-ad-slot="1571044029"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-gray-200" />

        {/* ── Content ── */}
        <div className="px-7 pt-6 pb-7 space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-[19px] font-bold text-gray-900 leading-snug">
              ConvertPilot est 100&nbsp;% gratuit
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              10 secondes de pub suffisent à faire vivre l&apos;outil.<br />
              Merci pour votre soutien&nbsp;!
            </p>
          </div>

          {/* Timer text */}
          <p className="text-sm text-center text-gray-500">
            {canPass ? (
              <span className="font-semibold text-gray-700">Prêt !</span>
            ) : (
              <>Encore <span className="font-bold text-gray-900">{timeLeft}s</span></>
            )}
          </p>

          {/* Progress bar */}
          <div className="h-[3px] bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 rounded-full transition-[width] duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* CTA button */}
          <button
            onClick={canPass ? onComplete : undefined}
            disabled={!canPass}
            className={`w-full py-[15px] rounded-full font-semibold text-sm tracking-wide transition-all duration-300
              ${canPass
                ? "bg-gray-900 text-white hover:bg-gray-700 cursor-pointer"
                : "bg-gray-300 text-white cursor-not-allowed"
              }`}
          >
            Passer
          </button>
        </div>

      </div>
    </div>
  );
}
