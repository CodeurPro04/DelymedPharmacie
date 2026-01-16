import AsyncStorage from '@react-native-async-storage/async-storage';

export type Medication = {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  stock: number;
  minStock: number;
  price: string;
  requiresPrescription: boolean;
  barcode?: string;
  manufacturer?: string;
  expiryDate?: string;
};

export type OrderStatus =
  | 'created'
  | 'pending_pharmacy'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'assigned'
  | 'picked_up'
  | 'delivered'
  | 'cancelled';

export type OrderType = 'list' | 'prescription';

export type Order = {
  id: string;
  customer: string;
  customerEmail?: string;
  customerPhone?: string;
  status: OrderStatus;
  type: OrderType;
  items: number;
  total: string;
  time: string;
  isUrgent: boolean;
  prescriptionImage?: string;
  pickupCode?: string;
  pickupCodeExpiresAt?: string;
  assignedDriverId?: string;
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  createdAt: string;
};

export type PharmacyProfile = {
  name: string;
  address: string;
  phone: string;
  email: string;
  licenseNumber: string;
  memberSince: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'order' | 'stock' | 'payment' | 'delivery';
  createdAt: string;
};

const STORAGE_KEYS = {
  medications: 'delymed.medications',
  orders: 'delymed.orders',
  profile: 'delymed.profile',
  auth: 'delymed.auth',
  notifications: 'delymed.notifications',
} as const;

const seedMedications: Medication[] = [
  {
    id: '1',
    name: 'Paracétamol 500mg',
    genericName: 'Acétaminophène',
    category: 'analgesique',
    stock: 45,
    minStock: 20,
    price: '3 500 FCFA',
    requiresPrescription: false,
    barcode: '123456789012',
    manufacturer: 'Laboratoire X',
    expiryDate: '2025-12-31',
  },
  {
    id: '2',
    name: 'Ibuprofène 400mg',
    genericName: '',
    category: 'anti-inflammatoire',
    stock: 12,
    minStock: 15,
    price: '4 200 FCFA',
    requiresPrescription: false,
    barcode: '234567890123',
    manufacturer: 'Laboratoire Y',
    expiryDate: '2025-10-15',
  },
  {
    id: '3',
    name: 'Amoxicilline 500mg',
    genericName: '',
    category: 'antibiotique',
    stock: 8,
    minStock: 10,
    price: '7 800 FCFA',
    requiresPrescription: true,
    barcode: '345678901234',
    manufacturer: 'Laboratoire Z',
    expiryDate: '2025-09-30',
  },
  {
    id: '4',
    name: 'Vitamine C 1000mg',
    genericName: 'Acide ascorbique',
    category: 'vitamine',
    stock: 32,
    minStock: 15,
    price: '8 900 FCFA',
    requiresPrescription: false,
    barcode: '456789012345',
    manufacturer: 'Laboratoire A',
    expiryDate: '2026-03-20',
  },
  {
    id: '5',
    name: 'Oméprazole 20mg',
    genericName: '',
    category: 'gastro',
    stock: 5,
    minStock: 10,
    price: '12 500 FCFA',
    requiresPrescription: true,
    barcode: '567890123456',
    manufacturer: 'Laboratoire B',
    expiryDate: '2025-11-15',
  },
  {
    id: '6',
    name: 'Doliprane 1000mg',
    genericName: 'Paracétamol',
    category: 'analgesique',
    stock: 60,
    minStock: 25,
    price: '2 800 FCFA',
    requiresPrescription: false,
    barcode: '678901234567',
    manufacturer: 'Sanofi',
    expiryDate: '2026-01-31',
  },
];

