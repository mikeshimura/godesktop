本包提供了 Go 语言中读写 INI 文件的功能。

## 功能特性

- 支持覆盖加载多个数据源（`[]byte` 或文件）
- 支持递归读取键值
- 支持读取父子分区
- 支持读取自增键名
- 支持读取多行的键值
- 支持大量辅助方法
- 支持在读取时直接转换为 Go 语言类型
- 支持读取和 **写入** 分区和键的注释
- 轻松操作分区、键值和注释
- 在保存文件时分区和键值会保持原有的顺序

## 下载安装

    go get gopkg.in/ini.v1

## 开始使用

### 从数据源加载

一个 **数据源** 可以是 `[]byte` 类型的原始数据，或 `string` 类型的文件路径。您可以加载 **任意多个** 数据源。如果您传递其它类型的数据源，则会直接返回错误。

```go
cfg, err := ini.Load([]byte("raw data"), "filename")
```

或者从一个空白的文件开始：

```go
cfg := ini.Empty()
```

当您在一开始无法决定需要加载哪些数据源时，仍可以使用 **Append()** 在需要的时候加载它们。

```go
err := cfg.Append("other file", []byte("other raw data"))
```

### 操作分区（Section）

获取指定分区：

```go
section, err := cfg.GetSection("section name")
```

如果您想要获取默认分区，则可以用空字符串代替分区名：

```go
section, err := cfg.GetSection("")
```

当您非常确定某个分区是存在的，可以使用以下简便方法：

```go
section := cfg.Section("")
```

如果不小心判断错了，要获取的分区其实是不存在的，那会发生什么呢？没事的，它会自动创建并返回一个对应的分区对象给您。

创建一个分区：

```go
err := cfg.NewSection("new section")
```

获取所有分区对象或名称：

```go
sections := cfg.Sections()
names := cfg.SectionStrings()
```

### 操作键（Key）

获取某个分区下的键：

```go
key, err := cfg.Section("").GetKey("key name")
```

和分区一样，您也可以直接获取键而忽略错误处理：

```go
key := cfg.Section("").Key("key name")
```

创建一个新的键：

```go
err := cfg.Section("").NewKey("name", "value")
```

获取分区下的所有键或键名：

```go
keys := cfg.Section().Keys()
names := cfg.Section().KeyStrings()
```

获取分区下的所有键值对的克隆：

```go
hash := cfg.GetSection("").KeysHash()
```

### 操作键值（Value）

获取一个类型为字符串（string）的值：

```go
val := cfg.Section("").Key("key name").String()
```

获取其它类型的值：

```go
// 布尔值的规则：
// true 当值为：1, t, T, TRUE, true, True, YES, yes, Yes, ON, on, On
// false 当值为：0, f, F, FALSE, false, False, NO, no, No, OFF, off, Off
v, err = cfg.Section("").Key("BOOL").Bool()
v, err = cfg.Section("").Key("FLOAT64").Float64()
v, err = cfg.Section("").Key("INT").Int()
v, err = cfg.Section("").Key("INT64").Int64()
v, err = cfg.Section("").Key("TIME").TimeFormat(time.RFC3339)
v, err = cfg.Section("").Key("TIME").Time() // RFC3339

v = cfg.Section("").Key("BOOL").MustBool()
v = cfg.Section("").Key("FLOAT64").MustFloat64()
v = cfg.Section("").Key("INT").MustInt()
v = cfg.Section("").Key("INT64").MustInt64()
v = cfg.Section("").Key("TIME").MustTimeFormat(time.RFC3339)
v = cfg.Section("").Key("TIME").MustTime() // RFC3339

// 由 Must 开头的方法名允许接收一个相同类型的参数来作为默认值，
// 当键不存在或者转换失败时，则会直接返回该默认值。
// 但是，MustString 方法必须传递一个默认值。

v = cfg.Seciont("").Key("String").MustString("default")
v = cfg.Section("").Key("BOOL").MustBool(true)
v = cfg.Section("").Key("FLOAT64").MustFloat64(1.25)
v = cfg.Section("").Key("INT").MustInt(10)
v = cfg.Section("").Key("INT64").MustInt64(99)
v = cfg.Section("").Key("TIME").MustTimeFormat(time.RFC3339, time.Now())
v = cfg.Section("").Key("TIME").MustTime(time.Now()) // RFC3339
```

