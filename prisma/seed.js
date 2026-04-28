import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  const user1 = await prisma.user.create({
    data: {
      username: 'user1',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'USER'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'user2',
      email: 'other@example.com',
      password: hashedPassword,
      role: 'USER'
    }
  });

  const venue1 = await prisma.venue.create({
    data: {
      name: 'Student Union',
      address: 'UNC Charlotte',
      capacity: 200,
      createdBy: user1.id
    }
  });

  const venue2 = await prisma.venue.create({
    data: {
      name: 'Conference Hall',
      address: 'Charlotte Downtown',
      capacity: 300,
      createdBy: user2.id
    }
  });

  const event1 = await prisma.event.create({
    data: {
      title: 'Networking Night',
      description: 'Meet professionals',
      eventDate: new Date('2026-05-01T00:00:00.000Z'),
      venueId: venue1.id,
      createdBy: user1.id
    }
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Tech Conference',
      description: 'Tech talks',
      eventDate: new Date('2026-06-01T00:00:00.000Z'),
      venueId: venue2.id,
      createdBy: user2.id
    }
  });

  await prisma.ticket.create({
    data: {
      price: 20,
      status: 'PURCHASED',
      eventId: event1.id,
      userId: user1.id
    }
  });

  await prisma.ticket.create({
    data: {
      price: 30,
      status: 'PURCHASED',
      eventId: event2.id,
      userId: user2.id
    }
  });

  console.log('🌱 Seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });