import { Request, Response, NextFunction } from 'express';
import { validate as classValidate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { createValidationError } from '../common/errors';

type ClassType<T = {}> = new (...args: any[]) => T;
type ValidationTarget = 'body' | 'params' | 'query';

/**
 * Middleware para validar DTOs usando class-validator
 */
export function validateDto<T extends object>(
  DtoClass: ClassType<T>,
  target: ValidationTarget = 'body'
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = (req as any)[target];
      
      // Transformar plain object a clase
      const dto = plainToClass(DtoClass, data);
      
      // Validar usando class-validator
      const errors: ValidationError[] = await classValidate(dto, {
        whitelist: true, // Eliminar propiedades no definidas en el DTO
        forbidNonWhitelisted: true, // Rechazar propiedades adicionales
      });
      
      if (errors.length > 0) {
        // Crear error de validación usando la clase custom
        const validationError = createValidationError(errors);
        return next(validationError);
      }
      
      // Asignar el DTO validado y transformado al request
      (req as any)[target] = dto;
      next();
    } catch (err) {
      next(err);
    }
  };
}
