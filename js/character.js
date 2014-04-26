Character.sprite1_layer = document.createElement("div");
Character.sprite1_layer.className = "layer1";
Character.sprite2_layer = document.createElement("div");
Character.sprite2_layer.className = "layer2";


function Character(sprite1, sprite2, hero){
    var that = this;
    var sprite1_div = document.createElement("div");
    sprite1_div.className = "character "+sprite1;

    var sprite2_div = document.createElement("div");
    sprite2_div.className = "character_under "+sprite2;

    this.isHero = function(){
        return hero;
    };

    this.addToDOM = function(){
        Character.sprite1_layer.appendChild(sprite1_div);
        Character.sprite2_layer.appendChild(sprite2_div);
    };

    var left = (Math.random()*(960-64));
    var top = (Math.random()*(960-100));

    Object.defineProperty(
        this,
        "left",
        {
            set: function(value){
                value = Math.max(0,value);
                value = Math.min(value, 960-64);
                left = value;
                that.move();
            },
            get: function(){
                return left;
            }
        }
    );
    Object.defineProperty(
        this,
        "top",
        {
            set: function(value){
                value = Math.max(0,value);
                value = Math.min(value, 960-100);
                top = value;
                that.move();
            },
            get: function(){
                return top;
            }
        }
    );

    var vect = [0,0];
    var last_move = 10;

    this.randomMove = function(){
        this.left += vect[0];
        this.top += vect[1];
        if(last_move*0.01 > Math.random()){
            last_move = 0;
            vect[0] = Math.random()*2-1;
            vect[1] = Math.random()*2-1;
        } else {
            last_move++;
        }

    };

    this.move = function(){
        sprite1_div.style.left = left+"px";
        sprite1_div.style.top = top+"px";
        sprite1_div.style.zIndex = Math.floor(top);
        sprite2_div.style.left = left+"px";
        sprite2_div.style.top = top+"px";
        sprite2_div.style.zIndex = Math.floor(top);
    };
    this.move();
}

var game_node = document.querySelector("#game");
game_node.appendChild(Character.sprite1_layer);
game_node.appendChild(Character.sprite2_layer);


Character.sprite2_layer.onmousemove = function(e){
    var x = e.pageX - game_node.offsetLeft;
    var y = e.pageY - game_node.offsetTop;
    var coords = [
        y-80,
        x+80,
        y+80,
        x-80
    ];
//    console.log(e);
    Character.sprite2_layer.style.backgroundPosition = (x-100)+"px "+(y-100)+"px";
    Character.sprite2_layer.style.clip = "rect("+
        coords.join("px, ")
        +"px)";
}