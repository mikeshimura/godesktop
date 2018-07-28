package main

import (
	"net/http"
	"os"
	"com/mssoftech/util"
	"com/mssoftech/route"
	"com/mssoftech/system"

	"github.com/gorilla/context"
	_ "github.com/lib/pq"
	"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
	"github.com/go-ini/ini"
	"flag"
	"path/filepath"
	"fmt"
)

func main() {
	util.SetUp()
	var err error

	RootPath, _ := filepath.Abs(".")
	fmt.Printf("Root Path %v\n",RootPath)
	util.INI, err = ini.Load(RootPath+string(os.PathSeparator)+"godesktop.ini")
	if err != nil {
		panic("godesktop.ini" + "が読めません")
	}
	var app = &system.Application{}
	app.Init() 
	static := web.New()
	static.Get("/assets/*", http.StripPrefix("/assets/",
		http.FileServer(http.Dir(util.RootPath+
			string(os.PathSeparator)+"assets"))))

	http.Handle("/assets/", static)
	goji.Use(context.ClearHandler)
	common,_:=util.INI.GetSection("common")
	port,_:=common.GetKey("PORT")
	util.PORT=port.String()
	flag.Set("bind", ":"+util.PORT)
	go util.StartSelenium()
	route.CommonRoute(goji.DefaultMux)
	goji.Handle("/api/*", route.RouteAPI())
	goji.Serve()

}
