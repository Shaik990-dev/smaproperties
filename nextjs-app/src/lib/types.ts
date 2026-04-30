export type PropertyType = 'plot' | 'flat' | 'house' | 'land' | 'agricultural';

export interface PropertyDetail {
  icon: string;
  label: string;
  value: string;
}

export interface Property {
  id: string;
  name: string;
  nameLocal?: string;
  nameLocalTa?: string;
  type: PropertyType;
  typeLabel: string;
  badge?: string;
  badgeColor?: 'hot' | 'new' | 'ready' | 'default';
  bgColor?: string;
  emoji?: string;
  address: string;
  availability: string;
  tags: string[];
  details: PropertyDetail[];
  pics: string[];
  price?: string;
  priceNumber?: number;
  area?: string;
  facing?: string;
  bedrooms?: number;
}

export interface AppUser {
  uid: string;
  name: string;
  phone: string;
  email: string;
  interest?: string;
  isAdmin?: boolean;
  createdAt: string;
}

export interface Agent {
  name: string;
  phones: string[];
  whatsapp: string;
  avatar?: string;
}

export interface Visit {
  time: string;
  date: string;
  page: string;
  ref: string;
  ua: string;
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  initials: string;
}