如果我的值有好多行怎么办？

```ini
[advance]
ADDRESS = """404 road,
NotFound, State, 5000
Earth"""
```

嗯哼？小 case！

```go
cfg.Section("advance").Key("ADDRESS").String()

/* --- start ---
404 road,
NotFound, State, 5000
Earth
------  end  --- */
```

赞爆了！那要是我属于一行的内容写不下想要写到第二行怎么办？

```ini
[advance]
two_lines = how about \
	continuation lines?
lots_of_lines = 1 \
	2 \
	3 \
	4
```

简直是小菜一碟！

```go
cfg.Section("advance").Key("two_lines").String() // how about continuation lines?
cfg.Section("advance").Key("lots_of_lines").String() // 1 2 3 4 
```

这就是全部了？哈哈，当然不是。

#### 操作键值的辅助方法

获取键值时设定候选值：

```go
v = cfg.Section("").Key("STRING").In("default", []string{"str", "arr", "types"})
v = cfg.Section("").Key("FLOAT64").InFloat64(1.1, []float64{1.25, 2.5, 3.75})
v = cfg.Section("").Key("INT").InInt(5, []int{10, 20, 30})
v = cfg.Section("").Key("INT64").InInt64(10, []int64{10, 20, 30})
v = cfg.Section("").Key("TIME").InTimeFormat(time.RFC3339, time.Now(), []time.Time{time1, time2, time3})
v = cfg.Section("").Key("TIME").InTime(time.Now(), []time.Time{time1, time2, time3}) // RFC3339
```

如果获取到的值不是候选值的任意一个，则会返回默认值，而默认值不需要是候选值中的一员。

验证获取的值是否在指定范围内：

```go
vals = cfg.Section("").Key("FLOAT64").RangeFloat64(0.0, 1.1, 2.2)
vals = cfg.Section("").Key("INT").RangeInt(0, 10, 20)
vals = cfg.Section("").Key("INT64").RangeInt64(0, 10, 20)
vals = cfg.Section("").Key("TIME").RangeTimeFormat(time.RFC3339, time.Now(), minTime, maxTime)
vals = cfg.Section("").Key("TIME").RangeTime(time.Now(), minTime, maxTime) // RFC3339
```

自动分割键值为切片（slice）：

```go
vals = cfg.Section("").Key("STRINGS").Strings(",")
vals = cfg.Section("").Key("FLOAT64S").Float64s(",")
vals = cfg.Section("").Key("INTS").Ints(",")
vals = cfg.Section("").Key("INT64S").Int64s(",")
vals = cfg.Section("").Key("TIMES").Times(",")
```

### 高级用法

#### 递归读取键值

在获取所有键值的过程中，特殊语法 `%(<name>)s` 会被应用，其中 `<name>` 可以是相同分区或者默认分区下的键名。字符串 `%(<name>)s` 会被相应的键值所替代，如果指定的键不存在，则会用空字符串替代。您可以最多使用 99 层的递归嵌套。

```ini
NAME = ini

[author]
NAME = Unknwon
GITHUB = https://github.com/%(NAME)s

[package]
FULL_NAME = github.com/go-ini/%(NAME)s
```

```go
cfg.Section("author").Key("GITHUB").String()		// https://github.com/Unknwon
cfg.Section("package").Key("FULL_NAME").String()	// github.com/go-ini/ini
```

#### 读取父子分区

您可以在分区名称中使用 `.` 来表示两个或多个分区之间的父子关系。如果某个键在子分区中不存在，则会去它的父分区中再次寻找，直到没有父分区为止。

