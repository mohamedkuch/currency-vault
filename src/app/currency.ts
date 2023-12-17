import { Flag } from './flag';

export class Currency {
  id: number;
  code: string;
  name: string;
  short_code: string;
  flags: Flag[];

  constructor(
    id: number,
    code: string,
    name: string,
    short_code: string,
    flags: Flag[]
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.short_code = short_code;
    this.flags = flags;
  }
}
