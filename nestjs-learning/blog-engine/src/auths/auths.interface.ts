/*
Auths interfaces are used to define the interfaces for the auths.
*/

/*
IAuth is the interface for the auth.
*/
export interface IAuth {
  username: string;
  password: string;
}

/*
IAuthResponse is the interface for the auth response.
*/
export interface IAuthResponse {
  token: string;
}
