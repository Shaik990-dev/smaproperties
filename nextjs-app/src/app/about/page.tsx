import { About } from '@/components/sections/About';
import { Testimonials } from '@/components/sections/Testimonials';

export const metadata = {
  title: 'About Us – SMA Builders & Real Estates',
  description: 'Learn about SMA Builders & Real Estates, Nellore\'s trusted real estate partner since 2014.'
};

export default function AboutPage() {
  return (
    <>
      <About />
      <Testimonials />
    </>
  );
}
