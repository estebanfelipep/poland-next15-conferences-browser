import type { SelectItem } from '@/components/ui/select/Select';

export function updateThemeColor(items: SelectItem[], documentRef: React.RefObject<Document | null>) {
  const lastSelectedTag = items.length > 0 ? items[items.length - 1].value : null;

  const colorMap = {
    AI: { dark: '#7a96d1', darker: '#6382b9', primary: '#95ade9' },
    Angular: { dark: '#b80029', darker: '#9a0022', primary: '#dd0031' },
    Astro: { dark: '#bc52ee', darker: '#a042d4', primary: '#dc63f7' },
    JavaScript: { dark: '#b1a116', darker: '#9a8713', primary: '#d4c01a' },
    'Next.js': { dark: '#000000', darker: '#000000', primary: '#000000' },
    'Node.js': { dark: '#2e8a2e', darker: '#267a26', primary: '#339933' },
    React: { dark: '#35acd5', darker: '#2895c2', primary: '#4bc3e8' },
    'React Native': { dark: '#35acd5', darker: '#2895c2', primary: '#4bc3e8' },
    SolidJS: { dark: '#2c4f96', darker: '#1e3a6f', primary: '#446ace' },
    Svelte: { dark: '#c1341c', darker: '#a02e19', primary: '#ff3e00' },
    TypeScript: { dark: '#2866a8', darker: '#1f548a', primary: '#3178c6' },
    'Vue.js': { dark: '#42a378', darker: '#358663', primary: '#4fc08d' },
  };

  const colors = (lastSelectedTag && colorMap[lastSelectedTag as keyof typeof colorMap]) || {
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
