class Monster{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    draw(){
        text("🤢",this.x, this.y );
    }
    move(){
        this.x=random(0,width);
        this.y=random(0,hight);
    }
}

let m1 = new Monster (150 , 100);
let m2 = new Monster (200 , 50);
let m3 = new Monster (250 , 200);


function setup() {
    createCanvas(600, 400);
    background(200);
}

function draw() {
    background(200);
    fill(150, 0, 150);
    ellipse(mouseX, mouseY, 50, 50);

    m1.draw();
    m2.draw();
    m3.draw();


    if (mouseIsPressed){
        m1.move();
        m2.move();
        m3.move();
        
    }
} 