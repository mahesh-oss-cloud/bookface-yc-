export type YcPartner = {
  id: string;
  name: string;
  role: string;
  formerCompany: string;
  batch: string;
  bio: string;
  image: string | null;
};

export const YC_PARTNERS: YcPartner[] = [
  {
    id: "garry-tan",
    name: "Garry Tan",
    role: "President & CEO",
    formerCompany: "Posterous",
    batch: "S08",
    bio: "Co-founded Posterous and Initialized Capital. Earlier, he was an engineer and designer at Palantir and helped build parts of the YC founder experience, including Bookface.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/a6cc9253e166b0a3d01381925958e112ec0c781f.jpg?1616220339=",
  },
  {
    id: "harj-taggar",
    name: "Harj Taggar",
    role: "Managing Partner",
    formerCompany: "Auctomatic",
    batch: "W07",
    bio: "Co-founded Auctomatic and Triplebyte. He first joined YC as a partner in 2010, later returned, and has advised founders across many batches.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/ce6a6797a16d7a99006897e386f36f46b96ed37b.jpg?1606325891=",
  },
  {
    id: "jared-friedman",
    name: "Jared Friedman",
    role: "Managing Partner",
    formerCompany: "Scribd",
    batch: "S06",
    bio: "Co-founded Scribd, which was funded by YC in 2006. He works with YC companies on software and has advised more than 20 YC unicorns.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/a927622876e01908a36dcfd139c2e80b730f8fcf.jpg?1748977182=",
  },
  {
    id: "aaron-epstein",
    name: "Aaron Epstein",
    role: "General Partner",
    formerCompany: "Creative Market",
    batch: "W10",
    bio: "Co-founded Creative Market, a marketplace for design assets that helped independent creators reach customers around the world.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/c4f553b962e3706616d14acf8112b713d869f85b.jpg?1606324055=",
  },
  {
    id: "diana-hu",
    name: "Diana Hu",
    role: "Managing Partner",
    formerCompany: "Escher Reality",
    batch: "S17",
    bio: "Co-founded and served as CTO of Escher Reality, later acquired by Niantic. At Niantic, she led the augmented-reality platform behind products used by millions.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/36477564f07b2f9314a051cebc0237a9c117e07a.jpg?1617298669=",
  },
  {
    id: "gustaf-alstromer",
    name: "Gustaf Alströmer",
    role: "General Partner",
    formerCompany: "Heysan",
    batch: "W07",
    bio: "Co-founded Heysan and later led growth at Airbnb for four and a half years. He previously led growth at Voxer.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/4f928989bed2a19d272b3d15d1ea79e8079bb02a.jpg?1738962698=",
  },
  {
    id: "nicolas-dessaigne",
    name: "Nicolas Dessaigne",
    role: "General Partner",
    formerCompany: "Algolia",
    batch: "W14",
    bio: "Co-founded Algolia, the search API company, and led it as CEO as it grew to hundreds of employees. He remains involved as a board director.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/5253ee21e2f3d017ba0651543b6298204a34b573.jpg?1606324053=",
  },
  {
    id: "tom-blomfield",
    name: "Tom Blomfield",
    role: "General Partner",
    formerCompany: "GoCardless",
    batch: "S11",
    bio: "Founded GoCardless and co-founded Monzo. He helped build Monzo into one of the UK's best-known app-based banks.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/42a6b32151f7a837870b642740069a54064e05fd.jpg?1678905548=",
  },
  {
    id: "brad-flora",
    name: "Brad Flora",
    role: "General Partner",
    formerCompany: "Perfect Audience",
    batch: "S11",
    bio: "Co-founded and led Perfect Audience, an advertising platform acquired by Marin Software. He is also an active angel investor.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/b80b1786df98079214a5924c8d51ac0078811c95.jpg?1606325269=",
  },
  {
    id: "pete-koomen",
    name: "Pete Koomen",
    role: "General Partner",
    formerCompany: "Optimizely",
    batch: "W10",
    bio: "Co-founded Optimizely and helped grow it from an early product into a large experimentation platform before its acquisition.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/3b71d3b3291400d1a59332c328d503155ba7f29a.jpg?1741753990=",
  },
  {
    id: "ankit-gupta",
    name: "Ankit Gupta",
    role: "General Partner",
    formerCompany: "Reverie Labs",
    batch: "W18",
    bio: "Co-founded Reverie Labs, which used machine learning for drug discovery and advanced medicines into clinical development before its acquisition.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/44d78f3fa59c47849b2622c0db40acb2d83e57d3.jpg?1741543141=",
  },
  {
    id: "tyler-bosmeny",
    name: "Tyler Bosmeny",
    role: "General Partner",
    formerCompany: "Clever",
    batch: "S12",
    bio: "Co-founded and led Clever, which helps schools give students and teachers access to their learning software. Clever was acquired in 2021.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/d27d955ba970b9f2f6af1f13dd8ec52f7e2707b2.jpg?1699638311=",
  },
  {
    id: "david-lieb",
    name: "David Lieb",
    role: "General Partner",
    formerCompany: "Bump",
    batch: "S09",
    bio: "Co-founded Bump, acquired by Google. The team's later photo-sharing work became the foundation for Google Photos.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/bc67d3452ba64bfed92186bf0f4ca3c13577d8d1.jpg?1650649240=",
  },
  {
    id: "andrew-miklas",
    name: "Andrew Miklas",
    role: "General Partner",
    formerCompany: "PagerDuty",
    batch: "S10",
    bio: "Co-founded PagerDuty and served as its founding CTO, designing the original product and scaling its engineering team.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/cf1d31c61d8aa0712171e07025a4d4f23d65e5a3.jpg?1692122912=",
  },
  {
    id: "harshita-arora",
    name: "Harshita Arora",
    role: "General Partner",
    formerCompany: "AtoB",
    batch: "S20",
    bio: "Co-founded AtoB, which builds financial infrastructure for the trucking industry. She previously built a cryptocurrency portfolio app.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/42b2318d4334342764e121c6261d7a6e84dbade7.jpg?1758561959=",
  },
  {
    id: "jon-xu",
    name: "Jon Xu",
    role: "General Partner",
    formerCompany: "FutureAdvisor",
    batch: "S10",
    bio: "Co-founded FutureAdvisor and led product and engineering as it built a robo-advisor platform for financial institutions. The company was acquired by BlackRock.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/4e5616b84afd6f567d64bb69deaa861c087e5a1a.jpg?1713220273=",
  },
  {
    id: "chris-golda",
    name: "Chris Golda",
    role: "General Partner",
    formerCompany: "BackType",
    batch: "S08",
    bio: "Co-founded BackType, later acquired by Twitter, and launched Twitter's Ad Center. He also helped open-source Apache Storm.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/32667dde69bcd7d971b9df9ffabc2467c405c383.jpg?1606325045=",
  },
  {
    id: "grey-baker",
    name: "Grey Baker",
    role: "General Partner",
    formerCompany: "Pincites",
    batch: "S23",
    bio: "Co-founded Pincites and Dependabot. He previously led product and engineering at GoCardless.",
    image: "https://bookface-images.s3.amazonaws.com/avatars/9e3084ad00957e5bbe06f41a05f5fb8b2ebd4621.jpg?1686750747=",
  },
  {
    id: "vivian-midha-shen",
    name: "Vivian Midha Shen",
    role: "General Partner",
    formerCompany: "Juni Learning",
    batch: "W18",
    bio: "Co-founded Juni Learning and later founded Acely, an AI tutor. She previously worked in engineering, consulting, and product.",
    image: null,
  },
  {
    id: "raphael-schaad",
    name: "Raphael Schaad",
    role: "General Partner",
    formerCompany: "Cron",
    batch: "W20",
    bio: "Founded Cron, which was acquired by Notion. He later grew Notion Calendar and led design for growth and new products.",
    image: null,
  },
];

export function getPartnerByName(name: string | undefined | null): YcPartner | undefined {
  if (!name) return undefined;
  const normalized = name.trim().toLowerCase();
  return YC_PARTNERS.find((partner) => partner.name.toLowerCase() === normalized);
}

export function getPartnerById(id: string): YcPartner | undefined {
  return YC_PARTNERS.find((partner) => partner.id === id);
}
