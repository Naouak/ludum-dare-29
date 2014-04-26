Character.sprite1_layer = document.createElement("div");
Character.sprite2_layer = document.createElement("div");

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
    var right = (Math.random()*(960-100));

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
        "right",
        {
            set: function(value){
                value = Math.max(0,value);
                value = Math.min(value, 960-100);
                right = value;
                that.move();
            },
            get: function(){
                return right;
            }
        }
    );

    this.move = function(){
        sprite1_div.style.left = left+"px";
        sprite1_div.style.right = right+"px";
        sprite2_div.style.left = left+"px";
        sprite2_div.style.right = right+"px";
    };

    this.move();

    console.log("position: %d %d",left,right);
}

var game_node = document.querySelector("#game");
game_node.appendChild(Character.sprite1_layer);
game_node.appendChild(Character.sprite2_layer);