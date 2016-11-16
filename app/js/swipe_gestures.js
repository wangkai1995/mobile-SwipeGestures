
window.onload = function(){

    var swipe = Swipe('.swipe-container');

    console.log(swipe);

};


function Swipe(select){
    var swipe = {};

    var container = {
            height: 0,
            width: 0
        },
        item = '';

    var startX = 0,
        startY = 0,
        startTime  = 0;


    function init(select){
        var war = document.querySelectorAll(select)[0];
        container.height = war.clientHeight;
        container.width = war.clientWidth
        item = document.querySelectorAll(select+' div');

        console.log(container);
        console.log(item);
    };

    init(select);

    return swipe;
  
}