import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

/**
 * Valida que o usuário autenticado tem vínculo de Employee
 * com a empresa indicada no parâmetro :companyId da rota.
 * Deve ser usado após o JwtAuthGuard (que já popula req.user).
 */
@Injectable()
export class CompanyAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req       = context.switchToHttp().getRequest<Request & { user: JwtPayload }>();
    const companyId = req.params['companyId'] as string;

    if (!companyId) return true;

    const employee = await this.prisma.employee.findFirst({
      where:  { userId: req.user.sub, companyId },
      select: { id: true },
    });

    if (!employee) throw new ForbiddenException('Sem acesso a esta empresa.');

    return true;
  }
}
