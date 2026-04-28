import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createEvent = async (req, res) => {
  try {
    const { title, description, eventDate, venueId } = req.body;

    if (!title || !description || !eventDate || !venueId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const venue = await prisma.venue.findUnique({
      where: { id: Number(venueId) }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        venueId: Number(venueId),
        createdBy: req.user.id
      }
    });

    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid event id' });
    }

    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, eventDate, venueId } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid event id' });
    }

    if (!title || !description || !eventDate || !venueId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (req.user.role !== 'ADMIN' && event.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const venue = await prisma.venue.findUnique({
      where: { id: Number(venueId) }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        venueId: Number(venueId)
      }
    });

    res.json(updatedEvent);
  } catch (err) {
    console.error(err);

    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Event already exists with this title, date, and venue' });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid event id' });
    }

    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (req.user.role !== 'ADMIN' && event.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const deletedEvent = await prisma.event.delete({ where: { id } });

    res.json(deletedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};