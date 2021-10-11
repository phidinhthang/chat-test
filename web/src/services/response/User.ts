export interface User {
  id: string;
  username: string;
}

export interface UserResponse {
  user: User;
  token: string;
}
