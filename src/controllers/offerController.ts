import { Request, Response } from 'express';
import { makeOffer, rejectOffer, acceptOffer, listSentOffers, listReceivedOffers, deleteOffer } from '../services/offerServices';
import { AcceptOfferInput, DeleteOfferInput, MakeOfferInput, RejectOfferInput } from '../schemas/offerSchema';

export async function makeOfferHandler(req: Request<any, any, MakeOfferInput["body"]>, res: Response) {
  const fromLawyerId = res.locals.user.lawyer_id;
  const { to_lawyer_id, job_id } = req.body;

  try {
    const result = await makeOffer(fromLawyerId, to_lawyer_id, job_id);
    if (result === true) {
      return res.status(201).json({ message: 'Offer made successfully' });
    } 
    if (typeof result === 'string') {
      return res.status(400).json({ error: result });
    }
    else {
      return res.status(500).json({ error: 'Failed to make offer' });
    }
  } catch (error) {
    console.error('Error making offer:', error);
    return res.status(500).json({ error: 'Failed to make offer' });
  }
}

export async function rejectOfferHandler(req: Request<RejectOfferInput["params"]>, res: Response) {
  const lawyerId = res.locals.user.lawyer_id;
  const offerId = Number(req.params.offer_id);

  try {
    const result = await rejectOffer(offerId, lawyerId);
    if (result === true) {
      return res.status(200).json({ message: 'Offer rejected successfully' });
    } 
    if (typeof result === 'string'){
      return res.status(400).json({ error: result });
    }
    else {
      return res.status(500).json({ error: 'Failed to reject offer' });
    }
  } catch (error) {
    console.error('Error rejecting offer:', error);
    return res.status(500).json({ error: 'Failed to reject offer' });
  }
}

export async function acceptOfferHandler(req: Request<AcceptOfferInput["params"]>, res: Response) {
  const lawyerId = res.locals.user.lawyer_id;
  const offerId = Number(req.params.offer_id);

  try {
    const result = await acceptOffer(offerId, lawyerId);

    if (result === true) {
      return res.status(200).json({ message: 'Offer accepted successfully' });
    } 
    if (typeof result === 'string'){
      return res.status(400).json({ error: result });
    }
    else {
      return res.status(500).json({ error: 'Failed to accept offer' });
    }
  } catch (error) {
    console.error('Error accepting offer:', error);
    return res.status(500).json({ error: 'Failed to accept offer' });
  }
}

export async function listSentOffersHandler(req: Request, res: Response) {
  const fromLawyerId = res.locals.user.lawyer_id;

  try {
    const sentOffers = await listSentOffers(fromLawyerId);
    return res.status(200).json(sentOffers);
  } catch (error) {
    console.error('Error getting sent offers:', error);
    return res.status(500).json({ error: 'Failed to get sent offers' });
  }
}

export async function listReceivedOffersHandler(req: Request, res: Response) {
  const toLawyerId = res.locals.user.lawyer_id;

  try {
    const receivedOffers = await listReceivedOffers(toLawyerId);
    return res.status(200).json(receivedOffers);
  } catch (error) {
    console.error('Error getting received offers:', error);
    return res.status(500).json({ error: 'Failed to get received offers' });
  }
}

export async function deleteOfferHandler(req: Request<DeleteOfferInput["params"]>, res: Response) {
  const offerId = Number(req.params.offer_id);
  const lawyerId = res.locals.user.lawyer_id;

  try {
    const result = await deleteOffer(offerId, lawyerId);

    if (result === true) {
      return res.status(200).json({ message: "Offer deleted successfully." });
    } 
    if (typeof result === 'string'){
      return res.status(400).json({ error: result });
    }
    else {
      return res.status(500).json({ error: "Failed to delete the offer." });
    }
  } catch (error) {
    console.error("Error in deleteOfferHandler:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

