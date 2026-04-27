'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { MapPin, Clock, Phone, MessageCircle } from 'lucide-react';
import { AGENTS, OFFICE } from '@/data/agents';
import { waLink, telLink } from '@/lib/utils';
import { saveInquiry } from '@/lib/inquiries';
import { notifyOwner } from '@/lib/emailjs';

export function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Please enter your name and phone number.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.replace(/[\s\-]/g, ''))) {
      toast.error('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setSubmitting(true);
    try {
      // 1. Save lead to Firebase FIRST so we capture it even if WhatsApp fails
      await saveInquiry({
        name,
        phone,
        message: message || `Interested in: ${interest || 'General Enquiry'}`,
        source: 'home_contact'
      });
      // 2. Notify owner by email (best-effort, non-blocking on failure)
      notifyOwner({ type: 'lead', name, phone, message, interest }).catch(() => {});
      // 3. Open WhatsApp with pre-filled message
      const text = `Hi SMA Builders! 🏠\n*Name:* ${name}\n*Phone:* ${phone}\n*Interested in:* ${interest || 'General Enquiry'}\n*Message:* ${message || '-'}`;
      window.open(waLink(AGENTS[0].whatsapp, text), '_blank');
      toast.success("Enquiry received! We'll contact you shortly.");
      setSent(true);
      setName(''); setPhone(''); setInterest(''); setMessage('');
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      console.error(err);
      toast.error('Could not send enquiry. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[3px] uppercase text-[var(--color-teal)]">
            Contact Us · సంప్రదించండి
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-gray-900 mt-2">
            Get In Touch
          </h2>
          <p className="text-gray-500 text-sm mt-3">
            Reach us anytime. మిమ్మల్ని సంప్రదించడానికి మేము సంతోషంగా ఉన్నాము!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div>
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-6">
              Our Agents
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex gap-3">
                <MapPin className="text-[var(--color-amber)] flex-shrink-0 mt-1" size={20} />
                <div>
                  <strong className="block text-gray-900">Office Address</strong>
                  <span className="text-gray-600 text-sm">{OFFICE.addressEn}</span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=NTS+Gate+Padugupadu+Nellore+Andhra+Pradesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-xs font-semibold text-[var(--color-navy)] hover:underline"
                  >
                    📍 Get Directions →
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="text-[var(--color-amber)] flex-shrink-0 mt-1" size={20} />
                <div>
                  <strong className="block text-gray-900">Working Hours</strong>
                  <span className="text-gray-600 text-sm">{OFFICE.hours}</span>
                </div>
              </div>
            </div>

            {AGENTS.map((a) => (
              <div key={a.name} className="bg-gray-50 rounded-2xl p-5 mb-3 border border-gray-100">
                <div className="text-xs uppercase font-bold text-gray-500 mb-1">Agent</div>
                <div className="font-bold text-gray-900 text-lg mb-3">👤 {a.name}</div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={waLink(a.whatsapp, `Hi ${a.name}!`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-wa)] text-white text-sm font-bold hover:opacity-90"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                  {a.phones.map((p) => (
                    <a
                      key={p}
                      href={telLink(p)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-navy)] text-white text-sm font-bold hover:opacity-90"
                    >
                      <Phone size={14} /> {p}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={submit} className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 h-fit">
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-5">
              📩 Send Enquiry
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className={inputCls} placeholder="Your full name" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className={inputCls} placeholder="Enter your 10-digit mobile number" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Property Interest</label>
                <input value={interest} onChange={(e) => setInterest(e.target.value)}
                  className={inputCls} placeholder="Plots / Flats / Houses / Land" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                  className={inputCls + ' h-24 resize-y'}
                  placeholder="Tell us your requirements, budget, location..." />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[var(--color-navy)] text-white font-bold rounded-lg hover:bg-[var(--color-navy-light)] transition-colors disabled:opacity-60"
              >
                {submitting ? 'Sending…' : '💬 Send via WhatsApp →'}
              </button>
              {sent && (
                <div className="text-center text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                  ✅ Opening WhatsApp! We&apos;ll contact you soon.
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

const inputCls = 'w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-navy)]';
