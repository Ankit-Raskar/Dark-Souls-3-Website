import type { Covenant } from "./types";

export const covenants: Covenant[] = [
  {
    id: "warriors-of-sunlight",
    name: "Warriors of Sunlight",
    description: "The covenant of Solaire of Astora, the warriors who praise the Sun. Sunlight Medals are offered in exchange for the miracles of the Sun.",
    leader: "The Altar of Sunlight (no NPC leader)",
    location: "Lothric Castle — hidden behind the dragon's perch",
    ranks: [
      {
        rank: 1,
        requirement: "1 Sunlight Medal",
        reward: "Lightning Spear miracle",
      },
      {
        rank: 2,
        requirement: "10 Sunlight Medals",
        reward: "Sunlight Straight Sword",
      },
      {
        rank: 3,
        requirement: "30 Sunlight Medals",
        reward: "Great Lightning Spear miracle",
      },
    ],
    lore: "Followers of the firstborn son of Gwyn, the forgotten god of war. They praise the Sun in his name, and offer their medals at his abandoned altars across Lothric.",
  },
  {
    id: "blue-sentinels",
    name: "Blue Sentinels",
    description: "Holy knights sworn to defend the innocent. When a Way of Blue member is invaded, a Blue Sentinel is summoned to their aid.",
    leader: "Horace the Hushed (nominal)",
    location: "Road of Sacrifices — Halfway Fortress bonfire",
    ranks: [
      {
        rank: 1,
        requirement: "1 Proof of a Concord Kept",
        reward: "Way of Blue covenant access",
      },
      {
        rank: 2,
        requirement: "10 Proofs of a Concord Kept",
        reward: "Darkmoon Ring (miracle slot)",
      },
      {
        rank: 3,
        requirement: "30 Proofs of a Concord Kept",
        reward: "Dark Blade miracle",
      },
    ],
    lore: "The Blue Sentinels descend from the Blades of the Darkmoon, the knights who once served Gwyndolin in Anor Londo. They protect the weak from the dark, their blades ever-ready to defend.",
  },
  {
    id: "blade-of-the-darkmoon",
    name: "Blade of the Darkmoon",
    description: "The covenant of Gwyndolin's faithful, sworn to exact vengeance on sinners. Invaders in Irithyll and Anor Londo are their prey.",
    leader: "Captain Yorshka",
    location: "Anor Londo — accessed via the invisible walkway from the spinning tower",
    ranks: [
      {
        rank: 1,
        requirement: "1 Proof of a Concord Kept",
        reward: "Darkmoon covenant items",
      },
      {
        rank: 2,
        requirement: "10 Proofs of a Concord Kept",
        reward: "Darkmoon Ring",
      },
      {
        rank: 3,
        requirement: "30 Proofs of a Concord Kept",
        reward: "Darkmoon Blade miracle",
      },
    ],
    lore: "The Blades of the Darkmoon served Gwyndolin, the dark sun of Anor Londo. After his consumption by Aldrich, Captain Yorshka leads the few remaining blades in his name.",
  },
  {
    id: "way-of-blue",
    name: "Way of Blue",
    description: "The covenant of the frightened faithful, who seek the protection of the Blue Sentinels when invaded.",
    leader: "Old Man in the Cathedral",
    location: "High Wall of Lothric — the old man near Vordt's gate",
    ranks: [
      {
        rank: 1,
        requirement: "Join the covenant",
        reward: "Blue Sentinels summoned on invasion",
      },
    ],
    lore: "The Way of Blue is the covenant of the weak and the fearful — those who cannot defend themselves, but know that the Blue Sentinels will answer their call.",
  },
  {
    id: "mound-makers",
    name: "Mound-makers",
    description: "Madmen who worship the bite of the serpent. Mound-makers can invade any world — host, invader, or cooperators — and reap their rewards in chaos.",
    leader: "Holy Knight Hodrick",
    location: "Undead Settlement — accessed via the wooden cage lift",
    ranks: [
      {
        rank: 1,
        requirement: "1 Vertebra Shackle",
        reward: "Warmth pyromancy",
      },
      {
        rank: 2,
        requirement: "10 Vertebra Shackles",
        reward: "Climbing the Mound-makers",
      },
      {
        rank: 3,
        requirement: "30 Vertebra Shackles",
        reward: "Mound-maker covenant rank 3 reward",
      },
    ],
    lore: "The Mound-makers are the mad, those who would heap the bodies of the dead into mounds in service of the great serpent. They have no side — only the mound.",
  },
  {
    id: "watchdogs-of-farron",
    name: "Watchdogs of Farron",
    description: "The Undead Legion's spirit lives on in these watchdogs, who defend Farron Keep from intruders. They invade any who dare enter the Keep.",
    leader: "Abyss Watchers (in spirit)",
    location: "Farron Keep — the Wolf Blood altar",
    ranks: [
      {
        rank: 1,
        requirement: "1 Wolf's Blood Swordgrass",
        reward: "Wolf Ring",
      },
      {
        rank: 2,
        requirement: "10 Wolf's Blood Swordgrass",
        reward: "Wolf Knight's Greatsword (transposed)",
      },
      {
        rank: 3,
        requirement: "30 Wolf's Blood Swordgrass",
        reward: "Old Wolf Curved Sword",
      },
    ],
    lore: "The Watchdogs are the heirs of the Abyss Watchers' charge — they defend Farron Keep from those who would profane the Legion's rest. The old wolf atop the tower watches over them.",
  },
  {
    id: "aldritch-faithful",
    name: "Aldrich Faithful",
    description: "The faithful of Aldrich, Devourer of Gods, who defend the Cathedral and Irithyll from intruders. They invade any who would approach their master.",
    leader: "Archdeacon McDonnell",
    location: "Irithyll of the Boreal Valley — hidden in the watery depths",
    ranks: [
      {
        rank: 1,
        requirement: "1 Human Dregs",
        reward: "Deep Protection miracle",
      },
      {
        rank: 2,
        requirement: "10 Human Dregs",
        reward: "Archdeacon's Staff",
      },
      {
        rank: 3,
        requirement: "30 Human Dregs",
        reward: "Cleric's Sacred Chime",
      },
    ],
    lore: "The Aldrich Faithful are the devourer's most devoted servants — they slay intruders and offer the human dregs of their kills as tribute. They believe Aldrich will return to devour even more gods.",
  },
  {
    id: "spears-of-the-church",
    name: "Spears of the Church",
    description: "The guardians of Princess Filianore's sleep, who answer the bell when rung by an intruder. The player (or a summoned player) becomes the Spear.",
    leader: "Halflight, Spear of the Church",
    location: "The Ringed City — Church of Filianore",
    ranks: [
      {
        rank: 1,
        requirement: "1 Filianore's Spear Ornament",
        reward: "Divine Pillar Fragment",
      },
      {
        rank: 2,
        requirement: "10 Filianore's Spear Ornaments",
        reward: "Lightning Arrow miracle",
      },
      {
        rank: 3,
        requirement: "30 Filianore's Spear Ornaments",
        reward: "Rift-Key Ring",
      },
    ],
    lore: "The Spears of the Church were once the knights of Princess Filianore, daughter of Gwyn. They defend her sleep at the end of the world, and any who ring the bell must face them.",
  },
];
