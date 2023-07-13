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

    let scriptOutput = '';

    // 监听子进程的输出事件
    childProcess.stdout.on('data', (data) => {
      scriptOutput += data.toString();
      console.log("childProcess on data");
    });

    // 监听子进程的错误事件
    childProcess.stderr.on('error', (error) => {
      console.error("childProcess on error",error.message);
    });

    // 监听子进程的关闭事件
    childProcess.on('close', (code) => {
      // 将脚本执行结果作为响应返回给客户端
      // ctx.body = `Script output: ${scriptOutput}`;
      console.log("childProcess on close", scriptOutput);
    });

    ctx.body = {
      title: 'webhook received!',
      requestBody
    }


  } catch (error) {

    // 处理脚本执行过程中的错误
    console.error("error=", error);
    // ctx.body = {
    //   error
    // }

  }


})

module.exports = router
