export class Principal {
  constructor(
    public readonly user: { id: string; username: string },
    public readonly session: { id: string },
    public readonly roles: { id: string }[],
  ) {}
}
