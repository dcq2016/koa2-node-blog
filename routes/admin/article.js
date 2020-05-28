router.get('/admin/article', async (ctx) => {
    console.log(ctx.query);
    let res;
    switch (ctx.query.act) {
        case 'addshow':
            res = await db.query('SELECT * FROM act_article').then(res => {
                return res;
            })
            await ctx.render('admin/article', {
                banner: res,
                showAddBox: true
            });
            break;
        case 'mod':
            res = await db.query(`SELECT * FROM act_article WHERE ID='${ctx.query.id}'`).then(res => {
                console.log(ctx.query.id)
                return res;
            })
            const banner = await db.query('SELECT * FROM act_article').then(res => {
                console.log(2)
                return res;
            })
            await ctx.render('admin/article', {
                banner: banner,
                modifyData: res[0]
            });
            break;
        case 'del':
            await db.query(`DELETE FROM act_article WHERE ID = '${ctx.query.id}'`).then(res => {
                ctx.response.body = 'delete success';
                ctx.response.redirect('/admin/banner');
            })
            break;
        default: 
            res = await db.query('SELECT * FROM act_article').then(res => {
                return res;
            })
            await ctx.render('admin/article', {
                banner: res
            });
            break;
    }
    
})

router.post('/admin/article', async (ctx) => {
    const title = ctx.request.body.title;
    const description = ctx.request.body.description;
    const content = ctx.request.body.content;
    let postParam = ctx.request.body; //获取post提交的数据
    console.log(postParam);
    switch (ctx.query.act) {
        case 'add':
            await db.query(`INSERT INTO act_article (title, description, content) VALUES ('${title}','${description}','${content}')`).then(res => {
                ctx.response.redirect('/admin/article');
            })
            break;
        case 'modify':
            await db.query(`UPDATE act_article SET title = '${title}', description = '${description}', content = '${content}' WHERE ID = '${ctx.query.id}'`).then(res => {
                ctx.response.redirect('/admin/article');
            })
            break;
        default: 
            break;
    }
})