($ "div")

($ "div" "get")

(define foo-div ($ "div" "get" 0))
(get-el-attr foo-div "id")

(get-el-attr ($ "#symbols" "get" 0) "id")
(set-el-attr ($ "#symbols" "get" 0) "id" "symbols2")
(get-el-attr ($ "#symbols" "get" 0) "id")

($wrap foo-div)
(js-invoke ($wrap ($ "#symbols" "get" 0)) "get")
(js-invoke ($wrap ($ "#symbols" "get" 0)) "get" 0)

;; Not working: ($unwrap ($wrap ($ "#symbols" "get" 0)))
