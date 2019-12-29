# jsScheme Reference to jsScheme's Foreign Function Interface (FFI)

## Pre-Compiling jsScheme's Library

jsScheme's library can be compiled by evaluating
```
	   (compile-lib)
```
The result, which will be printed in the Log, can be copied and
edited into jsScheme's init() function for faster startup.

## Checkboxes Hidden in This Version.

The original version of jsScheme had checkboxes to enable or disable
input logging, results logging, and just-in-time compilation
using the built-in compiler.
They can be displayed by removing the "display:hidden" style
from the paragraph tag (<p>) containing them.
Note that the just-in-time compiler might not work in Firefox.
See "Bugs" in the [README](README.html).

## jsScheme's Foreign Function Interface (FFI)

### The ```js-eval``` and ```js-invoke``` Primitives

The ```js-eval``` and ```js-invoke``` primitives cause one or more of
their arguments to be passed to the JavaScript environment to be
evaluated. If and when a value returned from the JavaScript environment
is an integer or string, it can be used as the corresponding type,
i.e. an integer or string, respectively, in jsScheme. Examples:

#### The ```js-eval``` Primitive

The ```js-eval``` primitive takes a string as an argument and executes it as
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
		and in the JavaScript console the following gets printed:
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

#### The ```js-invoke``` Primitive

The ```js-invoke``` primitive takes a JavaScript object as its first
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

### Manipulating the DOM

jsScheme uses jsQuery v3.4.1. The ```js-eval``` and ```js-invoke``` primititves can be
used to access it. Fuctions are being developed to facilitate the use of these
primitives:

* `$`

	Evaluates a jQuery call in the context of the JavaScript environment and returns the resulting jQuery-wrapped collection of elements. There are three call signatures:

	* Select a collection of elements or create an HTML element and return a jQuery-wrapped collection of elements, given, respectively, a jQuery selector or content parameter:

		```($ "#symbols") => #obj<function(e,t){return new k.fn.init(e,t)}>```

		```($ "<div></div>") => #obj<function(e,t){return new k.fn.init(e,t)}>```

	* Invoke a method on a jQuery collection of elements and return a jQuery-wrapped collection of elements:

		```($ "#symbols" "get") => #obj<function(e,t){return new k.fn.init(e,t)}>```

	* Invoke a method on a jQuery collection of elements and return jQuery's result:

		```($ "#symbols" "get" 0) => #obj<HTMLTableElement>```

* `$wrap`

	Give a raw HTML object a jQuery wrapping:

		($wrap ($ "#symbols" "get" 0)) => #obj<function(e,t){return new k.fn.init(e,t)}>


* `$unwrap`

	[Not working.] Get a raw HTML object from inside a jQuery wrapping:

		($unwrap ($ "#symbols))

* `get-el-attr`

	Returns an attribute, given the raw HTML object and the name of the attribute:

		(get-el-attr ($ "#symbols" "get" 0) "id") => "symbols"

* `set-el-attr`

	Sets an attribute of an HTML element, given the raw HTML object and the attribute:

		(set-el-attr ($ "#symbols" "get" 0) "id" "symbols2") => #null

* ```get-attr```

	Returns an attribute of an HTML object, given a jQuery selector for a single HTML element:

		(get-attr "#symbols" "id") => "symbols"

* ```set-attr```

	Sets an attribute of an HTML object, given a jQuery selectro for a single HTML element and a value:

		(set-attr "#symbols" "id" "symbols2") => #obj<function(e,t){return new k.fn.init(e,t)}>

* ```add-style```

	Add a CSS style to the page:

		(add-style ".button { background-color:rgb(80,200,80); }") => #obj<function(e,t){return new k.fn.init(e,t)}>
