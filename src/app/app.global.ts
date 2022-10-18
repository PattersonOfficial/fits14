export var Global = {
  roles: {
    client: 1,
    administrator: 2,
    manager: 3,
    mentor: 4
  },
  mains: {
    '1': '/board/u/home',
    '2': '/board/a',
    '3': '/board/t/dash',
    '4': '/board/u/home'
  }
};

export class GlobalRoles {
  public client: number | undefined;
  public administrator: number | undefined;
  public manager: number | undefined;
  public mentor: number | undefined;
}
