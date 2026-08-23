 
 
export const formattedPrice = (price: string | number): string => {

return new Intl.NumberFormat("en-US").format(
    Number(price),
  );
 } 