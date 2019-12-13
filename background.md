# Background

[Chris Double's blog post on jsScheme](https://bluishcoder.co.nz/2006/05/05/scheme-implementation-in-javascript.html)
links to resources related to jsScheme and
[sequential web-application demo using jsScheme](https://github.com/tomelam/sequential_web_app_demo).
Those and other resources are listed here because they provide a rich background
on the use of languages interpretted in or compiled to JavaScript,
and the use of continuations or continuation-passing style in
web applications.
The resources are papers and running implementations.
The bibliographies of the papers list much related research.
Many of the papers and resources have moved but have been tracked down
and recorded below, in no particular order, with some of the links
updated.

## Papers

1. [Oberon Script. A Lightweight Compiler and Runtime System for the Web](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-2006-50.pdf)

	From [Lambda the Ultimate](http://lambda-the-ultimate.org/node/1432):

	"Oberon Script is a scripting language and runtime system for building interactive Web Client applications. It is based on the Oberon programming language and consists of a compiler that translates Oberon Script at load-time into JavaScript code, and a small runtime system that detects and compiles script sections written in Oberon Script."

	People outside our field often don't relaize just how easy it is to implement languages: This project, for example, uses a recursive descent parser, and the entire compiler is 1081 lines of Javascript code.

1. [Control Delimiters and Their Hierarchies](https://github.com/rain-1/continuations-study-group/blob/master/papers/(1990)%20Control%20Delimiters%20and%20Their%20Hierarchies%20-%20Dorai%20Sitaram%2C%20Matthias%20Felleisen.pdf)

	Abstract:

	"Since control operators for the _unrestricted_ transfer of control are too powerful in many situations, we propose the _control delimiter_ as a means for restricting control manipulations and study its use in Lisp- and Sheme-like languages. In a Compon Lisp-like setting, the concept of delimiting control provides a well-suited terminology for explaining different control constructs. For higher-order languess like Scheme, the control delimiter is the means for embedding Lisp control constructs faithfully and for realizing high-level control abstractions elegantly. A deeper analysis of the examples suggests a need for an entire _control hierarchy_ of such delimiters. We show how to implement such a hierarchy on toop of the simple version of a control delimiter."

1. [Continuations in Programming Practice: Introduction and Survey](https://www.cs.indiana.edu/~sabry/papers/continuations.ps)

	From the introduction:

	"Continuations appear in many contexts including compilers ...,
denotational semantics ..., operating systems ..., and classical logic ....
We can however understand much of the history ..., development, and
applications of continuations by simply studying programming practice.

	"We begin our study of continuations ... by making an informal
connection with control stacks commonly used for runtime storage of
activation records. Next ... we generalize this argument: instead of looking at the evaluation of single programs, we look at entire programming languages
and show how continuations appear at the implementation level. Once
continuations are revealed as entities in an implementation it becomes
natural to give them an explicit representation in the evaluator, and
then to manipulate them to express ..., and even discover ..., control
operators. The manipulation of continuations using control operators
provides an expressive formalism in which one can express elegant solutions
to a wide variety of problems .... Finally we conclude with a perspective
about the future uses of continations ...."

1. [A Library of High Level Control Operators](https://christian.queinnec.org/PDF/contlib.pdf)

	Abstract:

	"Numerous high-level control operators, with various properties, exist in the literature. To understand or compare them is difficult since their definitions use quite different theoretical frameworks; moreover, to our knowledge, no implementation offers them all. This paper tries to explain control operators by the often simple stack manipulation they perform. We therefore present what we think these operators are, in an executable framework derived from abstract continuations. This library is published in the hope that it will be useful, but WITHOUT ANY WARRANTY; without oven the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For instance, we do not claim our implementation to be faithful nor we attempt to formally derive these implementations from their original definitions. The goal is to give a flavor of what control operators are, from an implementation point of view. Lasst but worth to say, all errors are mine."

1. [Continuations by example: Exceptions, time-traveling search, generators, threads, and coroutines](http://matt.might.net/articles/programming-with-continuations--exceptions-backtracking-search-threads-generators-coroutines/)

	Introduction:

	"Continuations are the least understood of all control-flow constructs. This lack of understanding (or awareness) is unfortunate, given that continuations permit the programmer to implement powerful language features and algorithms, including exceptions, backtracking search, threads, generators and coroutines.

	"I think part of the problem with continuations is that they're always explained with quasi-metaphysical phrases: "time travel," "parallel universes," "the future of the computation." I wrote this article so that my advanced compilers students could piece together how continuations worked by example."

1. [Why Are Continuations So Darn Cool?](https://danielfm.me/posts/why-are-continuations-so-darn-cool.html)

	Introduction:

	"The usual way to control the flow of execution of a computer program is via procedure calls and returns; a stack data structure is how high-level programming languages keep track of the point to which each active subroutine should return control when it finishes executing.

	"Unfortunately, you'll need more than that if you intend to write useful programs to solve real-world problems. That's why most high-level programming languages also provide other control-flow primitives, like the goto statement, loops, and exception handling.

	"I'm not saying that implementing a programming language is an easy task, but putting that aside for a moment, it's like programming languages in general fight as hard as they can to make the call stack something as hidden and intangible as possible - something no one but itself are allowed to control.

	"What would happen if some programming languages, instead of keeping the call stack inside a 2" solid steel safe, actually gave the programmers the ability to 'capture' them as functions that can be invoked, stored, and passed around as values?

	"In this post, I hope to show you what continuations are and how they can be used in practical situations. So grab Racket and let's go!"

1. [Links: Web Programming Without Tiers](http://homepages.inf.ed.ac.uk/slindley/papers/links-fmco06.pdf)

	The [Links homepage](https://links-lang.org/) has a good, up to date (as of December 2019) related bibliography.

	From [Lambda the Ultimate](http://lambda-the-ultimate.org/node/1441):

	"Links is a programming language for web applications. Links generates code for all three tiers of a web application from a single source, compiling into JavaScript to run on the client and into SQL to run on the database. Links provides support for rich clients running in what has been dubbed `Ajax' style. Links programs are scalable in the sense that session state is preserved in the client rather than the server, in contrast to other approaches such as Java Servlets or PLT Scheme."

	Links is related to many of the recent discussions (here's one), and was discussed here a few times in the past. This paper is a nice overview, and a good place to start if you haven't looked at [Links](https://links-lang.org/) before.

	It would be nice (and, I think, productive) to have Erik and Philip, who both guest blog here on occasion, discuss their different PL based approaches to web programming here on LtU! What better place to discuss web programming?!

1. [Inverting back the inversion of control or, Continuations versus page-centric programming](https://pages.lip6.fr/Christian.Queinnec/PDF/www.pdf)

	Abstract:

	"Our thesis is that programming web applications with continuations is superior to the current page-centric technology. A continuation is a program-level manageable value representing the rest of the computation of the program.
'What to do next' is precisely what has to be explicitly encoded in order to program non trivial web interactions.
Continuations allow web applications to be written in direct style that is, as a single program that displays forms and
reads form submission since continuations automatically capture everything (control point, lexical bindings, etc.) that
is needed to resume the computation. Programming is therefore safer, easier and more re-usable."

1. [The Influence of Browsers on Evaluators or, Continuations to Program Web Servers](https://pages.lip6.fr/Christian.Queinnec/PDF/webcont.pdf)

	Abstract:

	"While developing the software of a browser-operated educational CD-ROM, we had to face a number of problems. This paper presents these problems and the solutions we found. Amusingly, most of our solutions rely on continuations. Are browsers and multimedia the future of continations?

	"Through their 'Back' button or 'Clone window' menu item, browsers have powerful abilities that force servers to take care of multiply and simultaneously answered questions. A comprehensive tool to apprehend these problems as well as to solve them is to view these abilities as operators acting on the continuations of the computation performed by servers.

	"Thematical trails are provided to walk through the CD-ROM but do not prevent students to wander elsewhere. A trail may contain choices or quizzes so the rest of the trail should adapt to the walked part. We consider the trail as a computation and the position of the student as a continuation within that computation.

	"Moreover this paper advocates a computation-centric view of servers (in opposition to the usual page-centric view) where interactions with users suspend the computation into continuations that may be later resumed. This approach is superior because the contination reifies, automatically and without errors, the whole state of the computation."

1. [More: Systems Programming with Racket](https://docs.racket-lang.org/more/)

	Introduction:

	"In contrast to the impression that Quick: An Introduction to Racket with Pictures may give, Racket is not just another pretty face. Underneath the graphical facade of DrRacket lies a sophisticated toolbox for managing threads and processes, which is the subject of this tutorial.

	"Specifically, we show how to build a secure, multi-threaded, servlet-extensible, continuation-based web server. We use much more of the language than in Quick: An Introduction to Racket with Pictures, and we expect you to click on syntax or function names that you don't recognize (which will take you to the relevant documentation). Beware that the last couple of sections present material that is normally considered difficult. If you're still new to Racket and have relatively little programming experience, you may want to skip to The Racket Guide.

	"To get into the spirit of this tutorial, we suggest that you set DrRacket aside for a moment, and switch to raw racket in a terminal. You'll also need a text editor, such as Emacs, vi, or even Notepad--any editor will do, but one that supports parenthesis matching would be helpful. Finally, you'll need a web client, perhaps Lynx or Firefox."

1. [The Racket website's bibliography](https://docs.racket-lang.org/reference/doc-bibliography.html)

	Seminal papers in Scheme develpment.

1. [Chrisitan Queinnec's index of PDF papers](https://pages.lip6.fr/Christian.Queinnec/PDF/)

	Christian Queinnec has written a lot on Scheme, continuations, and web continuations. Here is a comprehensive list of his publications.

1. [rain-1's Github repository 'continuations-study-group'](https://docs.racket-lang.org/reference/doc-bibliography.html)

	About 30-40 research papers related to Scheme and continuations, as PDFs.