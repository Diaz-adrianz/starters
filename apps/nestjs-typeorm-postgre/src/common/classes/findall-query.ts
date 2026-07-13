import { FindAllQueryDto } from '../../shared/dto/findall-query.dto';

export class FindAllQuery {
  skip: number | undefined;
  take: number | undefined;

  get query() {
    return { skip: this.skip, take: this.take };
  }

  constructor(dto: FindAllQueryDto) {
    this.take = dto.limit;
    this.skip = (dto.page - 1) * (this.take || 0);
  }
}
