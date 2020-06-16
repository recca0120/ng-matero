export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  email_verified_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class Guest implements User {
  id = -1;
  name = 'Guest';
  email = '';
  avatar = 'assets/images/avatar.jpg';
}

export class GenericUser implements User {
  id: number;
  name: string;
  email: string;
  avatar = 'assets/images/avatar.jpg';

  constructor(attributes: any) {
    Object.assign(this, attributes, {
      email_verified_at: Date.parse(attributes.created_at),
      created_at: Date.parse(attributes.created_at),
      updated_at: Date.parse(attributes.updated_at),
    });
  }
}
