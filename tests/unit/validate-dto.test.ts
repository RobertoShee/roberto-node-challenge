import { validateDto } from '../../src/middlewares/validate-dto';
import { Request, Response, NextFunction } from 'express';
import { CreateTaskDto } from '../../src/modules/tasks/dto/task.dto';
import { ValidationError } from '../../src/common/errors';

describe('Validate DTO Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            body: {},
            params: {},
            query: {}
        };
        mockResponse = {};
        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    describe('validateDto', () => {
        it('should pass validation with valid data', async () => {
            mockRequest.body = {
                titulo: 'Valid Task',
                descripcion: 'Valid description'
            };

            const middleware = validateDto(CreateTaskDto, 'body');
            await middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith();
        });

        it('should fail validation with invalid data', async () => {
            mockRequest.body = {
                titulo: '',
                descripcion: 'Valid description'
            };

            const middleware = validateDto(CreateTaskDto, 'body');
            await middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
        });

        it('should validate params', async () => {
            mockRequest.params = {
                id: 'not-a-number'
            };

            const middleware = validateDto(CreateTaskDto, 'params');
            await middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
        });

        it('should validate query', async () => {
            mockRequest.query = {
                titulo: 'Valid Task'
            };

            const middleware = validateDto(CreateTaskDto, 'query');
            await middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith();
        });
    });
});
