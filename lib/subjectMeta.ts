export const subjectMeta: Record<string, { icon: string; color: string }> = {
  'discrete-mathematics': { icon: '🔢', color: '#6366f1' },
  'data-structures':      { icon: '🌲', color: '#10b981' },
  'algorithms':           { icon: '⚡', color: '#f59e0b' },
  'operating-systems':    { icon: '💻', color: '#ef4444' },
  'computer-networks':    { icon: '🌐', color: '#3b82f6' },
  'databases':            { icon: '🗄️',  color: '#8b5cf6' },
}

export function getSubjectMeta(slug: string) {
  return subjectMeta[slug] ?? { icon: '📚', color: 'var(--brand-primary)' }
}
