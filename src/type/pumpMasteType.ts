export type PumpInfo = {
  pumpName: string;
  type: string;
  area: string;
  latitude: number;
  longitude: number;
  flowRate: number;
  offSet: number;
  current_pressure: number;
  min_pressure: number;
  max_pressure: number;
};

export interface Pump {
  _id: string
  _creationTime: number
  type: string
  pumpName: string
  area: string
  latitude: number
  longitude: number
  flowRate: number
  offSet: number
  current_pressure: number
  min_pressure: number
  max_pressure: number
}
