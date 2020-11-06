window.onload=function(){
        var canvas=document.getElementById("mycanvas");
        var ctx=canvas.getContext("2d");
        ctx.save();
        var boundingClientRect=canvas.getBoundingClientRect();
        var offsetX=boundingClientRect.left;
        var offsetY=boundingClientRect.top;
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        var dragOk = false;
        var isResize = false;
        var closeEnough = 10;
        var dragTL,dragBL,dragTR,dragBR;
        dragTL=dragBL=dragTR=dragBR=false;
        var selectedRect=-1;
        var currentAngle=0;
        // an array of objects that define different rectangles
        var rects=[];
        rects.push({x:70,y:150,width:80,height:80,fill:"#444444",isDragging:false,isRotateable:false});
        rects.push({x:250,y:150,width:80,height:80,fill:"#ff550d",isDragging:false,isRotateable:false});
        rects.push({x:450,y:150,width:80,height:80,fill:"#800080",isDragging:false,isRotateable:false});
        rects.push({x:650,y:150,width:80,height:80,fill:"#0c64e8",isDragging:false,isRotateable:false});

        // listen for mouse events
        canvas.onmousedown = handleMouseDown;
        canvas.onmouseup = handleMouseUp;
        canvas.onmousemove = handleMouseMove;

        draw();
        // draw shape
        function shape(x,y,w,h,fillStyle) 
        {
            ctx.fillStyle=fillStyle;
            ctx.fillRect(x,y,w,h);
        }

        // clear the canvas
        function clearCanvas() 
        {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
        }

        // redraw the rectangles
        function draw() 
        {
            clearCanvas();
            ctx.fillStyle = "white";
            shape(0,0,WIDTH,HEIGHT);
            for(var i=0;i<rects.length;i++){
                var r=rects[i];
                shape(r.x,r.y,r.width,r.height,r.fill);
            }
        }
        // handle mousedown events
        function handleMouseDown(e)
        {
            //current mouse position
            var mouseX=parseInt(e.clientX-offsetX);
            var mouseY=parseInt(e.clientY-offsetY);

            dragOk=false;
            for(var i=0;i<rects.length;i++)
            {
                  var rect=rects[i];
                  if(mouseX>rect.x && mouseX<rect.x+rect.width && mouseY>rect.y && mouseY<rect.y+rect.height&&mouseX!=rect.width/2&&mouseY!=rect.height/2)
                  {
                      // if mouse click is inside rectangle
                      dragOk=true;
                      rect.isDragging=true;
                      selectedRect=i;
                      this.style.cursor='grab';
                  }
                  if(checkCloseEnough(mouseX, rect.x+rect.width/2)&&checkCloseEnough(mouseY, rect.y+rect.height/2) )
                  {
                      this.style.cursor='pointer';
                      rect.isDragging=false;
                      isResize=false;
                      rect.isRotateable=true;
                      selectedRect=i;
                  }
                  //top left
                  if( checkCloseEnough(mouseX, rect.x) && checkCloseEnough(mouseY, rect.y) )
                  {
                      this.style.cursor='nw-resize';
                      isResize=true;
                      dragTL = true;
                      rect.isDragging=false;
                      rect.isRotateable=false;
                      selectedRect=i;
                  }
                  //top right
                  else if( checkCloseEnough(mouseX, rect.x+rect.width) && checkCloseEnough(mouseY, rect.y) )
                  {
                      this.style.cursor='ne-resize';
                      isResize=true;
                      dragTR = true;
                      rect.isDragging=false;
                      rect.isRotateable=false;
                      selectedRect=i;
                  }
                  //bottom left
                  else if( checkCloseEnough(mouseX, rect.x) && checkCloseEnough(mouseY, rect.y+rect.height))
                  {
                      this.style.cursor='sw-resize'; 
                      isResize=true;
                      dragBL = true;
                      rect.isDragging=false;
                      rect.isRotateable=false;
                      selectedRect=i;
                  }
                  //bottom right
                  else if( checkCloseEnough(mouseX, rect.x+rect.width) && checkCloseEnough(mouseY, rect.y+rect.height) )
                  {
                      this.style.cursor='se-resize';
                      isResize=true;
                      dragBR = true;
                      rect.isDragging=false;
                      rect.isRotateable=false;
                      selectedRect=i;
                  }
                  clearCanvas();
                  draw();
            }
            // save the current mouse position
            startX=mouseX;
            startY=mouseY;
            
        }
        function checkCloseEnough(p1, p2)
        {
            return Math.abs(p1-p2)<closeEnough;
        }

        // handle mouseup events
        function handleMouseUp(e)
        {
            // clear all the dragging flags
            dragOk = false;
            for(var i=0;i<rects.length;i++)
            {
                rects[i].isDragging=false;
                rects[i].isRotateable=false;
            }
            dragTL = dragTR = dragBL = dragBR = false;
        }


        // handle mouse moves
        function handleMouseMove(e)
        {
            if (dragOk)
            {
                  // get the current mouse position
                  var mouseX=parseInt(e.clientX-offsetX);
                  var mouseY=parseInt(e.clientY-offsetY);

                  // calculate the distance the mouse has moved
                  // since the last mousemove
                  var dx=mouseX-startX;
                  var dy=mouseY-startY;
                  var rect=rects[selectedRect];
                  if(rect.isDragging)
                  {
                      rect.x+=dx;
                      rect.y+=dy;
                      this.style.cursor='grab';
                  }
                  else if(rect.isRotateable)
                  {
                    this.style.cursor='pointer';
                    clearCanvas();
                    ctx.translate(rect.x+rect.width/2,rect.y+rect.height/2);
                    ctx.rotate(Math.PI / 180 * (currentAngle += 5));  
                    ctx.translate(-(rect.x+rect.width/2), -(rect.y+rect.height/2));
                    ctx.rotate(Math.PI / 180 * (currentAngle -= 5));   
                    shape(rect.x,rect.y,rect.width,rect.height,rect.fill);
                  }
                  else if(isResize)
                  {
                      if(dragTL)
                      {
                          rect.isDragging=false;
                          rect.width += rect.x-mouseX;
                          rect.height += rect.y-mouseY;
                          rect.x = mouseX;
                          rect.y = mouseY;
                          this.style.cursor='nw-resize';
                      } 
                      else if(dragTR) 
                      {
                          rect.width = Math.abs(rect.x-mouseX);
                          rect.height += rect.y-mouseY;
                          rect.y = mouseY;
                          this.style.cursor='ne-resize';
                      } 
                      else if(dragBL) 
                      {
                          rect.width += rect.x-mouseX;
                          rect.height = Math.abs(rect.y-mouseY);
                          rect.x = mouseX; 
                          this.style.cursor='sw-resize';
                      }
                      else if(dragBR) 
                      {
                          rect.width = Math.abs(rect.x-mouseX);
                          rect.height = Math.abs(rect.y-mouseY);
                          this.style.cursor='se-resize';
                      }
                  }  
                  clearCanvas();
                  draw();

                  // reset the starting mouse position for the next mousemove
                  startX=mouseX;
                  startY=mouseY;
                  this.style.cursor='auto';
            }
        }

        window.addEventListener('keydown', function () 
        {
            if (event.keyCode == "8") 
            {
                removeSelectedRectangle(selectedRect);
            } 
        });  
        
        function removeSelectedRectangle(selectedRect)
        {
            ctx.clearRect(rects[selectedRect].x,rects[selectedRect].y,rects[selectedRect].width,rects[selectedRect].height);
            rects.splice(selectedRect,1);
            selectedRect=-1;
        }
}; 

