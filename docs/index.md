# Pocket lisp

Pocket Lisp a simple and configurable generic script language.

## Goals

- Simple
- Expressive
- "Fast"
- Sandbox - no access to the native runtime environment (ex. Browser, NodeJS, etc.) API
- Zero dependencies

## Try it!

### Sandbox

The easiest way the try the language is open the sandbox version in your browser:

[Pocket-lisp sandbox](https://maxinteger.github.io/pocket-lisp/sandbox.html)

_Note_: It using JS modules

### REPL

But you can clone the project and run as a REPL (Read-eval-print loop) in your terminal.
For that check out the repository, install the dependencies, then run the fallowing command:

    npm start


# Usage

```js
import { Scanner, Parser, Interpreter } from 'index.es.js'
import { literals, runtime, utils } from 'stdlib.es.js'

const run = sourceCode => {
  const interpreter = new Interpreter(
    {
      globals: runtime,
      // our you can overwrite the print function in the globals 
      stdout: value => writeOutput(value, false),
      utils
    },
    literals
  )

  // tokenize
  const scanner = new Scanner(sourceCode)
  // parse, you need to pass provide the literals if you ar using the stdlib
  const parser = new Parser(scanner, literals)
  const parserResult = parser.parse()

  // check parser errors
  if (parserResult.hasError) {
    for (let err of parserResult.errors) {
      writeOutput(`line: ${err.line} - ${err.message}`, true)
    }
  } else {
    try {
      // Execute
      interpreter.interpret(parserResult.program)
    } catch (err) {
      // Handle runtime errors
      writeOutput(err.message, true)
    }
  }
}

run('(print (+ 1 2))')
```

## Package

On NPM: https://www.npmjs.com/package/pocket-lisp

It contains both **ES5** and **ES6** packages with typescript type definitions

- Pocket lisp interpreter: `index.js` and `index.es.js`
- Pocket lisp standard library: `stdlib.js` and `stdlib.es.js`

# Pocket lisp syntax

The syntax very similar to the closure script language

## Basics

- space like (space, newline, comma, etc.) characters are ignored.
  For example: `[ 1 2 3 ]` equivalent with `[ 1, 2, 3 ]`
- single line comment star with: `;`
- no multi line comment

### Identifiers

The identifier

- must be start with latin alphabetic character or the fallowing symbols `=+-*\&%$_!<>?`
- can continue with latin alphabetic or numeric characters or the fallowing symbols `=+-*\&%$_!<>?`

### Keywords

Keywords are special identifiers which are

- must be start with colon (`:`) and
- must continue with at least 1 latin alphabetic or numeric characters or the fallowing symbols `=+-*\&%$_!<>?`

```clojure
:keyword
:t1
:x
```

## Literals

### boolean

- `true` and `false`

### Number

- Integer: `42`
- float: `42.5`
- friction: `1/2` _numerator and denominator must be integer_

### String

- string `"Hello world"`

### Vector

Array like structure

- vector `[ 1 2 3 ]`

### HashMap

Key value pairs

- hashMap: `{ key1 value1 key2 value2}` _must be pairs_

## List / Function calls

List a special structure which is very similar to an array,
except the first item must be callable (lambda function, or function reference).
The rest of the list will be the parameters of the function

- list: `(print 1 2 3)`

## Integrated functions

### Print

Print value to the standard output. It accepts any amount fo parameters.

```clojure
(print Hello world)
(print 42 1/2 1.5)
```

### define variable - `def`

`def` function can create a new variable in the current scope.
The function has 2 parameter:

- the variable name, it must be an identifier
- the initial value of the variable, it can be anything and it is mandatory

Define the `x` variable

```clojure
(def x 42)
(print x)                           ; print 42
```

### Lambda function - `fn`

`fn` define a lambda function. It has 2 parameters:

- arguments vector, where the items must be identifiers, empty vector allowed
- function body, can be anything

```clojure
(fn [] 42)
(fn [] (+ 1 2))
                                    ; function closure
(def add (fn [a] ( fn [b] (+ a b) )))
(def addTo10 (add 10))              ; create reference for the function
(print (addTo10 1))                 ; print 11
```

#### Function shortcut - `#()`

```clojure
(def add #(+ %1 %2))
(def addTo10 (add 10))
(print (addTo10 1))                 ; print 11
```

### Define function - `defn`

`defn` function is a shortcut for the often used `def` and `fn` combination.

The fallowing two definitions are equivalent:

```clojure
(def add (fn [a b] (+ a b))

(defn add [a b] (+ a b)
```

### If function - `if`

`if` function has 3 parameters and if the first expression value is `true` then evaluate and return with the second parameter otherwise does the same with the third parameter

- Boolean expression
- true branch
- false branch

```clojure
(print (if true 1 2))               ; print 1
```

### Do function - `do`

`do` run sequentially all the passed parameters and return with the values of the last expression. It must be called with at least 1 parameter

```clojure
(print (do 1 2 42))                 ;pritn 42
(defn x [] (do (+ 1 2) 10))
```
