# electron 踩坑之旅(三) —— electron + vue + edge

既然是前端来开发客户端, 前端界面绘制肯定不会使用原生开发, 那么如何在 `Electron` 呢, 这里我使用的是 `vue-cli-plugin-electron-builder`

> [# Vue CLI Plugin Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/)

## 搭建 vue 环境

具体搭建方法请参考 [Vue CLI](https://cli.vuejs.org/zh/guide/)

```
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```
#### 检查版本
```
vue --version
```
#### 创建项目
```
vue create electron-vue-edge
```
根据自己的需求选择对应的配置项

#### 运行项目

```
cd electron-vue-edge
yarn serve OR npm run serve
```

## vue-cli-plugin-electron-builder

使用插件在 `vue` 项目中集成 `Electron`

```
vue add electron-builder
```
运行过程中需要选择版本, 这里选择的是 `13.0.0` 版本

#### 运行项目
```
npm run electron:serve
```

#### 打包项目
```
npm run electron:build
```

## electron-edge-js

具体如何使用可以参考 [# electron 踩坑之旅(二) —— 调用 .Net 的 DLL](https://juejin.cn/post/7035250118538297374)

#### 安装
```
yarn add electron-edge-js -S
```

#### 使用
```vue
<template>
  <div id="app">
    <h1>Welcome to Your Vue.js App</h1>
    <button @click="testEdge">testEdge</button>
  </div>
</template>

<script>
import edge from 'electron-edge-js'
export default {
  name: 'App',
  methods: {
    testEdge() {
      const helloWorld = edge.func(function () {/*
    async (input) => {
        return ".NET Welcomes " + input.ToString();
    }
*/});
      helloWorld('Electron', (error, value) => {
        console.log(error, value)
      })
    }
  }
}
</script>
```

#### 第一个坑

此时会报第一个错

```
Uncaught ReferenceError: __dirname is not defined
```

我们需要在根目录创建 `vue.config.js`

```
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  }
}
```

#### 第二个坑

第二个报错

```
Uncaught Error: The edge module has not been pre-compiled for Electron version 13.6.2  . You must build a custom version of edge.node. Please refer to https://github.com/agracio/edge-js for building instructions.
```

我们需要对应配置

```
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['electron-edge-js']
    }
  }
}
```

重新运行可以发现

```
undefined ".NET Welcomes Electron"
```

至此我们可以安全使用 `Electron` + `vue` + `edge` 

## 调用 Dll

#### 准备 Dll 文件

将 DLL 文件放入 `public/dll` 文件夹中

#### 执行方法

```HTML
<button @click="testDll">testDll</button>
```

```JavaScript
testDll() {
  const Invoke = edge.func({
    assemblyFile: 'public/dll/electronedge.dll',
    typeName: "electronedge.MQ",
    methodName: "Invoke"
  })
  Invoke('Electron', (error, value) => {
    console.log(error, value)
  })
}
```

#### 执行结果

```
undefined "来自dll : 2021-11-27 23:05:48.924 Electron"
```
## 32 位 .net

如果执行的 DLL 文件是按照 32 位编译的或者依赖了其他 32 为程序, 那么就需要安装对应 32 为 的 `Electron`
```
npm install --arch=ia32 electron
```

#### 编译 32 位程序
最后打包程序的时候也要修改为 32 位的
```json
"script": {
   "electron:build": "vue-cli-service electron:build --ia32"
}
```
