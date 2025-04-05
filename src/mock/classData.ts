export interface ClassData {
  id: string;
  name: string;
  teacher: string;
  room: string;
  students: number;
  description: string;
}

export const mockClassData: ClassData[] = [
  {
    id: "cls-001",
    name: "Mathematics 101",
    teacher: "Dr. Jane Smith",
    room: "A-201",
    students: 32,
    description:
      "Introduction to basic mathematical concepts including algebra and geometry.",
  },
  {
    id: "cls-002",
    name: "Physics for Beginners",
    teacher: "Prof. Robert Johnson",
    room: "B-105",
    students: 25,
    description:
      "Fundamental physics principles and mechanics for first-year students.",
  },
  {
    id: "cls-003",
    name: "English Literature",
    teacher: "Ms. Emily Brooks",
    room: "C-304",
    students: 28,
    description:
      "Analysis of classic literature works and essay writing skills.",
  },
  {
    id: "cls-004",
    name: "Computer Science Fundamentals",
    teacher: "Dr. Alan Turing",
    room: "Lab-101",
    students: 20,
    description:
      "Introduction to programming concepts, algorithms, and problem-solving techniques.",
  },
  {
    id: "cls-005",
    name: "Chemistry Lab",
    teacher: "Dr. Marie Curie",

    room: "Lab-202",
    students: 18,
    description:
      "Hands-on laboratory experiments exploring chemical reactions and properties.",
  },
];
