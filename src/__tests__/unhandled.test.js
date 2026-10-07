/**
 * Copyright (c) 2019-present, GraphQL Foundation
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const { spawnSync } = require('child_process');
const path = require('path');

describe('Unhandled rejections', () => {
  it('Not catching a primed error is an unhandled rejection', () => {
    const result = spawnSync(
      process.execPath,
      [
        '-r',
        '@babel/register',
        '-e',
        `
          const DataLoader = require('./src');
          process.once('unhandledRejection', error => {
            process.exit(error.message === 'Error: 1' ? 0 : 2);
          });
          const identityLoader = new DataLoader(async keys => keys);
          identityLoader.prime(1, new Error('Error: 1'));
          identityLoader.load(1);
          setTimeout(() => process.exit(3), 1000);
        `,
      ],
      { cwd: path.resolve(__dirname, '../..') },
    );

    expect(result.status).toBe(0);
  });
});
