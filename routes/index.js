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
      childProcess.on('error', (error) => {
        console.error("childProcess on error", error.message);
        reject(error);
      });

      // 监听子进程的关闭事件
      childProcess.on('close', (code) => {
        console.log("childProcess on close", scriptOutput);
        resolve(code);
      });

      // 启动超时计时器
      setTimeout(() => {
        // 如果子进程没有正常退出，则手动终止子进程
        childProcess.kill();
        console.error('Child process timed out and was terminated.');
        reject("响应超时")
      }, 10 * 1000);

    });

    console.log(`Child process exited with code: ${exitCode}`);
    ctx.body = {
      title: 'webhook received!',
      requestBody
    }


  } catch (error) {
    // 处理脚本执行过程中的错误
    console.error("error=", error);
  }


})

module.exports = router
