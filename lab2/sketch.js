class Monster{
    constructor(){
        this.x = width;
        this.y = height / 2;
        this.speed = 2;
    }
    move(){
        this.x -= this.speed;
    }
    draw(){
        text("🤢",this.x, this.y );
    }
    reset(){
        this.x = width; 
        this.y = random(0,height);
        this.speed += 1;
    }
   
}
class Rocket{
    constructor(){
        this.x = 20;
        this.lifes = 3;
    }
    
    draw(){
        text("🚀",this.x, mouseY );
    }
}


let monster;
let rocket;


function setup() {
    createCanvas(600, 400);
    
    monster = new Monster (); 
    rocket = new Rocket();

}

function draw() {
    background(200);

    rocket.draw();

    if (rocket.lifes == 0) {

        text('Game over' , 100 , 200);


    }
    else{
        monster.move();
        monster.draw();


        if(monster.x < 20){
            print(monster.y - mouseY);
            if (abs(monster.y - mouseY) > 10){
                rocket.lifes -= 1 ;
            }

            monster.reset();
        }
    }

    text('❤' + rocket.lifes, 10 , 40)



}

