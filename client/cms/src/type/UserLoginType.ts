import { DetailUserProps } from "./UserType";

export interface UserLoginType {
  accessToken: string;
  refreshToken: number;
  adminId: string;
  user: DetailUserProps
}

export interface DataLoginType {
  email: string;
  password: string;
}
