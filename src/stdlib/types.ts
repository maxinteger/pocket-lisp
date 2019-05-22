import { PLBool } from 'stdlib/data/PLBool'

export function staticImplements<T>() {
  // @ts-ignore
  return (constructor: T) => {}
}

/*
  Types based on Fantasy land
	https://github.com/fantasyland/fantasy-land
 */

export const negate = Symbol('negate')
export const add = Symbol('add')
export const subtract = Symbol('subtract')
export const multiple = Symbol('multiple')
export const divide = Symbol('divide')

export interface BaseNumberOp<T extends BaseNumberOp<any>> {
  [negate](): ThisType<T>
  [add](a: ThisType<T>): ThisType<T>
  [subtract](a: ThisType<T>): ThisType<T>
  [multiple](a: ThisType<T>): ThisType<T>
  [divide](a: ThisType<T>): ThisType<T>
}

export const equals = Symbol('equals')
/**
 * a.equals(a) === true (reflexivity)
 * a.equals(b) === b.equals(a) (symmetry)
 * If a.equals(b) and b.equals(c), then a.equals(c) (transitivity)
 */
export interface Setoid<a> {
  // Setoid a => a ~> a -> Boolean
  [equals](b: Setoid<a>): PLBool
}

export const lte = Symbol('lte')
/**
 * a.lte(b) or b.lte(a) (totality)
 * If a.lte(b) and b.lte(a), then a.equals(b) (antisymmetry)
 * If a.lte(b) and b.lte(c), then a.lte(c) (transitivity)
 */
export interface Ord<a> extends Setoid<a> {
  // Semigroupoid c => c i j ~> c j k -> c i k
  [lte](b: Ord<a>): PLBool
}

export const compose = Symbol('compose')
/**
 * a.compose(b).compose(c) === a.compose(b.compose(c)) (associativity)
 */
export interface Semigroupoid<i, j> {
  // Semigroupoid c => c i j ~> c j k -> c i k
  [compose]<k>(b: Semigroupoid<j, k>): Semigroupoid<i, k>
}

export const id = Symbol('id')
/**
 * a.compose(C.id()) is equivalent to a (right identity)
 * C.id().compose(a) is equivalent to a (left identity)
 */
export interface SCategory<a> /* extends Semigroupoid */ {
  // SCategory c => () -> c a a
  [id](): SCategory<a>
}

export const concat = Symbol('concat')
/**
 * a.concat(b).concat(c) is equivalent to a.concat(b.concat(c)) (associativity)
 */
export interface Semigroup<a> {
  // Semigroup a => a ~> a -> a
  [concat](a: a): a
}

export const empty = Symbol('empty')
/**
 * m.concat(M.empty()) is equivalent to m (right identity)
 * M.empty().concat(m) is equivalent to m (left identity)
 */
export interface SMonoid<T> /* extends Semigroup */ {
  // SMonoid m => () -> m
  [empty](): T
}

export const invert = Symbol('invert')
/**
 * g.concat(g.invert()) is equivalent to g.constructor.empty() (right inverse)
 * g.invert().concat(g) is equivalent to g.constructor.empty() (left inverse)
 */
export interface Group<g> {
  // extends SMonoid
  // Group g => g ~> () -> g
  [invert](): Group<g>
}

export const filter = Symbol('filter')
/**
 * v.filter(x => p(x) && q(x)) is equivalent to v.filter(p).filter(q) (distributivity)
 * v.filter(x => true) is equivalent to v (identity)
 * v.filter(x => false) is equivalent to w.filter(x => false) if v and w are values of the same Filterable (annihilation)
 */
export interface Filterable<a> {
  // Filterable f => f a ~> (a -> Boolean) -> f a
  [filter](p: (a: a) => PLBool): Filterable<a>
}

export const map = Symbol('map')
/**
 * u.map(a => a) is equivalent to u (identity)
 * u.map(x => f(g(x))) is equivalent to u.map(g).map(f) (composition)
 */
export interface Functor<f, a> {
  // Functor f => f a ~> (a -> b) -> f b
  [map]<b>(f: (a: a) => b): f
}

export const contramap = Symbol('contramap')
/**
 * u.contramap(a => a) is equivalent to u (identity)
 * u.contramap(x => f(g(x))) is equivalent to u.contramap(f).contramap(g) (composition)
 */
export interface Contravariant<a> {
  // Contravariant f => f a ~> (b -> a) -> f b
  [contramap]<b>(f: (a: a) => b): Contravariant<b>
}

export const ap = Symbol('ap')
/**
 * v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a) (composition)
 */
export interface Apply<f, a> extends Functor<f, a> {
  // Apply f => f a ~> f (a -> b) -> f b
  [ap]<b>(f: Apply<f, (a: a) => b>): Apply<f, b>
}

