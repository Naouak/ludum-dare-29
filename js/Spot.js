var Spot = function(node){
    var that = this;
    var pos = [0,0];
    var dist = 0;
    var move =
    Object.defineProperty(this,"pos" , {
        set: function(value){
            this.dist += Math.pow(value[0]-pos[0],2) + Math.pow(value[1]-pos[1],2);
            pos = value;
            updatePosition();
        },
        get: function(){
            return pos;
        }
    });
    Object.defineProperty(this,"dist", {
        set: function(value){
            dist = value;
            node.style.opacity = Math.max(1 - dist/1000000, 0.2);
        },
        get: function(){
            return dist;
        }
    });

    var updatePosition = function(){
        var x = pos[0];
        var y = pos[1];
        node.style.backgroundPosition = (x-100)+"px "+(y-100)+"px";
        node.style.clipPath = "circle("+x+"px, "+y+"px, 80px)";
        node.style.MozClipPath = "circle("+x+"px, "+y+"px, 80px)";
        node.style.webkitClipPath = "circle("+x+"px, "+y+"px, 80px)";
    };

    node.onmousemove = function(e){
        that.pos = [e.pageX - game_node.offsetLeft, e.pageY - game_node.offsetTop];
    };

    node.style.zIndex = 99999999;

    this.update = function(){
        that.dist = Math.max(0, that.dist - 1000);
    }
};

var spot = new Spot(Character.sprite2_layer);