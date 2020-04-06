import { mergeDeepRight } from "ramda";
import cleanDeep from "clean-deep";

//removes properties with empty values
export const prepareItemForSave = <O extends object>(obj: O) => {
  const res = cleanDeep(obj);
  return deepTrim(res);
};

const deepTrim = (obj:any) => {
  Object.keys(obj).forEach(function (key) {
    const v = obj[key];    
    obj[key] = (typeof v === 'string') ? v.trim() : (typeof v === 'object') ? deepTrim(v) : v;
  });
  return obj;
}

//adds "" to undefined properties using template object
export const prepareItemForForm = <O extends object>(templateObject: O, obj: any): O => {
  return mergeDeepRight(templateObject, obj);
}

export const flattenObject = <O extends object>(obj: O | Partial<O>, prefix?: keyof O | string) => {
  const toReturn: { [key: string]: any } = {};
  prefix = prefix ? prefix + '.' : '';

  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue;

    if (typeof obj[i] === 'object' && obj[i] !== null) {
      Object.assign(toReturn, flattenObject(obj[i] as Partial<O>, prefix + i));
    } else {
      toReturn[prefix + i] = obj[i];
    }
  }
  return toReturn;
}

export const unflattenObject = <O extends object>(obj: O) => {
  let result = {}
  for (let i in obj) {
    const keys = i.split('.')
    keys.reduce(function (r: { [key: string]: any }, e, j) {
      return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 === j ? obj[i] : {}) : [])
    }, result)
  }
  return result;
}