const seedOrders: Order[] = [
  {
    id: 'PH-001',
    customer: 'Kouassi Jean',
    customerEmail: 'kouassi.jean@example.com',
    customerPhone: '+225 01 11 22 33 44',
    status: 'pending_pharmacy',
    type: 'list',
    items: 3,
    total: '45 000 FCFA',
    time: '10:30',
    isUrgent: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'PH-002',
    customer: 'Amani Marie',
    customerEmail: 'amani.marie@example.com',
    customerPhone: '+225 07 22 33 44 55',
    status: 'accepted',
    type: 'prescription',
    items: 2,
    total: '28 750 FCFA',
    time: '11:15',
    isUrgent: true,
    prescriptionImage: 'mock://prescription-002',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'PH-003',
    customer: 'Brou Didier',
    customerEmail: 'brou.didier@example.com',
    customerPhone: '+225 05 33 44 55 66',
    status: 'ready',
    type: 'list',
    items: 5,
    total: '62 300 FCFA',
    time: '11:45',
    isUrgent: false,
    pickupCode: '8412',
    pickupCodeExpiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'PH-004',
    customer: 'Koné Fatou',
    customerEmail: 'kone.fatou@example.com',
    customerPhone: '+225 01 44 55 66 77',
    status: 'pending_pharmacy',
    type: 'prescription',
    items: 1,
    total: '12 500 FCFA',
    time: '12:00',
    isUrgent: false,
    prescriptionImage: 'mock://prescription-004',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'PH-005',
    customer: 'Yao Paul',
    customerEmail: 'yao.paul@example.com',
    customerPhone: '+225 07 55 66 77 88',
    status: 'ready',
    type: 'list',
    items: 4,
    total: '38 900 FCFA',
    time: '12:30',
    isUrgent: true,
    pickupCode: '2295',
    pickupCodeExpiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'PH-006',
    customer: 'Ndiaye Salma',
    customerEmail: 'ndiaye.salma@example.com',
    customerPhone: '+225 05 66 77 88 99',
    status: 'assigned',
    type: 'list',
    items: 2,
    total: '19 500 FCFA',
    time: '13:10',
    isUrgent: false,
    pickupCode: '3047',
    pickupCodeExpiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    assignedDriverId: 'DRV-001',
    assignedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

const seedProfile: PharmacyProfile = {
  name: 'Pharmacie Delymed',
  address: "Rue des Jardins, Plateau, Abidjan, Côte d'Ivoire",
  phone: '+225 01 02 03 04 05',
  email: 'contact@pharmaciedelymed.ci',
  licenseNumber: 'PH-CI-2024-001',
  memberSince: 'Janvier 2024',
};

const seedNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Nouvelle commande reçue',
    description: 'Commande #PH-006 en attente de préparation.',
    time: 'Il y a 5 min',
    type: 'order',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    title: 'Stock faible',
    description: 'Paracétamol 500mg en dessous du seuil minimal.',
    time: 'Il y a 20 min',
    type: 'stock',
    createdAt: new Date().toISOString(),
  },
];

async function readJson<T>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

async function writeJson<T>(key: string, data: T) {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export async function getMedications() {
  const data = await readJson<Medication[]>(STORAGE_KEYS.medications);
  if (data && data.length > 0) return data;
  await writeJson(STORAGE_KEYS.medications, seedMedications);
  return seedMedications;
}

export async function saveMedications(medications: Medication[]) {
  await writeJson(STORAGE_KEYS.medications, medications);
}

export async function getOrders() {
  const data = await readJson<Order[]>(STORAGE_KEYS.orders);
  if (data && data.length > 0) return data;
  await writeJson(STORAGE_KEYS.orders, seedOrders);
  return seedOrders;
}

export async function saveOrders(orders: Order[]) {
  await writeJson(STORAGE_KEYS.orders, orders);
}

export async function getProfile() {
  const data = await readJson<PharmacyProfile>(STORAGE_KEYS.profile);
  if (data) return data;
  await writeJson(STORAGE_KEYS.profile, seedProfile);
  return seedProfile;
}

export async function saveProfile(profile: PharmacyProfile) {
  await writeJson(STORAGE_KEYS.profile, profile);
}

export async function getAuth() {
  const data = await readJson<{ loggedIn: boolean }>(STORAGE_KEYS.auth);
  return data?.loggedIn ?? false;
}

export async function setAuth(loggedIn: boolean) {
  await writeJson(STORAGE_KEYS.auth, { loggedIn });
}

export async function getNotifications() {
  const data = await readJson<NotificationItem[]>(STORAGE_KEYS.notifications);
  if (data && data.length > 0) return data;
  await writeJson(STORAGE_KEYS.notifications, seedNotifications);
  return seedNotifications;
}

export async function addNotification(notification: NotificationItem) {
  const list = await getNotifications();
  const updated = [notification, ...list];
  await writeJson(STORAGE_KEYS.notifications, updated);
  return updated;
}
