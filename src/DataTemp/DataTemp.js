// songs = [
//   {
//     name: "א",
//     artist: "אומן א",
//     lyrics: "מילים א",
//   },
//   {
//     name: "ב",
//     artist: "אומן ב",
//     lyrics: "מילים ב",
//   },
//   {
//     name: "ג",
//     artist: "אומן ג",
//     lyrics: "מילים ג",
//   },
//   {
//     name: "ד",
//     artist: "אומן ד",
//     lyrics: "מילים ד",
//   },
//   {
//     name: "ה",
//     artist: "אומן ה",
//     lyrics: "מילים ה",
//   },
//   {
//     name: "ו",
//     artist: "אומן ו",
//     lyrics: "מילים ו",
//   },
//   {
//     name: "ז",
//     artist: "אומן ז",
//     lyrics: "מילים ז",
//   },
// ];

songs = [
  {
    name: "א - אומן א",
  },
  {
    name: "ב - אומן ב",
  },
  {
    name: "ג - אומן ג",
  },
  {
    name: "ד - אומן ד",
  },
  {
    name: "ה - אומן ה",
  },
  {
    name: "ו - אומן ו",
  },
  {
    name: "ז - אומן ז",
  },
];

const data = [
  { name: "a", lyrics: "aa aa aa aa" },
  { name: "b" },
  { name: "c" },
  { name: "d" },
  { name: "e" },
];
let target_array = [];
data.map((element) => target_array.push(element.name));
console.log(target_array);
