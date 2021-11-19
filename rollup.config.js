import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

export default [
  {
    input: 'src/index.ts',

    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
        exclude: ['test/**/*', '*.spec.ts', 'src/repl.ts'],
      }),
    ],
  },
]
