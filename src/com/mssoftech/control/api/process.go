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
func Test(c web.C, w http.ResponseWriter, r *http.Request) {
	params := util.GetBodyJson(r)
	in := params["in"].(string)
	rmap := make(map[string]interface{})
	rmap["msg"]=in+" was setnt."
	util.ReturnJson(w,rmap )
}
