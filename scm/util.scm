(display "util.scm")

(define first car)
(define second cadr)
(define third caddr)
(define rest cdr)
(define (displayln text)
  (display text)
  (newline))
;
(define (input-listener-cont . args)
  (display "Handler called with no listener continuation up"))
(define-syntax with-handlers
  (syntax-rules ()
    ((with-handlers handlers body ...)
     (begin
       (setup-handlers handlers)
       (begin body ...)
       (remove-handlers handlers)))))
(define (setup-handlers handlers)
  (process-handlers handlers second))
(define (remove-handlers handlers)
  (process-handlers handlers third))
(define (process-handlers handlers part)
  (map (lambda (handler)
         (let ((handler-func (part (assq (first handler) handlers-impl)))
               (handler-args (rest handler)))
           (apply handler-func handler-args)))
       handlers))
(define handlers-impl
  (list
   (list 'click-handler
         (lambda (id)
           (set-handler! ($ id "get" 0) "onclick" 'on-click-handler))
         (lambda (id)
           (remove-handler! ($ id "get" 0)  "onclick")))
   (list 'timeout-handler
         (lambda (timeout)
           (set-timeout! 'on-timeout-handler timeout))
         (lambda (timeout)
           #f))))
(define (on-click-handler this event)
  (input-listener-cont (list 'click this)))
(define (on-timeout-handler)
  (input-listener-cont (list 'timeout)))
;
(define-syntax get-input
  (syntax-rules ()
    ((get-input)
     (shift c (set! input-listener-cont c)))))

;;;; HTML

(define (get-el-attr element attribute)
  (js-invoke element "getAttribute" attribute))

(define (set-el-attr element attribute value)
  (js-invoke element "setAttribute" attribute value))

(define (get-attr selector attribute)
  (js-invoke (js-eval (string-append "$(" (make-js-string selector) ")"))
	     "attr" attribute))

(define (set-attr selector attribute value)
  (js-invoke (js-eval (string-append "$(" (make-js-string selector) ")"))
	     "attr" attribute value))

;;;; jQuery

;; Helper function
(define (make-js-string arg)
  (string-append "'" arg "'"))

(define-syntax $
  (syntax-rules ()
    (($ selector)
     (js-eval (string-append "$(" (make-js-string selector) ")")))
    (($ selector method)
     (js-invoke
      (js-eval (string-append "$(" (make-js-string selector) ")")) method))
    (($ selector method arg)
     (js-invoke
      (js-eval (string-append "$(" (make-js-string selector) ")")) method arg))
    (($ selector method arg1 arg2)
     (js-invoke
      (js-eval (string-append "$(" (make-js-string selector) ")")) method argi arg2))
    (($ selector method arg1 arg2 arg3)
     (js-invoke
      (js-eval (string-append "$(" (make-js-string selector) ")")) method arg1 arg2 arg3))))

(define ($wrap element)
  (js-call (js-eval "$") element))

(define ($unwrap $element)
  (js-invoke $element "get" 0))

(define (add-el query selector relative-position html)
  (js-invoke ($ query selector) relative-position html))

;; Example style parameter: "'.button { background-color:rgb(80,200,80); }'"
;;(define (add-style style)
;;  (set-el-attr
;;   (js-invoke
;;    (js-invoke (add-el "script" "first" "after" "<style></style>") "next") "get" 0)
;;   "type" "text/css"))
(define (add-style style)
  (js-eval (string-append "$('<style>').prop('type','text/css').html(" (make-js-string style) ").appendTo('head')")))
