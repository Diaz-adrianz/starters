import { ResourceScope } from './resource-scope.class';

export class Principal {
  permission: { name: string; scope: ResourceScope };

  constructor(
    public readonly user: { id: string; username: string },
    public readonly session: { id: string },
    public readonly roles: { id: string; name: string }[],
  ) {}

  toSubject() {
    return { user: { id: this.user.id } };
  }
}
