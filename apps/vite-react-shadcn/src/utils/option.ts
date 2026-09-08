export interface Option<V = string, M = Record<string, string>> {
  value: V;
  label: string;
  meta?: M;
}

export const getOption = <T extends Option>(
  list: T[],
  value?: string | null
): T | null => {
  return list.find((o) => o.value == (value ?? '')) ?? null;
};
