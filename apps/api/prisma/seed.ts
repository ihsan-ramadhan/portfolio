/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  const sections = [
    { name: 'hero', order: 1, isEnabled: true },
    { name: 'about', order: 2, isEnabled: true },
    { name: 'skills', order: 3, isEnabled: true },
    { name: 'projects', order: 4, isEnabled: true },
    { name: 'experience', order: 5, isEnabled: false },
    { name: 'education', order: 6, isEnabled: false },
    { name: 'contact', order: 7, isEnabled: true },
  ];

  for (const section of sections) {
    await prisma.siteSection.upsert({
      where: { name: section.name },
      update: {
        order: section.order,
      },
      create: {
        name: section.name,
        order: section.order,
        isEnabled: section.isEnabled,
      },
    });
  }

  const profile = await prisma.profile.upsert({
    where: { id: 'default-profile' },
    update: {},
    create: {
      id: 'default-profile',
      headline: 'Full Stack Developer',
      tagline: 'Building digital experiences that matter.',
      bio: 'I love coding and building things.',
      location: 'Bandung, Indonesia',
      statusBadge: 'Still Exploring',
    },
  });

  await prisma.experience.deleteMany({ where: { profileId: profile.id } });
  await prisma.experience.createMany({
    data: [
      {
        profileId: profile.id,
        company: 'PT Awan Digital',
        position: 'Web Developer',
        startDate: 'Jan 2026',
        endDate: 'Present',
        description:
          'Assisted in building responsive landing pages and backend APIs using Laravel.',
        order: 1,
      },
      {
        profileId: profile.id,
        company: 'PT Sejahtera',
        position: 'Web Developer Intern',
        startDate: 'Jul 2024',
        endDate: 'Dec 2024',
        description:
          'Assisted in building responsive landing pages and backend APIs using Laravel.',
        order: 2,
      },
    ],
  });

  await prisma.education.deleteMany({ where: { profileId: profile.id } });
  await prisma.education.createMany({
    data: [
      {
        profileId: profile.id,
        institution: 'Politeknik Negeri Bandung',
        major: 'Informatics Engineering',
        startYear: 2024,
        endYear: 2027,
        order: 1,
      },
    ],
  });

  const skills = [
    {
      name: 'HTML5',
      icon: 'html5',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
      category: 'FRONTEND' as const,
      proficiency: 90,
    },
    {
      name: 'CSS3',
      icon: 'css',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
      category: 'FRONTEND' as const,
      proficiency: 90,
    },
  ];

  for (const skill of skills) {
    const existing = await prisma.skill.findFirst({
      where: { name: skill.name },
    });
    if (!existing) {
      await prisma.skill.create({
        data: {
          name: skill.name,
          icon: skill.icon,
          url: skill.url,
          category: skill.category,
          proficiency: skill.proficiency,
        },
      });
    }
  }

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
