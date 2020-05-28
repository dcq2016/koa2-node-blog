const router = require('koa-router')()
const mysql = require('mysql')


const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'learn'
});

/*连接数据库*/
const allSqlAction = (sql, value) => {
    return new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                console.log("数据库连接成功")
                connection.query(sql, value, (err, row) => {
                    if (err) reject(err)
                    else{
                        resolve(row)
                    } 
                    connection.release()
                })
            }
        })
    })
}

router.get('/admin', async (ctx) => {
    await ctx.render('admin/index', {});
})
router.get('/admin/banner', async (ctx) => {
    console.log(ctx.query);
    let res;
    switch (ctx.query.act) {
        case 'addshow':
            res = await allSqlAction('SELECT * FROM act_banner').then(res => {
                return res;
            })
            await ctx.render('admin/banner', {
                banner: res,
                showAddBox: true
            });
            break;
        case 'mod':
            res = await allSqlAction(`SELECT * FROM act_banner WHERE ID='${ctx.query.id}'`).then(res => {
                console.log(ctx.query.id)
                return res;
            })
            const banner = await allSqlAction('SELECT * FROM act_banner').then(res => {
                console.log(2)
                return res;
            })
            await ctx.render('admin/banner', {
                banner: banner,
                modifyData: res[0]
            });
            break;
        case 'del':
            await allSqlAction(`DELETE FROM act_banner WHERE ID = '${ctx.query.id}'`).then(res => {
                ctx.response.body = 'delete success';
                ctx.response.redirect('/admin/banner');
            })
            break;
        default: 
            res = await allSqlAction('SELECT * FROM act_banner').then(res => {
                return res;
            })
            await ctx.render('admin/banner', {
                banner: res
            });
            break;
    }
    
})

router.post('/admin/banner', async (ctx) => {
    const title = ctx.request.body.title;
    const description = ctx.request.body.description;
    const href = ctx.request.body.href;
    let postParam = ctx.request.body; //获取post提交的数据
    console.log(postParam);
    switch (ctx.query.act) {
        case 'add':
            await allSqlAction(`INSERT INTO act_banner (title, description, href) VALUES ('${title}','${description}','${href}')`).then(res => {
                ctx.response.redirect('/admin/banner');
            })
            break;
        case 'modify':
            await allSqlAction(`UPDATE act_banner SET title = '${title}', description = '${description}', href = '${href}' WHERE ID = '${ctx.query.id}'`).then(res => {
                ctx.response.redirect('/admin/banner');
            })
            break;
        default: 
            break;
    }
})

module.exports = router;