
window.onload = function(){
    var swipe = Swipe({
        rollBack: 150
    });
};


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

    var config = {
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
        inlineMode : !isUndefined(cfg.inlineMode)? cfg.inlineMode : false
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
            dom: '',
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

    /***************公共函数部分******************/
    //设置容器DOM的transform   
    function setTransform(move,delay){
        //这里还需要修改 IOS9.0以下和安卓5 以下需要加webkit 以上则不需要加
        container.dom.setAttribute('style','-webkit-transform: translate3d('+move+'px, 0px, 0px); transition-duration :'+delay+'ms;');
    }


    /***************内连模式滑动函数部分******************/ 
    var inline = {
        //按住不松开的滑动处理
        //暂未完善，有待修改 上下滑动未处理
        pressSwipe : function(clientX,clientY){
            //这种方式是及时移动
            //如果是左右滑动
            if( Math.abs(clientX-start.x) > Math.abs(clientY-start.y) ){

                if(clientX-start.x > 0){

                    //向左滑动
                    if(move.x  === 0){
                        container.moveLeft += clientX-start.x;
                        move.x  = clientX;
                    }else{ 
                        container.moveLeft += clientX-move.x;
                        move.x  = clientX;
                    }

                }else{

                    //向右滑动
                    if(move.x  === 0){
                        container.moveLeft += Math.abs(clientX)-Math.abs(start.x);
                        move.x  = clientX;
                    }else{ 
                        container.moveLeft += Math.abs(clientX)-Math.abs(move.x);
                        move.x  = clientX;
                    }

                }

                //对拖动做限制
                //container.moveLeft < 0 右拖动限制
                //Math.abs(container.moveLeft) + viem.totalWidth ) < item.totalWidth  左拖动限制            
                if(container.moveLeft - config.rollBack > 0){
                    container.moveLeft = config.rollBack;
                }else if( (-container.moveLeft + viem.totalWidth - config.rollBack) > item.totalWidth){
                    container.moveLeft = -(item.totalWidth-viem.totalWidth) - config.rollBack;
                }

                setTransform(container.moveLeft ,config.rollBackDelay);
            }else{
                //如果是上下滑动
                console.log( Math.abs(clientY-start.y),'y' );
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

                    if(container.moveLeft > 0){
                        container.moveLeft = 0;
                    //左滑动距离限制
                    }else if( (Math.abs(container.moveLeft) + viem.totalWidth) > item.totalWidth ){
                        container.moveLeft = -(item.totalWidth-viem.totalWidth);
                    }

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

                    if(container.moveLeft > 0){
                        container.moveLeft = 0;
                    //左滑动距离限制
                    }else if( (Math.abs(container.moveLeft) + viem.totalWidth) > item.totalWidth ){
                        container.moveLeft = -(item.totalWidth-viem.totalWidth);
                    }

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
                if(container.moveLeft > 0){
                    container.moveLeft = 0;
                //左滑动距离限制
                }else if( (Math.abs(container.moveLeft) + viem.totalWidth) > item.totalWidth ){
                    container.moveLeft = -(item.totalWidth-viem.totalWidth);
                }

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
                //临时变量 不计入累加
                 if(clientX-start.x > 0){

                    //向左滑动
                    if(move.x  === 0){
                        this.moveleft  += clientX-start.x;
                        move.x  = clientX;
                    }else{ 
                        this.moveleft  += clientX-move.x;
                        move.x  = clientX;
                    }

                }else{

                    //向右滑动
                    if(move.x  === 0){
                        this.moveleft  += Math.abs(clientX)-Math.abs(start.x);
                        move.x  = clientX;
                    }else{ 
                        this.moveleft  += Math.abs(clientX)-Math.abs(move.x);
                        move.x  = clientX;
                    }

                }

                //块级对拖动做限制
                //container.moveLeft < 0 右拖动限制
                //Math.abs(container.moveLeft) + viem.totalWidth ) < clientWidth 左拖动限制 
                var clientWidth = item.dom[this.index].clientWidth;

                if( this.moveleft  + config.rollBack > clientWidth){
                    this.moveleft  = clientWidth-config.rollBack;
                }else if( -(this.moveleft) + config.rollBack > clientWidth ){
                    this.moveleft  = -(clientWidth - config.rollBack); 
                }

                setTransform(container.moveLeft+this.moveleft  ,config.rollBackDelay);

            }else{
                //如果是上下滑动
                console.log( Math.abs(clientY-start.y),'y' );
            }
        },
        //松手之后的滑动处理
        letGoSwipe :function(){
            //判断快速滑动还是慢速滑动
            //@阀值设为500MS
            var moveTime = end.time - start.time;

            if(moveTime < config.quickIsSlowDelay){
                //快速滑动
                this.quickSlide();
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
                //左右滑动
                //计算滑动距离 翻页还是后退
                //是否启用按住滑动
                if(!config.pressSwipeFlag){
                    var move = item.dom[this.index].clientWidth;
                    if(moveX > 0){
                       container.moveLeft += move;
                       this.index--;
                       if(this.index < 0){
                            this.index = 0;
                       } 
                    }else{
                       container.moveLeft -= move; 
                       this.index++;
                       if(this.index > item.length-1){
                            this.index = item.length-1;
                       }
                    }
                }else{
                    var move = 0,
                        len = this.index===0? 1 :this.index+1;
                    for(var i =0; i<len ;i++){
                        move += item.dom[i].clientWidth;
                    }
                    if(moveX > 0){
                       container.moveLeft += move-Math.abs(container.moveLeft);
                       this.index--;
                       if(this.index < 0){
                            this.index = 0;
                       } 
                    }else{
                       container.moveLeft -= move-Math.abs(container.moveLeft); 
                       this.index++;
                       if(this.index > item.length-1){
                            this.index = item.length-1;
                       }
                    }
                }
                

                //左右滑动限制
                if( (-container.moveLeft)+viem.totalWidth  >= item.totalWidth ){
                    //左滑动
                    container.moveLeft = -(item.totalWidth - viem.totalWidth);
                }else if(container.moveLeft > 0){
                    //右滑动
                    container.moveLeft = 0;
                }
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

                //滑动面积要超过当前块面积的百分之30 才做翻页处理
                if( Math.abs(this.moveleft) > item.dom[this.index].clientWidth/3){
                    var move = 0,
                    len = this.index===0? 1 : this.index+1;
                    for(var i =0; i<len ;i++){
                        move += item.dom[i].clientWidth;
                    }
                    if(moveX > 0){
                       container.moveLeft += move-Math.abs(container.moveLeft);
                       this.index--;
                       if(this.index < 0){
                            this.index = 0;
                       } 
                    }else{
                       container.moveLeft -= move-Math.abs(container.moveLeft); 
                       this.index++;
                       if(this.index > item.length-1){
                            this.index = item.length-1;
                       }
                    }
                }

                // console.log(this.index);
                // console.log(Math.abs(this.moveleft));

                //右滑动距离限制
                if(container.moveLeft > 0){
                    container.moveLeft = 0;
                //左滑动距离限制
                }else if( (-container.moveLeft)+viem.totalWidth  >= item.totalWidth  ){
                    container.moveLeft = -(item.totalWidth - viem.totalWidth);
                }

                setTransform(container.moveLeft ,config.rollBackDelay);
            }else{
            //上下滑动
            } 
        }
    };
    /*****************初始化**********************/    
    function init(select){
        container.war = document.querySelectorAll('.swipe-war')[0];
        container.dom = document.querySelectorAll('.swipe-container')[0];
        container.height = container.dom.clientHeight;
        container.width = container.dom.clientWidth;
        item.dom= document.querySelectorAll('.swipe-container .swipe-item');
        item.length = item.dom.length;
        for(var i=0,len =item.dom.length; i<len ;i++){
            item.totalWidth += item.dom[i].clientWidth;
        }

        console.log(config);
        console.log(container);
        console.log(item);
        console.log(viem);

        touchEventInit();
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
        event.preventDefault();           //阻止默认行为 这个很重要 在有滑动翻页的浏览器下 不禁止这个行为会导致翻页
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
        event.preventDefault();       //阻止默认行为 这个很重要 在有滑动翻页的浏览器下 不禁止这个行为会导致翻页
        end.x = event.changedTouches[0].clientX;
        end.y = event.changedTouches[0].clientY;
        end.time = new Date().getTime();
        //松手之后
        //判断是块级滑动还是内连
        if(config.inlineMode){
            inline.letGoSwipe();
        }else{
            block.letGoSwipe();
        }
    }

    /******************初始化运行*******************/

    init();

    return swipe;
}