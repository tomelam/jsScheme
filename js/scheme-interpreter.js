// Scheme interpreter written in JavaScript.

// Scheme interpreter

var trace = false;

function clone(x) {
    var i, r = new x.constructor;
    for(i in x) {
	if( x[i] != x.constructor.prototype[i] )
	    r[i] = x[i];
    }
    return r;
}

//
// Classes...
//

// Pair - List construction block

function Pair( car, cdr ) {
    this.car = car;
    this.cdr = cdr;
}

function isNil(x) {
    return x == theNil || x == null || ( (x instanceof Pair) &&
					 x.car == null && x.cdr == null );
}

function Nil() { }
var theNil = new Nil();

Nil.prototype.Str = function() { return '()'; }
Nil.prototype.Html = dumbHtml;
Nil.prototype.ListCopy = function() { return this; }

// Char class constructor - since we don't have Char type in JS
// 2Do: Chat = String with .isChar=true ??

function Char(c) {
    Chars[ this.value = c ] = this;
}

// Symbol class constructor - to distinguish it from String

function Symbol(s) {
    Symbols[ this.name = s ] = this;
}

var Symbols = new Object();
var Chars = new Object();

function getSymbol(name,leaveCase) {
    if( ! leaveCase ) name = name.toLowerCase(); // case-insensitive symbols!
    if( Symbols[name] != undefined ) {
	return Symbols[name];
    }
    return new Symbol(name);
}

function getChar(c) {
    if( Chars[c] != undefined ) {
	return Chars[c];
    }
    return new Char(c);
}

//
// Parser
//

// Tokenizer

function tokenize(txt) {
    var tokens = new Array(), oldTxt=null;
    while( txt != "" && oldTxt != txt ) {
	oldTxt = txt;
	txt = txt.replace( /^\s*(;[^\r\n]*(\r|\n|$)|#\\[^\w]|#?(\(|\[|{)|\)|\]|}|\'|`|,@|,|\"(\\(.|$)|[^\"\\])*(\"|$)|[^\s()\[\]{}]+)/,
			   function($0,$1) {
			       if( $1.charAt(0) != ';' ) {
				   tokens[tokens.length]=$1;
			       }
			       return "";
			   } );
    }
    return tokens;
}

// Parser class constructor

function Parser(txt) {
    this.tokens = tokenize(txt);
    this.i = 0;
}

// get list items until ')'

Parser.prototype.getList = function( close ) {
    var list = theNil, prev = list;
    while( this.i < this.tokens.length ) {
	if( this.tokens[ this.i ] == ')' ||
            this.tokens[ this.i ] == ']' ||
            this.tokens[ this.i ] == '}' ) {
	    this.i++; break;
	}

	if( this.tokens[ this.i ] == '.' ) {
	    this.i++;
	    var o = this.getObject();
	    if( o != null && list != theNil ) {
		prev.cdr = o;
	    }
	} else {
	    var cur = new Pair( this.getObject(), theNil );
	    if( list == theNil ) list = cur;
	    else prev.cdr = cur;
	    prev = cur;
	}
    }
    return list;
}

Parser.prototype.getVector = function( close ) {
    var arr = new Array();
    while( this.i < this.tokens.length ) {
	if( this.tokens[ this.i ] == ')' ||
            this.tokens[ this.i ] == ']' ||
            this.tokens[ this.i ] == '}' ) { this.i++; break; }
	arr[ arr.length ] = this.getObject();
    }
    return arr;
}

// get object

Parser.prototype.getObject = function() {
    if( this.i >= this.tokens.length ) return null;
    var t = this.tokens[ this.i++ ];

    // if( t == ')' ) return null;

    var s = t == "'" ? 'quote' :
        t == "`" ? 'quasiquote' :
        t == "," ? 'unquote' :
        t == ",@" ? 'unquote-splicing' : false;
    if( s || t == '(' || t == '#(' ||
        t == '[' || t == '#[' ||
        t == '{' || t == '#{' ) {
	return s ?
	    new Pair( getSymbol(s),
		      new Pair( this.getObject(),
				theNil ))
            : (t=='(' || t=='[' || t=='{') ?
	        this.getList(t)
	        : this.getVector(t);
    } else {

	var n;
	if( /^#x[0-9a-z]+$/i.test(t) ) {  // #x... Hex
	    n = new Number('0x'+t.substring(2,t.length) );
	} else if( /^#d[0-9\.]+$/i.test(t) ) {  // #d... Decimal
	    n = new Number( t.substring(2,t.length) );
	} else n = new Number(t);  // use constrictor as parser

	if( ! isNaN(n) ) {
	    return n.valueOf();
	} else if( t == '#f' || t == '#F' ) {
	    return false;
	} else if( t == '#t' || t == '#T' ) {
	    return true;
	} else if( t.toLowerCase() == '#\\newline' ) {
	    return getChar('\n');
	} else if( t.toLowerCase() == '#\\space' ) {
	    return getChar(' ');
	} else if( /^#\\.$/.test(t) ) {
	    return getChar( t.charAt(2) );
	} else if( /^\"(\\(.|$)|[^\"\\])*\"?$/.test(t) ) {
	    return t.replace( /^\"|\\(.|$)|\"$/g, function($0,$1) {
		return $1 ? $1 : '';
            } );
	} else return getSymbol(t);  // 2Do: validate !!
    }
}

//
// Printers
//

Boolean.prototype.Str = function () {
    return this.valueOf() ? '#t' : '#f';
}

Char.prototype.Str = function () {
    if( this.value == ' ' ) return '#\\space';
    if( this.value == '\n' ) return '#\\newline';
    return '#\\'+this.value;
}

Number.prototype.Str = function () {
    return this.toString();
}

Pair.prototype.Str = function () {
    var s = '';
    for( var o = this;
	 o != null && o instanceof Pair && (o.car != null || o.cdr != null);
	 o = o.cdr ) {
	if( o.car != null ) {
	    if(s) s += ' ';
	    s += Str(o.car);
	}
    }
    if( o != theNil && o != null && !( o instanceof Pair ) )
	s += ' . ' + Str(o);
    return '('+s+')';
}

