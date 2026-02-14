import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const quizzes = await prisma.quiz.findMany({
    where: {
      question_text: {
        contains: '二人'
      }
    },
    include: {
      choices: true
    }
  });
  console.log(JSON.stringify(quizzes, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
