export interface Option<V = string, M = Record<string, string>> {
  value: V;
  label: string;
  meta?: M;
}

export const getOptionMap = <K extends string, M extends Option>(
  map: Record<K, M>,
  value?: K | null
): M | null => {
  return value && value in map ? map[value] : null;
};
