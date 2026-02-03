import { lunar } from "khmercal";
import { KH_MONTH, KH_STEM, KH_ZODIAC, khDayInWeek, khDigit } from "./Constant";

function replaceAll(text, dic) {
  return text
    .toString()
    .split("")
    .map((char) => (dic.hasOwnProperty(char) ? dic[char] : char))
    .join("");
}

function getKhmerDay(period) {
  const day = replaceAll(period[0], khDigit);
  const month = period[1] === "K" ? "កើត" : "រោច";
  return day + month;
}

export function getKhmerZodiac(code) {
  return KH_ZODIAC.find((z) => z.code === code)?.kh;
}

export function getKhmerMonth(index) {
  return KH_MONTH[index];
}

export function getKhmerStem(index) {
  return KH_STEM[index];
}

function getLunarDate(date) {
  const lunarDate = lunar(date);
  const day =
    khDayInWeek[date.toLocaleDateString("en-US", { weekday: "long" })];
  const khDay = getKhmerDay(lunarDate.period);
  const khMonth = getKhmerMonth(lunarDate.month.index);
  const khZodiac = getKhmerZodiac(lunarDate.zodiac);
  const khStem = getKhmerStem(lunarDate.sequence);
  const sak = replaceAll(lunarDate.years.BE, khDigit);

  return `ថ្ងៃ${day} ${khDay} ខែ${khMonth} ឆ្នាំ${khZodiac} ${khStem} ព.ស.${sak}`;
}

export { getLunarDate };
