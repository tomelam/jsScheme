($ "div")

($ "div" "get")

(define foo-div ($ "div" "get" 0))
(get-el-attr foo-div "id")
(set-el-attr foo-div "id" "bar")
(get-el-attr foo-div "id")

($wrap foo-div)
(js-invoke ($wrap ($ "#symbols" "get" 0)) "get")
(js-invoke ($wrap ($ "#symbols" "get" 0)) "get" 0)

;; Not working: ($unwrap ($wrap ($ "#symbols" "get" 0)))

(get-attr "#bar" "id")
(set-attr "#bar" "id" "foo")
(get-attr "#foo" "id")
