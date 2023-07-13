const router = require('koa-router')()

// const { exec } = require('child_process');
const { spawn } = require('child_process');

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

  try {
    const requestBody = ctx.request.body;

    // 使用spawn函数执行Shell脚本
    const childProcess = spawn(
      'sudo',
      ['sh', 'zhima-manager.sh'],
      {
        cwd: '/root/webhook-server' // 设置子进程的工作目录
      }
    );
    console.log("childProcess 已启动...");

    // 等待子进程结束，并解析出子进程的退出码
    const exitCode = await new Promise((resolve, reject) => {
      let scriptOutput = '';

      // 监听子进程的输出事件
      childProcess.stdout.on('data', (data) => {
        scriptOutput += data.toString();
      });

      // 监听子进程的错误事件
      childProcess.stderr.on('data', (data) => {
        console.error("childProcess.stderr on error", data.toString());
      });

      // 监听子进程的关闭事件
      childProcess.on('close', (code) => {
        console.log("childProcess on close", scriptOutput);
      });
    });

    ctx.body = {
      title: 'webhook received!',
      requestBody
    }
    console.log("消息已送回Github");

  } catch (error) {
    // 处理脚本执行过程中的错误
    console.error("error=", error);
  }


})

module.exports = router
