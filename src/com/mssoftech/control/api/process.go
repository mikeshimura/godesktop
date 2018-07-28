package api

import (
	"github.com/zenazn/goji/web"
	"net/http"
		"com/mssoftech/util"
							"os"
		)


func Quit(c web.C, w http.ResponseWriter, r *http.Request) {
	//util.Pages[1].CloseWindow()
	util.Pages[0].CloseWindow()
	os.Exit(0)
}
