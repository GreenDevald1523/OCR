export interface User {
  id?: number;
  username?: string;
  superuser?: boolean;
  allowed: boolean;
  displayname: string;
  email: string;
  additionalinfo: string;
}

export interface ClientUser extends User {
  createdate: string;
  passwordmodifydate: string;
}
