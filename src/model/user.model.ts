export class UserRequest {
  username: string;
  password: string;
  name: string;
}

export class UserResponse {
  username: string;
  name: string;
  token?: string;
}

export class LoginRequest {
  username: string;
  password: string;
}

export class UpdateUserRequest {
  name?: string;
  password?: string;
}
