import type { Property } from '@/lib/types';

export const DEFAULT_PROPERTIES: Property[] = [
  {
    id: 'p1',
    name: 'Srinivasa Layout – West Facing Plots',
    nameLocal: 'శ్రీనివాస లేఅవుట్ – పశ్చిమ ముఖంగా స్థలాలు',
    type: 'plot',
    typeLabel: 'Layout / లేఅవుట్',
    badge: 'Hot Deal',
    badgeColor: 'hot',
    bgColor: '#d4edda',
    emoji: '🏘️',
    address: 'Ramadasu Kandriga Grama Panchayat, Venkatachalam Mandal, Nellore',
    availability: '2 Plots Available',
    tags: ['33½ Ankanams', 'West Facing', 'Kandriga', 'Venkatachalam Mandal'],
    facing: 'West',
    area: '33½ Ankanams',
    details: [
      { icon: '🏘️', label: 'Layout', value: 'Srinivasa Layout' },
      { icon: '📐', label: 'Plot Size', value: '33½ Ankanams each' },
      { icon: '🧭', label: 'Facing', value: 'West Facing' },
      { icon: '📍', label: 'Address', value: 'Ramadasu Kandriga, Venkatachalam Mandal, Nellore AP' },
      { icon: '📜', label: 'Documents', value: 'Clear Title – Ready for Registration' },
      { icon: '💰', label: 'Price', value: 'Contact for best price' }
    ],
    pics: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80']
  },
  {
    id: 'p2',
    name: 'Srinivasa Layout – East Facing Plot',
    nameLocal: 'శ్రీనివాస లేఅవుట్ – తూర్పు ముఖంగా స్థలం',
    type: 'plot',
    typeLabel: 'Layout / లేఅవుట్',
    badge: 'Available',
    badgeColor: 'default',
    bgColor: '#dbeafe',
    emoji: '🏘️',
    address: 'Ramadasu Kandriga Grama Panchayat, Venkatachalam Mandal, Nellore',
    availability: '1 Plot Available',
    tags: ['33½ Ankanams', 'East Facing', 'Kandriga'],
    facing: 'East',
    area: '33½ Ankanams',
    details: [
      { icon: '🏘️', label: 'Layout', value: 'Srinivasa Layout' },
      { icon: '📐', label: 'Plot Size', value: '33½ Ankanams' },
      { icon: '🧭', label: 'Facing', value: 'East Facing' },
      { icon: '📜', label: 'Documents', value: 'Clear Title' },
      { icon: '💰', label: 'Price', value: 'Contact us' }
    ],
    pics: ['https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80']
  },
  {
    id: 'p3',
    name: 'Saravana Kamakshi Gardens',
    nameLocal: 'సరవణ కామాక్షి గార్డెన్స్ లేఅవుట్',
    type: 'plot',
    typeLabel: 'Layout / లేఅవుట్',
    badge: 'New',
    badgeColor: 'new',
    bgColor: '#fef3c7',
    emoji: '🌿',
    address: 'Penballi Gramam, Buchireddipalem Mandal, Nellore District, AP',
    availability: 'Plots Available',
    tags: ['25 Ankanams', 'East Facing', 'Penballi Gramam'],
    facing: 'East',
    area: '25 Ankanams',
    price: 'From ₹10 Lakhs',
    priceNumber: 1000000,
    details: [
      { icon: '🌿', label: 'Layout', value: 'Saravana Kamakshi Gardens' },
      { icon: '📐', label: 'Plot Size', value: '25 Ankanams' },
      { icon: '🧭', label: 'Facing', value: 'East Facing' },
      { icon: '💧', label: 'Water', value: 'Borewell nearby' },
      { icon: '💰', label: 'Price', value: 'From ₹10 Lakhs onwards' }
    ],
    pics: ['https://images.unsplash.com/photo-1625602812206-5ec545ca1231?w=1200&q=80']
  },
  {
    id: 'p7',
    name: 'Krishnapatnam Port Area Plots',
    nameLocal: 'కృష్ణపట్నం పోర్ట్ సమీప స్థలాలు',
    type: 'plot',
    typeLabel: 'Layout / లేఅవుట్',
    badge: 'Hot Deal',
    badgeColor: 'hot',
    bgColor: '#d1fae5',
    emoji: '⚓',
    address: 'Near Krishnapatnam Port, Nellore District, Andhra Pradesh',
    availability: 'Plots Available',
    tags: ['Near Port', 'High Growth Area', 'Investment'],
    area: 'Multiple sizes',
    price: 'From ₹10 Lakhs',
    priceNumber: 1000000,
    details: [
      { icon: '⚓', label: 'Location', value: 'Near Krishnapatnam Port, Nellore' },
      { icon: '📈', label: 'Investment', value: 'High growth — Industrial corridor' },
      { icon: '🛣️', label: 'Access', value: 'NH-16 & Port Road connectivity' },
      { icon: '📜', label: 'Documents', value: 'Clear Title Documents' },
      { icon: '💰', label: 'Price', value: 'From ₹10 Lakhs onwards' }
    ],
    pics: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80']
  },
  {
    id: 'p4',
    name: 'Residential Plots – Nellore',
    nameLocal: 'నివాస స్థలాలు – నెల్లూరు',
    type: 'plot',
    typeLabel: 'Residential / నివాస',
    badge: 'Available',
    badgeColor: 'default',
    bgColor: '#fce7f3',
    emoji: '🏡',
    address: 'NTS Gate Area, పడుగుపాడు, Nellore – 524137',
    availability: 'Available Now',
    tags: ['DTCP Approved', 'Road Facing', 'Water & Power'],
    details: [
      { icon: '🏡', label: 'Type', value: 'DTCP Approved Residential Plots' },
      { icon: '🛣️', label: 'Roads', value: '30-40 ft wide' },
      { icon: '💧', label: 'Utilities', value: 'Water & Electricity Available' },
      { icon: '💰', label: 'Price', value: 'Contact us' }
    ],
    pics: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80']
  },
  {
    id: 'p5',
    name: 'Flats & Apartments – Nellore',
    nameLocal: 'ఫ్లాట్లు & అపార్ట్‌మెంట్లు – నెల్లూరు',
    type: 'flat',
    typeLabel: 'Flats / ఫ్లాట్లు',
    badge: 'Ready to Move',
    badgeColor: 'ready',
    bgColor: '#ede9fe',
    emoji: '🏢',
    address: 'Nellore City & Surroundings, Andhra Pradesh',
    availability: 'Ready to Move',
    tags: ['2BHK & 3BHK', 'Parking', 'Security', 'Lift'],
    bedrooms: 2,
    area: '800–1400 sq.ft',
    details: [
      { icon: '🏢', label: 'Type', value: '2BHK & 3BHK Flats' },
      { icon: '📏', label: 'Size', value: '800–1400 sq.ft' },
      { icon: '🔒', label: 'Security', value: '24/7 CCTV' },
      { icon: '💰', label: 'Price', value: 'Contact us' }
    ],
    pics: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80']
  },
  {
    id: 'p6',
    name: 'Agricultural Land – Nellore District',
    nameLocal: 'వ్యవసాయ భూమి / పాలముల అమ్మకానికి',
    type: 'agricultural',
    typeLabel: 'Agricultural / వ్యవసాయ',
    badge: 'Available',
    badgeColor: 'default',
    bgColor: '#d1fae5',
    emoji: '🌾',
    address: 'Various Locations, Nellore District, Andhra Pradesh',
    availability: 'Available',
    tags: ['Farm Land', 'Water Source', 'Road Access', 'Pattadar Docs'],
    details: [
      { icon: '🌾', label: 'Type', value: 'Agricultural / Farm Land' },
      { icon: '💧', label: 'Water', value: 'Borewell/Canal available' },
      { icon: '📜', label: 'Documents', value: 'Clear Pattadar Documents' },
      { icon: '💰', label: 'Price', value: 'Contact for plot-wise pricing' }
    ],
    pics: ['https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1200&q=80']
  }
];

export const TESTIMONIALS = [
  {
    name: 'Ravi Kumar',
    location: '📍 Buchireddipalem, Nellore',
    rating: 5,
    text: 'SMA Builders helped me find the perfect plot in Buchireddipalem. Documents were clear, price was fair, and registration was done within one week. Very honest and professional!',
    initials: 'RK'
  },
  {
    name: 'Syed Mohammed',
    location: '📍 Padugupadu, Nellore',
    rating: 5,
    text: 'Sk. Ahamad garu చాలా help చేసారు. వారు చాలా honest గా వ్యవహరించారు. మా family కి perfect house దొరికింది. Nellore లో best real estate agent!',
    initials: 'SM'
  },
  {
    name: 'Venkata Prasad',
    location: '📍 Nellore District',
    rating: 5,
    text: 'I was looking for agricultural land near Nellore for investment. Sk. Umar showed me multiple options with water facilities. Deal completed smoothly. Highly recommend!',
    initials: 'VP'
  }
];
