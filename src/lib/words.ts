
export const wordCategories: Record<string, Record<string, string[]>> = {
  "Animals": {
    "General": [
      "Elephant", "Tiger", "Giraffe", "Zebra", "Monkey", "Lion", "Hippo", 
      "Kangaroo", "Penguin", "Dolphin", "Koala", "Panda", "Cheetah", "Gorilla", "Octopus"
    ],
    "भारतीय और हिंदी": [
      "मोर", "बाघ", "लंगूर", "कोबरा", "सांभर", "नेवला", "नीलगाय",
      "घड़ियाल", "शेर", "हाथी", "बंदर", "गाय", "ऊंट", "भालू", "मगरमच्छ"
    ]
  },
  "TV Shows and Movies": {
    "General": [
      "Friends", "The Office", "Game of Thrones", "Breaking Bad", "Stranger Things", 
      "The Crown", "Money Heist", "Black Mirror", "The Simpsons", "Seinfeld", 
      "Westworld", "The Mandalorian", "Sherlock", "Doctor Who", "Peaky Blinders",
      "Inception", "The Dark Knight", "Forrest Gump", "Pulp Fiction", "The Matrix",
      "Avatar", "Titanic", "Jurassic Park", "Star Wars", "The Avengers"
    ],
    "भारतीय और हिंदी": [
      "CID", "तारक मेहता", "महाभारत", "रामायण", "सेक्रेड गेम्स", "मिर्जापुर",
      "द फैमिली मैन", "पंचायत", "स्कैम 1992", "बिग बॉस", "KBC", "शक्तिमान",
      "साराभाई vs साराभाई", "लगान", "3 इडियट्स", "दंगल", "बाहुबली", "RRR",
      "शोले", "मुग़ल-ए-आज़म", "क्वीन", "अंधाधुन", "चक दे इंडिया"
    ]
  },
  "Celebrities": {
    "General": [
      "Beyoncé", "Tom Hanks", "Dwayne Johnson", "Taylor Swift", "Leonardo DiCaprio", 
      "Jennifer Lawrence", "Will Smith", "Ariana Grande", "Keanu Reeves", "Rihanna", 
      "Brad Pitt", "Angelina Jolie", "Oprah Winfrey", "Elon Musk", "Serena Williams"
    ],
    "भारतीय और हिंदी": [
      "शाहरुख खान", "अमिताभ बच्चन", "प्रियंका चोपड़ा", "दीपिका पादुकोण", "सलमान खान",
      "आमिर खान", "सचिन तेंदुलकर", "विराट कोहली", "ए. आर. रहमान", "लता मंगेशकर",
      "नरेन्द्र मोदी", "रजनीकांत", "अक्षय कुमार", "करीना कपूर", "ह्रितिक रोशन"
    ]
  },
  "Mixed": {
    "General": [], // Will be populated by getWordsForCategory
    "भारतीय और हिंदी": [] // Will be populated by getWordsForCategory
  }
};

wordCategories.Mixed.General = [
    ...wordCategories.Animals.General,
    ...wordCategories['TV Shows and Movies'].General,
    ...wordCategories.Celebrities.General
];
wordCategories.Mixed['भारतीय और हिंदी'] = [
    ...wordCategories.Animals['भारतीय और हिंदी'],
    ...wordCategories['TV Shows and Movies']['भारतीय और हिंदी'],
    ...wordCategories.Celebrities['भारतीय और हिंदी']
];


export const getWordsForCategory = (category: string, variant: string): string[] => {
  const categoryVariants = wordCategories[category];
  if (categoryVariants) {
    return categoryVariants[variant] || [];
  }

  return [];
};

export const categories = [
  { name: "Animals", icon: "Cat" },
  { name: "TV Shows and Movies", icon: "Tv" },
  { name: "Celebrities", icon: "User" },
  { name: "Mixed", icon: "Users" },
];
