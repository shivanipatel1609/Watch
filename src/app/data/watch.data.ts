import { Watch } from '../models/watch.model';

const defaultReviews = (label: string, rating: number) => [
  {
    author: 'Caliber Editorial',
    rating,
    comment: `${label} delivers a premium ownership experience with strong design character and broad collector appeal.`
  }
];

const defaultSpecs = (movement: string, caseSize: string, category: string, reserve: string) => [
  { label: 'Movement', value: movement },
  { label: 'Case', value: caseSize },
  { label: 'Category', value: category },
  { label: 'Power / Battery', value: reserve }
];

const localWatchImages = (folder: string, ...files: string[]) =>
  files.map((file) => `assets/images/watches/${folder}/${file}`);

export const WATCHES: Watch[] = [
  {
    id: 'rolex-submariner-pro',
    name: 'Rolex Submariner Pro',
    brand: 'Rolex',
    price: 747917,
    description: 'Professional dive watch with precision automatic movement and sapphire crystal.',
    category: 'luxury',
    stock: 5,
    rating: 5,
    accent: 'from-[#6f5a16] to-[#e5c55d]',
    featured: true,
    images: localWatchImages('Rolex Submariner Pro', 'r1.png', 'r2.png', 'r3.png', 'r4.png'),
    specifications: defaultSpecs('Swiss Automatic', '41mm Oystersteel', 'Diver', '70 hours'),
    reviews: defaultReviews('Rolex Submariner Pro', 5)
  },
  {
    id: 'omega-seamaster',
    name: 'Omega Seamaster',
    brand: 'Omega',
    price: 539500,
    description: 'Swiss luxury timepiece with chronograph detailing and ceramic bezel.',
    category: 'luxury',
    stock: 7,
    rating: 5,
    accent: 'from-[#8f6b19] to-[#d9d9d9]',
    featured: true,
    images: localWatchImages('Omega Seamaster', 'o1.png', 'o2.png'),
    specifications: defaultSpecs('Co-Axial Automatic', '42mm Steel', 'Luxury', '55 hours'),
    reviews: defaultReviews('Omega Seamaster', 5)
  },
  {
    id: 'tag-heuer-carrera',
    name: 'Tag Heuer Carrera',
    brand: 'Tag Heuer',
    price: 431600,
    description: 'Swiss precision chronograph with stainless steel bracelet.',
    category: 'luxury',
    stock: 4,
    rating: 5,
    accent: 'from-[#4b4b4b] to-[#d9d9d9]',
    featured: true,
    images: localWatchImages(
      'Tag Heuer Carrera',
      'CBU5050.FT6273_0913.webp',
      'CBU5091.FT6305_0314.webp',
      'TAGHeuer-merchandize-Carrera-Purple-Tourbillon.webp'
    ),
    specifications: defaultSpecs('Calibre Chronograph', '44mm Steel', 'Luxury', '80 hours'),
    reviews: defaultReviews('Tag Heuer Carrera', 5)
  },
  {
    id: 'garmin-fenix-7x',
    name: 'Garmin Fenix 7X',
    brand: 'Garmin',
    price: 66317,
    description: 'Multi-GNSS sports watch with advanced training metrics and long battery life.',
    category: 'sports',
    stock: 15,
    rating: 5,
    accent: 'from-[#202020] to-[#8a8a8a]',
    featured: true,
    images: localWatchImages('Garmin Fenix 7X', '10-36.webp', '2-48.webp', '4-43.webp'),
    specifications: defaultSpecs('Digital GPS', '51mm Polymer', 'Sports', '11 days'),
    reviews: defaultReviews('Garmin Fenix 7X', 5)
  },
  {
    id: 'suunto-9-peak',
    name: 'Suunto 9 Peak',
    brand: 'Suunto',
    price: 49717,
    description: 'Ultra-durable sports watch with ambient light display and endurance tracking.',
    category: 'sports',
    stock: 12,
    rating: 5,
    accent: 'from-[#2a2a2a] to-[#a4a4a4]',
    images: localWatchImages(
      'Suunto 9 Peak',
      'ss050522000-suunto-9-peak-all-black-expressive-view-sleep-insight-7-day-01.jpg',
      'ss050522000-suunto-9-peak-all-black-front-view-blood-oxygen-02.jpg',
      'ss050522000-suunto-9-peak-all-black-on-wrist-01.webp'
    ),
    specifications: defaultSpecs('Digital Outdoor', '43mm Titanium', 'Sports', '14 days'),
    reviews: defaultReviews('Suunto 9 Peak', 5)
  },
  {
    id: 'apple-watch-ultra',
    name: 'Apple Watch Ultra',
    brand: 'Apple',
    price: 66317,
    description: 'Rugged action watch with always-on Retina display and emergency SOS.',
    category: 'sports',
    stock: 20,
    rating: 5,
    accent: 'from-[#5c5c5c] to-[#d8d8d8]',
    featured: true,
    images: localWatchImages(
      'Apple Watch Ultra',
      'adventure_hero__e984wp5sx1ui_xlarge_2x.jpg',
      'more_metrics__dodw0ja7f70i_large_2x.jpg',
      'product_landing__d0d4mw4gk282_large_2x.jpg'
    ),
    specifications: defaultSpecs('Apple S9 SiP', '49mm Titanium', 'Sports', '36 hours'),
    reviews: defaultReviews('Apple Watch Ultra', 5)
  },
  {
    id: 'titan-classic-steel',
    name: 'Titan Classic Steel',
    brand: 'Titan',
    price: 49717,
    description: 'Elegant stainless steel casual watch with minimalist design.',
    category: 'casual',
    stock: 25,
    rating: 4.8,
    accent: 'from-[#5c5c5c] to-[#bdbdbd]',
    images: localWatchImages('Titan Classic Steel', '90152NM01_1.webp', '90152NM01_3.webp', '90152NM01_4.webp'),
    specifications: defaultSpecs('Quartz', '40mm Steel', 'Casual', '2 years'),
    reviews: defaultReviews('Titan Classic Steel', 4.8)
  },
  {
    id: 'titan-gold-plated',
    name: 'Titan Gold Plated',
    brand: 'Titan',
    price: 120350,
    description: 'Premium gold-plated casual watch with refined formal presence.',
    category: 'casual',
    stock: 18,
    rating: 4.9,
    accent: 'from-[#3f2b08] to-[#c9a227]',
    featured: true,
    images: localWatchImages('Titan Gold Plated', '1830KL02_1.webp', '1830KL02_2.webp', '1830KL02_3.webp'),
    specifications: defaultSpecs('Quartz', '40mm Gold Plated', 'Casual', '2 years'),
    reviews: defaultReviews('Titan Gold Plated', 4.9)
  },
  {
    id: 'tommy-hilfiger-classic',
    name: 'Tommy Hilfiger Classic',
    brand: 'Tommy Hilfiger',
    price: 41500,
    description: 'Casual analog watch with genuine leather strap and water resistance.',
    category: 'casual',
    stock: 22,
    rating: 4.7,
    accent: 'from-[#24303d] to-[#d9d9d9]',
    images: localWatchImages(
      'Tommy Hilfiger Classic',
      'TW001941_100_main.webp',
      'TW001941_100_alternate2.webp',
      'TW001941_100_alternate3.webp'
    ),
    specifications: defaultSpecs('Quartz', '42mm Steel', 'Casual', '2 years'),
    reviews: defaultReviews('Tommy Hilfiger Classic', 4.7)
  },
  {
    id: 'police-analog-watch',
    name: 'Police Analog Watch',
    brand: 'Police',
    price: 48970,
    description: 'Bold analog watch with stainless steel case and durable construction.',
    category: 'casual',
    stock: 19,
    rating: 4.6,
    accent: 'from-[#131313] to-[#767676]',
    images: localWatchImages(
      'Police Analog Watch',
      'PLPEWJG0018401_1.webp',
      'PLPEWJG0018401_2.webp',
      'PLPEWJG0018401_3.webp'
    ),
    specifications: defaultSpecs('Quartz', '44mm Steel', 'Casual', '2 years'),
    reviews: defaultReviews('Police Analog Watch', 4.6)
  },
  {
    id: 'samsung-galaxy-watch-6',
    name: 'Samsung Galaxy Watch 6',
    brand: 'Samsung',
    price: 24817,
    description: 'Advanced smartwatch with AMOLED display, health tracking, and deep app support.',
    category: 'smartwatch',
    stock: 30,
    rating: 4.9,
    accent: 'from-[#2c2c2c] to-[#9c9c9c]',
    images: localWatchImages('Samsung Galaxy Watch 6', 'galaxy-watch6-safety-pc.webp', 'videoframe_2000.png'),
    specifications: defaultSpecs('Wear OS', '44mm Aluminum', 'Smartwatch', '40 hours'),
    reviews: defaultReviews('Samsung Galaxy Watch 6', 4.9)
  },
  {
    id: 'fitbit-sense-2',
    name: 'Fitbit Sense 2',
    brand: 'Fitbit',
    price: 24817,
    description: 'Health and fitness smartwatch with stress management and readiness features.',
    category: 'smartwatch',
    stock: 28,
    rating: 4.7,
    accent: 'from-[#343434] to-[#b3b3b3]',
    images: localWatchImages('Fitbit Sense 2', 'unnamed.png', 'unnamed (1).png', 'unnamed (2).png'),
    specifications: defaultSpecs('Fitbit OS', '40mm Aluminum', 'Smartwatch', '6 days'),
    reviews: defaultReviews('Fitbit Sense 2', 4.7)
  },
  {
    id: 'wear-os-by-google',
    name: 'Wear OS by Google',
    brand: 'Google',
    price: 20667,
    description: 'Universal smartwatch platform with Google Assistant and modern fitness tracking.',
    category: 'smartwatch',
    stock: 26,
    rating: 4.8,
    accent: 'from-[#20263b] to-[#d9d9d9]',
    images: localWatchImages('Wear OS by Google', 'unnamed.png', 'unnamed (1).png', 'unnamed (3).png'),
    specifications: defaultSpecs('Wear OS', '42mm Stainless Steel', 'Smartwatch', '24 hours'),
    reviews: defaultReviews('Wear OS by Google', 4.8)
  },
  {
    id: 'xiaomi-mi-watch-ultra',
    name: 'Xiaomi Mi Watch Ultra',
    brand: 'Xiaomi',
    price: 28967,
    description: 'Premium smartwatch with titanium case and dual-frequency GPS.',
    category: 'smartwatch',
    stock: 24,
    rating: 4.8,
    accent: 'from-[#1b1b1b] to-[#d1d1d1]',
    images: localWatchImages('Xiaomi Mi Watch Ultra', 'sec01.jpg', 'sec16-img1.png'),
    specifications: defaultSpecs('HyperOS Watch', '47mm Titanium', 'Smartwatch', '10 days'),
    reviews: defaultReviews('Xiaomi Mi Watch Ultra', 4.8)
  },
  {
    id: 'huawei-watch-4-pro',
    name: 'Huawei Watch 4 Pro',
    brand: 'Huawei',
    price: 33117,
    description: 'Premium smartwatch with eSIM, ECG, and advanced wellness tracking.',
    category: 'smartwatch',
    stock: 21,
    rating: 4.7,
    accent: 'from-[#1e1e1e] to-[#c5c5c5]',
    images: localWatchImages('Huawei Watch 4 Pro', 'huawei-watch-fit4-pro-colours-img1-3-2x.webp'),
    specifications: defaultSpecs('HarmonyOS', '48mm Titanium', 'Smartwatch', '4.5 days'),
    reviews: defaultReviews('Huawei Watch 4 Pro', 4.7)
  },
  {
    id: 'patek-philippe-nautilus',
    name: 'Patek Philippe Nautilus',
    brand: 'Patek Philippe',
    price: 1327917,
    description: 'Ultra-luxury Swiss timepiece with integrated bracelet and iconic silhouette.',
    category: 'luxury',
    stock: 2,
    rating: 5,
    accent: 'from-[#4f411b] to-[#c9a227]',
    images: localWatchImages(
      'Patek Philippe Nautilus',
      '175395-51883.avif',
      '202033-51891.avif',
      '4866-51906.avif'
    ),
    specifications: defaultSpecs('Swiss Automatic', '40mm Steel', 'Luxury', '45 hours'),
    reviews: defaultReviews('Patek Philippe Nautilus', 5)
  },
  {
    id: 'cartier-ballon-bleu',
    name: 'Cartier Ballon Bleu',
    brand: 'Cartier',
    price: 597600,
    description: 'Iconic luxury watch with distinctive cabochon crown and refined proportions.',
    category: 'luxury',
    stock: 3,
    rating: 5,
    accent: 'from-[#78623b] to-[#d9d9d9]',
    images: localWatchImages('Cartier Ballon Bleu', 'WGBB0063-700.webp', 'WGBB0063-2-700.webp', 'WGBB0063-4-700.webp'),
    specifications: defaultSpecs('Swiss Automatic', '42mm Steel', 'Luxury', '42 hours'),
    reviews: defaultReviews('Cartier Ballon Bleu', 5)
  },
  {
    id: 'coros-apex-pro',
    name: 'Coros Apex Pro',
    brand: 'Coros',
    price: 49717,
    description: 'AMOLED sports watch with training load tracking and long battery life.',
    category: 'sports',
    stock: 16,
    rating: 4.9,
    accent: 'from-[#161616] to-[#8d8d8d]',
    images: localWatchImages('Coros Apex Pro', 'watchw.webp', 'apex4.webp', 'videoframe_22285.png', 'videoframe_7460.png'),
    specifications: defaultSpecs('Digital Outdoor', '46mm Titanium', 'Sports', '24 days'),
    reviews: defaultReviews('Coros Apex Pro', 4.9)
  },
  {
    id: 'garmin-epix-gen-2',
    name: 'Garmin Epix Gen 2',
    brand: 'Garmin',
    price: 74617,
    description: 'Premium AMOLED sports watch with mapping and advanced training features.',
    category: 'sports',
    stock: 13,
    rating: 4.9,
    accent: 'from-[#111111] to-[#9a9a9a]',
    images: localWatchImages('Garmin Epix Gen 2', 'image (13).webp', 'image (15).webp', 'image (23).webp'),
    specifications: defaultSpecs('Digital GPS', '47mm Fiber-Reinforced Polymer', 'Sports', '16 days'),
    reviews: defaultReviews('Garmin Epix Gen 2', 4.9)
  },
  {
    id: 'citizen-eco-drive',
    name: 'Citizen Eco-Drive',
    brand: 'Citizen',
    price: 29050,
    description: 'Solar-powered casual watch with date display and excellent daily wearability.',
    category: 'casual',
    stock: 28,
    rating: 4.8,
    accent: 'from-[#3c4a55] to-[#d9d9d9]',
    images: localWatchImages(
      'Citizen Eco-Drive',
      'Deskbanner05092024170632.jpg',
      'Galnb6031-56e-2-202501170730274.jpg',
      'Galnb6031-56e-4-202501170730272.png'
    ),
    specifications: defaultSpecs('Eco-Drive Solar', '41mm Steel', 'Casual', 'Solar Powered'),
    reviews: defaultReviews('Citizen Eco-Drive', 4.8)
  },
  {
    id: 'seiko-5-sports',
    name: 'Seiko 5 Sports',
    brand: 'Seiko',
    price: 22825,
    description: 'Japanese automatic watch with day-date display and 100m water resistance.',
    category: 'casual',
    stock: 32,
    rating: 4.7,
    accent: 'from-[#1c2a1c] to-[#d9d9d9]',
    images: localWatchImages('Seiko 5 Sports', 'SRPJ47K1_540x.webp', 'SRPJ47K102_540x.webp', 'SRPJ47K103_540x.webp'),
    specifications: defaultSpecs('Automatic', '42.5mm Steel', 'Casual', '41 hours'),
    reviews: defaultReviews('Seiko 5 Sports', 4.7)
  },
  {
    id: 'garmin-venu-3',
    name: 'Garmin Venu 3',
    brand: 'Garmin',
    price: 37267,
    description: 'Premium smartwatch with AMOLED display and advanced health monitoring.',
    category: 'smartwatch',
    stock: 19,
    rating: 4.9,
    accent: 'from-[#252525] to-[#bbbbbb]',
    images: localWatchImages('Garmin Venu 3', 'venu-3-1.webp', 'venu-3-4.webp', 'venu-3-6.webp'),
    specifications: defaultSpecs('Garmin OS', '45mm Steel', 'Smartwatch', '14 days'),
    reviews: defaultReviews('Garmin Venu 3', 4.9)
  },
  {
    id: 'amazfit-gtr-4',
    name: 'Amazfit GTR 4',
    brand: 'Amazfit',
    price: 14857,
    description: 'Sleek smartwatch with long battery life and comprehensive fitness tracking.',
    category: 'smartwatch',
    stock: 35,
    rating: 4.6,
    accent: 'from-[#242424] to-[#d8d8d8]',
    images: localWatchImages('Amazfit GTR 4', 'PC - 1.jpg', 'White_background-1_2048x2048.webp'),
    specifications: defaultSpecs('Zepp OS', '46mm Aluminum', 'Smartwatch', '14 days'),
    reviews: defaultReviews('Amazfit GTR 4', 4.6)
  }
];
