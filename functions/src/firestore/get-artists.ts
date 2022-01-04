import * as functions from "firebase-functions";
import {artistCollection} from "../config/firebase-admin";

export const getArtists = functions.https.onRequest(
    async (_, res) => {
      try {
        const artists = await artistCollection.get();
        res.status(200).send(artists);
        res.end();
      } catch (error) {
        functions.logger.error(error);
        res.status(500).send(
            "Something went wrong while posting the message to Slack.",
        );
      }
    },
);
