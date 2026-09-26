export const getMasteryBadgeClass = (level: number | string) => {
  const lvl = typeof level === 'string' ? level.toLowerCase() : level;
  if (lvl === 1 || lvl === 'emerging' || lvl === 'beginning') {
    return 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900';
  }
  if (lvl === 2 || lvl === 'developing') {
    return 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900';
  }
  if (lvl === 3 || lvl === 'proficient') {
    return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900';
  }
  return 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900';
};

export const getMasteryText = (level: number): string => {
  switch (level) {
    case 1:
      return 'Emerging (Level 1)';
    case 2:
      return 'Developing (Level 2)';
    case 3:
      return 'Proficient (Level 3)';
    case 4:
      return 'Advanced (Level 4)';
    default:
      return 'Unrated';
  }
};

export const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};
