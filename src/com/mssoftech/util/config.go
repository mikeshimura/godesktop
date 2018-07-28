package util

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	//"strings"

		log "github.com/Sirupsen/logrus"
	"github.com/go-ini/ini"
	//"github.com/mikeshimura/dbflute/df"
	"gopkg.in/flosch/pongo2.v3"
	"net/http"
	"github.com/sclevine/agouti"
)

var RootPath = ""
var TemplateSet *pongo2.TemplateSet
var IniMap map[string]*ini.Section
var DB *sql.DB
var Local bool
var ScreenDelay int64
var FbaItem int64
var Step1Exec int
var Step2Exec int
var Step3Exec int
var INI *ini.File
var PORT string
var URL string
var SYSTEM string
var Client http.Client
var Pages []*agouti.Page
var UUID string


func StartSelenium(){
	var err error
	Pages=make([]*agouti.Page,2,2)
	driver := agouti.ChromeDriver(agouti.ChromeOptions("args", []string{
		"--disable-infobars",
	}),agouti.Browser("chrome"))
	if err := driver.Start(); err != nil {
		log.Fatalf("Failed to start driver:%v", err)
	}
	Pages[0], err= driver.NewPage()
	if err != nil {
		log.Fatalf("Failed to open page:%v", err)
	}
	Pages[0].Navigate("http://127.0.0.1:"+PORT)
}
func SetUp() {
	RootPath, _ = filepath.Abs(".")
	fmt.Println("RootPath :" + RootPath)
	CreateTemplateSet()
}

func GetTemplatePath() string {
	return RootPath + string(os.PathSeparator) + "assets" +
		string(os.PathSeparator) + "html"
}

func CreateTemplateSet() {
	TemplateSet = pongo2.NewSet("common")
	TemplateSet.SetBaseDirectory(GetTemplatePath())
}



