mongodb
1.问题：
mongod exception in initAndListen: NonExistentPath: Data directory C:\data\db\ not found., terminati

解决：
mongod 没找到路径

```bash
mongod --dbpath F:/data/db
```

更改默认数据库路径

2.导入导出
(1)导入
1数据导出：
mongoexport
导入json:

```bash
# -d 数据库 -c 集合(数据表) --file 导入的文件位置 --type 导入的文件类型
mongoimport -d taobao -c product --file d:/Chromedowload/test.json --type json
```

导入csv:
```bash
mongoimport -d taobao -c new_product --type csv --headerline --file ‪D:/Chromedowload/tbtest.csv 
```
(2)导出
导出成json:
mongoexport -d mongotest -c users -o d:/Chromedowload/test.json --type json
mongoexport -d blogNode -c articles -o C:/Users/Administrator/Desktop/mongodb/articles.json --type json

导出成csv:
```bash
mongoexport -d taobao -c product -o D:/Chromedowload/taobao.csv --type csv -f
mongoexport -d blogNode -c users -o F:/front-end/front-end-study/code/project/github-demo/blog/react/blog-node-egg/dbs/users.json --type json
```

3.配置环境变量，解决找不到mongo命令
MongoDB 的可执行文件位于 bin 目录下，所以可以将其添加到 PATH 路径中：

```bash
export PATH=<mongodb-install-directory>/bin:$PATH
<mongodb-install-directory> 为你 MongoDB 的安装路径。如: /usr/local/mongodb。
```
