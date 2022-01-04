import {TourStep} from "./models";

export interface TourResponse {
  id: string;
  count: number;
  feasible: boolean;
  route: { [s: string]: TourStep; };
}
