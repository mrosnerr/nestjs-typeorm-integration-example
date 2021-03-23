import { Test, TestingModule } from '@nestjs/testing';
import { TestUtilsModule } from '../../test-utils/test-utils.module';
import { TestUtilsService } from '../../test-utils/test-utils.service';
import { AuthenticationModule } from '../authentication.module';
import { UserService } from './user.service';

describe('UserService', () => {
  let module: TestingModule;
  let testUtilsService: TestUtilsService;
  let userService: UserService;

  beforeEach(async () => {
    // Create a fresh test module instance for running our test against
    module = await Test.createTestingModule({
      imports: [TestUtilsModule, AuthenticationModule],
    }).compile();

    // Bring in our TestUtilsService
    testUtilsService = module.get<TestUtilsService>(TestUtilsService);

    // Use it to clean out our testdb
    await testUtilsService.wipeDb();

    // Create a fresh UserService for us to test against
    userService = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    // Clears out the previously used module
    if (module) await module.close();
  });

  it('should be was able to fill in the userService dependency tree', () => {
    expect(userService).toBeDefined();
  });

  it('should be able to create users directly', async () => {
    const savedUser = await userService.saveUser({
      name: 'Mabel Hook-Hand',
      email: 'mabel@hookhand.com',
    });
    expect(savedUser.id).toBe(1); // Always 1 since it's a fresh table
  });

  // This would be helpful when used in another module that doesn't have our
  // UserService natively in scope
  it('should be able to create users for testing via the testUtilsService', async () => {
    const savedUser = await testUtilsService.createUser();
    expect(savedUser.id).toBe(1); // Always 1 since it's a fresh table
  });
});
