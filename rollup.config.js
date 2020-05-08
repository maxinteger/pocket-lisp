import ts from '@wessberg/rollup-plugin-ts'
import pkg from './package.json'

export default [
  {
    input: 'src/index.ts',

    output: [
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      ts({
        tsconfig: 'tsconfig.json',
        exclude: ['test/**/*', '*.spec.ts', 'src/repl.ts']
      })
    ]
  }
]
