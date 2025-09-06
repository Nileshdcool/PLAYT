// Prisma seed script for mock game data
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const games = Array.from({ length: 1000 }).map(() => ({
    title: faker.lorem.words(3),
    genre: faker.music.genre(),
    platform: faker.helpers.arrayElement(['PC', 'PlayStation', 'Xbox', 'Switch', 'Mobile']),
    releaseDate: faker.date.past({ years: 10 }),
    developer: faker.company.name(),
    price: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
    multiplayer: faker.datatype.boolean(),
    metascore: faker.number.int({ min: 1, max: 100 }),
  }));

  await prisma.game.createMany({ data: games });
  console.log('Seeded 1000 games');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
