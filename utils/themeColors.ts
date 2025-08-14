export function updateThemeColor(tag: string, documentRef: React.RefObject<Document | null>) {
  const colorMap = {
    AI: { dark: '#7a96d1', darker: '#6382b9', primary: '#95ade9' },
    Angular: { dark: '#b80029', darker: '#9a0022', primary: '#dd0031' },
    JavaScript: { dark: '#b1a116', darker: '#9a8713', primary: '#d4c01a' },
    'Node.js': { dark: '#2e8a2e', darker: '#267a26', primary: '#339933' },
    React: { dark: '#35acd5', darker: '#2895c2', primary: '#4bc3e8' },
    TypeScript: { dark: '#2866a8', darker: '#1f548a', primary: '#3178c6' },
    'Vue.js': { dark: '#42a378', darker: '#358663', primary: '#4fc08d' },
  };

  const colors = colorMap[tag as keyof typeof colorMap] || {
    dark: '#6b21ff',
    darker: '#5b1ddb',
    primary: '#8132fe',
  };

  const root = documentRef.current?.documentElement;
  if (root) {
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-dark', colors.dark);
    root.style.setProperty('--color-primary-darker', colors.darker);
  }
}
