import * as repo from '../repositories/ticketRepo.js';

export const createTicket = async (price, status, eventId, userId) => {
  const event = await repo.findEventById(Number(eventId));

  if (!event) {
    return { error: 'Event not found', status: 404 };
  }

  try {
    const ticket = await repo.createTicket({
      price,
      status: status || 'PURCHASED',
      eventId: Number(eventId),
      userId
    });

    return { data: ticket };
  } catch (err) {
    if (err.code === 'P2002') {
      return { error: 'Ticket already exists for this user and event', status: 409 };
    }
    throw err;
  }
};

export const getAllTickets = () => {
  return repo.findAllTickets();
};

export const getTicketById = (id) => {
  return repo.findTicketById(id);
};

export const updateTicket = (id, data) => {
  return repo.updateTicket(id, data);
};

export const deleteTicket = (id) => {
  return repo.deleteTicket(id);
};