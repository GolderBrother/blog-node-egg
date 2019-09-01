# 基于node镜像
FROM node
# 标识名字和版本
LABEL name="blog-node-egg"
LABEL version="1.0"
# 把当前目录下的所有文件都拷贝到app目录下(没有会自动创建)
COPY . /app
WORKDIR /app
# 拷贝package.json文件到工作目录
# !!重要：package.json需要单独添加。
# Docker在构建镜像的时候，是一层一层构建的，仅当这一层有变化时，重新构建对应的层。
# 如果package.json和源代码一起添加到镜像，则每次修改源码都需要重新安装npm模块，这样木有必要。
# 所以，正确的顺序是: 添加package.json；安装npm模块；添加源代码。
COPY package.json /usr/projects/blog/blog-node-egg/package.json
# 运行命令
# 安装npm依赖
RUN npm install
# 向外暴露容器6000端口
EXPOSE 6000
# 启动node应用，基于镜像生成容器后，执行命令
CMD npm start
