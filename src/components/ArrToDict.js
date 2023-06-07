export const arrToDict = (arr) => {

    const dict = arr.map((value, index) => ({
        id: index,
        label: value,
      }));
    
    console.log("Resulting dictionary", dict)
    console.log(dict[3].label);

    return dict;

} 

export const dictToArr = (dict) => {
    const arr = dict.map((value) => value.label);
    console.log(arr);
    return arr;
}