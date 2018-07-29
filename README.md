# godesktop

[日本語の説明](https://github.com/mikeshimura/godesktop/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E8%AA%AC%E6%98%8E)

Go Desktop Program using Chrome Browser for UI.(Using Selenium)

Please view following movie.

https://www.useloom.com/share/e77ee6c495914f808336ca8d26bb524c

Demonstration is very easy.

Download 2 files from following Google Drive Folder and click godesktop.exe

https://drive.google.com/drive/folders/10D6f1XQk6rzkhJudAojGY8LjQjqN3BfL?usp=sharing

This is go program, then you can run with MAC.

Only Mac Version of Chromedriver is additionally required.

If you clone respository and following massage is shown, plase action as follows.

src\com\mssoftech\util\config.go:10:3: cannot find package "github.com/Sirupsen/logrus" in any of: D:\temp\godesktop\src\com\mssoftech\vendor\github.com\Sirupsen\logrus (vendor tree) D:\PG\Go\1.10\Go\src\github.com\Sirupsen\logrus (from $GOROOT) D:\temp\godesktop\src\github.com\Sirupsen\logrus (from $GOPATH) src\com\mssoftech\main.go:10:2: cannot find package "github.com/gorilla/context" in any of: D:\temp\godesktop\src\com\mssoftech\vendor\github.com\gorilla\context (vendor tree) D:\PG\Go\1.10\Go\src\github.com\gorilla\context (from $GOROOT) D:\temp\godesktop\src\github.com\gorilla\context (from $GOPATH) src\com\mssoftech\main.go:11:2: cannot find package "github.com/lib/pq" in any of: D:\temp\godesktop\src\com\mssoftech\vendor\github.com\lib\pq (vendor tree) D:\PG\Go\1.10\Go\src\github.com\lib\pq (from $GOROOT) D:\temp\godesktop\src\github.com\lib\pq (from $GOPATH)

et GOPATH=XXXX cd src\com\mssoftech

govendor fetch github.com/Sirupsen/logrus

govendor fetch github.com/gorilla/context

govendor fetch github.com/lib/pq
