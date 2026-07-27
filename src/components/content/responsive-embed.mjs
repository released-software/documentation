const providerHosts = {
  youtube: new Set(['youtu.be', 'youtube.com', 'www.youtube.com', 'm.youtube.com']),
  loom: new Set(['loom.com', 'www.loom.com'])
};

function parseMediaId(sourceUrl, provider, src) {
  const segments = sourceUrl.pathname.split('/').filter(Boolean);

  if (provider === 'youtube') {
    let mediaId;
    if (sourceUrl.hostname === 'youtu.be' && segments.length === 1) {
      [mediaId] = segments;
    } else if (sourceUrl.pathname === '/watch') {
      mediaId = sourceUrl.searchParams.get('v') ?? undefined;
    } else if (
      segments.length === 2 &&
      ['embed', 'shorts', 'live'].includes(segments[0])
    ) {
      mediaId = segments[1];
    }
    if (!mediaId || !/^[A-Za-z0-9_-]{11}$/.test(mediaId)) {
      throw new Error(
        `ResponsiveEmbed could not find a valid YouTube video ID in "${src}"`
      );
    }
    return mediaId;
  }

  const mediaId =
    segments.length === 2 && ['share', 'embed'].includes(segments[0])
      ? segments[1]
      : undefined;
  if (!mediaId || !/^[a-f0-9]{32}$/.test(mediaId)) {
    throw new Error(
      `ResponsiveEmbed could not find a valid Loom video ID in "${src}"`
    );
  }
  return mediaId;
}

export function normalizeResponsiveEmbed({
  src,
  title,
  provider,
  aspectRatio = '16/9'
}) {
  if (provider !== 'youtube' && provider !== 'loom') {
    throw new Error(`ResponsiveEmbed received an unsupported provider: "${provider}"`);
  }

  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    throw new Error('ResponsiveEmbed requires a non-empty title');
  }

  let sourceUrl;
  try {
    sourceUrl = new URL(src);
  } catch {
    throw new Error(`ResponsiveEmbed received an invalid URL: "${src}"`);
  }

  if (
    sourceUrl.protocol !== 'https:' ||
    sourceUrl.username ||
    sourceUrl.password ||
    (sourceUrl.port && sourceUrl.port !== '443')
  ) {
    throw new Error(
      'ResponsiveEmbed sources must use a standard HTTPS URL without credentials'
    );
  }

  const hostname = sourceUrl.hostname.toLowerCase();
  if (!providerHosts[provider].has(hostname)) {
    throw new Error(
      `ResponsiveEmbed provider "${provider}" does not allow hostname "${hostname}"`
    );
  }

  const mediaId = parseMediaId(sourceUrl, provider, src);
  const ratioMatch = aspectRatio.match(/^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (
    !ratioMatch ||
    Number(ratioMatch[1]) <= 0 ||
    Number(ratioMatch[2]) <= 0
  ) {
    throw new Error(
      `ResponsiveEmbed received an invalid aspect ratio: "${aspectRatio}"`
    );
  }

  return {
    embedSrc:
      provider === 'youtube'
        ? `https://www.youtube-nocookie.com/embed/${mediaId}`
        : `https://www.loom.com/embed/${mediaId}`,
    title: normalizedTitle,
    aspectRatio: `${ratioMatch[1]} / ${ratioMatch[2]}`
  };
}
