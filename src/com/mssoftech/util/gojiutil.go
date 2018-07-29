package util

import (
	"encoding/hex"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"golang.org/x/crypto/scrypt"
)

func GetBody(r *http.Request) []byte {
	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic("Request Body Read  Error")
	}
	return body
}
func GetBodyJson(r *http.Request) map[string]interface{} {
	var dat map[string]interface{}
	byt := GetBody(r)
	if err := json.Unmarshal(byt, &dat); err != nil {
		panic(err)
	}
	return dat
}
func ReturnJson(w http.ResponseWriter, rmap map[string]interface{}) {
	w.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(w)
	encoder.Encode(rmap)
}
func ReturnError(w http.ResponseWriter, errormsg string) {
	rmap := make(map[string]interface{})
	rmap["status"] = -1
	rmap["data"] = errormsg
	ReturnJson(w, rmap)
}
func ReturnNormal(w http.ResponseWriter, data interface{}) {
	rmap := make(map[string]interface{})
	rmap["status"] = 0
	rmap["data"] = data
	ReturnJson(w, rmap)
}
func GenPasswordHash(pass string) string {
	p := []byte(pass)
	salt := []byte("password hash salt")
	dk, err := scrypt.Key(p, salt, 16384, 8, 1, 32)
	if err != nil {
		panic(err)
	}
	return hex.EncodeToString(dk)
}
