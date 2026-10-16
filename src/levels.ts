import { Level } from './types';

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "De Basis: Home Row",
    description: "Focus op f, j, d en k. Houd je vingers in de basispositie.",
    content: ["fff jjj", "ddd kkk", "fjf jfj", "dkd kdk", "fjd kdk", "jkj fdf", "fjkd jkf dsf"],
    minWpm: 10,
    minAccuracy: 90
  },
  {
    id: 2,
    name: "Middelste Rij Woorden",
    description: "Woorden met letters van de middelste rij (a, s, d, f, g, h, j, k, l).",
    content: ["dal asfal", "sla slaas", "fal dal", "klas slak", "glad slag", "half haal", "glas glad"],
    minWpm: 15,
    minAccuracy: 92
  },
  {
    id: 3,
    name: "Bovenste Rij Intro",
    description: "Introduceer de bovenste rij: q, w, e, r, t, y, u, i, o, p.",
    content: ["weer reer", "tijd rijt", "type poet", "roer toer", "weer poort", "trui ruit", "peer weer"],
    minWpm: 18,
    minAccuracy: 92
  },
  {
    id: 4,
    name: "Alle Rijen Mix",
    description: "Mix van de bovenste en middelste rij woorden.",
    content: ["de kat loopt op de muur", "het weer is vandaag erg goed", "ik leer typen met tien vingers", "een grote rode appel", "de snelle vos springt"],
    minWpm: 22,
    minAccuracy: 94
  },
  {
    id: 5,
    name: "Onderste Rij Intro",
    description: "Introduceer de onderste rij: z, x, c, v, b, n, m.",
    content: ["zand mand", "vandaan maan", "nacht macht", "zoals mens", "bezoek boek", "vleugel blauw", "mensen zijn"],
    minWpm: 25,
    minAccuracy: 94
  },
  {
    id: 6,
    name: "Eerste Zinnen",
    description: "Kleine zinnen met alle letters (onderkast).",
    content: [
      "de kat krabt de krullen van de trap",
      "alle vogels vliegen in de blauwe lucht",
      "typvaardigheid is heel handig voor later",
      "oefening baart kunst zegt het spreekwoord",
      "ik kan nu al vrij snel typen op dit bord"
    ],
    minWpm: 30,
    minAccuracy: 95
  },
  {
    id: 7,
    name: "Hoofdletters & Punten",
    description: "Tijd voor hoofdletters en leestekens.",
    content: [
      "Hallo, hoe gaat het met jou?",
      "De hoofdstad van Nederland is Amsterdam.",
      "Ik vind typen erg leuk!",
      "VingerVlug is de beste app om te leren.",
      "Vandaag is het een mooie dag, nietwaar?"
    ],
    minWpm: 35,
    minAccuracy: 95
  },
  {
    id: 8,
    name: "Getallen & Symbolen",
    description: "Focus op de bovenste rij cijfers.",
    content: [
      "Er zijn 12 maanden in een jaar.",
      "Mijn telefoonnummer is 06-12345678.",
      "De prijs is €45,50 inclusief BTW.",
      "In 2024 gaan we weer op vakantie.",
      "Wachtwoord123 is niet echt veilig!"
    ],
    minWpm: 30,
    minAccuracy: 92
  },
  {
    id: 9,
    name: "Gevorderde Teksten",
    description: "Langere teksten met alles erop en eraan.",
    content: [
      "De snelle bruine vos springt over de luie hond heen, terwijl de zon langzaam ondergaat.",
      "Programmeren in TypeScript is erg leuk als je eenmaal de basis onder de knie hebt.",
      "Het is belangrijk om rechtop te zitten en je polsen niet op het bureau te laten rusten.",
      "Kijk altijd naar het scherm en probeer niet naar je vingers te staren tijdens het typen."
    ],
    minWpm: 45,
    minAccuracy: 97
  },
  {
    id: 10,
    name: "TypKoning",
    description: "De ultieme uitdaging voor de echte professionals.",
    content: [
      "De technologische vooruitgang van de afgelopen decennia heeft onze manier van communiceren volledig veranderd.",
      "Artificiële intelligentie speelt een steeds grotere rol in onze dagelijkse interacties met computers en smartphones.",
      "Consistentie is de sleutel tot succes wanneer je een nieuwe vaardigheid zoals blind typen probeert te leren.",
      "Zestien zwarte zwanen zwommen zeer statig langs het zompige zandpad van de zonnige zuidkant."
    ],
    minWpm: 60,
    minAccuracy: 98
  }
];
