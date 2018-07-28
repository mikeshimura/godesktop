package route

import (
	"com/mssoftech/control"
	"com/mssoftech/control/api"

	"github.com/zenazn/goji/web"
)

func CommonRoute(m *web.Mux) {
	index := new(control.Index)
	m.Get("/", index.Index)

}
func RouteAPI() *web.Mux {
	m := web.New()
	m.Post("/api/quit", api.Quit)


	return m
}
