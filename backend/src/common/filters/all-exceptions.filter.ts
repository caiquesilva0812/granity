import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx    = host.switchToHttp();
    const req    = ctx.getRequest<Request>();
    const res    = ctx.getResponse<Response>();
    const status = this.resolveStatus(exception);

    const clientMessage = this.resolveClientMessage(exception);
    const context       = this.buildContext(req, status, exception);

    if (status >= 500) {
      this.logger.error(context, exception instanceof Error ? exception.stack : undefined);
    } else {
      this.logger.warn(context);
    }

    res.status(status).json({
      statusCode: status,
      message:   clientMessage,
      path:      req.url,
      timestamp: new Date().toISOString(),
    });
  }

  private buildContext(req: Request, status: number, exception: unknown): string {
    const method  = req.method;
    const url     = req.url;
    const ip      = req.ip ?? req.socket?.remoteAddress ?? 'unknown';
    const body    = this.sanitizeBody(req.body);
    const message = exception instanceof Error ? exception.message : String(exception);

    return (
      `${method} ${url} ${status} | ip=${ip} | body=${body} | ${message}`
    );
  }

  /** Remove campos sensíveis antes de logar o body */
  private sanitizeBody(body: Record<string, unknown>): string {
    if (!body || typeof body !== 'object') return '{}';
    const SENSITIVE = ['password', 'passwordHash', 'token', 'secret'];
    const sanitized = Object.fromEntries(
      Object.entries(body).map(([k, v]) =>
        SENSITIVE.includes(k) ? [k, '***'] : [k, v],
      ),
    );
    return JSON.stringify(sanitized);
  }

  private resolveStatus(exception: unknown): number {
    if (exception instanceof HttpException) return exception.getStatus();
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private resolveClientMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') return res;
      if (typeof res === 'object' && res !== null && 'message' in res) {
        const msg = (res as Record<string, unknown>).message;
        return Array.isArray(msg) ? msg.join(', ') : String(msg);
      }
    }
    // Erros 500 não expõem detalhes internos para o cliente
    return 'Erro interno no servidor.';
  }
}
