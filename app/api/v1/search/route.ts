import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, SearchResult } from '@/src/types';

const SEARCH_INDEX: SearchResult[] = [
  { id:'n-ashwini',   type:'nakshatra', title:'Ashwini',          titleKn:'ಅಶ್ವಿನಿ',    excerpt:'First Nakshatra, ruled by Ketu. Symbol: Horse head.',        href:'/nakshatra#ashwini',   score:1 },
  { id:'n-rohini',    type:'nakshatra', title:'Rohini',           titleKn:'ರೋಹಿಣಿ',    excerpt:'Fourth Nakshatra, ruled by Moon. Symbol: Chariot.',          href:'/nakshatra#rohini',    score:1 },
  { id:'n-pushya',    type:'nakshatra', title:'Pushya',           titleKn:'ಪುಷ್ಯ',     excerpt:'Most auspicious Nakshatra, ruled by Saturn.',               href:'/nakshatra#pushya',    score:1 },
  { id:'r-mesha',     type:'rashi',     title:'Mesha (Aries)',    titleKn:'ಮೇಷ',       excerpt:'First sign. Fire element. Ruled by Mars.',                   href:'/rashi#mesha',         score:1 },
  { id:'r-vrischika', type:'rashi',     title:'Vrischika (Scorpio)',titleKn:'ವೃಶ್ಚಿಕ', excerpt:'Eighth sign. Water element. Ruled by Mars and Ketu.',         href:'/rashi#vrischika',     score:1 },
  { id:'g-guru',      type:'graha',     title:'Guru (Jupiter)',   titleKn:'ಗುರು',      excerpt:'Planet of wisdom and expansion. Exalted in Cancer.',          href:'/graha#guru',          score:1 },
  { id:'g-shani',     type:'graha',     title:'Shani (Saturn)',   titleKn:'ಶನಿ',       excerpt:'Planet of discipline and karma. Exalted in Libra.',           href:'/graha#shani',         score:1 },
  { id:'y-siddhi',    type:'yoga',      title:'Siddhi Yoga',      titleKn:'ಸಿದ್ಧಿ',   excerpt:'Highly auspicious yoga for accomplishments.',                 href:'/yoga#siddhi',         score:1 },
  { id:'t-ekadashi',  type:'tithi',     title:'Ekadashi',         titleKn:'ಏಕಾದಶಿ',   excerpt:'11th lunar day. Sacred to Vishnu. Fasting is recommended.',   href:'/tithi#ekadashi',      score:1 },
  { id:'f-ugadi',     type:'festival',  title:'Ugadi',            titleKn:'ಯುಗಾದಿ',   excerpt:'Kannada and Telugu New Year. Celebrated in March/April.',      href:'/festivals#ugadi',     score:1 },
  { id:'f-diwali',    type:'festival',  title:'Diwali',           titleKn:'ದೀಪಾವಳಿ',  excerpt:'Festival of Lights. Celebrated on Amavasya of Kartik month.', href:'/festivals#diwali',    score:1 },
  { id:'k-panchanga', type:'knowledge', title:'What is Panchanga?',titleKn:'ಪಂಚಾಂಗ ಎಂದರೇನು?', excerpt:'Five limbs of the Vedic calendar system.',         href:'/knowledge#panchanga', score:1 },
];

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<SearchResult[]>>> {
  const query = req.nextUrl.searchParams.get('q')?.toLowerCase().trim() ?? '';
  if (!query || query.length < 2) {
    return NextResponse.json({ success: true, data: [] });
  }

  const results = SEARCH_INDEX
    .filter(item =>
      item.title.toLowerCase().includes(query) ||
      (item.titleKn ?? '').includes(query) ||
      item.excerpt.toLowerCase().includes(query)
    )
    .map(item => ({
      ...item,
      score: item.title.toLowerCase().startsWith(query) ? 2 : 1,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return NextResponse.json({ success: true, data: results });
}
