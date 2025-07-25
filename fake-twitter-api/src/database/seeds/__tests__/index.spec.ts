/**
 * This file contains the tests for the seeds index.
 */

import { runSeeds } from '../index';
import { DataSource } from 'typeorm';
import * as roleSeed from '../role.seed';
import * as testSeed from '../test-seed';

describe('runSeeds', () => {
  let dataSource: jest.Mocked<DataSource>;
  let seedRolesSpy: jest.SpyInstance;
  let runTestSeedsSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;
  const OLD_ENV = process.env;

  beforeEach(() => {
    dataSource = {} as unknown as jest.Mocked<DataSource>;
    seedRolesSpy = jest
      .spyOn(roleSeed, 'seedRoles')
      .mockResolvedValue(undefined);
    runTestSeedsSpy = jest
      .spyOn(testSeed, 'runTestSeeds')
      .mockResolvedValue(undefined);
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    seedRolesSpy.mockRestore();
    runTestSeedsSpy.mockRestore();
    logSpy.mockRestore();
    process.env = OLD_ENV;
  });

  it('should call seedRoles always', async () => {
    await runSeeds(dataSource);
    expect(seedRolesSpy).toHaveBeenCalledWith(dataSource);
  });

  it('should call runTestSeeds only if NODE_ENV is test', async () => {
    process.env.NODE_ENV = 'test';
    await runSeeds(dataSource);
    expect(runTestSeedsSpy).toHaveBeenCalledWith(dataSource);
  });

  it('should not call runTestSeeds if NODE_ENV is not test', async () => {
    process.env.NODE_ENV = 'production';
    await runSeeds(dataSource);
    expect(runTestSeedsSpy).not.toHaveBeenCalled();
  });
});
