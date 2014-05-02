//Set the canvas defaults
//Including a white background
function canvasInit(){
    context = document.getElementById("test").getContext("2d");
    context.lineCap = "round";
    //Fill it with white background
    context.save();
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas_side, canvas_side);
    context.restore();
}


$(function(){
    var canvas, cntxt, top, left, draw, draw = 0;
    //Get the canvas element
    canvas = document.getElementById("test");
    cntxt = canvas.getContext("2d");
    top = 270;
    left = 540;

    //Drawing Code
    $('#test').mousedown(function(e){
        if(e.button == 0){
            draw = 1;
            //Start The drawing flow
            cntxt.beginPath();
            cntxt.moveTo(e.pageX-left, e.pageY-top);
        }
        else{
            draw = 0;
        }
    })
    .mouseup(function(e){
        if(e.button != 0){
            draw = 1;
        }
        else{
            draw = 0;
            cntxt.lineTo(e.pageX-left+1, e.pageY-top+1);
            cntxt.stroke();
            cntxt.closePath();
        }
    })
    .mousemove(function(e){
        if(draw == 1){
            cntxt.lineTo(e.pageX-left+1, e.pageY-top+1);
            cntxt.stroke();
        }
    });

    $('#clean').click(function(e){
        e.preventDefault();
        canvas.width = canvas.width;
        canvas.height = canvas.height;
        canvasInit();
        cntxt = canvas.getContext("2d");
        cntxt.lineWidth = 10;
        cntxt.strokeStyle = 'black';
    });
    cntxt.lineWidth = 10;
    cntxt.strokeStyle = 'black';
})
