'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Pequeño delay para no aparecer instantáneamente
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function aceptar() {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setVisible(false);
  }

  function rechazar() {
    localStorage.setItem('cookie-consent', 'rejected');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[100] animate-slide-up">
      <div className="glass-card-strong rounded-[22px] p-5 shadow-xl shadow-black/10 border border-black/5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#007AFF]/10 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🍪</span>
          </div>
          <div>
            <h3 className="font-semibold text-black text-sm">
              Usamos cookies
            </h3>
            <p className="text-xs text-black/60 mt-1 leading-relaxed">
              Utilizamos almacenamiento local para guardar tu progreso de
              estudio. No usamos cookies de rastreo publicitario.{' '}
              <Link
                href="/legal/cookies"
                className="text-[#007AFF] font-medium hover:underline"
              >
                Más información
              </Link>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={rechazar}
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/[0.05] text-black/70 text-sm font-medium hover:bg-black/[0.08] tap-scale"
          >
            Solo esenciales
          </button>
          <button
            onClick={aceptar}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#007AFF] text-white text-sm font-semibold hover:bg-[#0066DD] tap-scale"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}