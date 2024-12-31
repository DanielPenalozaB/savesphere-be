import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
      };

      const expectedResponse = {
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
        },
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'password123',
      };

      const expectedResponse = {
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
        },
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens', async () => {
      const mockRequest = {
        user: {
          sub: '1',
          refreshToken: 'oldRefreshToken',
        },
      };

      const expectedResponse = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };

      mockAuthService.refreshTokens.mockResolvedValue(expectedResponse);

      const result = await controller.refreshTokens(mockRequest as any);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith('1', 'oldRefreshToken');
    });
  });
});