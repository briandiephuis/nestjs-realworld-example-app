/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Convert an array to a dictionary
 * @param arr The array that needs to be converted to a dictionary
 * @param key The key of the resulting dictionary
 */
export const dict = <T>(arr: T[], key: keyof T): Record<string, T[]> => {
  const dictionary: Record<string, T[]> = {};
  arr.forEach((item) => {
    if ((item[key] as any) in dictionary) {
      dictionary[item[key] as any].push(item);
    } else {
      dictionary[item[key] as any] = [item];
    }
  });
  return dictionary;
};
