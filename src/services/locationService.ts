import { Location } from '../types/location';

const defaultLocation: Location = {
  latitude: 13.7563,
  longitude: 100.5018,
  zoom: 15,
  address: {
    en: "Digital Nova Co., Ltd.\n6 Petchkasem 77 Alley, 2-7\nNong Khaem, Bangkok 10160",
    th: "บริษัท ดิจิทัล โนวา จำกัด\nเลขที่ 6 ซอยเพชรเกษม 77 แยก 2-7 แขวงหนองค้างพลู เขตหนองแขม กทม 10160"
  },
  googleMapsUrl: "https://www.google.com/maps?q=13.7563,100.5018"
};

const STORAGE_KEY = 'office_location';

export const getLocation = (): Location => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultLocation;
};

export const updateLocation = (newLocation: Partial<Location>) => {
  const current = getLocation();
  const updated = { ...current, ...newLocation };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('location-updated'));
  return updated;
};

export const generateEmbedMapUrl = (lat: number, lng: number, zoom: number): string => {
  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.544!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ1JzIyLjciTiAxMDDCsDMwJzA2LjQiRQ!5e0!3m2!1sen!2sth!4v1647098981645!5m2!1sen!2sth`;
};
