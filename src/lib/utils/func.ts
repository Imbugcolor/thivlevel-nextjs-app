import slugify from "slugify";

export const count_element_in_array = (array: any[], x: any) => {
    let count = 0;
    for(let i=0;i<array.length;i++){
      if(array[i]==x) 
        count ++;
    } 
    return count;   
}

export const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export function findDuplicate<T>(elements: T[]): T | null {
    const seen = new Set<T>();

    for (let element of elements) {
        if (seen.has(element)) {
            return element; // Return element if a duplicate is found
        }
        seen.add(element);
    }

    return null; // Return null if all elements are unique
}


export function convertStringToSEO(title: string): string {
    return slugify(title, { lower: true, locale: "vi" });
}

export function getIdFromSlug(slug: string): string {
    const regexMatchArray = slug.match(/-(\w+)\.html$/)
    return regexMatchArray ? regexMatchArray[1] : "";
}
