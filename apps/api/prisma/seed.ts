/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  const sections = [
    { name: 'hero', order: 1 },
    { name: 'about', order: 2 },
    { name: 'skills', order: 3 },
    { name: 'projects', order: 4 },
    { name: 'experience', order: 5 },
    { name: 'contact', order: 6 },
  ];

  for (const section of sections) {
    await prisma.siteSection.upsert({
      where: { name: section.name },
      update: {},
      create: {
        name: section.name,
        order: section.order,
        isEnabled: true,
      },
    });
  }

  const contents = [
    {
      key: 'bio',
      value:
        'Full Stack Developer with a passion for building clean and functional web applications.',
    },
    { key: 'tagline', value: 'Building digital experiences that matter.' },
    { key: 'openToWork', value: 'true' },
  ];

  for (const content of contents) {
    await prisma.siteContent.upsert({
      where: { key: content.key },
      update: {},
      create: {
        key: content.key,
        value: content.value,
      },
    });
  }

  await prisma.profile.upsert({
    where: { id: 'default-profile' },
    update: {},
    create: {
      id: 'default-profile',
      headline: 'Full Stack Developer',
      bio: 'I love coding and building things.',
      location: 'Bandung, Indonesia',
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
