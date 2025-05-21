export interface Location {
  latitude: number;
  longitude: number;
  zoom: number;
  address: {
    en: string;
    th: string;
  };
  googleMapsUrl: string;
}
