export const wordCategories: Record<string, string[]> = {
  Animals: [
    "Elephant",
    "Tiger",
    "Giraffe",
    "Zebra",
    "Monkey",
    "Lion",
    "Hippo",
    "Kangaroo",
    "Penguin",
    "Dolphin",
    "Koala",
    "Panda",
    "Cheetah",
    "Gorilla",
    "Octopus",
  ],
  "TV Shows": [
    "Friends",
    "The Office",
    "Game of Thrones",
    "Breaking Bad",
    "Stranger Things",
    "The Crown",
    "Money Heist",
    "Black Mirror",
    "The Simpsons",
    "Seinfeld",
    "Westworld",
    "The Mandalorian",
    "Sherlock",
    "Doctor Who",
    "Peaky Blinders",
  ],
  Celebrities: [
    "Beyoncé",
    "Tom Hanks",
    "Dwayne Johnson",
    "Taylor Swift",
    "Leonardo DiCaprio",
    "Jennifer Lawrence",
    "Will Smith",
    "Ariana Grande",
    "Keanu Reeves",
    "Rihanna",
    "Brad Pitt",
    "Angelina Jolie",
    "Oprah Winfrey",
    "Elon Musk",
    "Serena Williams",
  ],
};

export const getWordsForCategory = (category: string): string[] => {
  if (category === "Mixed") {
    return Object.values(wordCategories).flat();
  }
  return wordCategories[category] || [];
};

export const categories = [
  { name: "Animals", icon: "Cat" },
  { name: "TV Shows", icon: "Tv" },
  { name: "Celebrities", icon: "User" },
  { name: "Mixed", icon: "Users" },
];
