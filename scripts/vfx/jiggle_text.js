/*
    Meowdy! I see you be perusing through the site files. Well, I'm personally flattered
    that you think shitfuckery of this site warrants a gentle peruse. Most of the code here
    is held together with toothpicks and bubblegum, so be warned.

    Feel free to yoink / modify any scripts as needed, and I'd greatly appreciate credit.
    I'm learning as a write this, so I'll try to leave as many comments as possible explaining
    the basics.

    Also, here are some helpful related learning links:
    https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event

-------------------------------------------------------------------------------------------------------------------------------------
*/

//import PhysicsItem from '/scripts/physics/physics_item.js';
/////////////////// Constants
const dt_ms=10

////////////////// Setup

// Get the collection of jiggle elements
const jiggleContainers = document.getElementsByClassName("jiggle-scroller")
const jiggleObjs=[]

//basically make a list of structs for container info
for (let i=0; i< jiggleContainers.length; i++){
    const jiggleChildren=[]
    curJiggleObj= jiggleContainers[i]
    JiggleObjChildren=jiggleContainers[i].querySelectorAll(".physics-item")
    //for (let j = 0; j< JiggleObjChildren.length; j++){
    //    physItem=PhysicsItem()
    //}
    const jobj={
        container: jiggleContainers[i],
        velocity: 0,
        acceleration: 0,
        childObjs: jiggleContainers[i].querySelectorAll(".physics-item")
    };
    jiggleObjs.push(jobj)
}

//const jiggleTexts = document.getElementsByClassName("jiggle-text")
testvel = document.getElementById("testtext")
console.log(jiggleContainers.length)

// Iterate through all of the containers that can jiggle, and attach a callback
for (let i=0; i< jiggleObjs.length; i++){
    curJiggleObj=jiggleObjs[i]
    curElem = curJiggleObj.container
    console.log(curJiggleObj.childObjs.length)
    curElem.addEventListener("scroll", (event) => updateVelocity(curJiggleObj));
    curElem.addEventListener("scrollend", (event) => updateVelocity(curJiggleObj));
}


function updateVelocity(velObj){
    v0=velObj.velocity
    v = getScrollVelocity(velObj.container, dt_ms);
    velObj.velocity=v
    testvel.textContent = ("V_0: "+v0)+ (" V: "+v);
}

var getScrollVelocity = (function(scroll_element,delay){
    var y0, y, timer, delta
    function clear(){
        y0=y
        //y0 = null;
        delta=0;
    }
    clear();
    return function(scroll_element){
        y = scroll_element.scrollTop
        if (y0 != null){
            delta = y-y0
        }
        y0=y
        clearTimeout(timer)
        timer = setTimeout(clear, delay)
        return delta
    };
})();
