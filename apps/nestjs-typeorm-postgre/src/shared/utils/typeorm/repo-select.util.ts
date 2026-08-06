import { FindOptionsSelect, ObjectLiteral, Repository } from 'typeorm';

export const repoSelect = <T extends ObjectLiteral>(
  repo: Repository<T>,
  keys: (keyof T)[] | '*',
  strategy: 'pick' | 'omit' = 'pick',
): FindOptionsSelect<T> => {
  const allColumns = repo.metadata.columns.map(
    (c) => c.propertyName,
  ) as (keyof T)[];
  const targetKeys =
    keys == '*'
      ? allColumns
      : strategy === 'pick'
        ? keys
        : allColumns.filter((k) => !keys.includes(k));

  return targetKeys.reduce((select, key) => {
    select[key] = true as any;
    return select;
  }, {} as FindOptionsSelect<T>);
};
