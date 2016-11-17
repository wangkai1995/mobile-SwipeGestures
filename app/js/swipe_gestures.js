
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
            dom: '',        //容器DOM
            height: 0,      //容器高度
            width: 0,       //容器宽度
            left:0,
            top:0
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
        end = {
            x : 0,
            y : 0,
            time : 0
        };


    /*****************初始化**********************/    
    function init(select){
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

        touchEvent();
    }

    /******************滑动事件*******************/
    function touchEvent(){
        container.dom.addEventListener('touchstart',touchStartEvent,false);
        container.dom.addEventListener('touchmove',touchMoveEvent,false);
        container.dom.addEventListener('touchend',touchEndEvent,false);
    }

    function touchStartEvent(event){
        event.stopPropagation();
        start.x = event.changedTouches[0].clientX;
        start.y = event.changedTouches[0].clientY;
        start.time = new Date().getTime();
    }

    function touchMoveEvent(event){
        event.stopPropagation();
        var clientX = event.changedTouches[0].clientX,
            clientY = event.changedTouches[0].clientY;
            //如果是左右滑动
            if( Math.abs(clientX-start.x) > Math.abs(clientY-start.y) ){

                 if(container.left == 0){
                    container.left = clientX - start.x;
                 }else{
                    if(container.left > clientX ){
                        container.left -= container.left-clientX;   //-15 -= -16-18 = -17
                    }else{
                        container.left += clientX-container.left;   //-15 
                    }
                 }

                if(container.left<0){
                    container.dom.setAttribute('style','transform: translate3d('+container.left+'px, 0px, 0px)');
                }else{
                    container.dom.setAttribute('style','transform: translate3d('+container.left+'px, 0px, 0px)');
                }

            }else{
                //如果是上下滑动
                console.log( Math.abs(clientY-start.y),'y' );
            }

    }

    function touchEndEvent(event){
        event.stopPropagation();
        end.x = event.changedTouches[0].clientX;
        end.y = event.changedTouches[0].clientY;
        end.time = new Date().getTime();
    }


    init();

    return swipe;
  
}