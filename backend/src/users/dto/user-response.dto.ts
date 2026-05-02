import { User } from '@prisma/client';

/** Projeção segura de User — passwordHash nunca é exposto */
export class UserResponseDto {
  id: string;
  email: string;
  createdAt: Date;

  constructor(user: User) {
    this.id        = user.id;
    this.email     = user.email;
    this.createdAt = user.createdAt;
  }
}
