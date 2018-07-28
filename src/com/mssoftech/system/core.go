package system

import (
	log "github.com/Sirupsen/logrus"

	)



type Application struct {

}


func (application *Application) Init() {

}
func (app *Application) Close() {
	log.Info("Bye!")
}