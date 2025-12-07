
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  DRAWER = 'DRAWER',
  MAPS = 'MAPS',
  MUSIC = 'MUSIC',
  PHONE = 'PHONE',
  CALENDAR = 'CALENDAR',
  VEHICLE = 'VEHICLE',
  VIDEO = 'VIDEO',
  SETTINGS = 'SETTINGS',
  EXIT = 'EXIT'
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: number; // seconds
  audioUrl: string;
}

export interface Contact {
  id: string;
  name: string;
  number: string;
  avatarUrl: string;
}

export interface VehicleConfig {
  brand: string;
  model: string;
  type: 'car' | 'bike';
  year: string;
}

// Live API Types
export type LiveStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
