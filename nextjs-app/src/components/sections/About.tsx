import Image from 'next/image';
import { CheckCircle2, FileText, Handshake, MapPin, IndianRupee } from 'lucide-react';

const POINTS = [
  { icon: CheckCircle2, title: 'DTCP Approved Layouts', desc: 'All our plots have proper government approvals.' },
  { icon: FileText, title: 'Clear Title Documents', desc: 'Pattadar & registration paperwork always ready.' },
  { icon: Handshake, title: 'Honest & Transparent', desc: 'No hidden charges. What we say is what you get.' },
  { icon: MapPin, title: 'Local Nellore Experts', desc: 'We know every road, village and mandal in the district.' },
  { icon: IndianRupee, title: 'Best Market Prices', desc: 'Competitive rates with flexible options.' }
];

export function About() {
  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[3px] uppercase text-[var(--color-teal)]">
            About Us · మా గురించి
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-gray-900 mt-2">
            Nellore&apos;s Trusted Real Estate Partner
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-2xl mx-auto">
            Building trust and fulfilling property dreams across Nellore District since 2014.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Founded by <strong className="text-gray-900">Sk. Ahamad</strong> and{' '}
              <strong className="text-gray-900">Sk. Umar</strong>, SMA Builders & Real Estates is based near
              NTS Gate, పడుగుపాడు, Nellore. We specialize in DTCP-approved residential plots, open layouts, flats, houses, and agricultural land — all with clear title documents and hassle-free registration.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <Stat n="10+" l="Years Active" />
              <Stat n="500+" l="Happy Clients" />
              <Stat n="50+" l="Projects" />
            </div>

            <ul className="space-y-3">
              {POINTS.map((p) => (
                <li key={p.title} className="flex gap-3">
                  <p.icon size={20} className="text-[var(--color-teal)] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 text-sm">{p.title}</strong>
                    <span className="text-gray-500 text-sm"> – {p.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"
              alt="SMA Builders office"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-[var(--color-amber)] text-gray-900 text-xs font-bold shadow-lg">
              🏆 Trusted Since 2014
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="text-center bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="font-display text-2xl font-black text-[var(--color-navy)]">{n}</div>
      <div className="text-xs uppercase tracking-wide text-gray-500 mt-1">{l}</div>
    </div>
  );
}
