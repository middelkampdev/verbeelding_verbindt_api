import {
  ArtistRouteDetails,
  ArtistRoutePreview,
  Profile,
  Speciality,
  GeolocationJoplin,
} from "./models";

export interface Artist {
  id?: string;
  profile: Profile;
  specialities: { [s: string]: Speciality; };
  location: GeolocationJoplin;
  previewContent: ArtistRoutePreview;
  detailsContent: ArtistRouteDetails;
  website: string;
}
