import { Request, Response } from 'express';
import { makeOffer, rejectOffer, acceptOffer, listSentOffers, listReceivedOffers } from '../services/offerServices';
import { MakeOfferInput } from '../schemas/offerSchema';

export async function makeOfferHandler(req: Request<any, any, MakeOfferInput["body"]>, res: Response) {
  const fromLawyerId = res.locals.user.lawyer_id;
  const { to_lawyer_id, job_id } = req.body;

  try {
    const success = await makeOffer(fromLawyerId, to_lawyer_id, job_id);
    if (success) {
      return res.status(201).json({ message: 'Offer made successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to make offer' });
    }
  } catch (error) {
    console.error('Error making offer:', error);
    return res.status(500).json({ error: 'Failed to make offer' });
  }
}

export async function rejectOfferHandler(req: Request, res: Response) {
  const lawyerId = res.locals.user.lawyer_id;
  const offerId = Number(req.params.offer_id);

  try {
    const success = await rejectOffer(offerId, lawyerId);
    if (success) {
      return res.status(200).json({ message: 'Offer rejected successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to reject offer' });
    }
  } catch (error) {
    console.error('Error rejecting offer:', error);
    return res.status(500).json({ error: 'Failed to reject offer' });
  }
}

export async function acceptOfferHandler(req: Request, res: Response) {
  const lawyerId = res.locals.user.lawyer_id;
  const offerId = Number(req.params.offer_id);

  try {
    const result = await acceptOffer(offerId, lawyerId);

    if (result) {
      return res.status(200).json({ message: 'Offer accepted successfully' });
    } else {
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
