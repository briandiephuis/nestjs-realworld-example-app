export class SignInPayload {
  constructor(token: string) {
    this.jwt = token;
  }

  jwt: string;
}
