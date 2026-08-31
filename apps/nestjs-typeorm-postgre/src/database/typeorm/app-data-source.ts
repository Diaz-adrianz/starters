import { DataSource, EntityTarget, ObjectLiteral, QueryRunner } from 'typeorm';
import { AppEntityManager } from './app-entity-manager';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel.js';
import { AppRepository } from './app-repository';

export class AppDataSource extends DataSource {
  declare manager: AppEntityManager;

  override createEntityManager(queryRunner?: QueryRunner): AppEntityManager {
    return new AppEntityManager(this, queryRunner);
  }

  override getRepository<Entity extends ObjectLiteral>(
    target: EntityTarget<Entity>,
  ): AppRepository<Entity> {
    return this.manager.getRepository(target);
  }

  override async transaction<T>(
    runInTransaction: (entityManager: AppEntityManager) => Promise<T>,
  ): Promise<T>;
  override async transaction<T>(
    isolationLevel: IsolationLevel,
    runInTransaction: (entityManager: AppEntityManager) => Promise<T>,
  ): Promise<T>;
  override async transaction<T>(
    isolationOrRunInTransaction:
      IsolationLevel | ((entityManager: AppEntityManager) => Promise<T>),
    runInTransactionParam?: (entityManager: AppEntityManager) => Promise<T>,
  ): Promise<any> {
    return this.manager.transaction(
      isolationOrRunInTransaction as any,
      runInTransactionParam as any,
    );
  }
}
