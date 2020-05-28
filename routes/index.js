const router = require('koa-router')()
// const koaBody = require('koa-body')
const db = require('../lib/mysql')
const until = require('../lib/common')
const jwt = require('jsonwebtoken')
const secret = require('../config/secret')
// const { verifyToken } = require('../middleware/verify')

const multer = require('koa-multer');


// 指定文件上传的目录
// const upload = multer({
//   dest: 'web/uploadfiles/'
// });


//以下是配置
var storage = multer.diskStorage({
	//定义文件保存路径
	destination:function(req,file,cb){
	    cb(null,'./web/src/uploadfiles/');//路径根据具体而定。如果不存在的话会自动创建一个路径
	},                       //注意这里有个，
	//修改文件名
	filename:function(req,file,cb){
	    var fileFormat = (file.originalname).split(".");
    	cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
	}
})
 
var upload = multer({ storage: storage });

// 定义文件上传路由
// router.post('/uploadFilds', upload.single('avatar'), async (ctx) =>{
//   console.log('上传成功')
// });

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})


// const ueditor = require('koa2-ueditor')
// router.all('/editor/controller', ueditor(['public', {
// "imageAllowFiles": [".png", ".jpg", ".jpeg"],
// "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  
// }]))

/*
**前台接口
*/
// 上传图片
router.post('/api/v1/uploadfile', upload.single('avatar'), async (ctx) => {
  console.log('req:', ctx.req.file);
  // req: { 
  //   fieldname: 'avatar',
  //   originalname: '1.jpeg',
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg',
  //   destination: 'uploads/',
  //   filename: '577bd08e854cf266782f8340e21c0e66',
  //   path: 'uploads/577bd08e854cf266782f8340e21c0e66',
  //   size: 661949 
  // }
  // const originalname = ctx.req.file.originalname
  // const ext = originalname.substr(originalname.lastIndexOf('.'));
  ctx.body = { isSuccess: true, message: '上传成功', filename: ctx.req.file.filename };
})


// article
router.post('/api/v1/articlelist', async (ctx) => {
    const { pageNo, pageSize } = ctx.request.body;
    const start = ( pageNo - 1 ) * pageSize;
    try {
      const data = await db.query(`SELECT * FROM act_article ORDER BY ID DESC limit ${start}, ${pageSize}`);
      console.log('data:', data);
      await db.query(`SELECT COUNT(ID) as total FROM act_article`).then(countData => {
        ctx.body = { isSuccess: true, data, total: countData[0].total, message: '请求成功' };
      })
    } catch(err) {
      console.log(err);
    }
})

// article/detail
router.get('/api/v1/article/detail/:id', async (ctx) => {
    try{
      const data = await db.query(`SELECT * FROM act_article WHERE ID=${ctx.params.id}`);
      ctx.body = { isSuccess: true, data, message: '请求成功' };
    } catch (err) {
      console.log(err);
    }
})

// article/mylike  点赞+1
router.post('/api/v1/article/mylike', async (ctx) => {
  const { id, mylike } = ctx.request.body;
  await db.query(`UPDATE act_article SET mylike = ${Number(mylike) + 1} WHERE ID='${id}'`).then(data => {
    ctx.body = { isSuccess: true, message: '点赞成功' };
  })
})

// article/read  阅读+1
router.post('/api/v1/article/myread', async (ctx) => {
  const { id, myread } = ctx.request.body;
  await db.query(`UPDATE act_article SET myread = ${Number(myread) + 1} WHERE ID='${id}'`).then(data => {
    ctx.body = { isSuccess: true, message: '请求成功' };
  })
})


