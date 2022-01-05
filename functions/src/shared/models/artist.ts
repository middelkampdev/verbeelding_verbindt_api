import {
  ArtistRouteDetails,
  ArtistRoutePreview,
  Profile,
  Speciality,
  Geolocation,
} from "./models";

export interface Artist {
  id?: string;
  profile: Profile;
  specialities: { [s: string]: Speciality; };
  location: Geolocation;
  previewContent: ArtistRoutePreview;
  detailsContent: ArtistRouteDetails;
  website: string;
}
