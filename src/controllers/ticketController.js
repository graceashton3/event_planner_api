import * as ticketService from '../services/ticketService.js';

export const createTicket = async (req, res) => {
  try {
    const { price, status, eventId } = req.body;

    if (!price || !eventId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const result = await ticketService.createTicket(
      price,
      status,
      eventId,
      req.user.id
    );

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    res.status(201).json(result.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTickets = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const tickets = await ticketService.getAllTickets();
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid ticket id' });
    }

    const ticket = await ticketService.getTicketById(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (req.user.role !== 'ADMIN' && ticket.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { price, status } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid ticket id' });
    }

    if (!price || !status) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const ticket = await ticketService.getTicketById(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (req.user.role !== 'ADMIN' && ticket.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatedTicket = await ticketService.updateTicket(id, {
      price,
      status
    });

    res.json(updatedTicket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid ticket id' });
    }

    const ticket = await ticketService.getTicketById(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (req.user.role !== 'ADMIN' && ticket.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const deletedTicket = await ticketService.deleteTicket(id);
    res.json(deletedTicket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};