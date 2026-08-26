import { gregorianToJD, getUTCOffsetHours } from '../ephemeris/julian-day'
import type { BirthData, ValidatedBirthData, KundaliResult, KundaliError, AyanamshaKey } from '../../types/kundali'

const MIN_YEAR=1900,MAX_YEAR=2100
const VALID_AY:AyanamshaKey[]=['LAHIRI','KP','RAMAN','TRUE_CHITRA']
const TZ_RE=/^[A-Za-z]+(?:\/[A-Za-z0-9_+\-]+){1,3}$|^UTC$/

function parseDate(s:string):{year:number;month:number;day:number}|null {
  const m=/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.exec(s.trim())
  return m?{year:+m[1],month:+m[2],day:+m[3]}:null
}
function parseTime(s:string):number|null {
  const m=/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(s.trim())
  return m?+m[1]+(+m[2])/60+(m[3]?+m[3]:0)/3600:null
}
function isRealDate(y:number,mo:number,d:number):boolean {
  const dt=new Date(y,mo-1,d)
  return dt.getFullYear()===y&&dt.getMonth()===mo-1&&dt.getDate()===d
}
function err(code:KundaliError['code'],message:string,field?:keyof BirthData):KundaliResult<ValidatedBirthData> {
  return {success:false,error:{code,message,field}}
}

export function validateBirthData(raw:BirthData):KundaliResult<ValidatedBirthData> {
  const name=(raw.name??'').trim()
  if(!name) return err('INVALID_NAME','Name is required.','name')
  if(name.length>120) return err('INVALID_NAME','Name must not exceed 120 characters.','name')

  if(!raw.dateOfBirth) return err('INVALID_DATE','Date of birth is required.','dateOfBirth')
  const pd=parseDate(raw.dateOfBirth)
  if(!pd) return err('INVALID_DATE','Date of birth must be YYYY-MM-DD.','dateOfBirth')
  const {year,month,day}=pd
  if(year<MIN_YEAR||year>MAX_YEAR) return err('DATE_OUT_OF_RANGE',`Year must be ${MIN_YEAR}–${MAX_YEAR}.`,'dateOfBirth')
  if(!isRealDate(year,month,day)) return err('INVALID_DATE',`${raw.dateOfBirth} is not a valid date.`,'dateOfBirth')

  if(!raw.timeOfBirth) return err('INVALID_TIME','Time of birth is required.','timeOfBirth')
  const timeH=parseTime(raw.timeOfBirth)
  if(timeH===null) return err('INVALID_TIME','Time must be HH:MM or HH:MM:SS.','timeOfBirth')

  const timezone=(raw.timezone??'').trim()
  if(!timezone) return err('INVALID_TIMEZONE','Timezone is required.','timezone')
  if(!TZ_RE.test(timezone)) return err('INVALID_TIMEZONE',`Invalid timezone "${timezone}".`,'timezone')

  let utcOffset:number
  try {
    const testDate=new Date(Date.UTC(year,month-1,day,12,0,0))
    utcOffset=getUTCOffsetHours(testDate,timezone)
  } catch { return err('INVALID_TIMEZONE',`Timezone "${timezone}" is not recognised.`,'timezone') }

  const lat=raw.latitude,lng=raw.longitude
  if(typeof lat!=='number'||isNaN(lat)) return err('INVALID_COORDINATES','Latitude must be a number.','latitude')
  if(lat<-90||lat>90) return err('INVALID_COORDINATES',`Latitude ${lat} out of range.`,'latitude')
  if(typeof lng!=='number'||isNaN(lng)) return err('INVALID_COORDINATES','Longitude must be a number.','longitude')
  if(lng<-180||lng>180) return err('INVALID_COORDINATES',`Longitude ${lng} out of range.`,'longitude')
  const placeName=(raw.placeName??'').trim()
  if(!placeName) return err('INVALID_COORDINATES','Place name is required.','placeName')

  const ayanamsha:AyanamshaKey=raw.ayanamsha??'LAHIRI'
  if(!VALID_AY.includes(ayanamsha)) return err('INVALID_DATE',`Invalid ayanamsha "${ayanamsha}".`,'ayanamsha')

  const utHour=timeH-utcOffset
  let jdY=year,jdM=month,jdD=day,jdH=utHour
  if(jdH<0){jdH+=24;const p=new Date(Date.UTC(year,month-1,day-1));jdY=p.getUTCFullYear();jdM=p.getUTCMonth()+1;jdD=p.getUTCDate()}
  else if(jdH>=24){jdH-=24;const n=new Date(Date.UTC(year,month-1,day+1));jdY=n.getUTCFullYear();jdM=n.getUTCMonth()+1;jdD=n.getUTCDate()}

  return {success:true,data:{name,dateOfBirth:raw.dateOfBirth.trim(),timeOfBirth:raw.timeOfBirth.trim(),timezone,latitude:lat,longitude:lng,placeName,ayanamsha,julianDay:gregorianToJD(jdY,jdM,jdD,jdH),utcOffset}}
}
