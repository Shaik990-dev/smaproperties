import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import { getPropertiesServer, getPropertyServer } from '@/lib/firebase-server';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyMap } from '@/components/property/PropertyMap';
import { Badge } from '@/components/ui/Badge';
import { AGENTS } from '@/data/agents';
import { waLink, telLink } from '@/lib/utils';
import { breadcrumbJsonLd } from '@/lib/seo';
import type { Property } from '@/lib/types';

export const revalidate = 60;

// Pre-render all properties at build time
export async function generateStaticParams() {
  const properties = await getPropertiesServer();
  return properties.map((p) => ({ id: p.id }));
}

const OG_FALLBACK = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80';

// Per-property SEO metadata (title, description, OG)
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await getPropertyServer(id);
  if (!p) return notFound();

  // No trailing "| SMA Builders" — layout template appends "| SMA Builders Nellore"
  const title = `${p.name} — ${p.typeLabel} for Sale in Nellore`;
  const desc = [
    p.name,
    p.typeLabel,
    p.availability,
    p.price,
    p.area,
    'Clear title. SMA Builders Nellore.'
  ].filter(Boolean).join(' · ');
  const description = desc.length > 155 ? desc.slice(0, 152) + '…' : desc;
  const url = `https://smaproperties.in/properties/${p.id}`;
  const ogImage = p.pics?.[0] ?? OG_FALLBACK;

  return {
    title,
    description,
    keywords: [
      `${p.typeLabel} nellore`, `${p.type} for sale nellore`, p.name,
      `buy ${p.type} nellore`, `${p.type} in nellore`, 'SMA builders nellore',
      ...p.tags.slice(0, 5)
    ],
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{ url: ogImage, alt: p.name, width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    },
    alternates: { canonical: url }
  };
}

function buildJsonLd(p: Property) {
  const offerBase = {
    '@type': 'Offer',
    url: `https://smaproperties.in/properties/${p.id}`,
    availability:
      p.availability.toLowerCase().includes('sold') || p.availability.toLowerCase().includes('not')
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
    priceCurrency: 'INR',
    ...(p.priceNumber
      ? { price: p.priceNumber }
      : { priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'INR', description: 'Contact for price' } }),
    seller: {
      '@type': 'RealEstateAgent',
      name: 'SMA Builders & Real Estates',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'NTS Gate, Padugupadu',
        addressLocality: 'Nellore',
        addressRegion: 'Andhra Pradesh',
        postalCode: '524137',
        addressCountry: 'IN'
      }
    }
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: `${p.typeLabel} located at ${p.address}. ${p.availability}.`,
    image: p.pics,
    brand: { '@type': 'Organization', name: 'SMA Builders & Real Estates', url: 'https://smaproperties.in' },
    category: p.typeLabel,
    offers: offerBase
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getPropertyServer(id);

  if (!p) return notFound();

  const enquiryMsg = `Hi SMA Builders! 🏠\nInterested in: *${p.name}*\nAddress: ${p.address}\nPlease share details.`;
  const jsonLd = buildJsonLd(p);
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: 'https://smaproperties.in' },
    { name: 'Properties', url: 'https://smaproperties.in/properties' },
    { name: p.name, url: `https://smaproperties.in/properties/${p.id}` }
  ]);

  // Get up to 3 similar properties (same type, excluding current)
  const all = await getPropertiesServer();
  const similar = all.filter((x) => x.type === p.type && x.id !== p.id).slice(0, 3);

  return (
    <>
      {/* JSON-LD structured data — invisible to users, gold for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 text-sm">
            <ol className="flex items-center gap-2 text-gray-500">
              <li><Link href="/" className="hover:text-[var(--color-navy)]">Home</Link></li>
              <li>›</li>
              <li><Link href="/properties" className="hover:text-[var(--color-navy)]">Properties</Link></li>
              <li>›</li>
              <li className="text-gray-900 truncate max-w-[200px]">{p.name}</li>
            </ol>
          </nav>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--color-navy)] mb-6"
          >
            <ArrowLeft size={16} /> Back to all properties
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left – gallery + details */}
            <div className="lg:col-span-2 space-y-6">
              <PropertyGallery images={p.pics} alt={p.name} />

              <article className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="text-xs text-[var(--color-teal)] font-bold uppercase tracking-wide">
                      {p.typeLabel}
                    </div>
                    <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 mt-1">
                      {p.name}
                    </h1>
                    {p.nameLocal && <p className="text-gray-500 text-sm mt-1">{p.nameLocal}</p>}
                  </div>
                  {p.badge && <Badge color={p.badgeColor}>{p.badge}</Badge>}
                </div>

                <div className="flex items-start gap-2 mt-4 text-gray-600">
                  <MapPin size={16} className="text-[var(--color-amber)] flex-shrink-0 mt-1" />
                  <span>{p.address}</span>
                </div>

                <div className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                  <CheckCircle size={14} /> {p.availability}
                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                  {p.tags.map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>

                <hr className="my-6 border-gray-100" />

                <h2 className="font-bold text-gray-900 mb-4">Property Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {p.details.map((d) => (
                    <div key={d.label} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                      <span className="text-2xl">{d.icon}</span>
                      <div>
                        <strong className="block text-xs text-gray-500 uppercase">{d.label}</strong>
                        <span className="text-sm text-gray-900">{d.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              {/* Map */}
              <PropertyMap address={p.address} name={p.name} />

              {/* Similar properties */}
              {similar.length > 0 && (
                <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
                  <h2 className="font-display text-2xl font-black text-gray-900 mb-4">
                    Similar Properties
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {similar.map((s) => (
                      <Link
                        key={s.id}
                        href={`/properties/${s.id}`}
                        className="block group"
                      >
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                          {s.pics?.[0] && (
                            // Plain img to avoid extra Image config; ok for thumbnail
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={s.pics[0]}
                              alt={s.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          )}
                        </div>
                        <h3 className="mt-2 text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-[var(--color-navy)]">
                          {s.name}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{s.address}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right – contact agents (sticky) */}
            <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-1">📞 Contact Our Agents</h3>
                <p className="text-xs text-gray-500 mb-5">Get in touch directly via call or WhatsApp.</p>

                {AGENTS.map((a) => (
                  <div key={a.name} className="mb-5 last:mb-0">
                    <p className="font-semibold text-sm text-gray-900 mb-2">👤 {a.name}</p>
                    <div className="flex flex-col gap-2">
                      <a
                        href={waLink(a.whatsapp, enquiryMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--color-wa)] text-white text-sm font-bold"
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </a>
                      {a.phones.map((ph) => (
                        <a
                          key={ph}
                          href={telLink(ph)}
                          className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--color-navy)] text-white text-sm font-bold"
                        >
                          <Phone size={14} /> {ph}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
