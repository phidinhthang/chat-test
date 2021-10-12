export interface User {
  id: string;
  username: string;
  isOnline: boolean;
  lastLoginAt: string;
}

export interface UserResponse {
  user: User;
  token: string;
}
