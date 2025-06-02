export interface User {
  role(): string;
  username(): string;
  hashedPassword(): string;
  jwtOf(aPassword: string): string;
  active(): boolean;
  ifActiveDo<T>(action: () => Promise<T>): Promise<T>
}
