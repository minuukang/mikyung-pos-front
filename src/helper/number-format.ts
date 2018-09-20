import numeral from 'numeral';

export function numberFormat(value: string | number) {
  return numeral(value).format('0,0');
}
