
/*
    Meowdy! I see you be perusing through the site files. Well, I'm personally flattered
    that you think shitfuckery of this site warrants a gentle peruse. Most of the code here
    is held together with toothpicks and bubblegum, so be warned.

    Feel free to yoink / modify any scripts as needed, and I'd greatly appreciate credit.
    I'm learning as a write this, so I'll try to leave as many comments as possible explaining
    the basics.

    Also, here are some helpful related learning links:
        https://developer.mozilla.org/en-US/docs/Web/HTTP/Status <--
        https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState <--
-------------------------------------------------------------------------------------------------------------------------------------
*/
import { LinkNode } from '/scripts/navigation/link_node.js';

// variables and constants
const svgsrc="http://www.w3.org/2000/svg" //svg namespace
const nodeSvgBoundScale=2.5 //outer bound of svg canvas (multiple of node scale)
const nodeScale=40 //circle scale
const refScale=0.1 //multiplied for reference count
const maxPosx=350 //farthest position to the right
const maxPosy=800 //farthest position to the bottom
const linkmapSrc="link_references.xml" //fill with page references


const minNodeDist = 2 * nodeScale
const optimizationCount=100

var nodeDictionary={};
// ----------------------- XML parsing ----------------------- //
function loadXmlNavNodes(){
    var xmlhttpReq= new XMLHttpRequest();
    xmlhttpReq.onreadystatechange = function(){
        //4 indicates the request is done, and codes 200 - 299 are success codes
        if(this.readyState==4 && this.status ==200){
            var node_dict=parseXML(this)
            optimizeNodeLocations(node_dict)
            buildNodes(node_dict)
        };
    }
    xmlhttpReq.open("GET",linkmapSrc,true);
    xmlhttpReq.send();
}


//TODO: should probably add a handler or module for maintaining the nav nodes
//TODO: also need to work on making this code safer.
function getPageName(pathString){
    var pageName=pathString.split("/")
    pageName=pageName[pageName.length-1]
    pageName=pageName.split(".")[0]
    return pageName
}


function parseXML(xml){
    var graphNodeDictionary={};
    const xmlDoc=xml.responseXML;
    var xmlNodelist = xmlDoc.getElementsByTagName("node")

    //First initialize all the nodes that can exist
    for (let i=0; i <xmlNodelist.length; i++){
        var curXmlNode=xmlNodelist[i]
        var parentLink=curXmlNode.getElementsByTagName("parent_link")[0].textContent

        //Just get the name of the file. This will be used for setting Ids later
        var parentName=getPageName(parentLink)

        //add the node to the dictionary
        graphNodeDictionary[parentName] = new LinkNode(Math.random()*maxPosx,Math.random()*maxPosy, parentLink)
    }

    //Then go through the existing nodes, and update their children ptrs and parent ref counts
    for (let i=0; i <xmlNodelist.length; i++){
        var parentName=Object.keys(graphNodeDictionary)[i]
        var curXmlNode=xmlNodelist[i]
        var childLinks=curXmlNode.getElementsByTagName("child_link")
        var curGraphNode =graphNodeDictionary[parentName]

        //add child pointers
        for (let j=0; j< childLinks.length;j++){
            var childLink=childLinks[j].textContent

            //Just get the name of the file. This will be used for setting Ids later
            var childName=getPageName(childLink)
            curGraphNode.addChilPtr(graphNodeDictionary[childName])
        }
        // now update the node's angle metric for later optimization
        curGraphNode.computeChildAngleMetric()
    }
    //now return the constructed graph node
    return graphNodeDictionary
}

// ---------------------- Actual node building ---------------------------- //
function optimizeNodeLocations(nodeDict){
    //This optimizes for the angles and distances between each parent node's child elements,
    //and (hopefully) chooses positions for the link nodes that make the graph as clear as possible
    var nodeIds=Object.keys(nodeDict)
    for (let i=0; i<optimizationCount; i++){
        for (let j = 0; j< nodeIds.length; j++){
            
            console.log(j)
        }
    }
}