export const of = Symbol('of')
/**
 * v.ap(A.of(x => x)) is equivalent to v (identity)
 * A.of(x).ap(A.of(f)) is equivalent to A.of(f(x)) (homomorphism)
 * A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y))) (interchange)
 */
export interface SApplicative<a, T> /* extends Apply */ {
  // SApplicative f => a -> f a
  [of](a: a): T
}

export const alt = Symbol('alt')
/**
 * a.alt(b).alt(c) is equivalent to a.alt(b.alt(c)) (associativity)
 * a.alt(b).map(f) is equivalent to a.map(f).alt(b.map(f)) (distributivity)
 */
export interface Alt<f, a> extends Functor<f, a> {
  // Alt f => f a ~> f a -> f a
  [alt](b: a): Alt<f, a>
}

export const zero = Symbol('zero')

/**
 * x.alt(A.zero()) is equivalent to x (right identity)
 * A.zero().alt(x) is equivalent to x (left identity)
 * A.zero().map(f) is equivalent to A.zero() (annihilation)
 */
export interface SPlus<T> {
  //  Plus f => () -> f a
  [zero](): T
}

/**
 * x.ap(f.alt(g)) is equivalent to x.ap(f).alt(x.ap(g)) (distributivity)
 * x.ap(A.zero()) is equivalent to A.zero() (annihilation)
 */
export interface SAlternative<a, T> extends SApplicative<a, T>, SPlus<T> {}

export const reduce = Symbol('reduce')
/**
 * u.reduce is equivalent to u.reduce((acc, x) => acc.concat([x]), []).reduce
 */
export interface Foldable<a> {
  // Foldable f => f a ~> ((b, a) -> b, b) -> b
  [reduce]<b>(f: (b: b, a: a) => b, init: b): b
}

// Todo: add Traversal: https://github.com/fantasyland/fantasy-land#traversable

export const chain = Symbol('chain')
/**
 * m.chain(f).chain(g) is equivalent to m.chain(x => f(x).chain(g)) (associativity)
 */
export interface Chain<m, a> extends Apply<m, a> {
  // Chain m => m a ~> (a -> m b) -> m b
  [chain]<b>(f: (a: a) => Chain<m, b>): Chain<m, b>
}

export const chainRec = Symbol('chainRec')

/**
 * M.chainRec((next, done, v) => p(v) ? d(v).map(done) : n(v).map(next), i) is equivalent to (function step(v) { return p(v) ? d(v) : n(v).chain(step); }(i)) (equivalence)
 * Stack usage of M.chainRec(f, i) must be at most a constant multiple of the stack usage of f itself.
 */
export interface SChainRec<m, a> /* extends Cain */ {
  // SChainRec m => ((a -> c, b -> c, a) -> m c, a) -> m b
  [chainRec]<b>(f: (a: a) => Chain<m, b>): Chain<m, b>
}

/**
 * M.of(a).chain(f) is equivalent to f(a) (left identity)
 * m.chain(M.of) is equivalent to m (right identity)
 */
export interface Monad<m, a> extends Chain<m, a> /*, Applicative */ {}

export const extend = Symbol('extend')
/**
 * w.extend(g).extend(f) is equivalent to w.extend(_w => f(_w.extend(g)))
 */
export interface Extend<a> {
  // Extend w => w a ~> (w a -> b) -> w b
  [extend]<b>(f: (a: Extend<a>) => b): b
}

export const extract = Symbol('extract')
/**
 * w.extend(_w => _w.extract()) is equivalent to w (left identity)
 * w.extend(f).extract() is equivalent to f(w) (right identity)
 */
export interface Comonad<a> extends Extend<a> {
  // Comonad w => w a ~> () -> a
  [extract](): a
}

export const bimap = Symbol('bimap')
/**
 * p.bimap(a => a, b => b) is equivalent to p (identity)
 * p.bimap(a => f(g(a)), b => h(i(b)) is equivalent to p.bimap(g, i).bimap(f, h) (composition)
 */
export interface Bifunctor<f, a, c> extends Functor<f, a> {
  // Bifunctor f => f a c ~> (a -> b, c -> d) -> f b d
  [bimap]<b, d>(f: (a: a) => b, g: (c: c) => d): Bifunctor<f, b, d>
}

export const promap = Symbol('promap')
/**
 * p.promap(a => a, b => b) is equivalent to p (identity)
 * p.promap(a => f(g(a)), b => h(i(b))) is equivalent to p.promap(f, i).promap(g, h) (composition)
 */
export interface Profunctor<p, b, c> extends Functor<p, b> {
  // Profunctor p => p b c ~> (a -> b, c -> d) -> p a d
  [promap]<a, d>(f: (a: a) => b, g: (c: c) => d): Bifunctor<p, a, d>
}
