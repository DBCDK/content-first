export const MINUTE = 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const MONTH = DAY * 30;
export const YEAR = DAY * 365;

export default function TimeToString(past) {
  const delta = Math.abs(Date.now() / 1000 - past);
  const years = Math.floor(delta / YEAR);
  const months = Math.floor(delta / MONTH);
  const days = Math.floor(delta / DAY);
  const hours = Math.floor(delta / HOUR);
  const minutes = Math.floor(delta / MINUTE);
  if (years) {
    return `${years} år`;
  }
  if (months) {
    return months === 1 ? '1 måned' : `${months} måneder`;
  }
  if (days) {
    return days === 1 ? '1 dag' : `${days} dage`;
  }
  if (hours) {
    return hours === 1 ? '1 time' : `${hours} timer`;
  }
  if (minutes) {
    return minutes === 1 ? '1 minut' : `${minutes} minutter`;
  }
  return 'Lige nu';
}
