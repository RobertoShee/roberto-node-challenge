import 'reflect-metadata';

/**
 * Utility type that picks specific properties from a class
 */
export type PickType<T, K extends keyof T> = Pick<T, K>;

/**
 * Utility type that omits specific properties from a class
 */
export type OmitType<T, K extends keyof T> = Omit<T, K>;

/**
 * Utility type that makes all properties partial
 */
export type PartialType<T> = Partial<T>;

/**
 * Utility type that makes specific properties required
 */
export type RequiredType<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Utility type that intersects two types
 */
export type IntersectionType<A, B> = A & B;

/**
 * Creates a new class that picks only the specified properties from the base class
 * This preserves decorators and metadata from the original class
 */
export function PickTypeClass<T, K extends keyof T>(
  BaseClass: new (...args: any[]) => T,
  keys: K[]
): new () => Pick<T, K> {
  class PickedClass {}
  
  // Copy metadata from the base class
  const metadata = Reflect.getMetadata('design:type', BaseClass);
  if (metadata) {
    Reflect.defineMetadata('design:type', metadata, PickedClass);
  }
  
  // Copy property decorators for picked keys
  keys.forEach(key => {
    const propertyMetadata = Reflect.getMetadata('design:type', BaseClass.prototype, key as string);
    if (propertyMetadata) {
      Reflect.defineMetadata('design:type', propertyMetadata, PickedClass.prototype, key as string);
    }
  });
  
  return PickedClass as any;
}

/**
 * Creates a new class that omits the specified properties from the base class
 * This preserves decorators and metadata from the original class
 */
export function OmitTypeClass<T, K extends keyof T>(
  BaseClass: new (...args: any[]) => T,
  keys: K[]
): new () => Omit<T, K> {
  class OmittedClass {}
  
  // Copy metadata from the base class
  const metadata = Reflect.getMetadata('design:type', BaseClass);
  if (metadata) {
    Reflect.defineMetadata('design:type', metadata, OmittedClass);
  }
  
  // Copy property decorators for all keys except omitted ones
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
