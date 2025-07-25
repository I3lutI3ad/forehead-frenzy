export const wordCategories: Record<string, Record<string, string[]>> = {
  "Animals": {
    "General": [
      "Elephant", "Tiger", "Giraffe", "Zebra", "Monkey", "Lion", "Hippo", 
      "Kangaroo", "Penguin", "Dolphin", "Koala", "Panda", "Cheetah", "Gorilla", "Octopus"
    ],
    "Indian & Hindi": [
      "Peacock", "Bengal Tiger", "Langur", "Cobra", "Sambar", "Mongoose", "Nilgai",
      "Gharial", "Banyan", "Lotus", "Ganga", "Himalayas", "Sher", "Haathi", "Bandar"
    ]
  },
  "TV Shows": {
    "General": [
      "Friends", "The Office", "Game of Thrones", "Breaking Bad", "Stranger Things", 
      "The Crown", "Money Heist", "Black Mirror", "The Simpsons", "Seinfeld", 
      "Westworld", "The Mandalorian", "Sherlock", "Doctor Who", "Peaky Blinders"
    ],
    "Indian & Hindi": [
      "CID", "Tarak Mehta", "Mahabharat", "Ramayan", "Sacred Games", "Mirzapur",
      "The Family Man", "Panchayat", "Scam 1992", "Bigg Boss", "KBC", "Shaktimaan",
      "Sarabhai vs Sarabhai", "Lagaan", "3 Idiots"
    ]
  },
  "Celebrities": {
    "General": [
      "Beyoncé", "Tom Hanks", "Dwayne Johnson", "Taylor Swift", "Leonardo DiCaprio", 
      "Jennifer Lawrence", "Will Smith", "Ariana Grande", "Keanu Reeves", "Rihanna", 
      "Brad Pitt", "Angelina Jolie", "Oprah Winfrey", "Elon Musk", "Serena Williams"
    ],
    "Indian & Hindi": [
      "Shah Rukh Khan", "Amitabh Bachchan", "Priyanka Chopra", "Deepika Padukone", "Salman Khan",
      "Aamir Khan", "Sachin Tendulkar", "Virat Kohli", "A. R. Rahman", "Lata Mangeshkar",
      "Narendra Modi", "Rajinikanth", "Akshay Kumar", "Kareena Kapoor", "Hrithik Roshan"
    ]
  },
};

export const getWordsForCategory = (category: string, variant: string): string[] => {
  if (category === "Mixed") {
    // Flatten all general words from all categories
    return Object.values(wordCategories).map(variants => variants["General"] || []).flat();
  }
  
  const categoryVariants = wordCategories[category];
  if (categoryVariants) {
    return categoryVariants[variant] || [];
  }

  return [];
};

export const categories = [
  { name: "Animals", icon: "Cat" },
  { name: "TV Shows", icon: "Tv" },
  { name: "Celebrities", icon: "User" },
  { name: "Mixed", icon: "Users" },
];
