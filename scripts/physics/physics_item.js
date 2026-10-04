/*
    Meowdy! I see you be perusing through the site files. Well, I'm personally flattered
    that you think shitfuckery of this site warrants a gentle peruse. Most of the code here
    is held together with toothpicks and bubblegum, so be warned.

    Feel free to yoink / modify any scripts as needed, and I'd greatly appreciate credit.
    I'm learning as a write this, so I'll try to leave as many comments as possible explaining
    the basics.

    Also, here are some helpful related learning links:
    https://developer.mozilla.org/en-US/docs/Web/API

-------------------------------------------------------------------------------------------------------------------------------------
*/

class PhysicsItem{
    constructor(width, height, centerX, centerY, obj, mass){
        this.width=width
        this.height=height
        this.centerX=centerX
        this.centerY=centerY
        this.obj=obj
        this.mass=mass
        this.vx=0
        this.vy=0
        this.ax=0
        this.ay=0
    }
    updateVelocity(dt_ms){
        this.vx=this.ax*dt_ms
        this.vy=this.ay*dt_ms
    }
    updatePosition(dt_ms){
        this.centerX=this.centerX + this.vx*dt_ms
        this.centerY=this.centerY + this.vy*dt_ms
    }

}

export default PhysicsItem; // Export the class