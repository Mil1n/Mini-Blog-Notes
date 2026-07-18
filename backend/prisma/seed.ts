import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  const password = await bcrypt.hash('password', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: { email: 'demo@example.com', username: 'demo', password },
  });

  await prisma.note.deleteMany({ where: { authorId: user.id } });
  await prisma.note.createMany({
    data: [
      { title: 'Welcome note', content: '# Hello\nThis is a seeded markdown note.', tags: JSON.stringify(['welcome', 'markdown']), category: 'general', pinned: true, favorite: true, draft: false, authorId: user.id },
      { title: 'Draft idea', content: 'Turn this into a longer post later.', tags: JSON.stringify(['idea']), category: 'drafts', pinned: false, favorite: false, draft: true, authorId: user.id },
    ],
  });
};

main().finally(async () => prisma.$disconnect());
