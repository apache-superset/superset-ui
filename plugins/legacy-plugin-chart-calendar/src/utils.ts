export function convertUTC(dttm: Date): Date {
  return new Date(
    dttm.getUTCFullYear(),
    dttm.getUTCMonth(),
    dttm.getUTCDate(),
    dttm.getUTCHours(),
    dttm.getUTCMinutes(),
    dttm.getUTCSeconds(),
  );
}

export function convertUTCTS(uts: number): number {
  return convertUTC(new Date(uts)).getTime();
}

export function getUTC(d: Date): Date {
  return new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()),
  );
}
