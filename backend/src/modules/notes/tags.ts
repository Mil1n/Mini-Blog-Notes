export const normalizeTags = (tags: string[]) => [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];

export const serializeTags = (tags: string[]) => JSON.stringify(normalizeTags(tags));

export const parseTags = (tags: string) => {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? normalizeTags(parsed.filter((tag): tag is string => typeof tag === 'string')) : [];
  } catch {
    return normalizeTags(tags.split(','));
  }
};
