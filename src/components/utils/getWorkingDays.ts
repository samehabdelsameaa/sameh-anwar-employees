import { differenceInDays } from 'date-fns';

export const getWorkingDays = (dateFrom: string, dateTo: string) => {
    const monthsChars = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let newDateStr = dateTo;

    if(dateTo.includes('/') || dateFrom.includes('.') || dateFrom.includes(' ')){      
      newDateStr = dateTo.replace(/[/.\s]/g, '-')
    }
  
    monthsChars?.some((v, index) => {
      if(dateTo.includes(v)) {
        newDateStr = dateTo.replace(v, `${index < 9 ? `0${index+1}` : index+1}`) 
      }
      return newDateStr;
    });
    
    let to = newDateStr.split('-');
    let from = dateFrom.split('-');
    
    return differenceInDays(new Date(to.join(' ')), new Date(from.join(' ')));
}