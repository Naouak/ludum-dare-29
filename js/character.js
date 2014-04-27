var sound = document.getElementById("sound");

var playSound = function(file){
    sound.src = " assets/"+file;
    sound.load();
    sound.play();
};

var Level = function(chars_count,hero_count, chars_combination, hero_combination, old_score, next_level ){


    that = this;

    function Character(sprite1, sprite2, hero, sound){
        var thatChar = this;
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
                    score.score += Math.max(Math.floor(10000-that.time_elapsed/10),2500);


                } else {
                    score.score -= 100;
                }
                sprite1_div.className += " killed";
                if(sound){
                    playSound(sound);
                }
                setTimeout(function(){
                    sprite1_div.parentNode.removeChild(sprite1_div);
                },1000);

                sprite2_div.parentNode.removeChild(sprite2_div);

                return true;
            }
            return false;
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
                    thatChar.move();
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
                    thatChar.move();
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
        var dist = -10000;
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
                dist = Math.min(value,0);
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

    function Score(score){
        var score_div = document.getElementById("score");
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
    var score = new Score(old_score);

    var timer_div = document.getElementById("timer");
    var start = new Date();
    Object.defineProperty(this, "time_elapsed", {
        get: function(){
            return new Date().getTime()-start.getTime();
        }
    });

    var hero_count_div = document.getElementById("hero_count");

    var game_node = document.querySelector("#game");
    game_node.appendChild(Character.sprite1_layer);
    game_node.appendChild(Character.sprite2_layer);

    var chars = [];
    var combination = null;
    var char = null;
    for(var i = 0; i < chars_count; i++){
        combination = chars_combination[Math.floor(Math.random()*chars_combination.length)];
        char = new Character(combination[0],combination[1], false, combination[2]);
        chars.push(char);
        char.addToDOM();
    }
    for(i = 0; i < hero_count; i++){
        combination = hero_combination[Math.floor(Math.random()*hero_combination.length)];
        char = new Character(combination[0],combination[1], true, combination[2]);
        chars.push(char);
        char.addToDOM();
    }

    Character.sprite2_layer.onclick = function(e){
        var pos = [e.pageX - game_node.offsetLeft, e.pageY - game_node.offsetTop];
        for(var i = 0; i < chars.length; i++){
            if(chars[i].hit(pos)){
                chars.splice(i,1);
                i--;
            }
        }
    };

    var mainloop = function(){
        var hero_count = 0;
        for(var i = 0; i < chars.length; i++){
            chars[i].randomMove();
            if(chars[i].isHero()){
                hero_count++;
            }
        }
        spot.update();
        hero_count_div.innerHTML = hero_count;
        timer_div.innerHTML = Math.round(that.time_elapsed/1000);
        if(hero_count > 0){
            requestAnimationFrame(mainloop)
        } else {
            setTimeout(function(){
                Character.sprite1_layer.parentNode.removeChild(Character.sprite1_layer);
                Character.sprite2_layer.parentNode.removeChild(Character.sprite2_layer);
                next_level(score.score);
            },1000);
        }
    };
    requestAnimationFrame(mainloop);

    this.killAll = function(){
    }
};
