/** 将时间转为 YYYY-MM-DD HH:mm:ss 格式，兼容 Safari 对 ISO 日期字符串的解析 */
export function formatDateTime(time: string | number | Date | undefined | null): string {
  if (!time) return "-";

  let date = new Date(time);

  // Safari 不支持 "2026-01-01" 格式，替换 - 为 / 即可兼容
  if (isNaN(date.getTime()) && typeof time === 'string') {
    date = new Date(time.replace(/-/g, '/'));
  }

  if (isNaN(date.getTime())) return String(time);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const YYYY = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const DD = pad(date.getDate());
  const HH = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`;
}
