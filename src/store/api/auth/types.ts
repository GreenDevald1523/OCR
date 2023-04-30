interface UserCredentials {
  username: string;
  password: string;
}

export interface UserRegistrationRequest extends UserCredentials {
  displayname: string;
  email: string;
}

export interface UserLoginRequest extends UserCredentials {
  remember_me: boolean;
}

// On login/registration/refresh
export interface RefreshInfo {
  refresh_token: string;
}

export interface UserSession {
  id: number;
  agent: string;
  longsession: boolean;
  invalidafter: number;
}
