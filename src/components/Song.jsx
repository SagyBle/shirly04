import React from 'react'

//TODO: get from api all the {title:sometitle, lyrics:fullLyrics} 
// meanwhile 

const songs = [
  {title: "אהבתיה - שלמה ארצי",
  lyrics:`היא בליבי עכשיו <br/> בתוך ליבי <br/> כמו הרבה צללים<br/> כמו הרבה שבילים <br/>כמו עשן` ,},
  {title: "בוא - עברי לידר",
  lyrics:`בוא נפזר את מסך הערפל <br/> בוא נעמוד באור ולא בצל <br/> עד מתי נמשיך לברוח <br/> אל משחקים של כוח <br/>` ,},
  {title: "גן סגור - הכבש השישה עשר",
  lyrics:`אתמול בחמש אחרי הצהריים <br/> הלכנו עם אמא למכולת <br/>ובדרך ראינו<br/>שהגן שלנו סגור` ,},
  {title: "דובשנייה - שחר סיאול ונורוז",
  lyrics:`פויה<br/> ילדה רעה של טיקטוק בואי לאבויה<br/>לא מתאמצת לא אכפת כמה צפו בה<br/> רודפת מותגים אז היא דוהרת כמו פומה<br/> וזה הזוי הא?` ,},
  {title: "הינך יפה רעייתי - עידן רייכל",
  lyrics:`במיטתי כבר שבועות ביקשתי<br/> את שאהבה נפשי ולא מצאתיו<br/> חיפשתי בין כל רחובות העיר<br/> העמוסה שקרים הזאת ולא מצאתיו<br/>` ,},
  {title: "והלכתי בדרך - אלון עדר",
  lyrics:`והלכתי בדרך שהייתה ארוכה <br/> להביט אודותיה <br/> לא ראיתי שרע לך השבילים התפצלו <br/> והדרך לא תמה` ,},
]

function Song(props) {

  // let song = songs.find(song => {song.title === props.playingNext})
  console.log(props.playingNow);
  let s = songs.find((s)=>{return s.title === props.playingNow})
  console.log(s)
  
  return (
    <div>
      <h1>Playing now: {props.playingNow}</h1>
      { s && <p>{s.lyrics}</p>}
    </div>    
       
  )
}

export default Song
