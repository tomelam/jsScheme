# Background

The resources listed here provide a rich background
on JavaScript in the web browser,
on the use of continuations or continuation-passing style in
web applications,
and on macro systems for Scheme.
For even more resources related to 
the use of continuations in web applications,
there is [a sequential web-application demo using jsScheme](https://github.com/tomelam/sequential_web_app_demo).
The sections below list some papers, Scheme implementations, and Scheme
software.
Many of the papers and resources have moved but have been tracked down
and recorded below, in no particular order, with some of the links
updated.

Some of the JavaScripts in the web browser are implemented using Emscripten.
From Wikipedia: "Emscripten is a source-to-source compiler that runs as a back end to the LLVM compiler and produces a subset of JavaScript known as asm.js. It can also produce WebAssembly... . asm.js can be compiled by browsers ahead of time meaning that the compiled programs can run much faster than those traditionally written in JavaScript."

## Papers

1. [R5RS](https://schemers.org/Documents/Standards/R5RS/)

	The paper that introduced and defined R5RS Scheme. [R5RS as a PDF](https://schemers.org/Documents/Standards/R5RS/r5rs.pdf). [R5RS in HTML](https://schemers.org/Documents/Standards/R5RS/HTML/).

1. [Oberon Script. A Lightweight Compiler and Runtime System for the Web](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-2006-50.pdf)

	From [Lambda the Ultimate](http://lambda-the-ultimate.org/node/1432):

	"Oberon Script is a scripting language and runtime system for building interactive Web Client applications. It is based on the Oberon programming language and consists of a compiler that translates Oberon Script at load-time into JavaScript code, and a small runtime system that detects and compiles script sections written in Oberon Script."

	People outside our field often don't relaize just how easy it is to implement languages: This project, for example, uses a recursive descent parser, and the entire compiler is 1081 lines of Javascript code.

1. [Control Delimiters and Their Hierarchies](https://github.com/rain-1/continuations-study-group/blob/master/papers/(1990)%20Control%20Delimiters%20and%20Their%20Hierarchies%20-%20Dorai%20Sitaram%2C%20Matthias%20Felleisen.pdf) (Sitaram90)

	Abstract:

	"Since control operators for the _unrestricted_ transfer of control are too powerful in many situations, we propose the _control delimiter_ as a means for restricting control manipulations and study its use in Lisp- and Sheme-like languages. In a Common Lisp-like setting, the concept of delimiting control provides a well-suited terminology for explaining different control constructs. For higher-order languages like Scheme, the control delimiter is the means for embedding Lisp control constructs faithfully and for realizing high-level control abstractions elegantly. A deeper analysis of the examples suggests a need for an entire _control hierarchy_ of such delimiters. We show how to implement such a hierarchy on top of the simple version of a control delimiter."

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

1. [The bibliography at the end of the tutorial 'More: Systems Programming with Racket'](https://docs.racket-lang.org/more/#%28part._doc-bibliography%29)

	Papers related to the tutorial on the Racket website.

1. [The Racket website's bibliography](https://docs.racket-lang.org/reference/doc-bibliography.html)

	Seminal papers in Scheme develpment, especially papers related to continuations
and macros.

1. [Chrisitan Queinnec's index of PDF papers](https://pages.lip6.fr/Christian.Queinnec/PDF/)

	Christian Queinnec has written a lot on Scheme, continuations, and web continuations. Here is a comprehensive list of his publications.

1. [rain-1's Github repository 'continuations-study-group'](https://github.com/rain-1/continuations-study-group/tree/master/papers)

	About 30-40 research papers related to Scheme and continuations, as PDFs.

1. [Bibliography of Scheme-related Research](https://github.com/scheme-live/bibliography)

	Github repository.

	"This online bibliography collects together links to technical papers and theses related to the Scheme language, including both classic papers and recent research. This site was maintained by Jim Bender." The website referred to was [library.readscheme.org](http://library.readscheme.org/), which .

1. [Bibliography provided in the R5RS report](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-14.html#%_chap_Temp_10)

1. [Writing Hygienic Macros in Scheme with Syntax-Case](https://cs.indiana.edu/~dyb/pubs/tr356.pdf)

	Dybvig 1992.

	"This article describes a hygienic macro system for Scheme that is similar to the one documented in an appendix to the 'Revised4 Report on the Algorithmic Language Scheme' [2], with several important differences. ...

	"The macro system consists of a set of defining forms, a set of forms for taking apart and putting together syntax, and a set of primitives for manipulating and comparing identifiers. ... Macro transformers take syntax objects as input and return (expanded) syntax objects as output. ... Implementation-dependent information may be contained within a syntax object; for example, the position of the expression in the original source code may be included for debugging purposes.

	"... Although this is not intended to serve as a complete implementors' guide, a theory of operation is given to help macro writers understand the expansion process (Section 4).

	"This article is intended to instruct potential macro-system users how to use the system; there is no attempt at justification or comparison with other systems. A more formal treatment of this macro system and its implementation, along with background information on this and other macro systems is given in [4].

	"A complete implementation of the macro system is available, and should run in any Scheme system with the provision of a few implementation-dependent 'hooks.' It can be obtained via 'anonymous ftp' from moose.cs.indiana.edu in the directory _pub/scheme/syntax-case_."

	See also [Community-Scheme-Wiki's page on syntax-case](http://community.schemewiki.org/cgi-bin/scheme.cgi?syntax-case);
[section 3.1](https://www.scheme.com/tspl3/further.html#./further:h1) and
[chapter 8](https://www.scheme.com/tspl3/syntax.html#./syntax:h0) of _The Scheme Scheme Programming Language_;
[_Chez Scheme User's Guide_, Chapter 9](https://www.scheme.com/csug6/syntax.html#g2138); and [Wikipedia article 'Scheme (programming language)', section 2.2.4, 'Hygienic macros'](https://en.wikipedia.org/wiki/Scheme_\(programming_language\)#Hygienic_macros).
Chez Scheme has a [portable implementation of the syntax-case macro system](https://github.com/cisco/ChezScheme/blob/master/s/syntax.ss).

	The Wikipedia article provides a simple but key insight to the implementation of define-syntax: "Invocations of macros and procedures bear a close resemblance--both are s-expressions--but they are treated differently. When the compiler encounters an s-expression in the program, it first checks to see if the symbol is defined as a syntactic keyword within the current lexical scope. ..."

1. Writing Hygienic Macros in Scheme with Syntax-Case (GNU zipped Postscript file on FTP server)

	ftp://ftp.maths.tcd.ie/pub/bosullvn/wreavoc/wreavoc/src/compiler/doc/syntax-case.ps.gz

	June version of the document of the same title, mentioned above. Contains a preface that gives the context in which the paper was published a short time after the death of Bob Hieb, who developed most of the important concepts and algorithms for the syntax-case system.

	"This report is intended not to justify the macro system, but to help potential users learn how to write macros using it. A companion report, "Syntactic Abstraction in Scheme" [4], which was mostly written before Bob's death, does attempt to justify the macro system and to place it within the context of other work. The companion report also contains more detail on the algorithms used by our implementation of the macro system.

	"A complete implementation of the macro system is available, and should run in any Scheme system with the provision of a few implementation-dependent "hooks." It can be obtained via "anonymous ftp" from _iuvax.cs.indiana.edu_ in the directory _pub/scheme/syntax-case_. ..." [Note, however, that _iuvax.cs.indiana.edu_ might no longer exist.]

1. Syntactic Abstraction in Scheme (GNU zipped Postscript file on FTP server)

	ftp://ftp.cs.indiana.edu/pub/scheme-repository/doc/pubs/iucstr355.ps.gz

	Hieb, Dybvig, Bruggeman 1992.

	"The remainder of this paper is structured as follows. Section 2 discusses related work. Section 3 describes the interface to our macro system and examples of its use. ..."

	A very clear explanation of the motivation for syntax-case and syntax-rules, how to implement them, and how to use them.

1. [Syntactic Abstraction: The syntax-case expander](https://www.cs.indiana.edu/~dyb/pubs/bc-syntax-case.pdf)

	Dybvig 2007.

1. [An introduction to macro exapansion algorithms](https://cs.indiana.edu/ftp/scheme-repository/doc/misc/macros-01.txt)

The link points to the first part of a planned series of nine articles.
Apparently only the first four parts were published.
They may also be obtained frrom the [Indiana University Scheme repository in its [miscellaneous directory](ftp://ftp.cs.indiana.edu/pub/scheme-repository/doc/misc/).

1. [Fear of Macros](https://www.greghendershott.com/fear-of-macros/all.html)

	"A practical guide to Racket macros."

1. [Patterns for Writing Macros](http://www.ccs.neu.edu/home/ryanc/macro-patterns/index.html)

1. [Debugging hygienic macros](https://core.ac.uk/download/pdf/82816814.pdf)

	Culpepper, Felleisen 2009

1. [Low- and high-level macro programming in Scheme](http://okmij.org/ftp/Scheme/macros.html)

1. [Macros that Compose: Systematic Macro Programming](http://okmij.org/ftp/Scheme/CPS-Macros.ps.gz)

	Kiselyov 2002

1. [Binding as Sets of Scopes--Notes on a new model of macro expansion for Racket](https://www.cs.utah.edu/plt/scope-sets/)

1. [How to write symbol? with syntax-rules](http://okmij.org/ftp/Scheme/macro-symbol-p.txt)

1. [Efficient Compilation of Tail Calls and Continuations to JavaScript](http://www.schemeworkshop.org/2012/papers/thivierge-feeley-paper-sfp12.pdf)

	Thivierge, Feeley 2012

1. [Hygienic macro](https://en.wikipedia.org/wiki/Hygienic_macro) from Wikipedia

1. [Indiana University Scheme Repository's bibliography and papers](ftp://ftp.cs.indiana.edu/pub/scheme-repository/doc/pubs/)

	The README contains the bibliography.

1. [CMU Scheme Repository's bibliogrpahies](http://www.cs.cmu.edu/afs/cs/project/ai-repository/ai/lang/scheme/doc/bib/)

	* compiler.txt -   Ozan Yigit's bibliography (ascii) of work on compilation
		techniques in Scheme. 
	* funcprog.tar -   Tony Davie's bibliography of functional programming
		in refer format. Updated 25-NOV-93.
		(tamdhu.dcs.st-andrews.ac.uk:/pub/staple/pubs.txt)
	* sbib.tar -       Ozan Yigit's definitive Scheme bibliography in
		bib, BibTeX, ASCII, and postscript form. (7-AUG-92)

1. [CMU Scheme Repository's macro/ index](http://www.cs.cmu.edu/afs/cs/project/ai-repository/ai/lang/scheme/doc/macros/0.html)

	Macros bibliographies. Contains two or three implementations of the R4RS macro proposal and proposals and implementations for macros based on syntax-case.

1. [Scheme-related tech reports and papers](http://www.cs.cmu.edu/afs/cs/project/ai-repository/ai/lang/scheme/txt/) on the CMU Scheme Repository

1. [Aubrey Jaffer's Scheme bibliography](https://people.csail.mit.edu/jaffer/Scheme.html)

1. [Collection of links about Scheme macros](https://www.reddit.com/r/scheme/comments/3chowf/collection_of_links_about_scheme_macros/) on Reddit

## Books

Just a few of the best books on Scheme programming:

1. [The Scheme Programming Language, Third Edition](https://www.scheme.com/tspl3/)

1. [The Scheme Programming Language, Fourth Edition](https://www.scheme.com/tspl4/)

1. [Structure and Interpretation of Computer Programs](https://mitpress.mit.edu/sites/default/files/sicp/index.html)

	A classic, often said to be the best programming textbook ever. The examples and
exercises are in Scheme. Often referred to simply as _SICP_. There is a series of video lectures for the book [here](https://groups.csail.mit.edu/mac/classes/6.001/abelson-sussman-lectures/).

1. [Teach Yourself Scheme in Fixnum Days](https://ds26gte.github.io/tyscheme/)

1. [How To Design Programs](https://htdp.org/)

1. [schemers.org's list](https://schemers.org/Documents/)

## Manuals

1. [Community-Scheme-Wiki's list of manuals](http://community.schemewiki.org/?category-manuals)

## Scheme Implementations

Especially portable versions and versions for a JavaScript run time environment.

1. [jsScheme](https://github.com/tomelam/jsScheme)

1. [BiwaScheme](https://www.biwascheme.org/)

	"BiwaScheme is a Scheme interpreter written in JavaScript.

	"Works with web browsers (including mobile devices) and Node.js."

1. [chibi-scheme](https://github.com/ashinn/chibi-scheme)

	"Chibi-Scheme is a very small library intended for use as an extension and scripting language in C programs. In addition to support for lightweight VM-based threads, each VM itself runs in an isolated heap allowing multiple VMs to run simultaneously in different OS threads.

	"There are no external dependencies so is relatively easy to drop into any project.

	"The default repl language contains all bindings from R7RS small, available explicitly as the (scheme small) library. The language is built in layers, however - see the manual for instructions on compiling with fewer features or requesting a smaller language on startup.

	"Chibi-Scheme is known to work on 32 and 64-bit Linux, FreeBSD, NetBSD, OpenBSD and OS X, Plan 9, Windows (using Cygwin), iOS, Android, ARM and Emscripten. Basic support for native Windows desktop also exists. See README-win32.md for details and build instructions."


1. [CPSCM Scheme](http://www.omnigia.com/scheme/cpscm/home/)

	"CPSCM is a Scheme compiler based on CPS conversion. It outputs code for two back-ends: Javascript and Common Lisp (as well as a "simple Scheme" back-end). There is an online CPSCM compiler that lets you play with the compiler right from your browser without downloading anything. Also see the bubble sort example which combines compiled Scheme and DHTML."

	CPSCM's installation instructions didn't work for me and it appears not to have
been recently maintained (not in the last 12 years).

1. [Kali Scheme](https://github.com/tonyg/kali-scheme/wiki)

	Also see [kali-scheme-revival](http://community.schemewiki.org/cgi-bin/scheme.cgi?kali-scheme-revival).

	"Kali Scheme is a distributed implementation of the Scheme that permits efficient transmission of higher-order objects such as closures and continuations. The integration of distributed communication facilities within a higher-order programming language engenders a number of new abstractions and paradigms for distributed computing. Among these are user-specified load-balancing and migration policies for threads, incrementally-linked distributed computations, and parameterized client-server applications. Kali Scheme supports concurrency and communication using first-class procedures and continuations. It integrates procedures and continuations into a message-based distributed framework that allows any Scheme object (including code vectors) to be sent and received in a message."

	Kali Scheme is included in this list of Scheme implementations because it has definitions of syntax-rules and define-syntax that could be added to BiwaScheme to give it R5RS macros.

1. [SCM](https://people.csail.mit.edu/jaffer/SCM.html)

	"SCM is a Scheme implementation conforming to Revised5 Report on the Algorithmic Language Scheme and the IEEE P1178 specification.   Scm is written in C and runs under Amiga, Atari-ST, GNU/Linux, MacOS, MS-DOS, MS-Vista, MS-Windows, OS/2, NOS/VE, Unicos, VMS, Unix and similar systems.
SCM includes Hobbit, the Scheme-to-C compiler originally written by Tanel Tammet. Hobbit generates C files whose binaries can be dynamically or statically linked with a SCM executable. SCM includes linkable modules for sequence-comparison, arrays, records, and byte-number conversions; and modules for POSIX system calls and network-sockets, readline, ncurses, and Xlib.

	"On some platforms SCM supports unexec (developed for Emacs and bash), which dumps a executable image from a running SCM. This results in very low latency (12.ms) startup for SCM.

	"SCM requires the SLIB Scheme Library. Both SCM and SLIB are GNU packages."

1. [Gambit](http://dynamo.iro.umontreal.ca/wiki/index.php/Main_Page)

	"The Gambit Scheme system is a complete, portable, efficient and reliable implementation of the Scheme programming language."

1. [Gambit in the browser](http://feeley.github.io/gambit-in-the-browser/)

	A very nice looking version of Scheme running in the browser with a REPL and simple debugging. It is mentioned on [ycombinator.com](https://news.ycombinator.com/item?id=8680589).

1. [spock](http://wiki.call-cc.org/eggref/4/spock)

	"SPOCK is a compiler and runtime system for translating most of R5RS Scheme into JavaScript. You can use it either by statically generating JavaScript files from Scheme source files or by translating s-expressions containing Scheme code on the fly. The compiler uses Henry Baker's Cheney-on-the-MTA compilation strategy.

	"This extension is still in a very early state and is likely to contain numerous bugs. There are known problems with Internet Explorer and the system has only been tested on a few browsers. Moreover, the compilation strategy used stresses JavaScript implementations in unusual ways and the results indicate that many JavaScript engines seem to have quite serious limitations regarding static function nesting and closure performance."

1. [Moritz Heidkamp's list](http://ceaude.twoticketsplease.de/js-lisps.html

	Moritz Heidkamp's comprehensive table of Scheme and Lisp implementations for JavaScript with checkboxes for whether they provide a compiler, an interpreter, interoperability, TCO (tail call optimization), continuations, macros, hygiene, and debugging.

1. [List of Schemes providing syntax-case](http://community.schemewiki.org/?syntax-case)

	Community-Scheme-Wiki's list.

1. [Community-Scheme-Wiki's list](http://community.schemewiki.org/?scheme-faq-standards#implementations)

	Lists several Scheme implementations for a JavaScript platform.

1. [Scheme Implementations Listed by the Standards They Meet](https://misc.lassi.io/2019/schemes-by-rnrs.text)

1. Other Implementations in JavaScript

	Early, mini-implementations [mentioned by Alex Yakovlev](http://web.archive.org/web/20080119020130/http://alex.ability.ru/scheme.html).

1. [Free/Shareware Scheme Implementations](https://www.cs.cmu.edu/afs/cs/project/ai-repository/ai/lang/scheme/impl/0.html) in the CMU Scheme repository

1. ["What is a fast and reliable Scheme -> JavaScript compiler?" thread on Reddit](https://www.reddit.com/r/scheme/comments/1mjm4w/what_is_a_fast_and_reliable_scheme_javascript/)

## Software

1. [The final program in the tutorial 'More: Systems Programming with Racket'](https://docs.racket-lang.org/more/step9.txt)

	A secure, multi-threaed, servlet-extensible, continuation-based web server in 153 lines of Scheme, described in the paper listed above, 'More: Systems Programming with Racket'. 

1. [Sequential Web-Application Demo](https://github.com/tomelam/jsScheme)

	A short gist demonstrating sequential programming in the web browser. Explanation of the motivation for the demo.

1. [Software for BiwaScheme](https://github.com/search?q=biwascheme)

	A search on Github.

1. Chez Scheme's [Portable implementation of the syntax-case macro system](https://github.com/cisco/ChezScheme/blob/master/s/syntax.ss)

	10,088 lines of code.

1. [Portable implementation of the syntax-case macro system](http://community.schemewiki.org/?syntax-case)

	See the [portable implementation of syntax-case in Chez Scheme](https://raw.githubusercontent.com/cisco/ChezScheme/master/s/syntax.ss).

1. [Proposals and implementations for macros in Scheme](http://www.cs.cmu.edu/afs/cs/project/ai-repository/ai/lang/scheme/doc/macros/) from the CMU Scheme Repository

1. [The Scheme Cookbook](http://community.schemewiki.org/?The-Scheme-Cookbook)

	"The Schematics Scheme Cookbook is a collaborative effort to produce time-saving documentation and recipes for using Scheme for common tasks in practical contexts, particularly in commercial environments.

	"The Cookbook aims to focus on portable Scheme solutions where possible, relying particularly on SRFIs to achieve this. Where a portable solution is impractical, the Cookbook currently focuses on the use of PLT-Scheme. The hope is that the Cookbook will be able to support other implementations in future."

	Download the book from [Github](https://github.com/schemedoc/cookbook) or from (https://misc.lassi.io/2019/schemecookbook.org.tgz).

1. The ['Where can I find scheme libraries?' section](http://community.schemewiki.org/) of Community-Scheme-Wiki's FAQ

1. [The Indiana University Scheme repository](ftp://ftp.cs.indiana.edu/pub/scheme-repository)

	Very slow to access. Mostly old. The README in the code subdirectory says:

	"This area of the repository is a collection of Scheme code meant for
   benchmarking, library/support, research, education, and fun.
   
	* Scheme code for language implementation (./lang/*).
	* Scheme library code (SLIB) (./lib/*).
	* Scheme code for pattern matching (./match/*)
	* Math-oriented Scheme code (./num/*).
	* Scheme code to implement object-oriented programming systems (./oop/*).
	* Scheme code for string handling (./string/*).
	* Scheme code to implement and manipulate many types of data
	  structures (./struct/*).
	* Scheme code for operating systems interfacing (./sys/*).
	* Miscellaneous Scheme code (./misc/*)."

	[Code from _Scheme and the Art of Programming_](ftp://ftp.cs.indiana.edu/pub/scheme-repository/doc/lit/sap/)

1. [The 'category-software' section of the Indiana University Scheme repository](http://community.schemewiki.org/?category-software)

	The portable software includes:

	* SLIB is a portable scheme library. It runs on most schemes.
	* SSAX (from the website) - This project offers tools to inter-convert between an angular-bracket and a more efficient S-expression-based notations for markup documents, and to manipulate and query xML data in Scheme.
	* SDOM - This is an implementation of the W3C DOM recommendation (Level 3) in scheme.
	* Spells is a portable library, running on several Schemes.
	* object-dump is a library for dumping (serializing) and retrieving objects to/from ports.
	* Sparks is an object database for Scheme, using prometheus as object system.
	* Conjure is a build tool in the spirit of the well known Make program
	* SchemeDS - An executable implementation of the Denotational Semantics for Scheme
	* simpler-macros - A portable macro and module system for Scheme in Scheme
	* common-scheme - A system that allows you to write portable code that will run on many implementations.
	* mod_lisp - An Apache module that uses an extremely simple protocol over a socket to communicate with your separately running process. There is a implementation of the bare-bones protocol for R5RS Scheme.
	* magic - Magic is a simple web application framework.
	* Schelog is an embedding of Prolog-style logic programming in Scheme.
	* text-template - a text template library for Scheme
	* Askemos - Use Scheme and SQLite in byzantine replication with Erlang style communication.

	There is also software for specific dialects of Scheme, for object oriented systems, and for compiler construction.

1. [The 'sicp-solutions' section of the Indiana University Scheme repository](http://community.schemewiki.org/?sicp-solutions)

	Just the solutions to the problems given at the ends of the chapters in the classic textbook _The Structure and Interpretation of Computer Programs_.

1. [The 'category-code' section of the Indiana University Scheme repository](http://community.schemewiki.org/?category-code)

	Code snippets in Scheme.

1. [CMU Scheme Repository](http://www-cgi.cs.cmu.edu/afs/cs/project/ai-repository/ai/lang/scheme/)

	Part of the CMU Artificial Intelligence Repository.

	* bookcode/  Machine readable parts of various Scheme booka:
		aibook (_Programming for Artificial Intelligence:
		Methods, Tools and Applications_),
		eopl (_Essentials of Programming Languages_), queinnec
		(_Les Langages Lisp_), sap (_Scheme and the Art of Programming_),
		sicp (_Structure and the Interpretation of Computer Programs_),
		ssics (_Simply Scheme_)
	* code/      Scheme code for benchmarking, research, 
		education, and fun
	* doc/       Documentation, including standards and proposals
	* edu/       Educational Materials for Teaching/Learning 
		Scheme
	* faq/       Scheme FAQ: Frequently Asked Questions (FAQ) 
		posting for comp.lang.scheme newsgroup
	* gui/       Graphical User Interfaces (GUI) for Scheme and 
		other graphics code.
	* impl/      Free/Shareware Scheme implementations
	* mail/      Archives of the Scheme mailing list.
	* oop/       OOP: Code related to object-oriented programming.
	* scheme/    Archives for the comp.lang.scheme newsgroup
	* txt/       Online Scheme-related tech reports and papers.
	* util/      Utilities for programming in Scheme.

1. [CMU Scheme Repository code](http://www.cs.cmu.edu/afs/cs/project/ai-repository/ai/lang/scheme/code/)

	SLIB (the Standard Scheme Library), the code from Sigplan on
	building abstract iterators using continuations, an interpreter for
	the language LOOP, a SKI compiler, an AVL tree implementation (without
	delete), and implementation of gensym, quicksort, read-line, various
	useful string functions, and a library of Common Lisp functions for Scheme.

1. [Scheme documentation](http://www.cs.cmu.edu/afs/cs/project/ai-repository/ai/lang/scheme/doc/),
including standards and proposals

	* bib/       Bibliographies related to Scheme.
	* intro/     Introductions, tutorials, and quick reference 
        	guides for Scheme.
	* macros/    Proposals and implementations for macros in 
        	Scheme.
	* notes/     Summaries and interesting notes about 
        	Scheme-related stuff.
	* standard/  Scheme standards documents and test suites

1. [lassi.io's miscellaneous collection](https://lassi.io/2019/)

1. [The 'ninety-nine-scheme-problems' section of the Indiana University Scheme repository](http://community.schemewiki.org/?ninety-nine-scheme-problems)

	Such problems as "Insert an element at a given position into a list" and "Calculate Euler's totient function phi(m)".

1. [Scheme code for _Scheme and the Art of Programming_](https://github.com/sl424/scheme-programming)

1. [Solutions of problems in _Scheme and the Art of Programming_](https://github.com/AmeerFazal/Scheme-and-The-Art-of-Programming)

## Conformance and Benchmark Testing

1. [Scheme faq](http://community.schemewiki.org/?scheme-faq-standards)

1. [Scheme r5rs conformance test suite (question on comp.lang.scheme)](https://comp.lang.scheme.narkive.com/cPDByGyC/scheme-r5rs-conformance-test-suite)

1. [r5rs_pitfalls.scm](http://sisc-scheme.org/r5rs_pitfall.scm)

1. [R5RS Pitfalls Test Results](http://sisc-scheme.org/r5rs_pitfall.php)

1. [CPSCM Scheme - R5RS conformance](http://www.omnigia.com/scheme/cpscm/conformance/)

1. [Benchmarks](https://people.csail.mit.edu/jaffer/CNS/benchmarks)

1. [r4rstest.scm](http://cvs.savannah.gnu.org/viewvc/*checkout*/scm/scm/r4rstest.scm)

1. [r7rs-wg1-infra](https://bitbucket.org/cowan/r7rs-wg1-infra/src/default/)

1. [A stress test of the syntax-rule macro-expander](http://okmij.org/ftp/Scheme/macros.html#syntax-rule-stress-test)

## Online Scheme Communities

1. [R7RS Scheme proposals and ballots homepage](https://bitbucket.org/cowan/r7rs-wg1-infra/src/default/R7RSHomePage.md)

	[r7rs.org](http://r7rs.org) redirects here.

1. [schemers.org](https://schemers.org/)

	* FAQ
	* textbooks
	* videos
	* blogs
	* standards
	* tutorials
	* bibliography
	* other documents
	* education

1. [Community-Scheme-Wiki](http://community.schemewiki.org/)

1. [Scheme at MIT](http://groups.csail.mit.edu/mac/projects/scheme/)

1. [The comp.lang.scheme newsgroup](https://groups.google.com/forum/#!forum/comp.lang.scheme)

1. [Planet Scheme](http://www.scheme.dk/planet/)

1. [reddit.com/r/scheme/](https://www.reddit.com/r/scheme/)

1. [#scheme channel on IRC](http://community.schemewiki.org/?%23scheme-on-freenode)

1. [Scheme Chat Rooms on IRC](https://netsplit.de/channels/?chat=scheme)

1. [Scheme Digest mailing list](http://www.cs.cmu.edu/afs/cs/project/ai-repository/ai/lang/scheme/mail/)

	Only old archives are here.

1. [Scheme news](http://www.cs.cmu.edu/afs/cs/project/ai-repository/ai/lang/scheme/news/)

	Only old archives are here.
