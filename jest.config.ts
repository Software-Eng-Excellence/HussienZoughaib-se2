import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],//where to find the tests
    testMatch: ['**/*.test.ts'],//what files to look for
    verbose: true,//be detailed in output
    collectCoverage: true,//how much of the code is covered by tests
    collectCoverageFrom: ['src/**/*.ts'],//which files to collect coverage from
    coverageDirectory: 'coverage',//where to output coverage files
    coverageThreshold: {
        global: {
            
            functions: 75,
            statements: 75,
        },
    },
    
    
    
}
export default config;