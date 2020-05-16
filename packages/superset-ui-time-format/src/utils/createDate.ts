export default function createDate({
  year,
  month = 0,
  date = 1,
  useLocalTime = false,
}: {
  year: number;
  month?: number;
  date?: number;
  useLocalTime?: boolean;
}): Date {
  return useLocalTime ? new Date(year, month, date) : new Date(Date.UTC(year, month, date));
}
