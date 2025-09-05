import { PickType, OmitType, PickTypeClass, OmitTypeClass } from '../../src/common/types/mapped-types';

// Test class for utility types
class TestClass {
  id!: number;
  name!: string;
  description!: string;
  status!: string;
}

describe('Mapped Types Utilities', () => {
  describe('PickType', () => {
    it('should create type with picked properties', () => {
      type PickedType = PickType<TestClass, 'id' | 'name'>;
      
      const picked: PickedType = {
        id: 1,
        name: 'test'
      };
      
      expect(picked.id).toBe(1);
      expect(picked.name).toBe('test');
    });
  });

  describe('OmitType', () => {
    it('should create type with omitted properties', () => {
      type OmittedType = OmitType<TestClass, 'description'>;
      
      const omitted: OmittedType = {
        id: 1,
        name: 'test',
        status: 'active'
      };
      
      expect(omitted.id).toBe(1);
      expect(omitted.name).toBe('test');
      expect(omitted.status).toBe('active');
    });
  });

  describe('PickTypeClass', () => {
    it('should create class constructor with picked properties', () => {
      const PickedClass = PickTypeClass(TestClass, ['id', 'name']);
      const instance = new PickedClass();
      
      expect(instance).toBeInstanceOf(PickedClass);
    });
  });

  describe('OmitTypeClass', () => {
    it('should create class constructor with omitted properties', () => {
      const OmittedClass = OmitTypeClass(TestClass, ['description']);
      const instance = new OmittedClass();
      
      expect(instance).toBeInstanceOf(OmittedClass);
    });
  });
});
