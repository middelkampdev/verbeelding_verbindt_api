import * as functions from "firebase-functions";
import {hennyArtistId, http} from "../config/route-xl";
import {artistCollection} from "../config/firebase-admin";
import {Location, TourResponse} from "./models/models";
import * as firebaseAdmin from "firebase-admin";
import {Headers} from "../shared/entities/headers";
import {Artist, Geolocation} from "../shared/models/models";
import {AxiosResponse} from "axios";
import {
  UnauthenticatedError,
  InvalidArgumentError,
  InternalServerError,
  UnknownInternalServerError,
} from "../shared/errors/errors";
import {HttpsError} from "firebase-functions/v1/https";

interface GenerateRouteParameters {
  artistIds: string[];
  userLocation: Geolocation;
}

export const generateRoute = functions.https.onCall(
    async (data, context) => {
      try {
        const params = validate(context, data);
        const artistSnap = await artistCollection.where(
            firebaseAdmin.firestore.FieldPath.documentId(),
            "in",
            params.artistIds,
        ).get();
        const artists = artistSnap.docs.map((doc) => doc.data());

        const positionHenny = artists.findIndex(
            (artist) => artist.id === hennyArtistId,
        );

        let henny: Artist;
        if (positionHenny !== -1) {
          henny = artists.splice(positionHenny, 1)[0];
        } else {
          const hennySnap = await artistCollection.doc(hennyArtistId).get();
          henny = hennySnap.data() as Artist;
        }

        artists.unshift(henny);
        artists.push(henny);

        const locations = artists.map((artist: Artist) => {
          return {
            address: artist.id,
            lat: artist.location.latitude,
            lng: artist.location.longitude,
          } as Location;
        });

        const httpPayload = new URLSearchParams();
        httpPayload.append("locations", JSON.stringify(locations));

        const config = {
          headers: {
            "Content-Type": Headers.formUrlEncodedContentType,
          },
        };

        // eslint-disable-next-line max-len
        const resp = await http.post<TourResponse, AxiosResponse<TourResponse>, URLSearchParams>(
            "/tour",
            httpPayload,
            config,
        );

        const result: Artist[] = [];
        Object.values(resp.data.route).forEach((step) => {
          const artist = artists.find((artist) => artist.id === step.name);
          if (artist != undefined) {
            result.push(artist);
          }
        });
        result.splice(0, 1);

        return result;
      } catch (error) {
        if (error instanceof HttpsError) {
          throw error;
        }
        if (error instanceof Error) {
          functions.logger.log("Error occured:", error);
          throw new InternalServerError({
            innerError: error,
          });
        }
        functions.logger.log("Unknown error occured:", error);
        throw new UnknownInternalServerError({});
      }
    },
);

function validate(
    context: functions.https.CallableContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
): GenerateRouteParameters {
  if (context.auth == undefined || context.auth == null) {
    throw new UnauthenticatedError({});
  }
  try {
    const result = data as GenerateRouteParameters;
    if (result.artistIds == undefined || result.artistIds.length < 2) {
      throw new InvalidArgumentError({
        message: "At least two artist ids must be provided.",
      });
    }
    if (result.userLocation == undefined) {
      throw new InvalidArgumentError({
        message: "User location must be provided.",
      });
    }
    return data;
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new InvalidArgumentError({
      message: "Invalid argument.",
    });
  }
}

// export const generateRouteLegacy = functions.https.onRequest(
//     async (req, res) => {
//       try {
//         const params = validateBody(req.body);
//         const artistSnap = await artistCollection.where(
//             firebaseAdmin.firestore.FieldPath.documentId(),
//             "in",
//             params.artistIds,
//         ).get();
//         const artists = artistSnap.docs.map((doc) => doc.data());

//         const positionHenny = artists.findIndex(
//             (artist) => artist.id === hennyArtistId,
//         );

//         let henny: Artist;
//         if (positionHenny !== -1) {
//           henny = artists.splice(positionHenny, 1)[0];
//         } else {
//           const hennySnap = await artistCollection.doc(hennyArtistId).get();
//           henny = hennySnap.data() as Artist;
//         }

//         artists.unshift(henny);
//         artists.push(henny);

//         const locations = artists.map((artist: Artist) => {
//           return {
//             address: artist.id,
//             lat: artist.location.latitude,
//             lng: artist.location.longitude,
//           } as Location;
//         });

//         const httpPayload = new URLSearchParams();
//         httpPayload.append("locations", JSON.stringify(locations));

//         const config = {
//           headers: {
//             "Content-Type": Headers.formUrlEncodedContentType,
//           },
//         };

// eslint-disable-next-line max-len
//         const resp = await http.post<TourResponse, AxiosResponse<TourResponse>, URLSearchParams>(
//             "/tour",
//             httpPayload,
//             config,
//         );

//         const result: Artist[] = [];
//         Object.values(resp.data.route).forEach((step) => {
//           const artist = artists.find((artist) => artist.id === step.name);
//           if (artist != undefined) {
//             result.push(artist);
//           }
//         });
//         result.splice(0, 1);
//         res.status(200).send(result);
//         res.end();
//       } catch (error) {
//         functions.logger.error(error);
//         res.status(500).send(
//             "Something went wrong while posting the message to Slack.",
//         );
//       }
//     },
// );
// function validateBody(
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     data: any,
// ): GenerateRouteParameters {
//   const result = data as GenerateRouteParameters;
//   if (result.artistIds == undefined || result.artistIds.length < 2) {
//     throw new InvalidArgumentError({
//       message: "At least two artist ids must be provided.",
//     });
//   }
//   if (result.userLocation == undefined) {
//     throw new InvalidArgumentError({
//       message: "User location must be provided.",
//     });
//   }
//   return data;
// }
