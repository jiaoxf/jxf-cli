#!/usr/bin/env node

const { program } = require('commander') 
const download = require('download-git-repo')
const templateMap  = require('./templateMap')

const { chooseTemplate } = require('./inquirers')

const ora = require('ora') // loading插件
const chalk = require('chalk'); // 命令行颜色插件

const { modifyPackage } = require('./modifyFiles') // 修改packjosn名字

function start() {
  console.log(chalk.rgb(255, 153, 0)('\n 😬 😬 😬  欢迎使用jxf-cli'))
  
  /* 
    ** 版本号
  */
  program.version(require('./package.json').version) 

  program
    .command('create <projectName>')
    .description('用于创建一个项目模板')
    .option("-T, --template [template]", "输入使用的模板名字")
    .action(async function (projectName, options) {
      let template = options.template;
      projectName = projectName || 'untitled';

      if (!template) {
        template = await chooseTemplate() // 注意这里是一个异步方法
      }
      console.log(chalk.rgb(255, 153, 0)('你选择的项目模板：'), chalk.bgRgb(0, 58, 140)(template))
      // 下载前提示loading
      const spinner = ora({
        text: '正在下载模板...',
        color: "yellow",
        spinner: {
          interval: 80,
          frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
        },
      });
      spinner.start();

      const downloadUrl = templateMap.get(template) // templateMap是一个引入的自定义Map

      download(downloadUrl, projectName, { clone: true }, async error => {
        if (error) {
          spinner.fail(`创建项目失败：${projectName}`)
          console.log('失败原因：', error.message)
        } else {
          spinner.succeed(chalk.rgb(82, 196, 26)('成功创建项目 ：'), chalk.bgRgb(0, 58, 140)(projectName) )
          
          // spinner.succeed(`成功创建项目：${projectName}`)
          await modifyPackage(projectName)

          console.log(chalk.rgb(67, 67, 67)('$'),'cd', projectName)
          console.log(chalk.rgb(67, 67, 67)('$'), 'yarn serve')
          console.log('🌚 🌚 🌚', chalk.rgb(82, 196, 26)('觉得好用给个Star '));
          
        }
      })

    });


  program
    .command('checkAll')
    .description('查看所有的模板')
    .action(function () {
      const templateList = [
        'vue-js-template',
        'vue-ts-template'
      ]
      templateList.forEach((temp, index) => {
        console.log(`(${index + 1})  ${temp}`)
      })
    })

  program.parse(process.argv);
}
start()