// 文章评论
router.post('/api/v1/comments', async (ctx) => {
  const { articleId, pageNo, pageSize } = ctx.request.body;
  const start = ( pageNo - 1 ) * pageSize;
  try {
    const data = await db.query(`SELECT * FROM act_comments WHERE articleId = ${articleId} AND replyId = 0 ORDER BY ID DESC limit ${start}, ${pageSize}`);
    console.log('data:', data);

    const list = await db.query(`SELECT * FROM act_comments WHERE articleId = ${articleId} AND replyId != 0 ORDER BY ID DESC`);

    console.log('list:', list);
    if (data.length && list.length){
      data.forEach(item => {
        item.list = [];
        list.forEach(items => {
          if (items.replyId == item.ID) {
            item.list.push(items);
          }
        })
      })
      console.log('change_data:', data);
    }
    



    await db.query(`SELECT COUNT(ID) as total FROM act_comments WHERE articleId = ${articleId} AND replyId = 0`).then(countData => {
      ctx.body = { isSuccess: true, data, total: countData[0].total, message: '请求成功' };
    })
  } catch(err) {
    console.log(err);
  }
})

// 添加文章评论
router.post('/api/v1/comments/add', async (ctx) => {
  const { articleId, articleTitle, username, content, avatar } = ctx.request.body;
  let postParam = ctx.request.body; //获取post提交的数据
  console.log('postParam:', postParam);
  
  const date = new Date();
  const timeStr = date.getFullYear() + '-' + until.toDou(date.getMonth()+1) + '-' + until.toDou(date.getDate()) +' '+ until.toDou(date.getHours())+':'+ until.toDou(date.getMinutes()) +':'+ until.toDou(date.getSeconds());
  await db.query(`INSERT INTO act_comments (articleId, articleTitle, username, content, avatar, createtime) VALUES ('${articleId}','${articleTitle}','${username}','${content}','${avatar}','${timeStr}')`).then(data => {
    ctx.body = { isSuccess: true, message: '评论成功' };
  })
})

// 回复文章评论
router.post('/api/v1/comments/reply', async (ctx) => {
  const { articleId, articleTitle, username, content, replyId, avatar } = ctx.request.body;
  let postParam = ctx.request.body; //获取post提交的数据
  console.log('postParam:', postParam);
  
  const date = new Date();
  const timeStr = date.getFullYear() + '-' + until.toDou(date.getMonth()+1) + '-' + until.toDou(date.getDate()) +' '+ until.toDou(date.getHours())+':'+ until.toDou(date.getMinutes()) +':'+ until.toDou(date.getSeconds());
  await db.query(`INSERT INTO act_comments (articleId, articleTitle, username, content, replyId, avatar, createtime) VALUES ('${articleId}','${articleTitle}','${username}','${content}','${replyId}','${avatar}','${timeStr}')`).then(data => {
    ctx.body = { isSuccess: true, message: '回复评论成功' };
  })
})

// message
router.post('/api/v1/messagelist', async (ctx) => {
  const { pageNo, pageSize } = ctx.request.body;
  const start = ( pageNo - 1 ) * pageSize;
  try {
    const data = await db.query(`SELECT * FROM act_message ORDER BY ID DESC limit ${start}, ${pageSize}`);
    console.log('data:', data);
    await db.query(`SELECT COUNT(ID) as total FROM act_message`).then(countData => {
      ctx.body = { isSuccess: true, data, total: countData[0].total, message: '请求成功' };
    })
  } catch(err) {
    console.log(err);
  }
})


// 添加留言
router.post('/api/v1/message/add', async (ctx) => {
  const { username, avatar, content } = ctx.request.body;
  let postParam = ctx.request.body; //获取post提交的数据
  console.log('postParam:', postParam);
  
  const date = new Date();
  const timeStr = date.getFullYear() + '-' + until.toDou(date.getMonth()+1) + '-' + until.toDou(date.getDate()) +' '+ until.toDou(date.getHours())+':'+ until.toDou(date.getMinutes()) +':'+ until.toDou(date.getSeconds());
  await db.query(`INSERT INTO act_message (username, avatar, content, createtime) VALUES ('${username}','${avatar}','${content}','${timeStr}')`).then(data => {
    ctx.body = { isSuccess: true, message: '留言成功' };
  })
})

