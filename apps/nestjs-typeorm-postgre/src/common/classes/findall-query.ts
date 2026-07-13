import {
  And,
  Between,
  Equal,
  FindOperator,
  ILike,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { FindAllQueryDto } from '../../shared/dto/findall-query.dto';
import { isBooleanString, isDateString, isNumberString } from 'class-validator';

export type FindAllOptions = {
  skip: number;
  take: number;
  where: Record<string, any>;
  order: Record<string, any>;
};

export class FindAllQuery {
  where: FindAllOptions['where'] = {};
  order: FindAllOptions['order'] = {};
  skip: number;
  take: number;

  constructor(
    private dto: FindAllQueryDto,
    private allowedInputs: string[] = [],
  ) {
    this.take = this.dto.limit;
    this.skip = (this.dto.page - 1) * (this.take || 0);
  }

  public toOptions(): FindAllOptions {
    return {
      skip: this.skip,
      take: this.take,
      where: this.buildWhere(),
      order: this.buildOrder(),
    };
  }

  public allowInputs(...inputs: string[]) {
    this.allowedInputs = [...this.allowedInputs, ...inputs];
  }

  public addWhere(key: string, value: FindOperator<any> | string) {
    this.addQuery(this.where, key, value);
  }

  private buildOrder() {
    if (this.dto.order)
      this.dto.order.split(';').forEach((q) => {
        const [key, value] = q.split(':');
        this.addQuery(this.order, key, value.toUpperCase());
      });

    return this.order;
  }

  private buildWhere() {
    if (this.dto.search)
      this.dto.search.split(';').forEach((q) => {
        const [key, value] = q.split(':');
        this.addQuery(this.where, key, ILike(`%${value}%`));
      });

    if (this.dto.starts)
      this.dto.starts.split(';').forEach((q) => {
        const [key, value] = q.split(':');
        this.addQuery(this.where, key, ILike(`${value}%`));
      });

    if (this.dto.where)
      this.dto.where.split(';').forEach((q) => {
        const [key, value] = q.split(':');
        this.addQuery(this.where, key, Equal(this.castValue(value)));
      });

    if (this.dto.in)
      this.dto.in.split(';').forEach((q) => {
        const [key, value] = q.split(':');
        this.addQuery(
          this.where,
          key,
          In(value.split(',').map((v) => this.castValue(v))),
        );
      });

    if (this.dto.nin)
      this.dto.nin.split(';').forEach((q) => {
        const [key, value] = q.split(':');
        this.addQuery(
          this.where,
          key,
          Not(In(value.split(',').map((v) => this.castValue(v)))),
        );
      });

    if (this.dto.isnull)
      this.dto.isnull.split(';').forEach((key) => {
        this.addQuery(this.where, key, IsNull());
      });

    if (this.dto.gte)
      this.dto.gte.split(';').forEach((q) => {
        const [key, value] = q.split(':');
        this.addQuery(this.where, key, MoreThanOrEqual(this.castValue(value)));
      });

    if (this.dto.lte)
      this.dto.lte.split(';').forEach((q) => {
        const [key, value] = q.split(':');
        this.addQuery(this.where, key, LessThanOrEqual(this.castValue(value)));
      });

    if (this.dto.between)
      this.dto.between.split(';').forEach((q) => {
        const [key, value] = q.split(':');
        const [start, end] = value.split(',');
        this.addQuery(
          this.where,
          key,
          Between(this.castValue(start), this.castValue(end)),
        );
      });

    return this.where;
  }

  private addQuery(
    target: Record<string, any>,
    key: string,
    value: FindOperator<any> | string,
  ) {
    if (!this.allowedInputs.includes(key)) return;
    const path = key.split('.');
    this.setNestedQuery(target, path, value);
  }

  private setNestedQuery(
    target: Record<string, any>,
    path: string[],
    value: FindOperator<any> | string,
  ) {
    const [head, ...rest] = path;

    if (rest.length === 0) {
      if (value instanceof FindOperator)
        target[head] = target[head] ? And(target[head], value) : value;
      else {
        target[head] = value;
      }
      return;
    }

    if (!target[head] || target[head] instanceof FindOperator) {
      target[head] = {};
    }
    this.setNestedQuery(target[head], rest, value);
  }

  private castValue(value: string) {
    if (isNumberString(value)) return Number(value);
    else if (isBooleanString(value)) return value === 'true';
    else if (value == 'null') return null;
    else if (isDateString(value)) return new Date(value);

    return value;
  }
}
