import {Planet} from '../../../planets/interfaces/planet';

export interface PlanetsResponse {
  count: number;
  next: string;
  previous: string;
  results: Planet[];
}
