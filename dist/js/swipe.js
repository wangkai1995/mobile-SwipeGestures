/*
 * html5 mobile swipte gestures
 *
 * 0.0.0  
 * 暂不支持上下滑动 只能左右滑动  
 *
 * wangkai  
 * 2016.12.4  china shenzhen
 *
*/
function Swipe(cfg){
    /****************参数配置********************/
    var swipe = {};
    //判断参数是否设置
    //@未定义返回true 定义返回false
    function isUndefined(obj){
        //同时过滤null和undefined
        if(typeof obj == 'undefined'){
            return true;
        }
        return false;
    }
    //判断输入pageList的样式参数是否正确,不正确使用返回默认样式值替换
    function validtionListClass(obj){
        var key = [];
        var classObj = pageListClass;
        if(typeof obj !== 'object'){
            return pageListClass;
        }
        for(var name in pageListClass){
            key.push(name);
        }
        for( var item in obj){
            if(key.indexOf(item) !== -1){
                classObj[item] = obj[item];
            }
        }
        return classObj;
    }
    //判断输入的class名
    //返回规范的class名
    function validtionClass(select){
        if(typeof select !== 'string'){
            throw new Error('查询元素类型不合法');
        }else{
            if(select.indexOf('.') !== -1){
                return select;
            }

            return '.'+select;
        }
    }

    //pageList的样式
    var pageListClass = {
        borderColor:'#ff8000',
        borderWidth:'1px',
        width: '16px',
        height: '16px',
        marginLeft: '5px',
        active:'#f30'
    };

    //配置
    var config = {
        //用于查找元素的class名  在一个页面 实例化多个应用的时候使用
        queryClass : !isUndefined(cfg.queryClass)? validtionClass(cfg.queryClass) : '.swipe-war',
        //快速滑动和慢速滑动的判断阀值
        quickIsSlowDelay : !isUndefined(cfg.quickIsSlowDelay)? cfg.quickIsSlowDelay : 300,
        //滑动时间 ms
        slideTime : !isUndefined(cfg.slideTime)? cfg.slideTime : 500,
        //回滚阀值 回滚使用在按住不松手移动阶段  px
        rollBack : !isUndefined(cfg.rollBack)? cfg.rollBack : 100,
        //回滚阀值回退时间 回滚使用在按住不松手移动阶段   ms 
        rollBackDelay: !isUndefined(cfg.rollBackDelay)? cfg.rollBackDelay : 300,
        //是否启用按住滑动
        pressSwipeFlag: !isUndefined(cfg.pressSwipeFlag)? cfg.pressSwipeFlag : true,
        //松手慢速滑动 根据pressSwipeFlag 判断取反
        slowSlideFlag : !isUndefined(cfg.pressSwipeFlag)? true : false,
        //是否启用内连滑动模式
        inlineMode : !isUndefined(cfg.inlineMode)? cfg.inlineMode : false,
        //是否启用显示页码索引列表
        pageListMode : !isUndefined(cfg.pageListMode)? cfg.pageListMode : false,
        //索引列表样式
        pageListClass : !isUndefined(cfg.pageListClass)?  validtionListClass(cfg.pageListClass) : pageListClass,
        //块滑动翻页界限 默认0.3 最大1 最小0
        blockSlideLimit : !isUndefined(cfg.blockSlideLimit)? cfg.blockSlideLimit : 0.3
    };

    var viem = {
            totalWidth: window.screen.width,
            halfWidth: window.screen.width/2
        },
        container = {
            war: '',            //绑定事件的容器
            dom: '',            //容器DOM
            height: 0,          //容器高度
            width: 0,           //容器宽度
            moveLeft:0,         //向左移动距离
            moveTop:0           //向右移动距离
        },
        item = {
            dom: [],
            page: [],
            length: 0,
            totalWidth: 0
        };

    var start = {
            x : 0,
            y : 0,
            time : 0
        },
        move = {
            x : 0,
            y : 0
        },
        end = {
            x : 0,
            y : 0,
            time : 0
        };
    /***************对外提供的方法****************/
    //获取一些对外的属性 保存在 swipe中
    function setSwipeAttribute(){
        //容器的dom
        swipe.container = container.dom;
        //子节点的列表
        swipe.itemList = item.dom;
        //子节点的长度
        swipe.length = item.length;
        //容器的最大宽度
        swipe.MaxWidth = item.totalWidth;
        //视窗的宽度
        swipe.screenWidth = viem.totalWidth;
    }
    //返回移动量
    swipe.getMoveValue = function(){
        //移动量
    	return container.moveLeft;
    };
    //返回块滑动当前元素索引
    swipe.getBlockIndex = function(){
        if(!config.inlineMode){
            return block.index;
        }
        console.log('必须处于块移动模式','swipe');
    };
    //设置移动量
    //@value 必须是数值类型 不大于0 不小于最长item长度
    //@blockFlag 块模式 如果为true并且没有启用行模式 则设置块翻页
    swipe.setMoveValue = function(value,blockFlag){
    	if(typeof value === 'number'){
    		if(value > 0){
    			console.log('输入值大于零则默认等于0','swipe');
    			value = 0;
                container.moveLeft = value;
                setTransform(container.moveLeft ,config.rollBackDelay);
                return false;
    		}else if(value < -(item.totalWidth-item.dom[item.length-1].clientWidth) ){
    			console.log('输入值最小不能小于item集合的总长度','swipe');
    			value = -(item.totalWidth-item.dom[item.length-1].clientWidth);
                container.moveLeft = value;
                setTransform(container.moveLeft ,config.rollBackDelay);
                return false;
    		}
    		//是否块模式
    		if(blockFlag && !config.inlineMode){
                var range = 0;
                for(var i=0; i<item.length; i++){
                    if(Math.abs(value) < range){
                        // 判断是否到达翻页阀值
                        if(item.dom[i].clientWidth - (range -Math.abs(value) ) > item.dom[i-1].clientWidth*config.blockSlideLimit ){
                            container.moveLeft = -(range);
                            setTransform(container.moveLeft ,config.rollBackDelay);
                            //设置元素索引
                            block.index = i;
                        }else{
                            container.moveLeft = -(range-item.dom[i-1].clientWidth);
                            setTransform(container.moveLeft ,config.rollBackDelay);
                            //设置元素索引
                            block.index = i-1;
                        }
                        return false;
                    }else{
                        range += item.dom[i].clientWidth;
                    }
                }
    		}else{
    			container.moveLeft = value;
    			setTransform(container.moveLeft ,config.rollBackDelay);
    		}
    	}else{
    		console.log('输入值必须是数值类型','swipe');
    	}
    };
    //块模式按照元素索引移动
    //@index = 索引
    swipe.setIndexMove = function(index){
        if(config.pageListMode && !config.inlineMode){
            if(index <0 || index > item.length-1){
                console.log('索引越界','swipe');
                return false;
            }
            block.clickPage(index);
        }
    };
    //重置配置
    //@cfg = 配置对象
    //@resetInit = true 重新初始化
    swipe.resetConfig = function(cfg,resetInit){
        config.quickIsSlowDelay = !isUndefined(cfg.quickIsSlowDelay)? cfg.quickIsSlowDelay : config.quickIsSlowDelay;
        config.slideTime = !isUndefined(cfg.slideTime)? cfg.slideTime : config.slideTime;
        config.rollBack = !isUndefined(cfg.rollBack)? cfg.rollBack :  config.rollBack;
        config.rollBackDelay = !isUndefined(cfg.rollBackDelay)? cfg.rollBackDelay : config.rollBackDelay;
        config.pressSwipeFlag = !isUndefined(cfg.pressSwipeFlag)? cfg.pressSwipeFlag : config.pressSwipeFlag;
        config.slowSlideFlag = !isUndefined(cfg.slowSlideFlag)? cfg.slowSlideFlag : config.slowSlideFlag;
        config.blockSlideLimit = !isUndefined(cfg.blockSlideLimit)? cfg.blockSlideLimit : config.blockSlideLimit;
        if(resetInit){
            init();
        }
    };


    /***************公共函数部分******************/
    //设置容器DOM的transform   
    function setTransform(move,delay){
        //这里还需要修改 IOS9.0以下和安卓5 以下需要加webkit 以上则不需要加
        container.dom.setAttribute('style','-webkit-transform: translate3d('+move+'px, 0px, 0px); transition-duration :'+delay+'ms;');
    }
    //按住中滑动量计算
    //@clientX=当前X轴坐标
    //#返回当前滑动量 正数为向右 负数向左
    function pressSlideValue(clientX){
        var value = 0;
        if(clientX-start.x > 0){
            //向左滑动
            if(move.x  === 0){
                value = clientX-start.x;
                move.x  = clientX;
            }else{ 
                value = clientX-move.x;
                move.x  = clientX;
            }
        }else{
            //向右滑动
            if(move.x  === 0){
                value = Math.abs(clientX)-Math.abs(start.x);
                move.x  = clientX;
            }else{ 
                value = Math.abs(clientX)-Math.abs(move.x);
                move.x  = clientX;
            }
        }
        return value;
    }
    //非按住滑动距离限制
    //@value=滑动量
    //#返回滑动量(在限制范围内)
    function SlideLimit(value){
    	var move = value;
    	//右方向滑动
    	if(move > 0){
            move = 0;
        //左方向滑动
        }else if( Math.abs(move) + viem.totalWidth > item.totalWidth ){
            move = -(item.totalWidth-viem.totalWidth);
        }

        return move;
    }
    //行级按住滑动距离限制
    //@value=滑动量
    //#返回滑动量(在限制范围内)
    function inlinePressSlideLimit(value){
    	var move = value;
    	//对拖动做限制
        //container.moveLeft < 0 右拖动限制
        //Math.abs(container.moveLeft) + viem.totalWidth ) < item.totalWidth  左拖动限制            
        if(move - config.rollBack > 0){
            move = config.rollBack;
        }else if(  (-move + viem.totalWidth - config.rollBack) > item.totalWidth){
            move = -(item.totalWidth-viem.totalWidth) - config.rollBack;
        }
        return move;
    }
    //块级按住滑动距离限制
    //@value=滑动量 @clientWidth=块的长度
    //#返回滑动量
    function blockPressSlideLimit(value,clientWidth){
    	var move = value;
    	if( value  + config.rollBack > clientWidth){
            value  = clientWidth-config.rollBack;
        }else if( -(value) + config.rollBack > clientWidth ){
            value  = -(clientWidth - config.rollBack); 
        }
        return value;
    }
    //添加样式
    //@el=元素
    //@classStyle=样式名 
    function addClass(el,classStyle){
        var reg = new RegExp( '/\s|^'+classStyle+'\s|$/' );
        if(!el.className.match(reg) ){
            el.className += ' '+classStyle;
        }
    }
    //删除样式
    //@el=元素
    //@classStyle=样式名
    function removeClass(el,classStyle){
        var reg = new RegExp( '/\s|^'+classStyle+'\s|$/' );
        if( el.className.match(reg) ){
             el.className.replace(reg,'');
        }
    }
    //激活对应的页码标签
    //@index需要激活的索引
    function activePage(index){
        if(item.page.length !== 0){
            for(var i =0; i<item.length ;i++){
                 item.page[i].style.backgroundColor = 'transparent';
                 if(i === index){
                    item.page[i].style.backgroundColor = config.pageListClass['active'];
                 }
            }

        }
    }

    /***************内连模式滑动函数部分******************/ 
    var inline = {
        //按住不松开的滑动处理
        //暂未完善，有待修改 上下滑动未处理
        pressSwipe : function(clientX,clientY){
            //这种方式是及时移动
            //如果是左右滑动
            if( Math.abs(clientX-start.x) > Math.abs(clientY-start.y) ){

                container.moveLeft += pressSlideValue(clientX);
                //对拖动做限制
                container.moveLeft = inlinePressSlideLimit(container.moveLeft);

                setTransform(container.moveLeft ,config.rollBackDelay);
            }else{
                //上下滑动未处理
            }
        },
        //松手之后的滑动处理
        letGoSwipe : function(){
            //判断快速滑动还是慢速滑动
            //@阀值设为500MS
            var moveTime = end.time - start.time;

            if(moveTime < config.quickIsSlowDelay){
                //快速滑动
                this.quickSlide();
            }else{
                if(config.slowSlideFlag){
                    //慢速滑动
                    this.slowSlide();
                }else{
                    //回弹
                    this.rollBackSlide();
                }
            }
        },
        //快速滑动 滑动距离=移动距离X2
        //上下滑动未处理
        quickSlide : function(){
            //判断上下滑动还是左右滑动
            var moveX  = end.x - start.x,
                moveY = end.y - start.y;

                //左右滑动
                if( Math.abs(moveX) > Math.abs(moveY) ){   
                    //右滑动距离限制

                    container.moveLeft  += moveX*2;
                    container.moveLeft = SlideLimit(container.moveLeft );

                    setTransform(container.moveLeft ,config.rollBackDelay);
                }else{
                    //上下滑动
                }
        },
        //慢速滑动 滑动距离=移动距离X1
        //上下滑动未处理
        slowSlide : function(){
            //判断上下滑动还是左右滑动
            var moveX  = end.x - start.x,
                moveY = end.y - start.y;

                //左右滑动
                if( Math.abs(moveX) > Math.abs(moveY) ){   
                    //右滑动距离限制

                    container.moveLeft  += moveX + moveX/5;
                    container.moveLeft = SlideLimit(container.moveLeft );

                    setTransform(container.moveLeft ,config.rollBackDelay);

                }else{
                    //上下滑动
                }
        },
        //滑动回弹
        rollBackSlide : function(){
            //判断上下滑动还是左右滑动
            var moveX  = end.x - start.x,
                moveY = end.y - start.y;

            //左右滑动
            if( Math.abs(moveX) > Math.abs(moveY) ){
            	//限制滑动距离
            	container.moveLeft = SlideLimit(container.moveLeft );  
                setTransform(container.moveLeft ,config.rollBackDelay);
            }else{
            //上下滑动

            } 
        }
    };
    /***************块级模式滑动函数部分******************/
    //块级滑动没有慢速滑动
    //按住滑动不进行翻页 翻页在回弹中进行
    var block = {
        //滑动元素索引
        index : 0,
        //按住时候滑动累加值
        moveleft : 0,
        //按住不松开的滑动处理
        pressSwipe : function(clientX,clientY){
            //这种方式是及时移动
            //如果是左右滑动
            if( Math.abs(clientX-start.x) > Math.abs(clientY-start.y) ){

                this.moveleft  += pressSlideValue(clientX);

                //块级对拖动做限制
                var clientWidth = item.dom[this.index].clientWidth;
                this.moveleft  = blockPressSlideLimit(this.moveleft ,clientWidth);

                setTransform(container.moveLeft+this.moveleft  ,config.rollBackDelay);
            }else{
            //上下滑动未处理
            }
        },
        //松手之后的滑动处理
        //！！如果启用了页码索引 并且 el===li 则不启动快速滑动
        //@el === 滑动范围中的元素
        letGoSwipe :function(el){
            //判断快速滑动还是慢速滑动
            //@阀值设为500MS
            var moveTime = end.time - start.time;
            if(moveTime < config.quickIsSlowDelay){
                //如果启用了页码索引 并且 el=li 则不启动快速滑动
                if(!config.pageListMode && el.tagName !== 'LI'){
                    //快速滑动
                    this.quickSlide();
                }else{
                    //回弹
                    this.rollBackSlide();
                }
            }else{
                //回弹
                this.rollBackSlide();
            }
            //清除一下及时滑动的数据
            this.moveleft = 0;
        },
        //快速滑动
        //上下滑动未处理
        quickSlide :function(){
            //判断上下滑动还是左右滑动
            var moveX  = end.x - start.x,
                moveY = end.y - start.y;
            //左右滑动
            if( Math.abs(moveX) > Math.abs(moveY) ){          
                //翻页处理
                container.moveLeft  = this.slideMove(false,moveX);
                //左右滑动限制
                container.moveLeft = SlideLimit(container.moveLeft );
                //开始滑动
                setTransform(container.moveLeft ,config.rollBackDelay);
            }else{
            //上下滑动
            }
        },
        //滑动回弹
        //配合按住不松开滑动使用
        rollBackSlide : function(){
            //判断上下滑动还是左右滑动
            var moveX  = end.x - start.x,
                moveY = end.y - start.y;

            //左右滑动
            if( Math.abs(moveX) > Math.abs(moveY) ){ 
                //翻页处理
                container.moveLeft  = this.slideMove(true,moveX,this.moveleft);
                //左右滑动距离限制
                container.moveLeft = SlideLimit(container.moveLeft );

                setTransform(container.moveLeft ,config.rollBackDelay);
            }else{
            //上下滑动
            } 
        },
        //点击页码滚动
        //@index = 当前点击的标签索引
        clickPage:function(index){  

            console.log(index);
            var move = 0;
            if(index === 0){
                move = 0;
            }else{
                for(var i =0; i<index ;i++){
                    move += item.dom[i].clientWidth;
                }
            }
            console.log(move);
            container.moveLeft = -move;
            this.index = index;  
            setTransform(container.moveLeft ,config.rollBackDelay);
            activePage(this.index); 
        },
        //块翻页处理
        //@rollBack true  =回弹翻页 
        //@rollBack false =快速滑动翻页
        //@direction >0 向右 <0向左
        //@value = 当前移动量 快速滑动的时候不输入
        //返回翻页移动量
        slideMove : function(rollBack,direction,value){
        	var moveleft = container.moveLeft,
        		move = 0;

        	if(rollBack){
        		//滑动面积要超过当前块面积的百分之30 才做翻页处理
                if( Math.abs(value) > item.dom[this.index].clientWidth*config.blockSlideLimit){
                    len = this.index===0? 1 : this.index+1;
                    for(var i =0; i<len ;i++){
                        move += item.dom[i].clientWidth;
                    }
                    if(direction > 0){
                       moveleft += move-Math.abs(container.moveLeft);
                       this.index--;
                       if(this.index < 0){
                            this.index = 0;
                       } 
                    }else{
                       moveleft -= move-Math.abs(container.moveLeft); 
                       this.index++;
                       if(this.index > item.length-1){
                            this.index = item.length-1;
                       }
                    }
                }
        	}else{
        		//左右滑动
                //计算滑动距离 翻页还是后退
                //是否启用按住滑动
                if(!config.pressSwipeFlag){
                    move = item.dom[this.index].clientWidth;
                    if(direction > 0){
                       moveleft += move;
                       this.index--;
                       if(this.index < 0){
                            this.index = 0;
                       } 
                    }else{
                       moveleft -= move; 
                       this.index++;
                       if(this.index > item.length-1){
                            this.index = item.length-1;
                       }
                    }
                }else{
                    var len = this.index===0? 1 :this.index+1;
                    for(var i =0; i<len ;i++){
                        move += item.dom[i].clientWidth;
                    }
                    if(direction > 0){
                       moveleft += move-Math.abs(container.moveLeft);
                       this.index--;
                       if(this.index < 0){
                            this.index = 0;
                       } 
                    }else{
                       moveleft -= move-Math.abs(container.moveLeft); 
                       this.index++;
                       if(this.index > item.length-1){
                            this.index = item.length-1;
                       }
                    }
                }  
        	}
            //是否启动页码模式 启动则激活对应的标签
            if(config.pageListMode){
                activePage(this.index);
            }

        	return moveleft;
        }
    };
    /*****************初始化**********************/    
    function init(select){
        container.war = document.querySelectorAll(config.queryClass)[0];
        container.dom = document.querySelectorAll(config.queryClass+' .swipe-container')[0];
        container.height = container.dom.clientHeight;
        container.width = container.dom.clientWidth;
        item.dom= document.querySelectorAll(config.queryClass+' .swipe-container .swipe-item');
        item.length = item.dom.length;
        for(var i=0,len =item.dom.length; i<len ;i++){
            item.totalWidth += item.dom[i].clientWidth;
        }

        // console.log(config);
        // console.log(container);
        // console.log(item);
        // console.log(viem);

        touchEventInit();
        pageListInit();
        setSwipeAttribute();
    }
    //索引列表初始化
    function pageListInit(){
        if(config.pageListMode){
            var list = document.createElement('ul');
            for(var i = 0; i< item.length ;i++){
                var li = document.createElement('li');

                for(var key in config.pageListClass){
                    if(key !== 'active'){
                        li.style[key] = config.pageListClass[key];
                    }   
                }
                //第一个元素初始化的时候默认选中
                if(i === 0){
                    li.style.backgroundColor = config.pageListClass['active'];
                }
                item.page.push(li);
                //设置索引标志 并且赋值点击事件
                li.setAttribute('data-index',i);
                li.addEventListener('click',pageListClickEvent);
                //标签插入列表中
                list.appendChild(li);
            }

            var div = document.createElement('div');
            div.className = 'swipe-page-list';
            div.appendChild(list);
            container.war.appendChild(div);
        }
    }
    //索引列表点击事件
    function pageListClickEvent(event){
        event.stopPropagation();          //阻止冒泡传播
        var index = parseInt(event.srcElement.getAttribute('data-index'));
        block.clickPage(index);
    }

    /******************滑动事件*******************/
    //注册滑动事件
    function touchEventInit(){
        container.war.addEventListener('touchstart',touchStartEvent,false);
        container.war.addEventListener('touchmove',touchMoveEvent,false);
        container.war.addEventListener('touchend',touchEndEvent,false);
    }
    //滑动开始事件
    function touchStartEvent(event){
        event.stopPropagation();          //阻止冒泡传播
        //这个阻止默认行为不能禁止 不然无法触发索引标签的click
        //event.preventDefault();              
        start.x = event.changedTouches[0].clientX;
        start.y = event.changedTouches[0].clientY;
        start.time = new Date().getTime();
        move.x = 0;
        move.y = 0;
    }
    //滑动中事件
    function touchMoveEvent(event){
        event.stopPropagation();     //阻止冒泡传播
        event.preventDefault();      //阻止默认行为 这个很重要 在有滑动翻页的浏览器下 不禁止这个行为会导致翻页
        var clientX = event.changedTouches[0].clientX,
            clientY = event.changedTouches[0].clientY;

        //这种方式是按住不放移动
        if(config.pressSwipeFlag){
            //判断是块级滑动还是内连
            if(config.inlineMode){
                inline.pressSwipe(clientX, clientY);
            }else{
                block.pressSwipe(clientX, clientY);
            }
        }
    }
    //滑动结束事件
    function touchEndEvent(event){
        event.stopPropagation();      //阻止冒泡传播
        //这个阻止默认行为不能禁止 不然无法触发索引标签的click
        //event.preventDefault();           
        end.x = event.changedTouches[0].clientX;
        end.y = event.changedTouches[0].clientY;
        end.time = new Date().getTime();
        //松手之后
        //判断是块级滑动还是内连
        if(config.inlineMode){
            inline.letGoSwipe();
        }else{
            block.letGoSwipe(event.srcElement);
        }
    }
    

    /******************初始化运行*******************/

    init();

    return swipe;
}


