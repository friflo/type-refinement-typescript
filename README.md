# Proposal: Optional static type refinement for Typescript

## Goals

-   Compile time checks for

    -   literals
    -   refined types

-   Compile time type checks covers:

    -   primitives: string, number and BigInt
    -   composed types: object

-   Compile time checks of refined types:

    -   assignments
    -   function calls - check signature
    -   type definitions - unions & intersections
    -   generics

-   Implement refinement validation by functions. E.g:

    -   RegExp patterns enclosed by named functions

    -   Common functions exposed by application or third party libraries with a signature like:  
        `(val: <base type>) => <refined type> | undefined`

    -   The name of a refinement function can be arbitrary. Is should be like: `isMyType ()`

-   Type refinement functions can also be used for runtime checks to avoid code duplication for compile time and runtime checks.  
    In case of positive check the type gets refined.

-   Make type refinement checking optional per Typescript project.
    If disabled the compiler simply fall back to their base type T declared in:
    type  
    `type TypeRefinement<T, refinementFcn extends RefinementFcn<T>> = T;`

## Non-goals

-   emit no code based based on type declarations from type space

## Use cases

-   Validate example literals used to illustrate usage of complex type hierarchy (hundreds of class) at compile time.
    This is especially very helpful for developers which are new to Typescript and/or new to a complex type hierarchy.

-   Create / validate / enhance unit tests especially for type declarations in DefinitelyTyped.

-   Represent & validate the regular expression pattern's and format's used in JSON Schema at compile time

-   Represent & validate the invariant of objects with inter-property dependencies at compile time

## Compile time / malicious code

A requirement of this PR is that user code need to be executed at compile time.
So concerns about increased compile time and malicious validation code are valid.

As this feature is designed as Opt-In those concerns can be solved by simply not using it.

## Precisionitis / Tower of babel

A valid concern about validation expressions is that authors of DefinitelyTyped may introduce validations to every type.  
See: https://github.com/microsoft/TypeScript/issues/6579#issuecomment-542405537

As this PR is not using meta data (via d.ts files) for validation only the 3rd party authors are able to introduce validation functions.  
Authors of DefinitelyTyped have only the possibility to utilize these validation functions for refined types.

## Compatibility

By using only two simple generics and returning the base type T in `TypeRefinement`
this PR preserves backward compatibility to early Typescript versions.

-   requires no change or extension of Typescript syntax
-   requires a specific handling by the compiler when assigning a refinement function to a refined type. More at docs of `TypeRefinement`

## Structural typing

As Typescript is designed to be a structural typed language (instead of a nominal typed language) it may be useful to apply this to refined types.
A refined typed may get (implicitly) an additional property 'refinementFcn' with the signature of the refinementFcn.
So two individual type refinements are considered as equal if the have the same signature of the refinement function.

As a result:

-   the union of two type refinements using the same base type is the union of both refined types
-   the intersection of two type refinements using the same base type results in: never

## Naming:

Alternative naming could by: type restriction, reduction or constraint