// sign_up注册
router.post('/api/v1/sign_up', async (ctx) => {
  const { username, phone, password, avatar } = ctx.request.body;
  let postParam = ctx.request.body; //获取post提交的数据
  console.log('postParam:', postParam);
  
  const date = new Date();
  const timeStr = date.getFullYear() + '-' + until.toDou(date.getMonth()+1) + '-' + until.toDou(date.getDate()) +' '+ until.toDou(date.getHours())+':'+ until.toDou(date.getMinutes()) +':'+ until.toDou(date.getSeconds());

  // 用户名不能重复
  const data = await db.query(`SELECT * FROM act_user WHERE username='${username}'`);

  console.log('data:', data);
  if (data.length) {
    ctx.body = { isSuccess: false, message: '用户名已存在' };
  } else {
    await db.query(`INSERT INTO act_user (username, phone, password, avatar, createtime) VALUES ('${username}','${phone}','${password}','${avatar}','${timeStr}')`).then(data => {
      console.log('INSERT data:', data);
      ctx.body = { isSuccess: true, message: '注册成功', data: { username } };
    })
  }

  
})
router.post('/api/v1/sign_in', async (ctx) => {
  const {username, password} = ctx.request.body;
  console.log('username:', username);
  console.log('password:', password);

  await db.query(`SELECT * FROM act_user WHERE username='${username}'`).then(data => {
    if (data.length) {
      if (data[0].password == password) {
        ctx.body = { isSuccess: true, message: '登录成功', avatar: data[0].avatar };
      } else {
        ctx.body = { isSuccess: false, message: '密码错误' };
      }
    } else {
      ctx.body = { isSuccess: false, message: '用户名错误' };
    }
  })
})


/*
**后台接口
*/
// 用户登陆
router.post('/api/v1/admin/login', async (ctx) => {
  const {username, password} = ctx.request.body;
  console.log('username:', username);
  console.log('password:', password);

  await db.query(`SELECT * FROM act_admin WHERE username='${username}'`).then(data => {
    if (data.length) {
      if (data[0].password == password) {
        // let payload = {
        //   exp: Date.now() + tokenExpiresTime,
        //   name: username
        // }
        // let token = jwt.encode(payload, jwtSecret)


        const token = jwt.sign({
          data: 'deanToken'
        }, secret.sign, { expiresIn: 20*60 }); // 20min*60秒

        const token_exp = new Date().getTime();
        ctx.body = { isSuccess: true, message: '登录成功', token, token_exp };
      } else {
        ctx.body = { isSuccess: false, message: '密码错误' };
      }
    } else {
      ctx.body = { isSuccess: false, message: '用户名错误' };
    }
  })
})

// 管理员列表
router.get('/api/v1/admin/superlist', async (ctx) => {
  await db.query(`SELECT * FROM act_admin ORDER BY ID DESC`).then(data => {
    ctx.body = { isSuccess: true, data, message: '请求成功' };
  })
})

// 删除管理员
router.post('/api/v1/admin/superdelete', async (ctx) => {
  const { id } = ctx.request.body;
  await db.query(`DELETE FROM act_admin WHERE ID = '${id}'`).then(data => {
    ctx.body = { isSuccess: true, message: '删除成功' };
  })
})

// 前台用户列表
router.get('/api/v1/admin/userlist', async (ctx) => {
  await db.query(`SELECT * FROM act_user ORDER BY ID DESC`).then(data => {
    ctx.body = { isSuccess: true, data, message: '请求成功' };
  })
})

// 删除用户列表
router.post('/api/v1/admin/userdelete', async (ctx) => {
  const { id } = ctx.request.body;
  await db.query(`DELETE FROM act_user WHERE ID = '${id}'`).then(data => {
    ctx.body = { isSuccess: true, message: '删除成功' };
  })
})

