const egg = require('egg');

// TODO: 参考 node-blog app.js进行改造

const workers = Number(process.argv[2] || require('os').cpus().length);
egg.startCluster({
    workers,
    baseDir: __dirname,
});