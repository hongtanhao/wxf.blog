const scpClient = require('scp2');
const ora = require('ora');
const chalk = require('chalk');
const server = require('./products');
const spinner = ora(
  '正在发布到'  +  `服务器[${server.host}]`
);

var Client = require('ssh2').Client;

var conn = new Client();
conn
  .on('ready', function() {
    // rm 删除dist文件，\n 是换行 换行执行 重启nginx命令 我这里是用docker重启nginx
    conn.exec('rm -rf /mdm/nginx/dist\ndocker restart nginx', function(
      err,
      stream
    ) {
      if (err) throw err;
      stream
        .on('close', function(code, signal) {
          // 在执行shell命令后，把开始上传部署项目代码放到这里面
          spinner.start();
          scpClient.scp(
            './public',
            {
              host: server.host,
              port: server.port,
              username: server.username,
              password: server.password,
              path: server.path
            },
            function(err) {
              spinner.stop();
              if (err) {
                console.log(chalk.red('发布失败.\n'));
                throw err;
              } else {
                console.log(
                  chalk.green(
                    'Success! 成功发布到' +
                        `服务器[${server.host}]\n`
                  )
                );
              }
            }
          );

          conn.end();
        })
        .on('data', function(data) {
          console.log('STDOUT: ' + data);
        })
        .stderr.on('data', function(data) {
          console.log('STDERR: ' + data);
        });
    });
  })
  .connect({
    host: server.host,
    port: server.port,
    username: server.username,
    password: server.password
    //privateKey: require('fs').readFileSync('/home/admin/.ssh/id_dsa')
  });