const router = require('koa-router')()
const { exec } = require('child_process');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

/* webhook */
router.post('/webhook', async (ctx, next) => {
  const requestBody = ctx.request.body;
  // console.log("requestBody", requestBody);

  // 执行Shell脚本，示例中使用的是一个简单的命令"echo Hello, World!"
  const { stdout } = await exec('sh zhima-manager.sh');
  console.log("sh zhima-manager.sh 运行完毕！stdout=", stdout);

  ctx.body = {
    title: 'webhook received!',
    requestBody
  }

})

module.exports = router
