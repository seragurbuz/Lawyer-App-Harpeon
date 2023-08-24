import express from 'express';
import { makeOfferHandler, listSentOffersHandler, listReceivedOffersHandler, acceptOfferHandler, rejectOfferHandler, deleteOfferHandler } from '../controllers/offerController';
import validateResource from '../middlewares/validateResource';
import { acceptOfferSchema, deleteOfferSchema, makeOfferSchema, rejectOfferSchema } from '../schemas/offerSchema';
import requireUser from '../middlewares/requireUser';

const offerRouter = express.Router();

/**
* @openapi
* '/api/offers':
*  post:
*     tags:
*     - Offer
*     summary: Make an offer
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*              $ref: '#/components/schemas/MakeOfferInput'
*     responses:
*      201:
*        description: Success
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/MakeOfferResponse'
*      400:
*        description: Bad Request
*      403:
*        description: Forbidden
*      500:
*        description: Internal server error
*/

// Route for making an offer
offerRouter.post('/api/offers', validateResource(makeOfferSchema), requireUser, makeOfferHandler);

/**
* @openapi
* '/api/offers/sent':
*  get:
*     tags:
*     - Offer
*     summary: Get the offers you sent
*     responses:
*       200:
*         description: Success
*         content:
*          application/json:
*           schema:
*              $ref: '#/components/schemas/GetSentOffersResponse'
*       403:
*         description: Forbidden
*       500:
*         description: Internal server error
*/

// Route for listing the offers sent
offerRouter.get('/api/offers/sent', requireUser, listSentOffersHandler);

/**
* @openapi
* '/api/offers/received':
*  get:
*     tags:
*     - Offer
*     summary: Get the offers you received
*     responses:
*       200:
*         description: Success
*         content:
*          application/json:
*           schema:
*              $ref: '#/components/schemas/GetReceivedOffersResponse'
*       403:
*         description: Forbidden
*       500:
*         description: Internal server error
*/

// Route for listing the offers received
offerRouter.get('/api/offers/received', requireUser, listReceivedOffersHandler);

  /**
   * @openapi
   * '/api/offers/{offer_id}/accept':
   *  put:
   *     tags:
   *     - Offer
   *     summary: Accept an offer by its id
   *     parameters:
   *      - name: offer_id
   *        in: path
   *        description: The id of the offer to be accepted
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schemas/AcceptOfferResponse'
   *       400:
   *         description: Bad Request
   *       403:
   *         description: Forbidden
   *       500:
   *         description: Internal server error
   */

// Route for accepting an offer
offerRouter.put('/api/offers/:offer_id/accept', validateResource(acceptOfferSchema), requireUser, acceptOfferHandler);

  /**
   * @openapi
   * '/api/offers/{offer_id}/reject':
   *  put:
   *     tags:
   *     - Offer
   *     summary: Reject an offer by its id
   *     parameters:
   *      - name: offer_id
   *        in: path
   *        description: The id of the offer to be rejected
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schemas/RejectOfferResponse'
   *       400:
   *         description: Bad Request
   *       403:
   *         description: Forbidden
   *       500:
   *         description: Internal server error
   */

// Route for rejecting an offer
offerRouter.put('/api/offers/:offer_id/reject', validateResource(rejectOfferSchema), requireUser, rejectOfferHandler);

  /**
   * @openapi
   * '/api/offers/{offer_id}':
   *  delete:
   *     tags:
   *     - Offer
   *     summary: Delete an offer by its id
   *     parameters:
   *      - name: offer_id
   *        in: path
   *        description: The id of the offer to be deleted
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schemas/DeleteOfferResponse'
   *       400:
   *         description: Bad Request
   *       403:
   *         description: Forbidden
   *       500:
   *         description: Internal server error
   */

// Route for deleting an offer
offerRouter.delete('/api/offers/:offer_id', validateResource(deleteOfferSchema), requireUser, deleteOfferHandler)

export default offerRouter;
