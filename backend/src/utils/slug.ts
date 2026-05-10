import { randomUUID } from 'node:crypto';

const shortId = () => randomUUID().split('-')[0];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 42);

export const buildShareSlug = (title: string) => {
  const base = normalize(title) || 'trip';
  return `${base}-${shortId()}`;
};
