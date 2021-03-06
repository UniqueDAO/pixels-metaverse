中文 / [English](https://github.com/UniqueDAO/pixels-metaverse/blob/main/README.md) 

该项目基于 [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth) 框架开发


# 像素元宇宙

## 像素元宇宙简介：

像素元宇宙是一个百分百由玩家自主绘制的世界，在元宇宙中，每个居民都可以将现实中的一切进行复制和克隆。宇宙居民不受随机数的约束，可以自主决定自己的宇宙身份、外貌、装备以及资产等。宇宙中有各种身份和职能供居民选择，如他们可以选择医生、警察或者商人等等。作为医生，他可以改变居民的性别或者是样貌。作为商人，他可以制作眼镜、口罩、帽子等等产品进行出售。

## 像素元宇宙特点

* 高度自治化: 像素元宇宙是一个高度自治且去中心化的，用户所有资产都是在链上，不可篡改和伪造。所有资产不存储于任何中心化的服务器，仅仅在区块链获取到数据后通过开源的前端UI组件即可绘制用户的区块链身份等信息，不与任何资源链接做绑定。

* 万物资产化: 像素元宇宙合约继承了ERC721标准的所有接口和功能，所有资产均可全链流通。宇宙中所有物品、器官、资产等都是ERC721标准的TOKEN，宇宙中的一切都进行了TOKEN化。

* 资产乐高化: 用户可通过合约来重组配置自己，重组性特别强。制作的产品越精细，可组合性越强，宇宙越清晰越丰富，是真正的实现了NFT碎片化。

* 宇宙层级化: 像素元宇宙分为5个层级，每个层级都是一个独立的合约，所有资产又同处于一个ERC721合约。每个层级的居民有不同的行为和样式。如层次分明层宇宙的居民只有有跑跳等功能，而洞察秋毫层宇宙却可以进行竞技类游戏。宇宙可支持像素越细，宇宙功能则会越丰富。宇宙不断社会化，发展越趋近于现实世界。

## 像素元宇宙现状和未来

当前元宇宙已在原来的头像绘制的基础上升级为万物合成阶段。当前居民可以上传任何物品图片，通过算法生成像素画。并通过对该像素画的复制来生成和发行该像素部位对应的资产。

当前宇宙初始有10000个原始居民名额，是为创世像素元宇宙居民。当宇宙升级到渺若烟云层时，也就是可绘制身体以及四肢时。原始居民可以选择自己的职业和性别或身份，在选择一定时间后可以通过男女配对来生育子女，每个子女成人后也可以通过配对生育他们的子女。宇宙总人口1024000，直到达到宇宙总人口便不
再新增居民。

最高层级的元宇宙可以体验到大部分现实世界的生活，居民可通过木工身份来建造宇宙的房屋和家具等等，而出租车司机可以通过自身携带的属性将居民快速的送往目的地，而没有交通工具的居民仅仅只能花费更多的时间和精力。居民可以体验生老病死、富贵美丑等，满足你内心深处对于自己理想身份的所有幻想。

未来宇宙的场景可以很丰富，这一切都是在所有居民共同作用下实现的。所以，加入像素元宇宙吧，让我们去创建自己的宇宙。在像素元宇宙的世界里，自由翱翔吧。


## 项目启动
```sh
1. yarn
2. yarn compile
3. yarn test
4. yarn deploy1 --network kovan
5. yarn abi:api
6. modify source:
      address: "new address"
      abi: PixelsMetaverse
      startBlock: new block
7. yarn graph-codegen
8. yarn graph-build
9. 发布至graph
```

> 当前项目基于truffle框架开发，如果仅仅只是查看项目可无需安装，若需重新部署合约，则需要安装truffle，具体可参考该[truffle框架文档](https://learnblockchain.cn/docs/truffle/index.html)

> 合约部署后需要设置721合约token的发行者，可自行编写代码调用接口，或者是安装 [contract-json-converted-html](https://github.com/xiangzhengfeng/truffle-contract-json-converted-html) npm包，将truffle生成的智能合约json文件直接转换成html文件，可以自动生成可视化的页面进行调用和查看数据。

> 新版本暂未在其他网络部署合约，仅在自己本地部署了。故其他开发者 <strong>yarn start</strong> 后的合约地址是无效的，此时可以通过truffle部署在本地或者其他网络便可，部署成功后，将部署后的新合约地址新增到 <strong>converted.config.js</strong> 中即可。

## 当前任务
1. 将该truffle框架升级为hardhat
2. 将webjs和自己编写的交互逻辑改为开源的web3-react。


## react-pixels-metaverse
项目中将所有绘制进行了封装和抽离，任何项目方或网站都可以安装 [react-pixels-metaverse](https://github.com/UniqueDAO/react-pixels-metaverse) 该npm包，并在自己的项目中引入UI组件，传入用户地址或身份数据即可生成他的像素元宇宙身份图案。

> 链接 [https://uniquedao.github.io](https://UniqueDAO.github.io/#/) 的版本是最初不合规版本，新版改动较大，仅做参考。