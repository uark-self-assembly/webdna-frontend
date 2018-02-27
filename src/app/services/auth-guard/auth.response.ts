import { User } from '../user/user';

export class response {
  user: User;
  token: any;
}

export class AuthenticationResponse {
  success: boolean;
  response?: response;
  message: string;
}
