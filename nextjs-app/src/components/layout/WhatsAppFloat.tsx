'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { AGENTS } from '@/data/agents';
import { waLink } from '@/lib/utils';

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Agent picker popup */}
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-72 overflow-hidden animate-in">
          <div className="bg-[var(--color-wa)] px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <MessageCircle size={18} />
              <span className="font-bold text-sm">Chat with us</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="p-4 space-y-2">
            <p className="text-xs text-gray-500 mb-3">Choose an agent to start chatting on WhatsApp:</p>
            {AGENTS.map((agent) => (
              <a
                key={agent.name}
                href={waLink(agent.whatsapp, `Hi ${agent.name}! I visited smaproperties.in and need help with properties in Nellore.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--color-wa)] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {agent.name.split(' ').pop()?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 group-hover:text-[var(--color-wa)]">{agent.name}</p>
                  <p className="text-xs text-gray-500">{agent.phones[0]}</p>
                </div>
                <MessageCircle size={16} className="text-[var(--color-wa)] flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen((s) => !s)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          open ? 'bg-gray-600 rotate-90' : 'bg-[var(--color-wa)]'
        }`}
        aria-label="Chat on WhatsApp"
      >
        {open ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={26} className="text-white fill-white" />
        )}
      </button>
    </div>
  );
}