String.prototype.Str = function () {
    return '"'+this.replace(/\\|\"/g,function($0){return'\\'+$0;})+'"';
}

Symbol.prototype.Str = function () {
    return this.name;
}

Function.prototype.Str = function () {
    return '#primitive' + (trace ? '<'+this+'>' : '');
}

function Str(obj) {
    if( obj == null ) return "#null";
    if( obj.Str ) return obj.Str();
    var c = obj.constructor, r;
    if( c ) {
	if( r = /^\s*function\s+(\w+)\(/.exec(c) ) c = r[1];
	return '#obj<'+c+'>';
    }
    return '#<'+obj+'>';
}

function Html(obj) {
    if( obj == null ) return "#null";
    if( obj.Html ) return obj.Html();
    return escapeHTML( '#obj<'+obj+'>' );
}

Array.prototype.Str = function () {
    var s='',i;
    for( i=0; i<this.length; i++ ) {
	if( s != '' ) s += ' ';
	s += Str( this[i] );
    }
    return '#('+s+')';
}

Continuation.prototype.Str = function () {
    return "#continuation";
}

// HTML output

function escapeHTML(s) {
    return s.replace( /(&)|(<)|(>)/g,
		      function($0,$1,$2,$3) {
			  return $1 ? '&amp;' : $2 ? '&lt;' : '&gt;';
		      } );
}

function dumbHtml() {
    return escapeHTML( this.Str() );
}

function pairHtml() {
    var s1='',s2='', i, cells = new Array(), allSimple=true, firstSymbol=false;
    for( var o = this; o instanceof Pair && !isNil(o); o = o.cdr ) {
	if( o.car != null ) {
	    if( cells.length == 0 )
		firstSymbol = o.car instanceof Symbol && o.car != theBegin;
	    allSimple = allSimple && !(o.car instanceof Pair) &&
                !(o.car instanceof Array);
	    cells[cells.length] = Html(o.car);
	}
    }
    if( o != theNil && o != null && !( o instanceof Pair ) ) {
	cells[cells.length] = '.';
	allSimple = allSimple && !(o instanceof Array);
	cells[cells.length] = Html(o);
	if( firstSymbol && cells.length == 3 ) allSimple = true;
    }

    var rowSpan = allSimple ? 1 : firstSymbol ? cells.length-1 : cells.length;
    rowSpan = rowSpan>1 ? ' rowSpan='+rowSpan : '';

    var edit = ''; // " onClick=editCell()"
    for( i=0; i<cells.length; i++ ) {
	if( allSimple || i<1 || (i<2 && firstSymbol) ) {
	    s1 += "<td"+(cells[i]=='.'?'':edit)
		+ (i==0&&firstSymbol ? ' valign=top'+rowSpan : '')
		+ ">" + cells[i] + "<\/td>";
	} else {
	    s2 += "<tr><td"+(cells[i]=='.'?'':edit)
		+ ">" + cells[i] + "<\/td><\/tr>";
	}
    }

    return '<table border=0 cellspacing=1 cellpadding=4>'
	+ '<tr><td valign=top'+rowSpan+'>(<\/td>'
	+ s1 + '<td valign=bottom'+rowSpan+'>)<\/td><\/tr>' + s2 + '<\/table>';
    //  onClick=hv(this)
}

Boolean.prototype.Html = dumbHtml;
Char.prototype.Html = dumbHtml;
Number.prototype.Html = dumbHtml;
Pair.prototype.Html = pairHtml;
String.prototype.Html = dumbHtml;
Symbol.prototype.Html = dumbHtml;
Function.prototype.Html = dumbHtml;
Array.prototype.Html = dumbHtml;
Continuation.prototype.Html = dumbHtml;

//
// Environment
//

function Env(parent) {
    this.parentEnv = parent;
}

Env.prototype.get = function(name) {
    var v = this[name]; if( v != undefined ) return v;
    for( var o = this.parentEnv; o; o = o.parentEnv ) {
	v = o[name]; if( v != undefined ) return v;
    }
    // if( typeof(v) == 'undefined' ) {
    //   if( this.parentEnv ) return this.parentEnv.get(name); else
    throw new Ex("unbound symbol "+name);
    // } else return v;
}

Env.prototype.set = function( name, value ) {
    for( var o=this; o; o=o.parentEnv )
	if( o[name] != undefined ) return o[name]=value;
    // if( typeof(this[name]) == 'undefined' ) {
    //   if( this.parentEnv ) this.parentEnv.set(name,value); else
    throw new Ex("cannot set! unbound symbol "+name);
    // } else this[name] = value;
}

Env.prototype.Str = function() {
    var s = '',i;
    for( i in this ) {
	if( ! Env.prototype[i] && this[i]!=TopEnv ) {
	    if( s != '' ) s += ',';
	    var v = this[i];
	    s += i + '=' + ( v instanceof Lambda ? '#lambda' :
			     typeof(v) == 'function' ? '#js' :
			     v ? v.Str() : v );
	}
    }
    return '['+s+']';
}

Env.prototype.With =
    function(a,v) { this[a]=v; this.Private=true; return this; }

// Top Environment

var TopEnv = new Env();

//

function Lambda(args,body,env,compiled) {
    this.args = args;
    this.body = body;
    this.env = env;
    this.compiled = compiled;
}

Lambda.prototype.clone = function(e) {
    if( this.env.Private ) {
	e = new Env(e);
	var i; for( i in this.env ) if(e[i]==undefined) e[i]=this.env[i];
    }

    return new Lambda( this.args, this.body, e, this.compiled);
}

Lambda.prototype.Html = dumbHtml;

Lambda.prototype.Str = function() {
    return "#lambda" + (trace ? "<"+this.args.Str()
			+ ',' + this.body.Str()
			// + ( trace ? ',' + this.env.Str() : '' )
			+ ">" : '');
}

//
// Evaluator - new state engine (for tail/rec and call/cc)
//

function State(obj,env,cc) {
    this.obj = obj;
    this.env = env;
    this.cc = cc;
}

function stateEval(noTrace) {
    if( this.obj == null ) this.ready = true;
    if( ! this.ready ) {
	if( trace && !noTrace ) printLog( "eval: " + this.obj.Str() );
	this.ready = false;
	this.obj.Eval(this);
    }
    return this.ready;
}

function stateContinue() {
    this.cc.cont(this);
}

State.prototype.Eval = stateEval;
State.prototype.cont = stateContinue;

function Ex(s) { this.s = s; }
Ex.prototype.Str = function(){ return "#error<"+this.s+">"; }
Ex.prototype.Html = dumbHtml;

getSymbol('(').Eval = getSymbol(')').Eval = function() {
    throw new Ex('unbalanced bracket '+this.name);
}

var topCC = new Continuation(null,null,null,function(state){throw state;});

function doEval( obj, noTrans ) {
    try {
	if( obj instanceof Symbol && obj.Eval == Symbol.prototype.Eval )
	    return TopEnv.get(obj.name);

	if( ! noTrans ) {
	    try {
		var xformer = TopEnv.get('transform');
		if( xformer instanceof Lambda || xformer instanceof Function )
		{
		    var o = doEval(
			new Pair( xformer,
				  new Pair( new Pair( theQuote,
						      new Pair( obj,
								theNil )),
							theNil)), true );
		    if( trace ) printLog( 'transformed: '+Str(o) );
		    if( ! (o instanceof Ex) ) obj = o;
		}
	    } catch( ex ) { }
	}

	var state = new State( obj, TopEnv, topCC );
	while( true ) {

	    // Both state.Eval() and state.cont()
	    // returns True if value was calculated
	    // or False if continuation

	    if( state.Eval(noTrans) ) {
		state.ready = false;
		state.cont();
	    }
	}
    } catch(e) {
	if( e instanceof Ex )
	    return e;
	else if( e instanceof State )
	    return e.obj;
	else
	    return new Ex(e.description); // throw e;
    }
}

function evalTrue(state) {
    state.ready = true;
}

function evalVar(state) {
    state.obj = state.env.get(this.name);
    state.ready = true;
}

// ?? Continuation

function Continuation(obj,env,cc,f) {
    this.i = 0; // for List-cont
    this.obj = obj;
    this.env = env;
    this.cc = cc;
    this.cont = f;
}

Continuation.prototype.clone = function() {
    var r = clone( this );
    if( this.cc ) r.cc = this.cc.clone();
    return r;
}

function continuePair(state) {
    this[this.i++] = state.obj;
    if( isNil(this.obj) ) {
	// apply: 1. create arg list
	var args = theNil, prev = args;
	for( var i = 1; i < this.i; i++ ) {
	    var cur = new Pair( this[i], theNil );
	    if( args == theNil ) args = cur; else prev.cdr = cur;
	    prev = cur;
	}
	// 2. call f()
	state.env = this.env;
	state.cc = this.cc;
	state.obj = callF( this[0], args, state );
    } else {
	state.obj = this.obj.car;
	state.env = this.env;
	state.cc = this;
	this.obj = this.obj.cdr;   // 2Do: (a.b) list!!
	state.ready = false;
    }
}

Pair.prototype.ListCopy = function() {
    var o,p,r = new Pair(this.car);
    for( o = this.cdr, p=r;
	 o instanceof Pair;
	 p=p.cdr=new Pair(o.car), o=o.cdr );
    p.cdr = o; return r;
}

function callF( f, args, state ) {

    Again: while(true) {

	if( typeof( f ) == 'function' ) {
	    state.ready = true;
	    return f(args,state);

	} else if( f instanceof Lambda ) {

	    if( f.compiled != false && document.getElementById('jit').checked )
	    {
		try {
		    state.ready = true;
		    return Apply(f,args.ListCopy() );
		} catch( e ) {
		    if( e instanceof State ) {
			args = e.obj; f = e.cc;
			continue Again;
		    }
		    if(e!=theCannot) {
			printLog(e instanceof Error?e.description:Str(e));
		    }
		}
	    }

	    // map arguments to new env variables
	    state.env = new Env(f.env);

	    for( var vars = f.args, vals = args;
		 (vars instanceof Pair) && !isNil(vars);
		 vars = vars.cdr, vals = vals.cdr ) {
		if( vars.car instanceof Symbol ) {
		    state.env[ vars.car.name ] = vals.car;
		} else throw new Ex("lambda arg is not symbol");
	    }
	    if( vars instanceof Symbol ) {
		state.env[ vars.name ] = vals;
	    } else if( ! isNil(vars) ) {
		throw new Ex("lambda args are not symbols");
	    }

	    state.ready = false;
	    return f.body;

	} else if( f instanceof Continuation ) {
	    state.ready = true;
	    state.cc = f.clone();
	    // continue - multiple values case...
	    if( state.cc.cont == continuePair ) {
		while( !isNil(args.cdr) ) {
		    state.cc[state.cc.i++] = args.car;
		    args = args.cdr;
		}
	    }
	    // if( state.cc == topCC ) { }
	    return args.car;

	} else {
	    throw new Ex("call to non-function " + ( f && f.Str ? f.Str() : f)
			 + (trace ? " with "+args.Str() : ''));
	}
    }}

function continueDefine(state) {
    state.env = this.env;
    state.cc = this.cc;
    if( this.define ) {
	state.env[this.obj.name] = state.obj;
    } else {
	state.env.set( this.obj.name, state.obj );
    }
    state.ready = true;
}

function continueBegin(state) {
    state.obj = this.obj.car;
    state.env = this.env;
    state.ready = false;
    if( isNil(this.obj.cdr) ) {
	state.cc = this.cc;
    } else {
	this.obj = this.obj.cdr;
	state.cc = this;
    }
}

function continueIf(state) {
    state.obj = state.obj ? this.obj.car : this.obj.cdr.car;
    state.env = this.env;
    state.cc = this.cc;
    state.ready = false;
}

function continueSyntax(state) {
    state.env = this.env;
    state.cc = this.cc;
    state.ready = false;
    if( trace ) printLog('rewrite: '+state.obj.Str());
}

function evalPair(state) {

    if( isNil(this) ) throw new Ex('Scheme is not Lisp, cannot eval ()');

    var f = (this.car instanceof Symbol) ? state.env.get(this.car.name) : null;

    // lambda, (define (f ...) ...)

    if( f == theLambda || (f == theDefine && (this.cdr.car instanceof Pair)) )
    {

	// get function arguments and body

	var args, body;
	if( f == theLambda ) {
	    args = this.cdr.car;
	    body = this.cdr.cdr;
	} else {  // define
	    args = this.cdr.car.cdr;
	    body = this.cdr.cdr;
	}

	// create function object

	state.obj = new Lambda( args,
				isNil(body.cdr) ? body.car :
				new Pair( getSymbol("begin"), body ),
				state.env );

	// define

	if( f == theDefine ) {
	    state.env[ this.cdr.car.car.name ] = state.obj;
	}

	// OK, don't need to evaluate it any more

	state.ready = true;

	// define, set!

    } else if( f == theDefine || f == theSet )
    {

	state.obj = this.cdr.cdr.car;
	state.cc = new Continuation(
	    this.cdr.car, state.env, state.cc, continueDefine );
	state.cc.define = f == theDefine;
	state.ready = false; // evaluate expression first

	// begin

    } else if( f == theBegin ) {

	state.obj = this.cdr.car;
	// if( state.env != TopEnv )
	//   state.env = new Env(state.env);  // 2Do: that is wrong!!
	if( ! isNil(this.cdr.cdr) ) {
	    state.cc = new Continuation(
		this.cdr.cdr, state.env, state.cc, continueBegin );
	}
	state.ready = false;

	// quote

    } else if( f == theQuote ) {
	state.obj = this.cdr.car;
	state.ready = true;

	// if

    } else if( f == theIf ) {
	state.obj = this.cdr.car;
	state.cc = new Continuation(
	    this.cdr.cdr, state.env, state.cc, continueIf );
	state.ready = false;

	// define-syntax

    } else if( f == theDefineSyntax ) {

	state.env[ (state.obj = this.cdr.car).name ] = new Syntax(
	    state.env.get(this.cdr.cdr.car.car.name), this.cdr.cdr.car.cdr );
	state.ready = true;

	// Syntax...

    } else if( f instanceof Syntax ) {

	state.cc = new Continuation(
	    null, state.env, state.cc, continueSyntax );
	state.obj = callF( f.transformer, new Pair(state.obj, f.args), state );

	// (...)

    } else {
	state.obj = this.car;
	state.cc = new Continuation(
	    this.cdr, state.env, state.cc, continuePair );
	state.ready = false;
    }
}

Nil.prototype.Eval = evalTrue;
Boolean.prototype.Eval = evalTrue;
Char.prototype.Eval = evalTrue;
Number.prototype.Eval = evalTrue;
Pair.prototype.Eval = evalPair;
String.prototype.Eval = evalTrue;
Symbol.prototype.Eval = evalVar;
Lambda.prototype.Eval = evalTrue;
Array.prototype.Eval = evalTrue;
Continuation.prototype.Eval = evalTrue;
Ex.prototype.Eval = evalTrue;
Function.prototype.Eval = evalTrue; // 2Do: throw Ex??

//
// Syntax transformers...
//

function Syntax( transformer, args ) {
    this.transformer = transformer;
    this.args = args;
}

Syntax.prototype.Eval = evalTrue;
Syntax.prototype.Html = dumbHtml;
Syntax.prototype.Str = function() { return '#syntax'; }

// syntax keywords

TopEnv['begin'] = theBegin = getSymbol('begin');
TopEnv['quote'] = theQuote = getSymbol('quote');
TopEnv['if'] = theIf = getSymbol('if');
TopEnv['define'] = theDefine = getSymbol('define');
TopEnv['set!'] = theSet = getSymbol('set!');
TopEnv['lambda'] = theLambda = getSymbol('lambda');
TopEnv['define-syntax'] = theDefineSyntax = getSymbol('define-syntax');
TopEnv['unquote'] = getSymbol('unquote');
TopEnv['unquote-splicing'] = getSymbol('unquote-splicing');

//
// Built-in functions
//

TopEnv['+'] = function(list) {
    var result = 0;
    while( list instanceof Pair ) {
	if( typeof(list.car)=='number' ) result += list.car;
	list = list.cdr;
    }
    return result;
}

TopEnv['*'] = function(list) {
    var result = 1;
    while( ! isNil(list) ) {
	result *= list.car.valueOf();
	list = list.cdr;
    }
    return result;
}

TopEnv['-'] = function(list) {
    var result = 0, count = 0;
    while( ! isNil(list) ) {
	var o = list.car.valueOf();
	result += (count++ > 0 ? -o : o);
	list = list.cdr;
    }
    return count > 1 ? result : -result;
}

TopEnv['/'] = function(list) {
    var result = 1, count = 0;
    while( ! isNil(list) ) {
	var o = list.car.valueOf();
	result *= (count++ > 0 ? 1/o : o);
	list = list.cdr;
    }
    return count > 1 ? result : 1/result;
}

TopEnv['string-append'] = function(list) {
    var result = '';
    while( ! isNil(list) ) {
	result += list.car;
	list = list.cdr;
    }
    return result;
}

TopEnv['string'] = function(list) {
    var result = '';
    while( ! isNil(list) ) {
	result += list.car.value;
	list = list.cdr;
    }
    return result;
}

TopEnv['vector'] = function(list) {
    var result = new Array();
    while( ! isNil(list) ) {
	result[result.length] = list.car;
	list = list.cdr;
    }
    return result;
}

TopEnv['string->list'] = function(list) {
    var i, result = theNil;
    for( i = list.car.length-1; i >= 0; --i ) {
	result = new Pair( getChar(list.car.charAt(i)), result );
    }
    return result;
}

// fixed arguments

TopEnv['car'] = function(list) { return list.car.car; }
TopEnv['cdr'] = function(list) { return list.car.cdr; }
TopEnv['cons'] = function(list) { return new Pair(list.car,list.cdr.car); }

TopEnv['eval'] = function(list) { return doEval(list.car); }
TopEnv['string->symbol'] = function(list) { return getSymbol(list.car,true); }
TopEnv['symbol->string'] = function(list) { return list.car.name; }

TopEnv['encode'] = function(list) { return encodeURIComponent(list.car); }

function truncate(x) {
    return x > 0 ? Math.floor(x) : Math.ceil(x);
}

TopEnv['ceiling'] = function(list) { return Math.ceil(list.car); }
TopEnv['floor'] = function(list) { return Math.floor(list.car); }
TopEnv['truncate'] = function(list) { return truncate(list.car); }
TopEnv['sqrt'] = function(list) { return Math.sqrt(list.car); }
TopEnv['exp'] = function(list) { return Math.exp(list.car); }
TopEnv['expt'] = function(list) { return Math.pow(list.car,list.cdr.car); }
TopEnv['log'] = function(list) { return Math.log(list.car); }
TopEnv['sin'] = function(list) { return Math.sin(list.car); }
TopEnv['cos'] = function(list) { return Math.cos(list.car); }
TopEnv['asin'] = function(list) { return Math.asin(list.car); }
TopEnv['acos'] = function(list) { return Math.acos(list.car); }
TopEnv['tan'] = function(list) { return Math.tan(list.car); }

TopEnv['atan'] = function(list) {
    return isNil(list.cdr) ? Math.atan(list.car)
        : Math.atan2(list.car,list.cdr.car);
}

TopEnv['integer?'] = function(list) { return list.car == Math.round(list.car); }
TopEnv['quotient'] = function(list) { return truncate(list.car / list.cdr.car); }
TopEnv['remainder'] = function(list) { return list.car % list.cdr.car; }
TopEnv['modulo'] = function(list) {
    var v = list.car % list.cdr.car;
    if( v && (list.car < 0) != (list.cdr.car < 0) ) v += list.cdr.car;
    return v;
}
TopEnv['round'] = function(list) { return Math.round(list.car); }

TopEnv['apply'] = function(list,state) {
    var f = list.car, cur;
    for( cur = list; !isNil(cur.cdr.cdr); cur = cur.cdr );
    cur.cdr = cur.cdr.car;
    return callF( list.car, list.cdr, state );
}

TopEnv['clone'] = function(list,state) {
    return list.car.clone(state.env);
}

function isEq(a,b) { return a==b || isNil(a)&&isNil(b); }

TopEnv['string=?'] =
    TopEnv['char=?'] =
    TopEnv['eqv?'] =
    TopEnv['='] =
    TopEnv['eq?'] = function(list) { return isEq(list.car,list.cdr.car); }

TopEnv['substring'] = function(list) {
    return list.car.substring( list.cdr.car, list.cdr.cdr.car );
}

TopEnv['string>?'] =
    TopEnv['>'] = function(list) { return list.car > list.cdr.car; }
TopEnv['string<?'] =
    TopEnv['<'] = function(list) { return list.car < list.cdr.car; }
TopEnv['string>=?'] =
    TopEnv['>='] = function(list) { return list.car >= list.cdr.car; }
TopEnv['string<=?'] =
    TopEnv['<='] = function(list) { return list.car <= list.cdr.car; }

TopEnv['char>?'] = function(list) { return list.car.value > list.cdr.car.value; }
TopEnv['char<?'] = function(list) { return list.car.value < list.cdr.car.value; }
TopEnv['char>=?'] = function(list) { return list.car.value >= list.cdr.car.value; }
TopEnv['char<=?'] = function(list) { return list.car.value <= list.cdr.car.value; }

TopEnv['char-downcase'] = function(list) { return getChar(list.car.value.toLowerCase()); }
TopEnv['char-upcase'] = function(list) { return getChar(list.car.value.toUpperCase()); }
TopEnv['string-downcase'] = function(list) { return list.car.toLowerCase(); }
TopEnv['string-upcase'] = function(list) { return list.car.toUpperCase(); }

TopEnv['char->integer'] = function(list) { return list.car.value.charCodeAt(0); }
TopEnv['integer->char'] = function(list) {
    return getChar( String.fromCharCode(list.car) );
}

TopEnv['make-string'] = function(list) {
    var s = '', i;
    for( i = 0; i < list.car; i++ ) {
	s += list.cdr.car.value;
    }
    return s;
}
TopEnv['rnd'] = function(list) { return Math.random(); }
TopEnv['string->number'] = function(list) {
    return list.cdr.car ? parseInt(list.car,list.cdr.car) : parseFloat(list.car);
}
TopEnv['number->string'] = function(list) {
    return list.cdr.car ? list.car.toString(list.cdr.car) : ''+list.car;
}

TopEnv['set-car!'] = function(list) { list.car.car = list.cdr.car; return list.car; }
TopEnv['set-cdr!'] = function(list) { list.car.cdr = list.cdr.car; return list.car; }

TopEnv['vector-length'] =
    TopEnv['string-length'] = function(list) { return list.car.length; }

TopEnv['string-ref'] = function(list) {
    return getChar(list.car.charAt(list.cdr.car));
}
TopEnv['get-prop'] =
    TopEnv['vector-ref'] = function(list) { return list.car[list.cdr.car]; }
TopEnv['set-prop!'] =
    TopEnv['vector-set!'] = function(list) { list.car[list.cdr.car] = list.cdr.cdr.car; }
TopEnv['make-vector'] = function(list) { var v = new Array(), i;
					 for( i=0; i<list.car; i++ ) v[i]=list.cdr.car; return v;
				       }

TopEnv['str'] = function(list) { return Str(list.car); }
TopEnv['html'] = function(list) { return Html(list.car); }

/* (alert "a message") */
TopEnv['alert'] = function(list) {
    alert(list.car);
}

/* (ajax-get url function) */
TopEnv['ajax-get'] = function(list) {
    $.get(list.car, function (xml) {
	doEval (new Pair(list.cdr.car, new Pair(new Pair(theQuote, new
							 Pair(xml,theNil)), theNil)), true)
    })
}

/* (set-timeout! handler timeout) */
TopEnv['set-timeout!'] = function(list) {
    setTimeout(function () {
	doEval (new Pair(list.car, theNil), true);
    }, list.cdr.car)
}

/* (set-handler! object name handler) */
TopEnv['set-handler!'] = function(list) {
    list.car[list.cdr.car] = function() {
	doEval( new Pair( list.cdr.cdr.car,
			  new Pair( new Pair( theQuote,
					      new Pair( this, theNil )), theNil)), true);
    }
}
/* (remove-handler! object name) */
TopEnv['remove-handler!'] = function(list) {
    list.car[list.cdr.car] = null;
}
TopEnv['list-props'] = function(list) {
    var r = theNil, i;
    for( i in list.car ) r = new Pair(i,r);
    return r;
}
TopEnv['parse'] = function(list) {
    var r = theNil, c = r, p = new Parser(list.car), o;
    while( (o = p.getObject()) != null ) {
	o = new Pair(o, theNil );
	if( r == theNil ) r = o; else c.cdr = o;
	c = o;
    }
    return r;
}
TopEnv['type-of'] = function(list) { return objType(list.car); }
TopEnv['js-call'] = function(list) {
    if( isNil( list.cdr ) ) {
	return list.car();
    } else if( isNil( list.cdr.cdr ) ) {
	return list.car( list.cdr.car );
    } else if( isNil( list.cdr.cdr.cdr ) ) {
	return list.car( list.cdr.car, list.cdr.cdr.car );
    } else {
	return list.car( list.cdr.car, list.cdr.cdr.car, list.cdr.cdr.cdr.car );
    }
}
TopEnv['js-invoke'] = function(list) {
    if( isNil( list.cdr.cdr ) ) {
	return list.car[list.cdr.car]();
    } else if( isNil( list.cdr.cdr.cdr ) ) {
	return list.car[list.cdr.car]( list.cdr.cdr.car );
    } else if( isNil( list.cdr.cdr.cdr.cdr ) ) {
	return list.car[list.cdr.car]( list.cdr.cdr.car, list.cdr.cdr.cdr.car );
    } else {
	return list.car[list.cdr.car]( list.cdr.cdr.car, list.cdr.cdr.cdr.car, list.cdr.cdr.cdr.cdr.car );
    }
}

function isPair(x) { return (x instanceof Pair) && !isNil(x); }
TopEnv['pair?'] = function(list) { return isPair(list.car); }

TopEnv['boolean?'] = function(list) { return typeof(list.car)=='boolean'; }
TopEnv['string?'] = function(list) { return typeof(list.car)=='string'; }
TopEnv['number?'] = function(list) { return typeof(list.car)=='number'; }
TopEnv['null?'] = function(list) { return isNil(list.car); }
TopEnv['symbol?'] = function(list) { return list.car instanceof Symbol; }
TopEnv['syntax?'] = function(list) { return list.car instanceof Syntax; }
TopEnv['char?'] = function(list) { return list.car instanceof Char; }
TopEnv['vector?'] = function(list) { return list.car instanceof Array; }
TopEnv['procedure?'] = function(list) {
    return list.car instanceof Function ||
        list.car instanceof Lambda ||
        list.car instanceof Continuation;
}
TopEnv['lambda?'] = function(list) { return list.car instanceof Lambda; }
TopEnv['function?'] = function(list) { return list.car instanceof Function; }
TopEnv['continuation?'] = function(list) { return list.car instanceof Continuation; }

TopEnv['js-eval'] = function(list) { return eval(list.car); }
TopEnv['error'] = function(list) { throw new Ex(list.car); }

TopEnv['trace'] = function(list) { trace = list.car.valueOf(); }
TopEnv['read'] = function(list) { return TopParser.getObject(); }
TopEnv['write'] = function(list) { printLog(list.car.Str(),true); }
TopEnv['newline'] = function(list) { printLog(''); }
TopEnv['write-char'] =
    TopEnv['display'] = function(list) {
	printLog( (list.car instanceof Char) ? list.car.value :
		  ((typeof(list.car)=='string') ? list.car : Str(list.car)), true );
    }

TopEnv['eof-object?'] =
    TopEnv['js-null?'] = function(list) { return list.car == null; }

theCallCC =
    TopEnv['call-with-current-continuation'] = function(list,state) {
	state.ready = false;
	return callF( list.car, new Pair( state.cc.clone(), theNil ), state );
    }

var genSymBase = 0;
TopEnv['gen-sym'] = function() { return getSymbol('_'+(genSymBase++)+'_'); }

//
// Read-Eval-Print-Loop
//

function clickEval(id) {
    var txt = document.getElementById(id).value, o, res = null,time0=new Date();
    TopParser = new Parser( txt );

    while( ( o = TopParser.getObject() ) != null ) {

	if( document.getElementById('echoInp').checked )
	    printLog( o.Str() );

	o = doEval( o );
	if( document.getElementById('echoRes').checked )
	    printLog( '=> ' + Str(o) );
	if( o != null ) res = o;
    }
    var time1 = new Date();
    document.getElementById('time').innerHTML = 'Elapsed: ' + ((time1-time0)/1000) + ' s';
    showRes(res);
    showSymbols();
}

function showRes(res) {
    if( res != null ) {
	if( document.getElementById('out') )
	    document.getElementById('out').innerHTML = Html( res );
    }
}

function printLog(s,no) {
    document.getElementById('log').value += s + (no?'':"\n");
    if( document.getElementById('log').doScroll )
	document.getElementById('log').doScroll();
}

// Need to wrap alert as calling it from Scheme
// in Firefox otherwise doesn't work
function jsAlert(text) {
    alert(text)
}

// Need to wrap settimeout as calling it from Scheme
// in Firefox otherwise doesn't work
function jsSetTimeout(f,t) {
    setTimeout(f,t)
}

function init() {
    $.get('scm/lib.scm',
	  function(result) {
	      $('#scheme').get(0).value=result;
	      clickEval('scheme');
	      $('#scheme').get(0).value = '';
	      $('#log').get(0).value = '';
          });
    $.get('scm/util.scm',
	  function(result) {
	      $('#scheme').get(0).value=result;
	      clickEval('scheme');
	      $('#scheme').get(0).value = '';
	      $('#log').get(0).value = '';
	  });
    // 2Do: Clearing the "out" <td> only works later if done manually.
    $('#out').get(0).innerHTML = '';

    $('#evalButton').bind('click', function() { clickEval('txt') })
    // The example and concurrency buttons can be added back later, if needed.
    /*
      $('#exampleButton').bind('click', function() {
      $.get('scm/example.scm',
      function(result) { $('#txt').get(0).value=result })
      })
      $('#concurrencyButton').bind('click', function() {
      $.get('scm/concurrency.scm',
      function(result) { $('#txt').get(0).value=result })
      })
    */
    $('#userCodeButton').bind('click', function() {
	$.get('scm/user-code.scm',
	      function(result) { $('#txt').get(0).value=result })
    })
    $('#clearInputButton').bind('click', function() {
	$('#txt').get(0).value = '';
    })
    $('#clearLogButton').bind('click', function() {
	$('#log').get(0).value = '';
    })
    document.getElementById('txt').focus();
    ShowEnv = TopEnv = new Env(TopEnv);
    showSymbols();
    $('#out').get(0).innerHTML = '';
}


//
// Compiler...
//

var theCannot = new Ex("Lambda cannot be compiled")

function Apply(f,args) {

    Again: while(true) {

	if( f instanceof Lambda ) {

	    if( f.compiled == undefined ) {

		// var jitComp = TopEnv.get('compile-lambda');
		try {
		    var jitComp = TopEnv.get('compile-lambda-obj');
		} catch( ee ) { throw theCannot }

		f.compiled = false;
		var expr = new Pair(jitComp,
				    new Pair(new Pair(theQuote,new Pair(f.args,theNil)),
					     new Pair(new Pair(theQuote,new Pair(
						 new Pair(f.body,theNil),theNil)),
						      theNil)));
		try {
		    var res = doEval(expr,true);
		    // f.compiled = eval("var tmp="+res+";tmp");
		    e = f.env; eval("tmp="+res);
		    f.compiled = tmp.compiled;
		    // Rebuild lambda to change local (lambda())s to (clone)s
		    f.body = tmp.body;
		    f.env = tmp.env;
		} catch( ex ) {
		    printLog( "JIT/JS/Error: " + ex.description + ", compiling:" );
		    printLog( typeof(res)=='string' ? res : Str(res) );
		    printLog( "for Lambda "+Str(f.args) );
		    printLog( Str(f.body) );
		}
	    }
	    if( f.compiled == false ) {
		// Back to interpretation...
		try {
		    var state = new State(null,null,topCC);
		    state.obj = callF(f,args,state);
		    while( true ) {
			if( state.Eval(true) ) {
			    state.ready = false;
			    state.cont();
			}
		    }
		    // throw theCannot;
		} catch(ex) {
		    if( ex instanceof Ex )
			return ex;
		    else if( ex instanceof State )
			return ex.obj;
		    else
			return new Ex(ex.description); // throw ex;
		}
	    }

	    var res = f.compiled(args);
	    if( res == theTC ) {
		f = res.f; args = res.args;
		continue Again;
	    }
	    return res;

	} else if( f instanceof Function ) {

	    if( f.FType == undefined ) {
		if( /^\s*function\s*\(\s*(list|)\s*\)/.exec(f) ) f.FType=1;
		// else if( /^\s*function\s*\(list,env\)/.exec(f) ) f.FType=2;
		else f.FType=3;
	    }

	    if( f.FType == 1 ) return f(args);
	    /*
	      if( f.FType == 2 ) {
	      var res = f(args);
	      if( res == theTC ) {
              f = res.f; args = res.args;
              continue Again;
	      }
	      return res;
	      }
	    */
	    throw new Ex("JIT: Apply to invalid function, maybe call/cc");

	} else if( f instanceof Continuation ) {
	    throw new State(args,null,f); // Give it to the interpreter
	} else throw new Ex("JIT: Apply to "+Str(f));
    }
}

// Tail-Calls

function TC(f,args) {
    theTC.f=f; theTC.args=args;
    return theTC;
}

var theTC = new Object();

//
// Interface things...
//

var buf1='';

function checkEdit(srcElement) {
    var e = srcElement, p = new Parser(e.value);
    var o = p.getObject();
    if( o instanceof Pair ) {
	e.parentElement.innerHTML = o.Html();
    }
    while( (m = p.getObject()) != null ) {
	var td = e.parentElement,
            tr = td.parentElement,
            tb = tr.parentElement,
            r0 = tb.rows[0];
	if( tb.rows.length == 1 ) { // horizontal
	    var cell = tr.insertCell(td.cellIndex+1);
	} else if( r0.cells.length == 3 ) { // vertical
	    r0.cells[0].rowSpan++;
	    r0.cells[2].rowSpan++;
	    var row = tb.insertRow(tr.rowIndex+1),
		cell = row.insertCell(0);
	} else {
	    alert('Error!'); return;
	}
	cell.innerHTML = m.Html();
	cell.onclick = editCell;
	e.value = o.Str();
    }
}

function editCell(event) {
    var i, o = event.srcElement;
    if( o.children.length == 0 && // 2Do: merge subtrees...
	! /^(\(|\)|)$/.test( o.innerHTML ) ) {
	var inp = document.createElement('input');
	inp.value = o.innerHTML;
	inp.onkeyup = function() { checkEdit(inp) };
	o.innerHTML = '';
	o.appendChild(inp);
	inp.focus();
    }
}

function hv(o) {
    var tr = o.parentElement, tbody = tr.parentElement;
    var isH = tbody.rows.length == 1 && tr.cells.length > 3;
    var isV = tbody.rows.length > 1 && tr.cells.length == 3;
    var isT = tbody.rows.length > 1 && tr.cells.length == 4;

    // 2Do: insert cell - esp. in (), move up/down, etc.

    if( isH /*tr.cells.length > 3*/ ) {
	tr.cells[0].rowSpan = tr.cells.length - 2;
	tr.cells[tr.cells.length-1].rowSpan = tr.cells.length - 2;
	//
	while( tr.cells.length > 3) {
	    var cell = tr.cells[2];
	    /*
	      tbody.insertRow().insertCell().innerHTML = cell.innerHTML;
	      tr.deleteCell(2);
	    */
	    tr.removeChild(cell);
	    tbody.insertRow().appendChild(cell);
	}
    } else if( isV ) {
	while( tbody.rows.length > 1 ) {
	    var cell = tbody.rows[1].cells[0];
	    /*
	      tr.insertCell(tr.cells.length-1).innerHTML = cell.innerHTML;
	    */
	    tr.insertBefore(cell,tr.cells[tr.cells.length-1]);
	    tbody.deleteRow(1);
	}
    }
}

function key1(srcElement) {
    buf1 = srcElement.value;
}

// 2Do: fix the TypeError in clickEval when typing too many RETURNs.
function key2(srcElement) {
    var buf2 = srcElement.value;
    var re = /(\n|\r\n){2}$/;
    if( !re.test(buf1) && re.test(buf2) ) {
	clickEval(); buf1 = buf2;
    }
}

function checkEdit(srcElement) {
    var e = srcElement, p = new Parser(e.value);
    var o = p.getObject();
    if( o instanceof Pair ) {
	e.parentElement.innerHTML = o.Html();
    }
    while( (m = p.getObject()) != null ) {
	var td = e.parentElement,
            tr = td.parentElement,
            tb = tr.parentElement,
            r0 = tb.rows[0];
	if( tb.rows.length == 1 ) { // horizontal
	    var cell = tr.insertCell(td.cellIndex+1);
	} else if( r0.cells.length == 3 ) { // vertical
	    r0.cells[0].rowSpan++;
	    r0.cells[2].rowSpan++;
	    var row = tb.insertRow(tr.rowIndex+1),
		cell = row.insertCell(0);
	} else {
	    alert('Error!'); return;
	}
	cell.innerHTML = m.Html();
	cell.onclick = editCell;
	e.value = o.Str();
    }
}

function editCell(event) {
    var i, o = event.srcElement;
    if( o.children.length == 0 && // 2Do: merge subtrees...
	! /^(\(|\)|)$/.test( o.innerHTML ) ) {
	var inp = document.createElement('input');
	inp.value = o.innerHTML;
	inp.onkeyup = function() { checkEdit(inp) };
	o.innerHTML = '';
	o.appendChild(inp);
	inp.focus();
    }
}

function hv(o) {
    var tr = o.parentElement, tbody = tr.parentElement;

    var isH = tbody.rows.length == 1 && tr.cells.length > 3;
    var isV = tbody.rows.length > 1 && tr.cells.length == 3;
    var isT = tbody.rows.length > 1 && tr.cells.length == 4;

    // 2Do: insert cell - esp. in (), move up/down, etc.

    if( isH /*tr.cells.length > 3*/ ) {
	tr.cells[0].rowSpan = tr.cells.length - 2;
	tr.cells[tr.cells.length-1].rowSpan = tr.cells.length - 2;
	//
	while( tr.cells.length > 3) {
	    var cell = tr.cells[2];
	    /*
	      tbody.insertRow().insertCell().innerHTML = cell.innerHTML;
	      tr.deleteCell(2);
	    */
	    tr.removeChild(cell);
	    tbody.insertRow().appendChild(cell);
	}
    } else if( isV ) {
	while( tbody.rows.length > 1 ) {
	    var cell = tbody.rows[1].cells[0];
	    /*
	      tr.insertCell(tr.cells.length-1).innerHTML = cell.innerHTML;
	    */
	    tr.insertBefore(cell,tr.cells[tr.cells.length-1]);
	    tbody.deleteRow(1);
	}
    }
}

function objType(o) {
    if( isNil(o) ) return 'null';
    if( o instanceof Lambda ) return 'lambda';
    if( o instanceof Pair ) return 'list';
    if( o instanceof Char ) return 'char';
    if( o instanceof Array ) return 'vector';
    if( o instanceof Symbol ) return 'symbol';
    if( o instanceof Continuation ) return 'continuation';
    if( o instanceof Syntax ) return 'syntax';
    return typeof(o);
}

function showSymbol(s) {
    var s = ShowEnv[s]/*TopEnv.get(s)*/;
    if( s instanceof Lambda ) {
	s = new Pair( getSymbol('lambda'),
		      new Pair( s.args,
				new Pair( s.body ))).Html();
    } else if( ! (s instanceof Function) ) s = Html(s);
    document.getElementById('out').innerHTML = s;
}

function showSymbols() {
    var i,j,tab = document.getElementById('symbols');
    // clear table
    while( tab.tBodies[0].rows.length > 0 ) {
	tab.tBodies[0].deleteRow(0);
    }
    //
    for( i in ShowEnv ) {
	if( i != 'parentEnv' && Env.prototype[i] == undefined ) {
	    var row = tab.insertRow(0);
	    var s = '<a href="javascript:showSymbol(\''+i+'\')">'+i+'<\/a>';
	    row.insertCell(0).innerHTML = s;
	    row.insertCell(0).innerHTML = objType(ShowEnv[i]);
	}
    }
}

$(document).ready(init);

