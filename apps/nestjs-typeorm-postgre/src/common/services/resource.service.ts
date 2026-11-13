import {
  FindOneOptions,
  FindOptionsSelect,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export class ResourceService<Entity extends ObjectLiteral> {
  constructor(private repo: Repository<Entity>) {}

  protected async load(
    options: FindOneOptions<Entity>,
    withDeleted: boolean = false,
  ) {
    return this.repo.findOneOrFail({ ...options, withDeleted });
  }

  protected select(
    keys: (keyof Entity)[] | '*',
    strategy: 'pick' | 'omit' = 'pick',
  ) {
    const allColumns = this.repo.metadata.columns.map(
      (c) => c.propertyName,
    ) as (keyof Entity)[];
    const targetKeys =
      keys == '*'
        ? allColumns
        : strategy === 'pick'
          ? keys
          : allColumns.filter((k) => !keys.includes(k));

    return targetKeys.reduce((select, key) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      select[key] = true as any;
      return select;
    }, {} as FindOptionsSelect<Entity>);
  }
}
