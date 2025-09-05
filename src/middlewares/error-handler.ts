import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError, InternalServerError, isOperationalError } from '../common/errors';
import { logger } from '../common/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestContext = {
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    ...(req.body && Object.keys(req.body).length > 0 && { body: req.body }),
    ...(req.params && Object.keys(req.params).length > 0 && { params: req.params }),
    ...(req.query && Object.keys(req.query).length > 0 && { query: req.query })
  };

  if (err instanceof AppError) {
    logger.warn(`Operational error: ${err.message}`, {
      ...requestContext,
      errorType: err.constructor.name,
      context: err.context
    });

    res.status(err.statusCode).json(err.toJSON());
    return;
  }

  logger.error(`Unexpected error: ${err.message}`, err, requestContext);

  const internalError = new InternalServerError(
    process.env.NODE_ENV === 'production' 
      ? 'Ha ocurrido un error interno del servidor'
      : err.message
  );

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalError.toJSON());
}

export function notFoundHandler(req: Request, res: Response): void {
  const context = {
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  };

  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`, context);

  res.status(StatusCodes.NOT_FOUND).json({
    type: 'https://httpstatuses.com/404',
    title: 'Ruta no encontrada',
    status: StatusCodes.NOT_FOUND,
    detail: `La ruta ${req.method} ${req.originalUrl} no existe`,
    timestamp: new Date().toISOString()
  });
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    logger.httpRequest(
      req.method,
      req.originalUrl,
      res.statusCode,
      responseTime,
      req.get('User-Agent')
    );
  });

  next();
}
