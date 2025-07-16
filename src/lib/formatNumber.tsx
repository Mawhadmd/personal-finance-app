export function formatNumber(num1: number, long?: boolean): string{
  let res = null;
  const num = Math.abs(num1); 
  if( long ){
    return `${Intl.NumberFormat().format(num).toString()}`;
  }
  if(num> 1000){
    res = `${Intl.NumberFormat().format(num/1000).toString()}k`;
  }
   if (num < 1000 && num > 0){
    res = `${Intl.NumberFormat().format(parseFloat(num.toFixed(2)) ).toString()}`;
  }
  if (num > 1000000){
    res= `${Intl.NumberFormat().format(parseFloat((num/1000000).toFixed(2))).toString()}M`;
  }
  if (num1 < 0){
    res = `-` + res;
  }
  return res || `${num}`;
}

