import { pageMeta } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Success Stories — Real Visa Approvals',
  description: 'Visa approvals, video testimonials and reviews from students, families and professionals helped by Punjab Immigration, Amritsar.',
  path: '/happy-customers',
});

export default function StoriesLayout({ children }) {
  return children;
}
