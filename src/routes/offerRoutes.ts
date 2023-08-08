import express from 'express';
import { makeOfferHandler, listSentOffersHandler, listReceivedOffersHandler, acceptOfferHandler, rejectOfferHandler } from '../controllers/offerController';
import validateResource from '../middlewares/validateResource';
import { makeOfferSchema } from '../schemas/offerSchema';
import requireUser from '../middlewares/requireUser';

const offerRouter = express.Router();

// Route for making an offer
offerRouter.post('/api/offers', validateResource(makeOfferSchema), requireUser, makeOfferHandler);
// Route for listing the offers sent
offerRouter.get('/api/offers/sent', requireUser, listSentOffersHandler);
// Route for listing the offers received
offerRouter.get('/api/offers/received', requireUser, listReceivedOffersHandler);
// Route for accepting an offer
offerRouter.put('/api/offers/:offer_id/accept', requireUser, acceptOfferHandler);
// Route for rejecting an offer
offerRouter.put('/api/offers/:offer_id/reject', requireUser, rejectOfferHandler);

export default offerRouter;
