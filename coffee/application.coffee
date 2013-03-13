width = 800
height = 600
ctx = null
window.KEY =
  UP:38
  DOWN:40
  LEFT:37
  RIGHT:39
$(document).ready(->
  ctx = $("#canvas")[0].getContext '2d'
  ctx.linewidth = 5
  ctx.strokeStyle = "rgb(255,0,0)"
  ctx.strokeRect (width-300)/2-1,(height-500)/2-1,240+2,400+2

  canvas =
    width: 800
    height: 600
    ctx : ->
        ctx

    sx: (width-300)/2
    sy: (height-500)/2



  window.canvasInfo = canvas
  )

