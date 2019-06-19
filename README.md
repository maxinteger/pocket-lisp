# Pocket lisp

Pocket lisp is a Clojure like programming language.


[![License: MIT][license-shield]][license-link]
[![code style: prettier][prettier-shield]][prettier-link]
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

## Details

You can find the details like usage and syntax, on the project website:

[https://maxinteger.github.io/pocket-lisp/](https://maxinteger.github.io/pocket-lisp/)

## For contributors

You can build packages locally with

    npm build
    
or do continuous build with

    npm watch
    
Also you can run test by

    npm test


[license-shield]: https://img.shields.io/badge/License-MIT-blue.svg?style=shield
[license-link]: https://opensource.org/licenses/MIT
[prettier-shield]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-link]: https://github.com/prettier/prettier
[build-shield]: https://travis-ci.com/maxinteger/pocket-lisp.svg?branch=master
[build-link]: https://travis-ci.com/maxinteger/pocket-lisp
[coverage-shield]: https://codecov.io/gh/maxinteger/pocket-lisp/branch/master/graph/badge.svg
[coverage-link]: https://codecov.io/gh/maxinteger/pocket-lisp
