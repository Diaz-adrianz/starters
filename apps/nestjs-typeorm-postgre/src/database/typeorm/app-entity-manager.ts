import {
  DeleteResult,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  TypeORMError,
  UpdateOptions,
  UpdateResult,
} from 'typeorm';
import { OrmUtils } from 'typeorm/util/OrmUtils.js';
import { AppRepository } from './app-repository';
import { AppDeleteOptions } from './app-delete-options';

export class AppEntityManager extends EntityManager {
  protected repositories = new Map<EntityTarget<any>, AppRepository<any>>();

  override softDelete(
    targetOrEntity: Parameters<EntityManager['softDelete']>[0],
    criteria: Parameters<EntityManager['softDelete']>[1],
    options?: UpdateOptions,
  ): Promise<UpdateResult> {
    const { criteria: whereCriteria, isPrimitive } =
      this.normalizeAndValidateWhereCriteria(criteria, 'softDelete');
    const qb = this.createQueryBuilder().softDelete().from(targetOrEntity);
    if (isPrimitive) qb.whereInIds(whereCriteria);
    else qb.where(whereCriteria);
    if (options?.returning !== undefined) qb.returning(options.returning);
    return qb.execute();
  }

  override restore(
    targetOrEntity: Parameters<EntityManager['restore']>[0],
    criteria: Parameters<EntityManager['restore']>[1],
    options?: UpdateOptions,
  ): Promise<UpdateResult> {
    const { criteria: whereCriteria, isPrimitive } =
      this.normalizeAndValidateWhereCriteria(criteria, 'restore');
    const qb = this.createQueryBuilder().restore().from(targetOrEntity);
    if (isPrimitive) qb.whereInIds(whereCriteria);
    else qb.where(whereCriteria);
    if (options?.returning !== undefined) qb.returning(options.returning);
    return qb.execute();
  }

  override delete(
    targetOrEntity: Parameters<EntityManager['delete']>[0],
    criteria: Parameters<EntityManager['delete']>[1],
    options?: AppDeleteOptions,
  ): Promise<DeleteResult> {
    const { criteria: whereCriteria, isPrimitive } =
      this.normalizeAndValidateWhereCriteria(criteria, 'delete');
    const qb = this.createQueryBuilder().delete().from(targetOrEntity);
    if (isPrimitive) qb.whereInIds(whereCriteria);
    else qb.where(whereCriteria);
    if (options?.returning !== undefined) qb.returning(options.returning);
    return qb.execute();
  }

  override getRepository<Entity extends ObjectLiteral>(
    target: EntityTarget<Entity>,
  ): AppRepository<Entity> {
    const repoFromMap = this.repositories.get(target);
    if (repoFromMap) return repoFromMap;

    const newRepository = new AppRepository<any>(
      target,
      this,
      this.queryRunner,
    );
    this.repositories.set(target, newRepository);
    return newRepository;
  }

  // ================================================================
  // pasted from typeorm source code
  // ----------------------------------------------------------------
  protected normalizeAndValidateWhereCriteria(
    criteria: any,
    methodName: string,
  ): {
    criteria: any;
    isPrimitive: boolean;
  } {
    const rejectEmpty = () => {
      throw new TypeORMError(
        `Empty criteria(s) are not allowed for the ${methodName} method.`,
      );
    };

    if (OrmUtils.isPrimitiveCriteria(criteria)) {
      if (OrmUtils.isCriteriaNullOrEmpty(criteria)) rejectEmpty();
      return { criteria, isPrimitive: true };
    }

    const normalizedCriteria = OrmUtils.normalizeWhereCriteria(
      criteria,
      this.dataSource.options.invalidWhereValuesBehavior,
    );

    const rendersNoPredicate = (value: unknown): boolean =>
      value === null ||
      typeof value !== 'object' ||
      Object.keys(value).length === 0;

    const isEmpty = Array.isArray(normalizedCriteria)
      ? normalizedCriteria.length === 0 ||
        normalizedCriteria.some(rendersNoPredicate)
      : rendersNoPredicate(normalizedCriteria);
    if (isEmpty) rejectEmpty();

    return { criteria: normalizedCriteria, isPrimitive: false };
  }
}
