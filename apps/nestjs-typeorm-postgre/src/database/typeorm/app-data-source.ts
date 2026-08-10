import { DataSource, QueryRunner } from 'typeorm';
import { AppEntityManager } from './app-entity-manager';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel.js';

export class AppDataSource extends DataSource {
  declare manager: AppEntityManager;

  createEntityManager(queryRunner?: QueryRunner): AppEntityManager {
    return new AppEntityManager(this, queryRunner);
  }

  async transaction<T>(
    runInTransaction: (entityManager: AppEntityManager) => Promise<T>,
  ): Promise<T>;
  async transaction<T>(
    isolationLevel: IsolationLevel,
    runInTransaction: (entityManager: AppEntityManager) => Promise<T>,
  ): Promise<T>;
  async transaction<T>(
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
