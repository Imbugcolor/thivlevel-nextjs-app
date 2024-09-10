export const count_element_in_array = (array: any[], x: any) => {
    let count = 0;
    for(let i=0;i<array.length;i++){
      if(array[i]==x) 
        count ++;
    } 
    return count;   
}