import {
  Repository,
  ObjectLiteral,
  UpdateOptions,
  FindOptionsSelect,
  DeleteResult,
  UpdateResult,
} from 'typeorm';
import { AppEntityManager } from './app-entity-manager';
import { QueryDeepPartialEntity } from 'typeorm/browser';

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

  rawToEntity<Entity>(raw: Record<string, unknown>[]): Partial<Entity>[] {
    return raw.map((row) => {
      const out: Record<string, unknown> = {};
      for (const col of this.metadata.columns) {
        if (col.databaseName in row)
          out[col.propertyName] = row[col.databaseName];
      }
      return out as Partial<Entity>;
    });
  }

  override async update(
    criteria: Parameters<Repository<Entity>['update']>[0],
    partialEntity: QueryDeepPartialEntity<Entity>,
    options?: UpdateOptions,
  ): Promise<UpdateResult> {
    const result = await this.manager.update(
      this.metadata.target,
      criteria,
      partialEntity,
      options,
    );
    if (options?.returning?.length) result.raw = this.rawToEntity(result.raw);
    return result;
  }

  override async softDelete(
    criteria: Parameters<Repository<Entity>['softDelete']>[0],
    options?: UpdateOptions,
  ): Promise<UpdateResult> {
    const result = await this.manager.softDelete(
      this.metadata.target,
      criteria,
      options,
    );
    if (options?.returning?.length) result.raw = this.rawToEntity(result.raw);
    return result;
  }

  override async restore(
    criteria: Parameters<Repository<Entity>['restore']>[0],
    options?: UpdateOptions,
  ): Promise<UpdateResult> {
    const result = await this.manager.restore(
      this.metadata.target,
      criteria,
      options,
    );
    if (options?.returning?.length) result.raw = this.rawToEntity(result.raw);
    return result;
  }

  override async delete(
    criteria: Parameters<Repository<Entity>['delete']>[0],
    options?: UpdateOptions,
  ): Promise<DeleteResult> {
    const result = await this.manager.delete(
      this.metadata.target,
      criteria,
      options,
    );
    if (options?.returning?.length) result.raw = this.rawToEntity(result.raw);
    return result;
  }
}
