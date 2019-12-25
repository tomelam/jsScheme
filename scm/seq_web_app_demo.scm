(reset
	  (with-handlers '((click-handler "foo"))
			 (let ((input (get-input)))
			   (displayln "get-input returned")
			   (displayln input))))
