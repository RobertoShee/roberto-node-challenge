import 'reflect-metadata';

export type PickType<T, K extends keyof T> = Pick<T, K>;

export type OmitType<T, K extends keyof T> = Omit<T, K>;

export type PartialType<T> = Partial<T>;

export type RequiredType<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type IntersectionType<A, B> = A & B;

export function PickTypeClass<T, K extends keyof T>(
  BaseClass: new (...args: any[]) => T,
  keys: K[]
): new () => Pick<T, K> {
  class PickedClass {}
  
  const metadata = Reflect.getMetadata('design:type', BaseClass);
  if (metadata) {
    Reflect.defineMetadata('design:type', metadata, PickedClass);
  }
  
  keys.forEach(key => {
    const propertyMetadata = Reflect.getMetadata('design:type', BaseClass.prototype, key as string);
    if (propertyMetadata) {
      Reflect.defineMetadata('design:type', propertyMetadata, PickedClass.prototype, key as string);
    }
  });
  
  return PickedClass as any;
}

export function OmitTypeClass<T, K extends keyof T>(
  BaseClass: new (...args: any[]) => T,
  keys: K[]
): new () => Omit<T, K> {
  class OmittedClass {}
  
  const metadata = Reflect.getMetadata('design:type', BaseClass);
  if (metadata) {
    Reflect.defineMetadata('design:type', metadata, OmittedClass);
  }
  
  const prototype = BaseClass.prototype;
  const propertyNames = Object.getOwnPropertyNames(prototype);
  
  propertyNames.forEach(propertyName => {
    if (!keys.includes(propertyName as K)) {
      const propertyMetadata = Reflect.getMetadata('design:type', prototype, propertyName);
      if (propertyMetadata) {
        Reflect.defineMetadata('design:type', propertyMetadata, OmittedClass.prototype, propertyName);
      }
    }
  });
  
  return OmittedClass as any;
}