```ini
NAME = ini
VERSION = v1
IMPORT_PATH = gopkg.in/%(NAME)s.%(VERSION)s

[package]
CLONE_URL = https://%(IMPORT_PATH)s

[package.sub]
```

```go
cfg.Section("package.sub").Key("CLONE_URL").String()	// https://gopkg.in/ini.v1
```

#### 读取自增键名

如果数据源中的键名为 `-`，则认为该键使用了自增键名的特殊语法。计数器从 1 开始，并且分区之间是相互独立的。

```ini
[features]
-: Support read/write comments of keys and sections
-: Support auto-increment of key names
-: Support load multiple files to overwrite key values
```

```go
cfg.Section("features").KeyStrings()	// []{"#1", "#2", "#3"}
```

### 映射到结构

想要使用更加面向对象的方式玩转 INI 吗？好主意。

```ini
Name = Unknwon
age = 21
Male = true
Born = 1993-01-01T20:17:05Z

[Note]
Content = Hi is a good man!
Cities = HangZhou, Boston
```

```go
type Note struct {
	Content string
	Cities  []string
}

type Person struct {
	Name string
	Age  int `ini:"age"`
	Male bool
	Born time.Time
	Note
	Created time.Time `ini:"-"`
}

func main() {
	cfg, err := ini.Load("path/to/ini")
	// ...
	p := new(Person)
	err = cfg.MapTo(p)
	// ...

	// 一切竟可以如此的简单。
	err = ini.MapTo(p, "path/to/ini")
	// ...

	// 嗯哼？只需要映射一个分区吗？
	n := new(Note)
	err = cfg.Section("Note").MapTo(n)
	// ...
}
```

结构的字段怎么设置默认值呢？很简单，只要在映射之前对指定字段进行赋值就可以了。如果键未找到或者类型错误，该值不会发生改变。

```go
// ...
p := &Person{
	Name: "Joe",
}
// ...
```

#### 名称映射器（Name Mapper）

为了节省您的时间并简化代码，本库支持类型为 [`NameMapper`](https://gowalker.org/gopkg.in/ini.v1#NameMapper) 的名称映射器，该映射器负责结构字段名与分区名和键名之间的映射。

目前有 2 款内置的映射器：

- `AllCapsUnderscore`：该映射器将字段名转换至格式 `ALL_CAPS_UNDERSCORE` 后再去匹配分区名和键名。
- `TitleUnderscore`：该映射器将字段名转换至格式 `title_underscore` 后再去匹配分区名和键名。

使用方法：

```go
type Info struct{
	PackageName string
}

func main() {
	err = ini.MapToWithMapper(&Info{}, ini.TitleUnderscore, []byte("packag_name=ini"))
	// ...

	cfg, err := ini.Load("PACKAGE_NAME=ini")
	// ...
	info := new(Info)
	cfg.NameMapper = ini.AllCapsUnderscore
	err = cfg.MapTo(info)
	// ...
}
```

## 获取帮助

- [API 文档](https://gowalker.org/gopkg.in/ini.v1)
- [创建工单](https://github.com/go-ini/ini/issues/new)

## 常见问题

### 字段 `BlockMode` 是什么？

默认情况下，本库会在您进行读写操作时采用锁机制来确保数据时间。但在某些情况下，您非常确定只进行读操作。此时，您可以通过设置 `cfg.BlockMode = false` 来将读操作提升大约 **50-70%** 的性能。

### 为什么要写另一个 INI 解析库？

许多人都在使用我的 [goconfig](https://github.com/Unknwon/goconfig) 来完成对 INI 文件的操作，但我希望使用更加 Go 风格的代码。并且当您设置 `cfg.BlockMode = false` 时，会有大约 **10-30%** 的性能提升。

为了做出这些改变，我必须对 API 进行破坏，所以新开一个仓库是最安全的做法。除此之外，本库直接使用 `gopkg.in` 来进行版本化发布。（其实真相是导入路径更短了）
