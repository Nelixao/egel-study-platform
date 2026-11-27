'use client';

import Link from 'next/link';
import { guardarPracticaPendiente } from '@/lib/practica-pendiente';

export default function PracticarSubareaLink({
  subareaId,
}: {
  subareaId: number;
}) {
  return (
    <Link
      href="/simulador"
      onClick={() => guardarPracticaPendiente([subareaId], false)}
      className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-[#007AFF] shadow-lg shadow-black/10 transition-colors hover:bg-white/90"
    >
      Iniciar práctica
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
}
