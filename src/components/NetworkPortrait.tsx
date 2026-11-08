"use client";

import { useState } from "react";
import { initials } from "@/lib/format";

export default function NetworkPortrait({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-surface)]">
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/network-images/${encodeURIComponent(id)}`}
          alt={name}
          loading="lazy"
          referrerPolicy="same-origin"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain object-center p-1"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface)]">
          <span className="text-[28px] font-semibold tracking-tight text-3">{initials(name)}</span>
        </div>
      )}
    </div>
  );
}
