# Sweet-operators - pythonic operators for javascript.
Because it's 2016.

## WTF is this ?
Sweet-operators allows you to overload and create new operators for javascript languages. ~~If you know python, then you already know why it is so great !~~

## Seriously ??? Show me how does it work !

```
> a = Real
> b = Real
> (a + a) b = 2 a b
true
```

## How does it works ?
Technically it's both a set of macros for the sweet.js compiler and a library with predefined operators.

Basically, sweet-operators replace operators with function calls to be able to overload them, eg: `a + b` with `a.__add__(b)`. This is very simple but in practice very powerful.

## Introducing _contexts_
Contexts allows you to customise/select which overloads you want. For instance you can choose between light modifications with only stricter evaluation/type coercion than standard javascript, or the opposite side of the spectrum with auto-scalability for SSE/SIMD array handling, specialised operators for matrix manipulation, symbolic programming, etc.

```
a = [10, 4, 3]
b = [1, 5, 7]
context('vector') {
    console.log(a + b)
    // [11, 9, 10]
}
context('plus-as-append') {
    console.log(a + b)
    // [10, 4, 3, 1, 5, 7]
}
```

## Bonus
Sweet.js compiles _javascript_ macros, so that means you can use it (and sweet-operators with it) in any language that compiles down to javascript. Juste be sure that you run `sjs` _before_ doing any minification.

# Interesting projects
Sweet.js _of course_, the macro compiler used by sweet-operators.
