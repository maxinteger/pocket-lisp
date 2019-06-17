import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

const baseConfig = {
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    typescript({
      typescript: require('typescript'),
      tsconfigOverride: {
        compilerOptions: {
          module: 'esnext'
        },
        exclude: ['test/**/*', 'src/repl.ts']
      }
    })
  ]
}

export default [
  {
    input: 'src/lang/index.ts',

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
    ...baseConfig
  },
  {
    input: 'src/stdlib/index.ts',

    output: [
      {
        file: pkg.main.replace('index', 'stdlib'),
        format: 'cjs'
      },
      {
        file: pkg.module.replace('index', 'stdlib'),
        format: 'es'
      }
    ],
    ...baseConfig
  }
]
