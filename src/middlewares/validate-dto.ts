import { Request, Response, NextFunction } from 'express';
import { validate as classValidate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { createValidationError } from '../common/errors';

type ClassType<T = {}> = new (...args: any[]) => T;
type ValidationTarget = 'body' | 'params' | 'query';

export function validateDto<T extends object>(
  DtoClass: ClassType<T>,
  target: ValidationTarget = 'body'
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = (req as any)[target];
      
      const dto = plainToClass(DtoClass, data);
      
      const errors: ValidationError[] = await classValidate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      
      if (errors.length > 0) {
        const validationError = createValidationError(errors);
        return next(validationError);
      }
      
      (req as any)[target] = dto;
      next();
    } catch (err) {
      next(err);
    }
  };
}
