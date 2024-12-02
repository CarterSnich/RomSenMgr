export function formatName(senior: Senior) {
  const middleInitial = senior.middlename
    ? `${senior.middlename[0].toUpperCase()}.`
    : "";
  return `${senior.lastname}, ${senior.firstname} ${middleInitial} ${
    senior.suffix && senior.suffix
  }`.trim();
}

export function formatStringDate(dateString: string) {
  const [year, month, day] = dateString.substring(0, 10).split("-");
  return `${month}/${day}/${year}`;
}

export function getAgeFromDate(dateString: string) {
  const birthDate = new Date(dateString);

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust age if the birthday has not occurred yet this year
  const isBeforeBirthday =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  if (isBeforeBirthday) {
    age--;
  }

  return age;
}

import { customAlphabet } from "nanoid";
import type { Senior } from "./models";
const CHARSET = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const generateId = customAlphabet(CHARSET, 10);
