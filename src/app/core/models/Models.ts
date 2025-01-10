export interface Olympic {
  id: number;
  country: string;
  participations: Participation[];
}

export interface Participation {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}

export interface PieChartData {
  name: string;
  value: number;
}