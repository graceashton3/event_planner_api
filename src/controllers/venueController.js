import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createVenue = async (req, res) => {
  try {
    const { name, address, capacity } = req.body;

    if (!name || !address || !capacity) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const venue = await prisma.venue.create({
      data: {
        name,
        address,
        capacity,
        createdBy: req.user.id
      }
    });

    res.status(201).json(venue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getVenues = async (req, res) => {
  try {
    const venues = await prisma.venue.findMany();
    res.json(venues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getVenueById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid venue id' });
    }

    const venue = await prisma.venue.findUnique({
      where: { id }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    res.json(venue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateVenue = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, address, capacity } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid venue id' });
    }

    if (!name || !address || !capacity) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const venue = await prisma.venue.findUnique({
      where: { id }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    if (req.user.role !== 'ADMIN' && venue.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatedVenue = await prisma.venue.update({
      where: { id },
      data: {
        name,
        address,
        capacity
      }
    });

    res.json(updatedVenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteVenue = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid venue id' });
    }

    const venue = await prisma.venue.findUnique({
      where: { id }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    if (req.user.role !== 'ADMIN' && venue.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const deletedVenue = await prisma.venue.delete({
      where: { id }
    });

    res.json(deletedVenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};