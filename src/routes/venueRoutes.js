import express from 'express';
import {
  createVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue
} from '../controllers/venueController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/', getVenues);
router.get('/:id', getVenueById);
router.post('/', authenticate, createVenue);
router.put('/:id', authenticate, updateVenue);
router.delete('/:id', authenticate, deleteVenue);

export default router;