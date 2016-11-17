
window.onload = function(){
    var swipe = Swipe();
};


function Swipe(config){

    /****************参数配置********************/
    var swipe = {};

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

    /***************公用函数部分******************/    


    /*****************初始化**********************/    
    function init(select){
        container.war = document.querySelectorAll('.swipe-war')[0];
        container.dom = document.querySelectorAll('.swipe-container')[0];
        container.height = container.dom.clientHeight;
        container.width = container.dom.clientWidth;
        item.dom= document.querySelectorAll('.swipe-container .swipe-item');
        for(var i=0,len =item.dom.length; i<len ;i++){
            item.totalWidth += item.dom[i].clientWidth;
        }

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
        event.stopPropagation();
        start.x = event.changedTouches[0].clientX;
        start.y = event.changedTouches[0].clientY;
        start.time = new Date().getTime();
        move.x = 0;
        move.y = 0;
    }
    //滑动中事件
    function touchMoveEvent(event){
        event.stopPropagation();
        var clientX = event.changedTouches[0].clientX,
            clientY = event.changedTouches[0].clientY;

            //这种方式是及时移动 在安卓下面体验不太好 尝试另外一种 在touchEndEvent 中做处理
            pressSwipe(clientX,clientY);
    }
    //滑动结束事件
    function touchEndEvent(event){
        event.stopPropagation();
        end.x = event.changedTouches[0].clientX;
        end.y = event.changedTouches[0].clientY;
        end.time = new Date().getTime();
    }

    /************按住不松开的滑动处理**************/
    function pressSwipe(clientX,clientY){
        //这种方式是及时移动 在安卓下面体验不太好 尝试另外一种 在touchEndEvent 中做处理
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
            if(container.moveLeft > 0){
                container.moveLeft = 0;
            }else if( (-container.moveLeft + viem.totalWidth) > item.totalWidth){
                container.moveLeft = -(item.totalWidth-viem.totalWidth);
            }

            //这里还需要修改 IOS9.0以下和安卓5 以下需要加webkit 以上则不需要加
            container.dom.setAttribute('style','-webkit-transform: translate3d('+container.moveLeft+'px, 0px, 0px)');

        }else{
            //如果是上下滑动
            console.log( Math.abs(clientY-start.y),'y' );
        }
    }

    /************松手之后的滑动处理****************/
    function letGoSwipe(){

    }

    init();

    return swipe;
}