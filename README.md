# Pocket lisp

Pocket lisp is a Closure like programming language.


[![License: MIT][license-shield]][license-link]
[![Travis Build Status][build-shield]][build-link]
[![Codecov Code Coverage][coverage-shield]][coverage-link]


## Why

We needed a very simple and configurable domain specific language to add a little logic to mathematics exercises on our learning platform Zsebtanár (~pocket teacher)

## Goals

- Simple
- Expressive
- "Fast"
- Sandbox - no access to the native runtime environment (ex. Browser, NodeJS, etc.) API
- Zero dependencies

## Usage

### Package 

_coming soon_

### Repl

The easiest way the try the language is to run it in your terminal in REPL 
(Read-eval-print loop) mode. For that check out the repository, install the dependencies, 
then run the fallowing command:

    npm start
     
## For contributors

You can build packages locally with

    npm build
    
or do continuous build with

    npm watch
    
Also you can run test by

    npm test


[license-shield]: https://img.shields.io/badge/License-MIT-blue.svg?style=shield
[license-link]: https://opensource.org/licenses/MIT
[build-shield]: https://travis-ci.com/maxinteger/pocket-lisp.svg?branch=master
[build-link]: https://travis-ci.com/maxinteger/pocket-lisp
[coverage-shield]: https://codecov.io/gh/maxinteger/pocket-lisp/branch/master/graph/badge.svg
[coverage-link]: https://codecov.io/gh/maxinteger/pocket-lisp
