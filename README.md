# jsScheme&mdash;Scheme in JavaScript

```jsScheme``` is a nearly complete implementation of R⁵RS Scheme language in
JavaScript. It is described on Chris Double's website in a
[2006 blog post](https://bluishcoder.co.nz/2006/05/05/scheme-implementation-in-javascript.html).
Archive.com has captured
[the page on its Wayback Machine](https://web.archive.org/web/20190221081641/https://bluishcoder.co.nz/2006/05/05/scheme-implementation-in-javascript.html).
The code can be run online on
[a page of Chris Double's website](https://bluishcoder.co.nz/jsscheme/)
or on
[Archive.com's capture](http://web.archive.org/web/20190221081543/https://bluishcoder.co.nz/jsscheme/).
That version forms the initial commit to this Git repository.
Archive.com also has
[captures of Alex Yakovlev's earlier, original version of jsScheme](http://web.archive.org/web/*/http://alex.ability.ru/scheme.html),
although those captures might not be working.

## Features

1. Proper tail-recursion.
2. First-class continuations, even with ```dynamic-wind```.
3. Boolean, string, number, char, and vector data types, but no
complex or rational numbers.
4. Limited ```syntax-rules``` transformer (written in
Scheme; no nested ellipsis ('...') or vectors support).
5. Optional just-in-time compilation to javascript. This does not
support continuations. The library can be pre-compiled with
```(compile-lib)``` and inserted in the ```init``` function.
This will speed up loading at the price of ~200kB.
[Download it.](javascript-scheme.tar.gz)
6. Almost no error checking.
7. No I/O like ```load```, ```read-char```,
```open-input-file```, etc.
8. Limited ```values``` support. Only the first value is
displayed. All continuations may receive multiple values, not only
those created with ```call-with-values```:
```
	(values 1 2 3)  =>  1
	(+ (values 1 2 3))  =>  6
	(list (values 1 2 3))  =>  (1 2 3)
	(call-with-values (lambda () (values 1 2 3)) +)  =>  6
```
9. Predicates like <code>=</code> and <code>string&gt;?</code>
take only 2 arguments, but can be extended in this way:
```
	(define < ((lambda() (define old< <)
	  (lambda (x y . rest)
	    (if (old< x y)
		(if (null? rest)
		    #t
		    (apply < y rest))
		#f)))))
	(< 1 2 3 4 5)  =>  #t
	(< 1 2 3 4 3)  =>  #f
```
10. ```map``` works on improper lists:
```
	(map + '(1 2 . 3) '(40 20 . 10))  =>  (41 22 . 13)
	(map + 14 9)  =>  23
```
11. Most of the R⁵RS features and library are implemented.
12. Passes all ```r5rs_pitfall.scm``` tests (included in
SISC).
13. Strings are immutable; no ```string-fill!``` and
```string-set!```.
20. ```begin```, ```lambda```, ```if```, ```define```,
```set!``` and ```quote```.  are primitive language expressions.
They are not derived as
R<sup>5</sup>RS defines. Moreover, ```lambda``` bodies with
several statements are enclosed in ```begin``` in internal
representation to emphasize that they express different concepts:
the first is a function and the second is an operators
sequencing.
21. Tested in IE6 and Opera7.

## References

1. R. Kent Dybvig,
[The Scheme Programming Language, Second Edition](http://www.scheme.com/tspl2d/).

2. [Revised⁵ Report on the Algorithmic Language Scheme R⁵RS](http://www.schemers.org/Documents/Standards/R5RS/).

3. [Structure and Interpretation of Computer Programs](https://mitpress.mit.edu/sites/default/files/sicp/index.html).

4. [Oleg Kiselyov's Scheme page](http://okmij.org/ftp/Scheme/).

5. [Kirill Lisovsky's Scheme page](http://www.pair.com/lisovsky/scheme/),
[captured by Archive.org](http://web.archive.org/web/20040318125318/http://www196.pair.com/lisovsky/scheme/).

6. [PLT Scheme](http://www.plt-scheme.org/).

7. Alex's old Lisp interpreter in C (source unknown).

## Other Implementations in JavaScript

1. [Luke Gorrie's](http://www.bluetail.com/~luke/jscm/repl.html), [captured by Archive.org](http://web.archive.org/web/20061011101527/http://fresh.homeunix.net/~luke/jscm/repl.html).

2. [Douglas Crockford's](https://www.crockford.com/scheme.html).

3. [Joe Ganley's](http://ganley.org/software/jslisp.html),
[relocated to joeganley.com](http://joeganley.com/code/jslisp.html).

## Implementations in Java

1. [Per Bothner's Kawa](http://www.gnu.org/software/kawa/), both an interpreter and compiler-to-Java-bytecode.

2. [Skij](http://www.alphaworks.ibm.com/formula/skij/), 
[captured by Archive.org](https://sourceforge.net/projects/jikes/),
from the same group at IBM's T.J. Watson Research Center
who developed [Jikes](http://www.ibm.com/developerworks/oss/jikes/),
[moved to Sourceforge.net](https://sourceforge.net/projects/jikes/).

3. [SISC - Second Interpreter of Scheme Code](http://sisc.sourceforge.net/), R⁵RS compliant.

4. [Bigloo compiler](http://www-sop.inria.fr/mimosa/fp/Bigloo/), very efficient, can produce Java bytecode.
