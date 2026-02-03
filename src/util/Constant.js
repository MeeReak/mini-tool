const CASE_TYPES = [
  { key: "sentence", label: "sentence" },
  { key: "capitalized", label: "capitalized" },
  { key: "alternating", label: "alternating" },
  { key: "lower", label: "lower" },
  { key: "upper", label: "upper" },
  // { key: "title", label: "titleCase" },
  // { key: "inverse", label: "inverse" },
  {
    key: "no-symbol",
    label: "noSymbol"
  },
  { key: "random-separator", label: "randomSeparator" }
];

const Photo_Base64 = "data:image/png;base64,";

const khDayInWeek = {
  Monday: "ចន្ទ",
  Tuesday: "អង្គារ",
  Wednesday: "ពុធ",
  Thursday: "ព្រហស្បតិ៍",
  Friday: "សុក្រ",
  Saturday: "សៅរ៍",
  Sunday: "អាទិត្យ"
};

const khMonthInWeek = {
  January: "មករា",
  February: "កុម្ភៈ",
  March: "មីនា",
  April: "មេសា",
  May: "ឧសភា",
  June: "មិថុនា",
  July: "កក្កដា",
  August: "សីហា",
  September: "កញ្ញា",
  October: "តុលា",
  November: "វិច្ឆិកា",
  December: "ធ្នូ"
};

const khDigit = {
  0: "០",
  1: "១",
  2: "២",
  3: "៣",
  4: "៤",
  5: "៥",
  6: "៦",
  7: "៧",
  8: "៨",
  9: "៩"
};

const KH_MONTH = [
  "មិគសិរ",
  "បុស្ស",
  "មាឃ",
  "ផល្គុន",
  "ចេត្រ",
  "ពិសាខ",
  "ជេស្ឋ",
  "បឋមាសាឍ",
  "ទុតិយាសាឍ",
  "អាសាឍ",
  "ស្រាពណ៍",
  "ភទ្របទ",
  "អស្សុជ",
  "កត្តិក"
];

const yearMonths = [
  "MĬKÔSĔR",
  "BŎSS",
  "MÉAKH",
  "PHÂLKŬN",
  "CHÉTR",
  "VĬSAKH",
  "CHÉSTH",
  "ASATH",
  "BÂTHÂMSATH",
  "TŬTĔYÉASATH",
  "SRAPÔNÂ",
  "PHÔTRÔBÂT",
  "ÂSSŎCH",
  "KÂTDĔK"
];

export const KH_ZODIAC = [
  { code: "JUTE", kh: "ជូត", en: "Rat" },
  { code: "CHLOV", kh: "ឆ្លូវ", en: "Ox" },
  { code: "KARL", kh: "ខាល", en: "Tiger" },
  { code: "THOS", kh: "ថោះ", en: "Rabbit" },
  { code: "RORNG", kh: "រោង", en: "Dragon" },
  { code: "MASAGN", kh: "ម្សាញ់", en: "Snake" },
  { code: "MOMEE", kh: "មមី", en: "Horse" },
  { code: "MOMAY", kh: "មមែ", en: "Goat" },
  { code: "VOKE", kh: "វក", en: "Monkey" },
  { code: "ROKA", kh: "រកា", en: "Rooster" },
  { code: "JOR", kh: "ច", en: "Dog" },
  { code: "KAOR", kh: "កុរ", en: "Pig" }
];

const ZODIAC_YEARS = [
  "JUTE",
  "CHLOV",
  "KARL",
  "THOS",
  "RORNG",
  "MASAGN",
  "MOMEE",
  "MOMAY",
  "VOKE",
  "ROKA",
  "JOR",
  "KAOR"
];

const KH_STEM = [
  "ឯកស័ក",
  "ទោស័ក",
  "ត្រីស័ក",
  "ចត្វាស័ក",
  "បញ្ចស័ក",
  "ឆស័ក",
  "សប្តស័ក",
  "អដ្ឋស័ក",
  "នព្វស័ក",
  "សំរឹទ្ធិស័ក"
];

export {
  CASE_TYPES,
  Photo_Base64,
  khDayInWeek,
  khDigit,
  KH_MONTH,
  KH_STEM,
  khMonthInWeek
};
