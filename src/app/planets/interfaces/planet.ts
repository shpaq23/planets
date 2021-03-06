import {Resident} from './resident';
import {Film} from './film';

export interface Planet {
  id: number;
  name: string;
  rotation_period: number;
  orbital_period: number;
  diameter: number;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: number;
  population: number;
  residents?: Resident[] | string[];
  films?: Film[] | string[];
  url?: string;

}
