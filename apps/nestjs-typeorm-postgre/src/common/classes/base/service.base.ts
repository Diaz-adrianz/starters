import { FindOptionsSelect, ObjectLiteral, Repository } from 'typeorm';

export class ServiceBase<T extends ObjectLiteral> {
  protected selection: FindOptionsSelect<T> = {};

  constructor(protected repo: Repository<T>) {
    const columns = repo.metadata.columns.map(
      (c) => c.propertyName,
    ) as (keyof T)[];

    this.selection = columns.reduce((select, key) => {
      select[key] = true as any;
      return select;
    }, {} as FindOptionsSelect<T>);
  }

  protected select(
    keys: (keyof T)[] | '*',
    strategy: 'pick' | 'omit' = 'pick',
  ): FindOptionsSelect<T> {
    if (keys === '*') return this.selection;

    if (strategy === 'pick')
      return keys.reduce((select, key) => {
        select[key] = true as FindOptionsSelect<T>[keyof T];
        return select;
      }, {} as FindOptionsSelect<T>);
    else {
      const select = { ...this.selection };
      for (const key of keys) delete select[key];
      return select;
    }
  }
}
