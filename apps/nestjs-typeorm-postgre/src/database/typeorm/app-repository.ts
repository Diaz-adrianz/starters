import {
  Repository,
  ObjectLiteral,
  UpdateOptions,
  FindOptionsSelect,
  DeleteResult,
  UpdateResult,
} from 'typeorm';
import { AppEntityManager } from './app-entity-manager';

export class AppRepository<
  Entity extends ObjectLiteral,
> extends Repository<Entity> {
  declare manager: AppEntityManager;

  select(keys: (keyof Entity)[] | '*', strategy: 'pick' | 'omit' = 'pick') {
    const allColumns = this.metadata.columns.map(
      (c) => c.propertyName,
    ) as (keyof Entity)[];
    const targetKeys =
      keys == '*'
        ? allColumns
        : strategy === 'pick'
          ? keys
          : allColumns.filter((k) => !keys.includes(k));

    return targetKeys.reduce((select, key) => {
      select[key] = true as any;
      return select;
    }, {} as FindOptionsSelect<Entity>);
  }

  override softDelete(
    criteria: Parameters<Repository<Entity>['softDelete']>[0],
    options?: UpdateOptions,
  ): Promise<UpdateResult> {
    return this.manager.softDelete(this.metadata.target, criteria, options);
  }

  override restore(
    criteria: Parameters<Repository<Entity>['restore']>[0],
    options?: UpdateOptions,
  ): Promise<UpdateResult> {
    return this.manager.restore(this.metadata.target, criteria, options);
  }

  override delete(
    criteria: Parameters<Repository<Entity>['delete']>[0],
    options?: UpdateOptions,
  ): Promise<DeleteResult> {
    return this.manager.delete(this.metadata.target, criteria, options);
  }
}
