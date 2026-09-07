// Najnowsze filmy z kanału YouTube — publiczny feed RSS (bez klucza API).
export type YtVideo = { id: string; title: string; published: string; thumb: string }

function decode(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

export async function getLatestYouTube(channelId: string, limit = 5): Promise<YtVideo[]> {
  if (!channelId) return []
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      next: { revalidate: 1800 },
    })
    if (!res.ok) return []
    const xml = await res.text()
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    const out: YtVideo[] = []
    for (const e of entries) {
      const block = e[1]
      const id = (block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1]
      const title = (block.match(/<title>([^<]+)<\/title>/) || [])[1]
      const published = (block.match(/<published>([^<]+)<\/published>/) || [])[1] || ''
      if (id && title) {
        out.push({ id, title: decode(title), published, thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` })
      }
      if (out.length >= limit) break
    }
    return out
  } catch {
    return []
  }
}
