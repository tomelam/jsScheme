# Quick Reference to jsScheme's Foreign Function Interface (FFI)

## The ```js-eval``` and ```js-invoke``` Primatives

The ```js-eval``` and ```js-invoke``` primatives cause one or more of
their arguments to be passed to the JavaScript environment to be
evaluated. If and when a value returned from the JavaScript environment
is an integer or string, it can be used as the corresponding type,
i.e. an integer or string, respectively, in jsScheme. Examples:

### The ```js-eval``` Primative

The ```js-eval``` primative takes a string as an argument and executes it as
a line of JavaScript, i.e. passes it to the JavaScript environment
to be evaluated. Examples:

* If the following has already been evaluated in JavaScript:
```
		function foo(a, b) { console.log(a); console.log(b); }
```
		then
```
		(js-eval "foo(0,1)") => #null
```
		and in the JavaScript console
```
		0
		1
```
* ```js-eval``` can return a JavaScript object to jsScheme and store it
in a variable:
```
		(define d  (js-eval "new Date();")) => #obj<Date>
```

* Combining strings using ```string-append``` and careful quoting to build
an argument for ```js-eval```:
```
		(define (id-element id)
		  (js-eval (string-append "document.getElementById('" id "')"))) => #lambda
		(id-element "foo") => #obj<HTMLDivElement>
```

### The ```js-invoke``` Primative

The ```js-invoke``` primative takes a JavaScript object as its first
argument, the name of a method of that object, and zero to three
arguments to that method. It invokes the method on the object.
(The number of arguments the method can accept is hard coded inside jsScheme,
but jsScheme could easily be modified to allow it to accept more.) Examples:

* Invoking a method on a stored JavaScript object: 
```
		(define d (js-eval "new Date();")) => #obj<Date>
		(display (js-invoke d "toString")) => Fri Dec 13 2019 02:03:05 GMT+0530 (India Standard Time)=> #null
```

* Invoking a method immediately after getting a JavaScript object:
```
		(display (js-invoke (js-eval "new Date();") "toString")) => Fri Dec 13 2019 02:08:47 GMT+0530 (India Standard Time)=> #null
```

* Passing an argument to the invoked method:
```
		(define divs (js-eval "$('div')")) => #obj<function(e,t){return new k.fn.init(e,t)}>
		(js-invoke divs "get" 2) => #obj<HTMLDivElement>
```

* Getting a single HTML element from a jQuery query set using the query set's
```get``` method:
```
		(define divs (js-eval "$('div')")) => #obj<function(e,t){return new k.fn.init(e,t)}>
		(define div (js-invoke divs "get" 0)) => #obj<HTMLDivElement>
		(js-invoke div "getAttribute" "id") => "foo"
		(define div (js-invoke divs "get" 2)) => #obj<HTMLDivElement>
		(js-invoke div "getAttribute" "id") => "time"
```

* Getting a single HTML element of a jQuery query set using Scheme's
procedure ```vector-ref```:
```
		(define divs (js-invoke (js-eval "$('div')") "toArray")) => #(#obj<HTMLDivElement> #obj<HTMLDivElement> #obj<HTMLDivElement>
		(define div (vector-ref divs 2)) => #obj<HTMLDivElement>
		(js-invoke div "getAttribute" "id") => "time"
```

## Manipulating the DOM

jsScheme uses jsQuery v3.4.1. ```js-eval``` and ```js-invoke``` can be used
to access it.
