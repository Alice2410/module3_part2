export interface ValidUser {
  [key: string]: string;
}

export interface UserData {
  email: string,
  password: string,
  salt: string,
}

export interface HashedPassword {
  password: string,
  salt: string
}

export interface jwtToken {
  email: string
}