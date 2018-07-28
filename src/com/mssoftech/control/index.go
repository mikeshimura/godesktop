package control

import (
	"net/http"
	"com/mssoftech/util"
	"github.com/zenazn/goji/web"
	pongo2 "gopkg.in/flosch/pongo2.v3"
)

type Index struct {
}

func (i *Index) Index(c web.C, w http.ResponseWriter, r *http.Request) {
	tpl, err := util.TemplateSet.FromFile("index.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	token := c.Env["CsrfToken"]
	common,_:=util.INI.GetSection("common")
	ssystem:=""
	system,err:=common.GetKey("SYSTEM")
	if err ==nil{
		ssystem=system.String()
	}
	tpl.ExecuteWriter(pongo2.Context{"csrf": token,"system":ssystem}, w)
}
