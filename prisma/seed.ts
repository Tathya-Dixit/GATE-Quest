import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const subjects = [
  {
    name: "Discrete Mathematics",
    slug: "discrete-mathematics",
    description: "Propositional logic, sets, relations, functions, graphs, combinatorics.",
    order: 1,
    subtopics: [
      { name: "Propositional and first-order logic", slug: "logic", order: 1 },
      { name: "Sets, relations, functions", slug: "sets-relations", order: 2 },
      { name: "Graphs", slug: "graphs", order: 3 },
      { name: "Combinatorics", slug: "combinatorics", order: 4 },
    ],
  },
  {
    name: "Data Structures",
    slug: "data-structures",
    description: "Arrays, stacks, queues, linked lists, trees, and graphs.",
    order: 2,
    subtopics: [
      { name: "Arrays, stacks, queues, linked lists", slug: "basics", order: 1 },
      { name: "Trees, binary search trees, binary heaps", slug: "trees", order: 2 },
      { name: "Graphs", slug: "graphs", order: 3 },
    ],
  },
  {
    name: "Algorithms",
    slug: "algorithms",
    description: "Time complexity, searching, sorting, greedy, dynamic programming.",
    order: 3,
    subtopics: [
      { name: "Asymptotic time and space complexity", slug: "complexity", order: 1 },
      { name: "Searching, sorting, hashing", slug: "searching-sorting", order: 2 },
      { name: "Greedy algorithms", slug: "greedy", order: 3 },
      { name: "Dynamic programming", slug: "dp", order: 4 },
      { name: "Divide-and-conquer", slug: "dac", order: 5 },
    ],
  },
  {
    name: "Operating Systems",
    slug: "operating-systems",
    description: "Processes, threads, inter-process communication, scheduling, memory.",
    order: 4,
    subtopics: [
      { name: "System calls, processes, threads", slug: "processes", order: 1 },
      { name: "Concurrency, synchronization, deadlock", slug: "concurrency", order: 2 },
      { name: "CPU scheduling", slug: "scheduling", order: 3 },
      { name: "Memory management and virtual memory", slug: "memory", order: 4 },
    ],
  },
];

async function main() {
  console.log("Seeding started...");

  // Clean existing data
  await prisma.subtopic.deleteMany();
  await prisma.subject.deleteMany();

  for (const subject of subjects) {
    const createdSubject = await prisma.subject.create({
      data: {
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
        order: subject.order,
        subtopics: {
          create: subject.subtopics,
        },
      },
    });
    console.log(`Created subject: ${createdSubject.name}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
