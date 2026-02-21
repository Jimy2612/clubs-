// src/index.ts

interface Club { name: string; members: number; }
const clubs: Club[] = [
  { name: "Drama Club", members: 12 },
  { name: "Chess Club", members: 8 }
];

clubs.forEach(c => console.log(`${c.name} has ${c.members} members`));