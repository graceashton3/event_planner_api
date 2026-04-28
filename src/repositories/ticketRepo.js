import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const findAllTickets = () => {
  return prisma.ticket.findMany();
};

export const findTicketById = (id) => {
  return prisma.ticket.findUnique({ where: { id } });
};

export const createTicket = (data) => {
  return prisma.ticket.create({ data });
};

export const updateTicket = (id, data) => {
  return prisma.ticket.update({
    where: { id },
    data
  });
};

export const deleteTicket = (id) => {
  return prisma.ticket.delete({ where: { id } });
};

export const findEventById = (id) => {
  return prisma.event.findUnique({ where: { id } });
};