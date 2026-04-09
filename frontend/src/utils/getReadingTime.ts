export function getReadingTime(text: string): string {
  const wordsPerMinute = 225; // average reading speed
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return `${minutes} min read`;
}