function buildNodes(nodeDict){
    var nodeIds=Object.keys(nodeDict)
    console.log(nodeIds.length)
    for (let i=0; i <nodeIds.length; i++){
        var currentNode=nodeDict[nodeIds[i]]
        drawNode(currentNode,nodeScale,refScale, nodeIds[i])
        // add lines to children
        for (let j=0; j <currentNode.childPtrs.length; j++){
            /*var childNode=currentNode.childPtrs[j]
            var lineParent=document.createElementNS(svgsrc, "svg")
            var nodeLine=document.createElementNS(svgsrc, "line")
            nodeLine.setAttribute("x1",currentNode.x )
            nodeLine.setAttribute("x2",childNode.x )
            nodeLine.setAttribute("y1",currentNode.y )
            nodeLine.setAttribute("y2",childNode.y )
            nodeLine.setAttribute("style", 'stroke:black; stroke-width:2;')
            lineParent.appendChild(nodeLine)
            document.body.appendChild(lineParent)*/
        }
    }
}

function drawNodeold(node, nodeScale,refScale, nodeId){
    var nodeSize=(node.refCount*refScale+1)*nodeScale
    //const NodeImg=document.createElement("img")
    /*NodeImg.src="/media/node.png"
    NodeImg.style.position = "absolute"
    NodeImg.style.top=currentNode.y+"px"
    NodeImg.style.left=currentNode.x+"px"
    NodeImg.width=nodeSize
    NodeImg.height=nodeSize
    document.body.appendChild(NodeImg)*/
    var nodeLink = document.createElement("a")
    nodeLink.href=node.link

    var newDiv=document.createElement("div")
    newDiv.id=nodeId
    newDiv.className="navNode"
    newDiv.textContent=node.link
    newDiv.style.position = "absolute"
    newDiv.style.top=node.y+"px"
    newDiv.style.left=node.x+"px"
    newDiv.style.width=nodeSize
    newDiv.style.height=nodeSize
    console.log(node.link)
    nodeLink.appendChild(newDiv)
    document.body.appendChild(nodeLink)
}

function drawNode(node, nodeScale,refScale, nodeId){
    var nodeSize=(node.refCount*refScale+1)*nodeScale
    var nodeLinkSrc=node.link

    //make the svg container
    var nodeSVG=document.createElementNS(svgsrc, "svg")
    nodeSVG.setAttribute("transform", "translate("+node.x+","+node.y+")")
    nodeSVG.setAttribute("width", nodeSvgBoundScale*nodeSize+"px")
    nodeSVG.setAttribute("height", nodeSvgBoundScale*nodeSize+"px")
    
    nodeSVG.setAttribute("style", 'position:absolute;')
    nodeSVG.setAttributeNS("http://www.w3.org/2000/xmlns", "mxlns:xlink","http://www.w3.org/1999/xlink")

    //make the ellipse
    var nodeEllipse = document.createElementNS (svgsrc, "ellipse")
    nodeEllipse.setAttribute("cx", nodeSize*nodeSvgBoundScale/2+"px")
    nodeEllipse.setAttribute("cy", nodeSize*nodeSvgBoundScale/2+"px")
    nodeEllipse.setAttribute("rx", nodeSize+"px")
    nodeEllipse.setAttribute("ry", nodeSize+"px")
    nodeEllipse.setAttribute("style", 'stroke:black; stroke-width:2; fill:red;position:absolute;')


    //make the link
    var svgLink = document.createElement("a")
    svgLink.setAttribute("href", nodeLinkSrc)
    svgLink.setAttribute("class","navText")
    
    //add link text
    var nodeText=document.createElement("text")
    nodeText.textContent=nodeId
    svgLink.appendChild(nodeText)

    //make the link container
    var linkContainer = document.createElement("div")
    var containerX=nodeSize*nodeSvgBoundScale/2+node.x
    var containerY=nodeSize*nodeSvgBoundScale/2+node.y
    linkContainer.style.position = "absolute"
    linkContainer.style.top=containerY+"px"
    linkContainer.style.left=containerX+"px"
    linkContainer.style.zIndex=1
    linkContainer.appendChild(svgLink)


    nodeSVG.appendChild(nodeEllipse)
    
    document.body.appendChild(linkContainer)

    //
    //nodeSVG.appendChild(nodeText)

    document.body.appendChild(nodeSVG)
}


// ---------------------- Code that is run ---------------------------- //
loadXmlNavNodes()