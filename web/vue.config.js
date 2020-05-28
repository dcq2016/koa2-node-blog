const path = require('path');

module.exports = {
    publicPath: './', // 相对路径
    outputDir: 'dean-dist', // 生产环境生成目录
    assetsDir: 'static', // 静态文件
    indexPath: 'index.html',
    filenameHashing: true, // 文件名哈希
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'dean-blog', // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            chunks: ['chunk-vendors', 'chunk-common', 'index'], // 提取出来的通用 chunk 和 vendor chunk。
        }
    },
    lintOnSave: false // 关闭eslist
}