/** Resposta do login — nunca expõe passwordHash */
export class AuthResponseDto {
  accessToken: string;

  user: {
    id: string;
    email: string;
  };
}
