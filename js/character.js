

var Level = function(chars_count,hero_count ){
    var chars_combination = [
        ["ben","nude"]
    ];

    var hero_combination = [
        ["ben","spiderman"]
    ];

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

        this.hit = function(pos){
            if(pos[0] > left && pos[0] < left+64 && pos[1] > top && pos[1] < top+100){
                if(hero){
                    score.score += 10;
                    sprite1_div.style.border = "solid blue 1px";
                } else {
                    score.score -= 1;
                    sprite1_div.parentNode.removeChild(sprite1_div);
                    sprite2_div.parentNode.removeChild(sprite2_div);
                }
                return true;
            }
            return false;
        }

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
            if(last_move*0.0001 > Math.random()){
                last_move = 0;
                vect[0] = Math.random()-0.5;
                vect[1] = Math.random()-0.5;
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

    Character.sprite1_layer = document.createElement("div");
    Character.sprite1_layer.className = "layer1";
    Character.sprite2_layer = document.createElement("div");
    Character.sprite2_layer.className = "layer2";

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

    function Score(){
        var score_div = document.getElementById("score");
        var score = 0;
        Object.defineProperty(this,"score", {
            set: function(value){
                score = value;
                score_div.innerHTML = score;
            },
            get: function(){
                return score;
            }
        });

    }

    var score = new Score();

    var game_node = document.querySelector("#game");
    game_node.appendChild(Character.sprite1_layer);
    game_node.appendChild(Character.sprite2_layer);

    var chars = [];
    var combination = null;
    var char = null;
    for(var i = 0; i < chars_count; i++){
        combination = chars_combination[Math.floor(Math.random()*chars_combination.length)];
        char = new Character(combination[0],combination[1], false);
        chars.push(char);
        char.addToDOM();
    }
    for(i = 0; i < hero_count; i++){
        combination = hero_combination[Math.floor(Math.random()*hero_combination.length)];
        char = new Character(combination[0],combination[1], true);
        chars.push(char);
        char.addToDOM();
    }

    console.log(chars);

    Character.sprite2_layer.onclick = function(e){
        var pos = [e.pageX - game_node.offsetLeft, e.pageY - game_node.offsetTop];
        for(var i = 0; i < chars.length; i++){
            if(chars[i].hit(pos) && !chars[i].isHero()){
                chars.splice(i,1);
                i--;
            }
        }
    };

    var mainloop = function(){
        for(var i = 0; i < chars.length; i++){
            chars[i].randomMove();
        }
        spot.update();
        requestAnimationFrame(mainloop)
    };
    mainloop();
};
