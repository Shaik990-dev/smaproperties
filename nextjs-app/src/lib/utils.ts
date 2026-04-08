export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function waLink(phone: string, msg = 'Hi SMA Builders!') {
  const clean = phone.replace(/[^0-9]/g, '');
  const num = clean.length === 10 ? `91${clean}` : clean;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

export function telLink(phone: string) {
  const clean = phone.replace(/[^0-9]/g, '');
  return `tel:+${clean.length === 10 ? '91' + clean : clean}`;
}

export function formatPhone(phone: string) {
  const c = phone.replace(/[^0-9]/g, '');
  if (c.length === 10) return `${c.slice(0, 5)} ${c.slice(5)}`;
  return phone;
}

export function userKey(emailOrPhone: string) {
  return String(emailOrPhone).trim().toLowerCase().replace(/[.#$/[\]@]/g, '_');
}
