type Props = {
  url: string;
  titulo?: string;
};

function obtenerEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);

    // YouTube - youtube.com/watch?v=ID
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }

    // YouTube - youtu.be/ID
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }

    // YouTube - youtube.com/embed/ID (ya es embed)
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/embed/')) {
      return url;
    }

    // Vimeo - vimeo.com/ID
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) {
        return `https://player.vimeo.com/video/${id}`;
      }
    }

    // Si ya es un iframe/embed, devolver tal cual
    if (url.includes('embed') || url.includes('player.')) {
      return url;
    }

    return null;
  } catch {
    return null;
  }
}

export default function VideoEmbed({ url, titulo }: Props) {
  const embedUrl = obtenerEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className="glass-card-strong rounded-[22px] p-6 border-l-4 border-[#FF9500]">
        <p className="text-sm text-black/70">
          ⚠️ No se pudo reconocer la URL del video.{' '}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#007AFF] font-medium hover:underline"
          >
            Abrir en nueva pestaña →
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card-strong rounded-[22px] overflow-hidden animate-slide-up">
      <div className="px-6 pt-5 pb-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#FF3B30]/10 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-[#FF3B30]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-black/70 uppercase tracking-wide">
          {titulo || 'Video explicativo'}
        </p>
      </div>

      <div className="relative w-full aspect-video bg-black">
        <iframe
          src={embedUrl}
          title={titulo || 'Video'}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}