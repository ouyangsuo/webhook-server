const router = require('koa-router')()

// const { exec } = require('child_process');
const { spawn } = require('child_process');

function runChildProcess(command, args, cwd, timeout) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, { cwd });

    // 监听子进程的标准输出事件
    childProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      console.log(output);
    });

    // 监听子进程的错误输出事件
    childProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    // 监听子进程的关闭事件
    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Child process exited with code: ${code}`));
      }
    });

    // 如果超时时间设定，则启动超时计时器
    if (timeout) {
      setTimeout(() => {
        if (childProcess.exitCode === null) {
          childProcess.kill();
          console.error("子进程超时死亡！");
          reject(new Error('Child process execution timed out.'));
        }
      }, timeout);
    }
  });
}


router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

/* webhook */
router.post('/webhook', async (ctx, next) => {

  // 示例调用
  runChildProcess('sudo', ['sh', 'zhima-manager.sh'], "/root/webhook-server", 20 * 1000)
    .then((output) => {
      console.log('Child process output:', output);
      ctx.body = {
        output
      }
    })
    .catch((error) => {
      console.error('Error executing child process:', error);
      ctx.body = {
        error
      }
    });
})

module.exports = router
