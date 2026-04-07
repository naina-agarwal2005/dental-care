export type LocalizedText = {
  en: string;
  kn: string;
};

export type ProtocolType = 'first_aid' | 'daily_care';

export type TraumaStep = {
  stepNumber: number;
  text: LocalizedText;
  imageUrl?: string;
};

export type TraumaItem = {
  id: string;
  title: LocalizedText;
  type: ProtocolType;
  videoUrl: string;
  thumbnail: string;
  numberOfFirstAidSteps: number;
  steps: TraumaStep[];
  createdAt?: string;
  updatedAt?: string;
};

export type ClinicItem = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  contactNumber: string;
  mapsUrl?: string;
  distanceKm?: number;
};
