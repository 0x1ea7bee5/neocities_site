
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

export class LinkNode{
    constructor(x,y,link){
        this.x=x
        this.y=y
        this.link=link
        this.childPtrs=[]
        this.refCount=0
        this.childAngleMetric=0
        this.childDistanceMetric=0
    }
    addChilPtr(childPtr){
        //increase the child's reference count, and then add it
        childPtr.increaseRefCnt()
        this.childPtrs.push(childPtr);
    }
    increaseRefCnt(){
        this.refCount = this.refCount+1;
    }
    //Compute the angle between each child, sum the angles, then set the metric to that
    computeChildAngleMetric(){
        this.childAngleMetric=0
        function getAngle(x1,y1,x2,y2){
            //TODO check that directionality is ok. Angles might be referenced funnily
            var dotprod=x1*x2+y1*y2
            var n1=Math.sqrt(Math.pow(x1,2)+ Math.pow(y1,2))
            var n2=Math.sqrt(Math.pow(x2,2)+ Math.pow(y2,2))
            var angle=Math.acos(dotprod/n1*n2)
            return angle
        }
        for (let i=0; i < this.childPtrs.length; i++){
            var child1=this.childPtrs[i]
            var x1 = child1.x
            var y1 = child1.y
            for (let j=i; j < this.childPtrs.length-i; j++){
                var child2=this.childPtrs[j]
                var x2=child2.x
                var y2=child2.y
                this.childAngleMetric=this.childAngleMetric+getAngle(x1,y1,x2,y2)
            }
        }
    }
    computerChildDistanceMetric(){
        this.childDistanceMetric=0
        for (let i=0; i < this.childPtrs.length; i++){
            var curChild=childPtrs[i]
            var deltaX=this.x-curChild.x
            var deltay=this.y-curChild.y
            var dist=Math.sqrt(Math.pow(deltaX,2)+ Math.pow(deltay,2))
            this.childDistanceMetric=this.childDistanceMetric+dist
        }
    }
    setPosition(xnew,ynew){
        this.x=xnew
        this.y=ynew
    }

}

