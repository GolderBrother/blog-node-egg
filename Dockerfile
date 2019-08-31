# 基于node镜像
FROM node
# 标识名字和版本
LABEL name="blog-node-egg"
LABEL vertion="1.0"
# 把当前目录下的所有文件都拷贝到app目录下(没有会自动创建)
COPY . /app
WORKDIR /app
# 运行命令
RUN npm install
# 向外暴露6000端口
EXPOSE 6000
# 基于镜像生成容器后，执行命令
CMD npm run dev
