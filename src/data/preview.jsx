const songs = [
  { id: 3912, artist: "בניה ברבי", song_name: "קרן שמש" },
  { id: 6042, artist: "טונה", song_name: "סהרה" },
  { id: 1820, artist: "אביתר בנאי", song_name: "עד מחר" },
  { id: 10714, artist: "שלמה ארצי", song_name: "תתארו לכם" },
  { id: 6649, artist: "יסמין מועלם", song_name: "יחפים" },
  { id: 9761, artist: "רביב כנר", song_name: "רסיסים" },
  { id: 1795, artist: "אביתר בנאי", song_name: "יפה כלבנה" },
  { id: 4168, artist: "ג'יין בורדו", song_name: "איך אפשר שלא" },
  { id: 6707, artist: "יצחק קלפטר וצליל מכוון", song_name: "צליל מכוון" },
  { id: 5429, artist: "הפיל הכחול", song_name: "יסמין" },
  { id: 5508, artist: "הפרוייקט של עידן רייכל", song_name: "ממעמקים" },
  { id: 5973, artist: "חנן בן ארי", song_name: "אמא אם הייתי" },
  { id: 6891, artist: "כוורת", song_name: "היא כל כך יפה" },
  { id: 1850, artist: "אביתר בנאי ומאיר בנאי", song_name: "אצלך בעולם" },
  { id: 1796, artist: "אביתר בנאי", song_name: "יש לי סיכוי" },
  { id: 3120, artist: "אמיר דדון", song_name: "אור גדול" },
  { id: 9069, artist: "עידן עמדי", song_name: "כאב של לוחמים" },
  { id: 10164, artist: "שולי רנד", song_name: "אייכה" },
  { id: 1569, artist: "אביב גפן", song_name: "אולי" },
  { id: 3139, artist: "אמיר דדון", song_name: "לבחור נכון" },
  { id: 1571, artist: "אביב גפן", song_name: "אור הירח" },
  { id: 5518, artist: "הפרוייקט של עידן רייכל", song_name: "שאריות של החיים" },
  { id: 8812, artist: "עדן חסון", song_name: "שקיעות אדומות" },
  { id: 10629, artist: "שלמה ארצי", song_name: "היא לא יודעת מה עובר עלי" },
  { id: 4670, artist: "דודו טסה ורוני אלטר", song_name: "מעליות" },
  { id: 3755, artist: "בועז מעודה", song_name: "ילד השדה" },
  { id: 6720, artist: "יציאת חירום", song_name: "קחי לך זמן" },
  { id: 9023, artist: "עידן חביב", song_name: "מחכה" },
  { id: 8002, artist: "משינה", song_name: "הכוכבים דולקים על אש קטנה" },
  { id: 8482, artist: "נתן גושן", song_name: "כל מה שיש לי" },
  { id: 3341, artist: "אריאל זילבר", song_name: "ואיך שלא" },
  { id: 1867, artist: "אברהם טל", song_name: "אורות" },
  { id: 1805, artist: "אביתר בנאי", song_name: "לילה כיום יאיר" },
  { id: 2030, artist: "אהוד בנאי", song_name: "יוצא לאור" },
  { id: 9051, artist: "עידן עמדי", song_name: "בזמן האחרון" },
  { id: 6366, artist: "יובל דיין", song_name: "עד שתחזור" },
  { id: 8788, artist: "עדן חסון", song_name: "גדל לי קצת זקן" },
  {
    id: 7261,
    artist: "מאיר אריאל",
    song_name: "לא יכול להוריד ממך את העיניים",
  },
  { id: 8859, artist: "עומר אדם", song_name: "אחרי כל השנים" },
  { id: 303, artist: "Coldplay", song_name: "Fix you" },
  { id: 1600, artist: "אביב גפן", song_name: "האם להיות בך מאוהב" },
  { id: 7486, artist: "מוקי", song_name: "ילד של אבא" },
  { id: 5971, artist: "חנן בן ארי", song_name: "אלוף העולם" },
  { id: 3441, artist: "אריק איינשטיין", song_name: "יש בי אהבה" },
  { id: 7864, artist: "מרסדס בנד", song_name: "משנכנס אדר" },
  { id: 1766, artist: "אביתר בנאי", song_name: "אבא" },
  { id: 3796, artist: "בית הבובות", song_name: "סיגפו" },
  { id: 3797, artist: "בית הבובות", song_name: "עד שבאת" },
  { id: 5522, artist: "הפרוייקט של עידן רייכל", song_name: "שושנים עצובות" },
  { id: 9220, artist: "עמיר בניון", song_name: "ניצחת איתי הכל" },
  { id: 8508, artist: "נתן גושן", song_name: "שני ילדים בעולם" },
  { id: 7167, artist: "לירן דנינו", song_name: "עדיין ריק" },
  { id: 1838, artist: "אביתר בנאי", song_name: "תחרות כלבים" },
  { id: 10274, artist: "שי-לי עטרי", song_name: "אצלנו בגן" },
  { id: 9081, artist: "עידן עמדי", song_name: "נגמר" },
  { id: 7739, artist: "מירי מסיקה", song_name: "עכשיו אתה חוזר בחזרה" },
  { id: 7458, artist: "מוניקה סקס", song_name: "מכה אפורה" },
  { id: 7807, artist: "מרגלית צנעני", song_name: "עץ ירוק מפלסטיק" },
  { id: 9389, artist: "עקיבא תורג'מן", song_name: "יש בך הכל" },
  { id: 4183, artist: "ג'יין בורדו", song_name: "עינב" },
  { id: 4696, artist: "דולי ופן והפרוייקט של עידן רייכל", song_name: "להאמין" },
  { id: 1717, artist: "אביב גפן והפרוייקט של עידן רייכל", song_name: "קוצים" },
  { id: 9048, artist: "עידן עמדי", song_name: "אלייך" },
  { id: 2609, artist: "אייל גולן", song_name: "צליל מיתר" },
  { id: 10649, artist: "שלמה ארצי", song_name: "ירח" },
  { id: 129, artist: "Arctic Monkeys", song_name: "Snap Out Of It" },
  { id: 5501, artist: "הפרוייקט של עידן רייכל", song_name: "לפני שייגמר" },
  { id: 6345, artist: "יובל דיין", song_name: "בדיוק כמו הירח" },
  { id: 3476, artist: "אריק איינשטיין", song_name: "עטור מצחך" },
  { id: 5228, artist: "החלונות הגבוהים", song_name: "אינך יכולה" },
  { id: 5473, artist: "הפרוייקט של עידן רייכל", song_name: "אם תלך" },
  { id: 3384, artist: "אריק איינשטיין", song_name: "אני ואתה" },
  { id: 5725, artist: "זוהר ארגוב", song_name: "הפרח בגני" },
  { id: 2522, artist: "אייל גולן", song_name: "כשאחר" },
  { id: 9991, artist: "ריטה", song_name: "מחכה" },
  { id: 3399, artist: "אריק איינשטיין", song_name: "גיטרה וכינור" },
  { id: 9385, artist: "עקיבא תורג'מן", song_name: "אל תעזבי ידיים" },
  { id: 4886, artist: "דני סנדרסון וכוורת", song_name: "זה הכל בשבילך" },
  { id: 316, artist: "Coldplay", song_name: "Yellow" },
  { id: 1930, artist: "אדיר גץ", song_name: "אהבת נעורי" },
  { id: 3771, artist: "בית הבובות", song_name: "איפה היית" },
  { id: 7377, artist: "מאיר בנאי", song_name: "שער הרחמים" },
  { id: 2002, artist: "אהוד בנאי", song_name: "בלוז כנעני" },
  { id: 10590, artist: "שלמה ארצי", song_name: "אבסורד" },
  { id: 1617, artist: "אביב גפן", song_name: "השיר שלנו" },
  { id: 1654, artist: "אביב גפן", song_name: "מלאך" },
  { id: 1655, artist: "אביב גפן", song_name: "מלח הדמעות" },
  { id: 4648, artist: "דודו טסה", song_name: "לולה" },
  { id: 7163, artist: "לירן דנינו", song_name: "ללכת" },
  { id: 4707, artist: "דור דניאל", song_name: "מקום לצידך" },
  { id: 3486, artist: "אריק איינשטיין", song_name: "פגישה לאין קץ" },
  { id: 498, artist: "Full Trunk וג'ימבו ג'יי", song_name: "סתלבט בקיבוץ" },
  { id: 1712, artist: "אביב גפן ואריק איינשטיין", song_name: "יומן מסע" },
  { id: 4619, artist: "דודו טסה", song_name: "איזה יום" },
  { id: 7266, artist: "מאיר אריאל", song_name: "מודה אני" },
  { id: 8490, artist: "נתן גושן", song_name: "מה אם נתנשק" },
  { id: 3801, artist: "בית הבובות", song_name: "שיר בעיפרון" },
];

const getSongID = (songHeader) => {
  console.log("inside getSongID");
  const arr = songHeader.split(" - ");
  const song_name = arr[0];
  const artist = arr[1];
  console.log(`song_name: ${song_name}, artist: ${artist}`);
  return songs.find(
    (elem) => elem.artist === artist && elem.song_name === song_name
  ).id;
};

async function getHeaders() {
  console.log("getHeaders() activated");
  fetch("http://18.191.165.235:9001/preview")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => console.error(error));
}

export { getHeaders, songs, getSongID };
