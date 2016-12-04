
##简介
####这是一个基于CSS3的应用在移动端的左右滑动插件,有两种滑动模式:(分别为行滑动,块滑动)

###[Demo](http://www.pzhwangkai.com/swipe/index.html/)`请调成移动设备模式刷新查看`

##使用以及配置
####支持一个页面下多个实例,但是需要每个实例HTML元素最外围标记不同的class来区分


##使用
#### 需要加载依赖的CSS文件swipe.css,插件JS在swipe.js中。(.min文件为压缩版本,全部大小只有10KB)


##配置信息和实例对象
####插件初始化配置信息
```javascript
    var config = {
        //用于查找元素的class名  在一个页面 实例化多个应用的时候使用 默认值是: 'swipe-war' (string类型)
        queryClass : 
        //快速滑动和慢速滑动的判断阀值 默认值300  单位ms (number类型)
        quickIsSlowDelay:
        //滑动时间 单位ms 默认值500  (number类型)
        slideTime: 
        //回滚阀值 回滚使用在按住不松手移动阶段 默认值100  单位px (number类型)
        rollBack: 
        //回滚阀值回退时间 回滚使用在按住不松手移动阶段 默认值300   单位ms (number类型)
        rollBackDelay: 
        //是否启用按住滑动 默认值true (number类型)
        pressSwipeFlag: 
        //松手慢速滑动 根据pressSwipeFlag判断取反 默认值300 (boolen类型) 
        slowSlideFlag : 
        //是否启用内连滑动模式 默认值false (boolen类型) 
        inlineMode : 
        //是否启用显示页码索引列表 默认值false (boolen类型) 
        pageListMode: 
        //索引列表样式,并判断输入pageList的样式参数是否正确,不正确使用返回默认样式值替换 
        //默认值pageListClass对象 (object类型)
        pageListClass: 
        //块滑动翻页界限 默认0.3  (number类型 最大1 最小0 )
        blockSlideLimit: 
    };

    //索引列表样式的默认对象
    var pageListClass = {
        borderColor:'#ff8000',
        borderWidth:'1px',
        width: '16px',
        height: '16px',
        marginLeft: '5px',
        active:'#f30'
    };
	//配置插件 返回实例化对象
    var test_swipe =  Swipe(config);


    `返回的实例化对象的属性`

	//容器的dom
    test_swipe.container;
    //子节点的dom列表
    test_swipe.itemList;
    //子节点的长度
    test_swipe.length;
    //容器的最大宽度
    test_swipe.MaxWidth;
    //视窗的宽度
    test_swipe.screenWidth;


    `返回的实例化对象的方法`

    //返回移动量
    swipe.getMoveValue();
    //返回块滑动当前元素索引
    swipe.getBlockIndex();
    //设置移动量
    //@value 必须是数值类型 不大于0 不小于最长item长度
    //@blockFlag 块模式 如果为true并且没有启用行模式 则设置块翻页
    swipe.setMoveValue(value,blockFlag);
    //块模式按照元素滑动索引移动
    //@index = 索引
    swipe.setIndexMove(index);
    //重置配置
    //@cfg = 配置对象
    //@resetInit = true 重新初始化
    swipe.resetConfig(cfg,resetInit);

    `关于swipe.resetConfig(cfg,resetInit)方法的特别说明！`
    /*
     *cfg对象只包括重置以下属性
     *   quickIsSlowDelay
     *	 slideTime	
     *   rollBack
     *   rollBackDelay
     *   pressSwipeFlag
     *   slowSlideFlag
     *   blockSlideLimit
     *
     *  resetInit=true重新初始化并不会重新生成一个新的swipe实例化对象
     *
    */
```



##例子
####在DEMO中使用的是下面的配置以及方法

`html文件`
```html
<!--行模式-->
<div class="swipe-war list-tab">
	<!--自定义list-tab样式名,用于区分这个实例-->
    <div class="swipe-container">
        <div class="swipe-item tab-item">首页</div>
        <div class="swipe-item tab-item">电器</div>
        <div class="swipe-item tab-item">女装</div>
        <div class="swipe-item tab-item">男装</div>
        <div class="swipe-item tab-item">儿童玩具</div>
        <div class="swipe-item tab-item">数码音影</div>
        <div class="swipe-item tab-item">家具用品</div>
        <div class="swipe-item tab-item">手机平板</div>
    </div>
</div>
<!--块模式-->
<div class="swipe-war list-container-one">
	<!--自定义list-container-one样式名,用于区分这个实例-->
    <div class="swipe-container">
        <div class="swipe-item test red">占位1</div>
        <div class="swipe-item test gay">占位2</div>
        <div class="swipe-item test blue">占位占位3</div>
        <div class="swipe-item test yellow">占位4</div>
        <div class="swipe-item test gay">占位占位5</div>
        <div class="swipe-item test yellow">占位6</div>
        <div class="swipe-item test red">占位7</div>
        <div class="swipe-item test blue">占位8</div>
        <div class="swipe-item test blue">占位占位9</div>
        <div class="swipe-item test yellow">占位10</div>
        <div class="swipe-item test gay">占位占位11</div>
        <div class="swipe-item test yellow">占位12</div>
    </div>
</div>
<!--块带索引标签模式-->
 <div class="swipe-war list-container-two">
 	<!--自定义list-container-two样式名,用于区分这个实例-->
    <div class="swipe-container">
        <div class="swipe-item test-two red">占位1</div>
        <div class="swipe-item test-two gay">占位2</div>
        <div class="swipe-item test-two blue">占位占位3</div>
        <div class="swipe-item test-two yellow">占位4</div>
        <div class="swipe-item test-two gay">占位占位5</div>
        <div class="swipe-item test-two yellow">占位6</div>
        <div class="swipe-item test-two red">占位7</div>
        <div class="swipe-item test-two blue">占位8</div>
    </div>
</div>
```

`配置插件`
```javascript
window.onload = function(){
    //头部标签
     var tab = Swipe({
        queryClass: 'list-tab',
        rollBack: 50,
        inlineMode: true,
        rollBackDelay:500
     });

    //不带page块级滑动
    var swipe_block = Swipe({
        queryClass: 'list-container-one',
        rollBack: 150,
        quickIsSlowDelay: 500,
        rollBackDelay : 150,
        blockSlideLimit : 0.5
    });

    //带page块级滑动
    var swipe_page = Swipe({
        queryClass: 'list-container-two',
        rollBack: 200,
        blockSlideLimit : 0.2,
        pageListMode: true,
        pageListClass: {
            borderColor:'#fff',
            borderWidth:'2px',
            active:'#000'
        }
    });
    
    setTimeout(function(){
        swipe_block.setMoveValue(-1650,true);
        console.log(swipe_block.getMoveValue());
        console.log(swipe_block.getBlockIndex());
    },2000);

    setTimeout(function(){
        swipe_page.setIndexMove(2);
        console.log(swipe_page.getMoveValue());
        console.log(swipe_page.getBlockIndex());
    },3000);
}
```

