import {YoutubeVideo, Image} from "./models";

export interface ArtistRouteDetails {
  video: YoutubeVideo;
  text: { [s: string]: string; };
  images: Image[];
}
