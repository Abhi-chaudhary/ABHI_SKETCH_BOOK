import React from "react";
import { useRef,useEffect,useLayoutEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { MENU_ITEMS } from "../../constants";
import { handleActionItemClick } from "../../Slice/menuSlice";
const Board=()=>{
    const dispatch=useDispatch()
    const drawHistory1 = useRef([])
    const drawHistory2 = useRef([])
    const historyPointer = useRef(0)
    const canvasRef=useRef(null);
    const shuldDraw=useRef(false);
    const activeItem=useSelector((state)=>state.menu.menuItemClick)
    const actionItem=useSelector((state)=>state.menu.actionItemClick)
    const {color,size} =useSelector((state)=>state.toolbox[activeItem])
    console.log(color,size)

    useEffect(() => {
        if(!canvasRef.current)return
        const canvas=canvasRef.current
        const context =canvas.getContext('2d');

        if(actionItem===MENU_ITEMS.DOWNLOAD)
        {
             const URL=canvas.toDataURL()
             const anchor=document.createElement('a')
             anchor.href=URL;
             anchor.download='sketch.jpg'
             anchor.click()

        }
        if(actionItem===MENU_ITEMS.UNDO)
        {
                 if(historyPointer.current!=0)
                 {
                    drawHistory2.current.push(drawHistory1.current.pop())
                    historyPointer.current=drawHistory1.current.length-1
                    const imgData=drawHistory1.current[historyPointer.current]
                    context.putImageData(imgData,0,0)
                 }
        }
        if(actionItem===MENU_ITEMS.REDO)
        {
           if(drawHistory2.current.length!==0)
           {
              drawHistory1.current.push(drawHistory2.current.pop())
              historyPointer.current=drawHistory1.current.length-1
              const imgData=drawHistory1.current[historyPointer.current]
              context.putImageData(imgData,0,0)
           }
        }
        dispatch(handleActionItemClick(null))
    
      
    }, [actionItem])
    

    useEffect(()=>{
        if(!canvasRef.current)return
        const canvas=canvasRef.current
        const context =canvas.getContext('2d');

        context.strokeStyle=color;
        context.lineWidth=size;

    },[color,size])

   useLayoutEffect(()=>{
    if(!canvasRef.current)return
    const canvas=canvasRef.current
    const context =canvas.getContext('2d');
    
      canvas.width=window.innerWidth
      canvas.height=window.innerHeight


      const handleMouseDown=(e)=>{
          shuldDraw.current=true;
          context.beginPath()
          context.moveTo(e.clientX,e.clientY)
      }
      const handleMouseMove=(e)=>{
          if(shuldDraw.current!==true)return
          context.lineTo(e.clientX,e.clientY)
          context.stroke()
      }
      const handleMouseUp=()=>{
        shuldDraw.current=false
        const imageData=context.getImageData(0,0,canvas.width,canvas.height)
        drawHistory1.current.push(imageData)
        drawHistory2.current=[]
        historyPointer.current=drawHistory1.current.length-1
      }

       canvas.addEventListener('mousedown',handleMouseDown);
       canvas.addEventListener('mousemove',handleMouseMove);
       canvas.addEventListener('mouseup',handleMouseUp);





   },[])

    return(
        <canvas ref={canvasRef} ></canvas>
    )
}

export default Board