// 文章列表
router.post('/api/v1/admin/articlelist', async (ctx) => {
  const { pageNo, pageSize } = ctx.request.body;
  const start = ( pageNo - 1 ) * pageSize;
  try {
    const data = await db.query(`SELECT * FROM act_article ORDER BY ID DESC limit ${start}, ${pageSize}`);
    console.log('data:', data);
    await db.query(`SELECT COUNT(ID) as total FROM act_article`).then(countData => {
      ctx.body = { isSuccess: true, data, total: countData[0].total, message: '请求成功' };
    })
  } catch(err) {
    console.log(err);
  }
})

// 添加文章
router.post('/api/v1/admin/articleadd', async (ctx) => {
  const { title, imgurl, description, mylike, myread, content } = ctx.request.body;
  let postParam = ctx.request.body; //获取post提交的数据
  console.log('postParam:', postParam);
  
  const date = new Date();
  const timeStr = date.getFullYear() + '-' + until.toDou(date.getMonth()+1) + '-' + until.toDou(date.getDate()) +' '+ until.toDou(date.getHours())+':'+ until.toDou(date.getMinutes()) +':'+ until.toDou(date.getSeconds());
  await db.query(`INSERT INTO act_article (title, imgurl, description, mylike, myread, content, createtime) VALUES ('${title}','${imgurl}','${description}','${mylike}','${myread}','${content}','${timeStr}')`).then(data => {
    ctx.body = { isSuccess: true, message: '添加成功' };
  })
})

// 修改文章
router.post('/api/v1/admin/articlemodify', async (ctx) => {
  const { id, title, imgurl, description, mylike, myread, content } = ctx.request.body;
  await db.query(`UPDATE act_article SET title = '${title}', imgurl = '${imgurl}', description = '${description}', mylike = '${mylike}', myread = '${myread}', content = '${content}' WHERE ID = '${id}'`).then(data => {
    ctx.body = { isSuccess: true, message: '更新成功' };
  })
})

// 删除文章  并删除相对应的评论
router.post('/api/v1/admin/articledel', async (ctx) => {
  const { id } = ctx.request.body;
  try {
    const res = await db.query(`DELETE FROM act_article WHERE ID = '${id}'`);
    console.log('res:', res);
    await db.query(`DELETE FROM act_comments WHERE articleId = '${id}'`).then(data => {
      ctx.body = { isSuccess: true, message: '删除成功' };
    })
  } catch(err) {
    console.log(err);
  }
})

// 留言列表
router.post('/api/v1/admin/messagelist', async (ctx) => {
  const { pageNo, pageSize } = ctx.request.body;
  const start = ( pageNo - 1 ) * pageSize;
  try {
    const data = await db.query(`SELECT * FROM act_message ORDER BY ID DESC limit ${start}, ${pageSize}`);
    console.log('data:', data);
    await db.query(`SELECT COUNT(ID) as total FROM act_message`).then(countData => {
      ctx.body = { isSuccess: true, data, total: countData[0].total, message: '请求成功' };
    })
  } catch(err) {
    console.log(err);
  }
})

// 删除留言
router.post('/api/v1/admin/messagedel', async (ctx) => {
  const { id } = ctx.request.body;
  await db.query(`DELETE FROM act_message WHERE ID = '${id}'`).then(data => {
    ctx.body = { isSuccess: true, message: '删除成功' };
  })
})

// 评论列表
router.post('/api/v1/admin/commentslist', async (ctx) => {
  const { pageNo, pageSize } = ctx.request.body;
  const start = ( pageNo - 1 ) * pageSize;
  try {
    const data = await db.query(`SELECT * FROM act_comments ORDER BY ID DESC limit ${start}, ${pageSize}`);
    console.log('data:', data);
    await db.query(`SELECT COUNT(ID) as total FROM act_comments`).then(countData => {
      ctx.body = { isSuccess: true, data, total: countData[0].total, message: '请求成功' };
    })
  } catch(err) {
    console.log(err);
  }
})

// 删除评论
router.post('/api/v1/admin/commentsdel', async (ctx) => {
  const { id } = ctx.request.body;
  await db.query(`DELETE FROM act_comments WHERE ID = '${id}'`).then(data => {
    ctx.body = { isSuccess: true, message: '删除成功' };
  })
})


module.exports = router;
