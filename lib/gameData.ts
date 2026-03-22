// Static seed data for the MVP to demo the games.
// In a real app, this would be fetched from the database based on the subtopicId.

export type FlashcardContent = {
  id: string;
  front: string;
  back: string;
};

export type SortStepContent = {
  id: string;
  text: string;
  order: number; // The correct order (1-indexed)
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const getGameData = (gameType: string, subtopicId: string) => {
  if (gameType === "flashcard") {
    return [
      { id: "1", front: "What is Time Complexity?", back: "A measure of the amount of time an algorithm takes to run as a function of the length of the input." },
      { id: "2", front: "Big O Notation (O)", back: "Represents the upper bound (worst-case scenario) of an algorithm's time complexity." },
      { id: "3", front: "Big Omega Notation (Ω)", back: "Represents the lower bound (best-case scenario) of an algorithm's time complexity." },
      { id: "4", front: "Big Theta Notation (Θ)", back: "Represents the tight bound (average/typical case) of an algorithm's time complexity." },
      { id: "5", front: "What is Space Complexity?", back: "A measure of the amount of working storage an algorithm needs." },
    ] as FlashcardContent[];
  }

  if (gameType === "sort-steps") {
    return [
      { id: "s1", text: "Initialize all distances as Infinite, and start node as 0", order: 1 },
      { id: "s2", text: "Pick the unvisited vertex with the minimum distance", order: 2 },
      { id: "s3", text: "Update distance of adjacent vertices of the picked vertex", order: 3 },
      { id: "s4", text: "Mark the picked vertex as visited", order: 4 },
      { id: "s5", text: "Repeat until all vertices are visited", order: 5 },
    ] as SortStepContent[];
  }

  return [];
};

export const getQuizData = (subtopicId: string): QuizQuestion[] => {
  return [
    {
      id: "q1",
      question: "What does Big O Notation represent?",
      options: [
        "The tight bound of an algorithm's time complexity", 
        "The lower bound of an algorithm's time complexity", 
        "The upper bound (worst-case scenario) of an algorithm's time complexity", 
        "The average-case scenario of an algorithm's time complexity"
      ],
      correctIndex: 2,
      explanation: "Big O Notation (O) represents the upper bound (worst-case scenario) of an algorithm's time complexity.",
    },
    {
      id: "q2",
      question: "Which notation describes the tight bound (average/typical case) of an algorithm's time complexity?",
      options: ["Big O Notation", "Big Omega Notation", "Big Theta Notation (Θ)", "Little O Notation"],
      correctIndex: 2,
      explanation: "Big Theta Notation (Θ) represents the tight bound of an algorithm's time complexity.",
    },
    {
      id: "q3",
      question: "What is the first step in the algorithm to find the shortest path (as practiced in the sorting steps)?",
      options: [
        "Mark the picked vertex as visited", 
        "Initialize all distances as Infinite, and start node as 0", 
        "Pick the unvisited vertex with the minimum distance", 
        "Update distance of adjacent vertices"
      ],
      correctIndex: 1,
      explanation: "The first step is to initialize all distances as Infinite, and start node as 0.",
    },
    {
      id: "q4",
      question: "Space complexity is defined as a measure of:",
      options: [
        "The amount of time an algorithm takes to run", 
        "The amount of working storage an algorithm needs", 
        "The number of lines of code in the algorithm", 
        "The total edge weights in a graph"
      ],
      correctIndex: 1,
      explanation: "Space complexity is a measure of the amount of working storage an algorithm needs.",
    },
    {
      id: "q5",
      question: "After picking the unvisited vertex with the minimum distance, what is the immediate next step?",
      options: [
        "Mark the picked vertex as visited", 
        "Initialize all distances as infinite", 
        "Update distance of adjacent vertices of the picked vertex", 
        "Repeat until all vertices are visited"
      ],
      correctIndex: 2,
      explanation: "Once you pick the vertex with the minimum distance, you must update the distance of its adjacent vertices.",
    },
  ];
};
