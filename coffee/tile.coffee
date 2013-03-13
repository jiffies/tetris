$(document).ready(
  ->
    gridw = 12
    gridh = 20
    gridMid = gridw / 2
    class Tile
      @tilew = @tileh = 20
      @canvas = canvasInfo
      @tile = new Array(gridh)
      @initTile = ->
        for i in [0...gridh]
          row = new Array(gridw)
          @tile[i] = row
          for j in [0...gridw]
            @tile[i][j] =
              x:@canvas.sx + j*@tilew
              y:@canvas.sy + i*@tileh
              fill:false

      @eachTile = (fun) ->
        for i in [0...gridh]
          for j in [0...gridw]
            fun.call @,@tile[i][j]


      @clearTile: (x,y) ->
        @tile[x][y].fill = false
        @drawTile x,y


      @drawTile = (x,y,colour = "rgb(255,255,255)") ->
        tile = @tile[x][y]
        ctx = @canvas.ctx()
        ctx.fillStyle = colour
        ctx.fillRect tile.x,tile.y,@tilew,@tileh

      @isHit: (row,cow) ->
          if 0 <= row < gridh and 0 <= cow < gridw
            return @tile[row][cow].fill
          else
            true

      @moveTile: (x,y) ->
        @tile[x+1][y].fill = @tile[x][y].fill
        if @tile[x+1][y].fill
          @drawTile x+1,y,"rgb(0,255,0)"
        else
          @drawTile x+1,y,"rgb(255,255,255)"
      @refresh: ->
        console.log "rerere"
        #  for i in [gridh-1..0]
        i = gridh - 1
        while i >= 0
          full = true
          for j in [0...gridw]
             if @tile[i][j].fill is false
                full = false
                break
          if full is true
            console.log full
            for k in [0...gridw]
              @clearTile i,k
            for p in [i-1..0]
              for q in [0...gridw]
                @moveTile p,q
            i++
          i--



    class Block
      @BlockType = ["straight4","left3","right3","all3","left2","right2","all2"]
      #@BlockMethod = {straight4,left2,right2,all2,left3,right3,all3}
      @randomBlock: ->
        num = Math.floor Math.random()*7
        @BlockType[num]

      straight4: ->
        @roof = [0,gridMid]
        @bottom = [3,gridMid]
        @all = ([n,gridMid] for n in [0..3])
        Tile.tile[co[0]][co[1]].fill = true for co in @all
        @transform = =>
          i = 0
          if @form is 1
            unless Tile.isHit(@roof[0],@roof[1]+3)
              for co in @all[1..3]
                i += 1
                co[0] -= i
                co[1] += i
              @form = 2
            else
              console.log "babab"
          else
            unless Tile.isHit(@bottom[0]+3,@bottom[1])
              for co in @all[1..3]
                i += 1
                co[0] += i
                co[1] -= i
              @form = 1
          roof = bottom = null
          for co in @all
               Tile.tile[co[0]][co[1]].fill = true
               roof ?= co
               roof = co if co[0] < roof[0]
               bottom ?= co
               bottom = co if co[0] > roof[0]
          @roof = roof
          @bottom = bottom
      all2: ->
        @all = [[1,gridMid],[0,gridMid],[0,gridMid+1],[1,gridMid+1]]
        @transform = ->

      all3: ->
        @all = [[1,gridMid],[1,gridMid-1],[0,gridMid],[1,gridMid+1]]
        @antenna = 1
        @detect = ->
          mid = @all[0]
          flag = false
          switch @form
            when 1 then do =>
              blocks = [[mid[0]-1,mid[1]-1],[mid[0]-1,mid[1]+1],[mid[0]+1,mid[1]+1],[mid[0]+1,mid[1]]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
            when 2 then do =>
              blocks = [[mid[0],mid[1]-1],[mid[0]-1,mid[1]+1],[mid[0]+1,mid[1]+1],[mid[0]+1,mid[1]-1]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
            when 3 then do =>
              blocks = [[mid[0]-1,mid[1]-1],[mid[0]-1,mid[1]],[mid[0]+1,mid[1]+1],[mid[0]+1,mid[1]-1]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
            when 4 then do =>
              blocks = [[mid[0]-1,mid[1]-1],[mid[0]-1,mid[1]+1],[mid[0],mid[1]+1],[mid[0]+1,mid[1]-1]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
            else
          flag

        @transform = ->
          unless @detect()
            switch @form
              when 1 then do =>
                @all[@antenna][0]+=1
                @all[@antenna][1]+=1
                @form = 2
                min = gridh
                for k,co of @all
                  if co[0] < min
                    min = co[0]
                    key = k
                @antenna = key
              when 2 then do =>
                @all[@antenna][0]+=1
                @all[@antenna][1]-=1
                @form = 3
                max = -1
                for k,co of @all
                   if co[1] > max
                      max = co[1]
                      key = k
                @antenna = key
              when 3 then do =>
                console.log "akb48"
                @all[@antenna][0]-=1
                @all[@antenna][1]-=1
                @form = 4
                max = -1
                for k,co of @all
                  if co[0] > max
                    max = co[0]
                    key = k
                @antenna = key
                #     console.log "all is #{@all}"
                #console.log "max is #{@all[@antenna][0]}"
              when 4 then do =>
                @all[@antenna][0]-=1
                @all[@antenna][1]+=1
                @form = 1
                min = gridw
                for k,co of @all
                  if co[1] < min
                    min = co[1]
                    key = k
                @antenna = key
              else



      right3: ->
        @all = [[1,gridMid],[0,gridMid],[0,gridMid+1],[2,gridMid]]
        @top = @all[1]
        @mid = @all[0]
        @bottom = @all[3]
        @antenna = @all[2]
        @detect = ->
          mid = @all[0]
          flag = false
          switch @form
            when 1 then do =>
              blocks = [[mid[0],mid[1]-1],[mid[0],mid[1]+1],[mid[0]+1,mid[1]-1],[mid[0]+1,mid[1]+1]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
            when 2 then do =>
              blocks = [[mid[0]-1,mid[1]-1],[mid[0]-1,mid[1]],[mid[0]+1,mid[1]-1],[mid[0]+1,mid[1]]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
            when 3 then do =>
              blocks = [[mid[0]-1,mid[1]-1],[mid[0]-1,mid[1]+1],[mid[0],mid[1]-1],[mid[0],mid[1]+1]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
            when 4 then do =>
              blocks = [[mid[0]-1,mid[1]],[mid[0]-1,mid[1]+1],[mid[0]+1,mid[1]+1],[mid[0]+1,mid[1]]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
            else
          flag
        @transform = ->
          unless @detect()
            switch @form
              when 1 then do =>
                @antenna[0]+=2
                @top[0]+=1
                @top[1]+=1
                @bottom[0]-=1
                @bottom[1]-=1
                @form = 2
                @right = @top
                @left = @bottom
                for co in @all
                  @antenna = co if co[0] > @antenna[0]
              when 2 then do =>
                @antenna[1]-=2
                @right[0]+=1
                @right[1]-=1
                @left[0]-=1
                @left[1]+=1
                @form = 3
                @top = @left
                @bottom = @right
                for co in @all
                  @antenna = co if co[1] < @antenna[1]
              when 3 then do =>
                @antenna[0]-=2
                @top[0]+=1
                @top[1]+=1
                @bottom[0]-=1
                @bottom[1]-=1
                @form = 4
                @right = @top
                @left = @bottom
                for co in @all
                  @antenna = co if co[0] < @antenna[0]
              when 4 then do =>
                @antenna[1]+=2
                @right[0]+=1
                @right[1]-=1
                @left[0]-=1
                @left[1]+=1
                @form = 1
                @top = @left
                @bottom = @right
                for co in @all
                  @antenna = co if co[1] > @antenna[1]
              else
      left3: ->
        @all = [[1,gridMid],[0,gridMid],[0,gridMid-1],[2,gridMid]]
        @top = @all[1]
        @mid = @all[0]
        @bottom = @all[3]
        @antenna = @all[2]
        @detect = ->
          mid = @all[0]
          flag = false
          switch @form
            when 1 then do =>
              blocks = [[mid[0]-1,mid[1]+1],[mid[0],mid[1]-1],[mid[0],mid[1]+1],[mid[0]+1,mid[1]-1]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
            when 2 then do =>
              blocks = [[mid[0]-1,mid[1]-1],[mid[0]-1,mid[1]],[mid[0]+1,mid[1]+1],[mid[0]+1,mid[1]]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
            when 3 then do =>
              blocks = [[mid[0]-1,mid[1]+1],[mid[0],mid[1]-1],[mid[0],mid[1]+1],[mid[0]+1,mid[1]-1]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
            when 4 then do =>
              blocks = [[mid[0]-1,mid[1]-1],[mid[0]-1,mid[1]],[mid[0]+1,mid[1]+1],[mid[0]+1,mid[1]]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
            else
          flag
        @transform = ->
          unless @detect()
            switch @form
              when 1 then do =>
                @antenna[1]+=2
                @top[0]+=1
                @top[1]+=1
                @bottom[0]-=1
                @bottom[1]-=1
                @form = 2
                @right = @top
                @left = @bottom
                for co in @all
                  @antenna = co if co[0] < @antenna[0]
              when 2 then do =>
                @antenna[0]+=2
                @right[0]+=1
                @right[1]-=1
                @left[0]-=1
                @left[1]+=1
                @form = 3
                @top = @left
                @bottom = @right
                for co in @all
                  @antenna = co if co[1] > @antenna[1]
              when 3 then do =>
                @antenna[1]-=2
                @top[0]+=1
                @top[1]+=1
                @bottom[0]-=1
                @bottom[1]-=1
                @form = 4
                @right = @top
                @left = @bottom
                for co in @all
                  @antenna = co if co[0] > @antenna[0]
              when 4 then do =>
                @antenna[0]-=2
                @right[0]+=1
                @right[1]-=1
                @left[0]-=1
                @left[1]+=1
                @form = 1
                @top = @left
                @bottom = @right
                for co in @all
                  @antenna = co if co[1] < @antenna[1]
              else
      right2: ->
        @all = [[1,gridMid],[0,gridMid],[0,gridMid-1],[1,gridMid+1]]
        
        @antenna_1 = @all[2]
        @antenna_2 = @all[1]
        @detect = ->
          mid = @antenna_2
          flag = false
          switch @form
            when 1 then do =>
              blocks = [[mid[0]-1,mid[1]+1],[mid[0]-1,mid[1]-1],[mid[0]-1,mid[1]],[mid[0],mid[1]+1],[mid[0]+2,mid[1]],[mid[0]+2,mid[1]+1]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
            when 2 then do =>
              blocks = [[mid[0]-2,mid[1]-1],[mid[0]-2,mid[1]],[mid[0],mid[1]+1]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
          
            else
          flag

        @transform = ->
          unless @detect()
            switch @form
              when 1 then do =>
                @antenna_1[1]+=2
                @antenna_2[0]+=2
                @form = 2
              when 2 then do =>
                @antenna_1[1]-=2
                @antenna_2[0]-=2
                @form = 1
              else 
      left2: ->
        @all = [[1,gridMid],[0,gridMid],[0,gridMid+1],[1,gridMid-1]]
        
        @antenna_1 = @all[2]
        @antenna_2 = @all[1]
        @detect = ->
          mid = @antenna_2
          flag = false
          switch @form
            when 1 then do =>
              blocks = [[mid[0],mid[1]-1],[mid[0]+2,mid[1]-1],[mid[0]+2,mid[1]]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
            when 2 then do =>
              blocks = [[mid[0]-2,mid[1]+1],[mid[0]-2,mid[1]],[mid[0],mid[1]-1]]
              for b in blocks
                flag = true if Tile.isHit b[0],b[1]
          
            else
          flag

        @transform = ->
          unless @detect()
            switch @form
              when 1 then do =>
                @antenna_1[1]-=2
                @antenna_2[0]+=2
                @form = 2
              when 2 then do =>
                @antenna_1[1]+=2
                @antenna_2[0]-=2
                @form = 1
              else 

      initBlock: ->
        switch @type
          when "straight4"  then @straight4()
          when "all2"       then @all2()
          when "all3"       then @all3()
          when "right3"     then @right3()
          when "left3"      then @left3()
          when "right2"     then @right2()
          when "left2"      then @left2()
          else
      constructor: (num)->
        @form = 1
        if num?
          @type = @.constructor.BlockType[num]
        else
          @type = @.constructor.randomBlock()
        @initBlock()

      draw: (colour = "rgb(0,255,0)")->
        ctx = Tile.canvas.ctx()
        ctx.fillStyle = colour
        if @all
          ctx.fillRect(Tile.tile[co[0]][co[1]].x,Tile.tile[co[0]][co[1]].y,Tile.tilew,Tile.tileh) for co in @all

        #move: ->
        #co[]
      move: (direct) ->
         @draw "rgb(255,255,255)"
         flag = true

         all = (co.toString() for co in @all)
         for co in @all
           switch direct
             when KEY.DOWN then do =>
               flag = false if Tile.isHit(co[0]+1,co[1]) and [co[0]+1,co[1]].toString() not in all
               #    console.log [co[0]+1,co[1]],@all,flag
               # flag = false if [co[0]+1,co[1]] in @all
             when KEY.LEFT then do =>
               flag = false if Tile.isHit(co[0],co[1]-1) and [co[0],co[1]-1].toString() not in all
               #  flag = false if Tile.isHit co[0],co[1]-1
             when KEY.RIGHT then do =>
               flag = false if Tile.isHit(co[0],co[1]+1) and [co[0],co[1]+1].toString() not in all
               #  flag = false if Tile.isHit co[0],co[1]-1
               #   flag = false if Tile.isHit co[0],co[1]+1
             else
         if flag is false and direct is KEY.DOWN
            @done = true
            @step = clearInterval @step


         if flag or direct is KEY.UP
           for co in @all
             Tile.tile[co[0]][co[1]].fill = false
             switch direct
               when KEY.DOWN then co[0] += 1
               when KEY.LEFT then co[1] -= 1
               when KEY.RIGHT then co[1] += 1
            #  when KEY.UP then do => @transform()
               else
           if direct is KEY.UP
             @transform()
           for co in @all
              Tile.tile[co[0]][co[1]].fill = true
           
           #     console.log @roof,@bottom,@form

    #  down: ->
    #    @draw "rgb(255,255,255)"
    #    for co in @all
    #      Tile.tile[co[0]][co[1]].fill = false
    #      co[0] += 1
    #    for co in @all
    #      Tile.tile[co[0]][co[1]].fill = true

    #   left: ->
    #    @draw "rgb(255,255,255)"
    #     for co in @all
    #       Tile.tile[co[0]][co[1]].fill = false
    #      co[1] -= 1
    #      Tile.tile[co[0]][co[1]].fill = true

     #   right: ->
     #    @draw "rgb(255,255,255)"
     #   for co in @all
     #     Tile.tile[co[0]][co[1]].fill = false
     #     co[1] += 1
     #     Tile.tile[co[0]][co[1]].fill = true



    Tile.initTile()
    #Tile.drawTile()
    #b = new Block(0)
    #setInterval(->
    #             b.down()
    #             b.draw()
    #           ,500)
    window.Tile = Tile
    window.Block = Block

)
#Tile.eachTile (tile) -> console.log tile

$(document).ready(
  ->
    b = null
    setInterval(->
    #loop
      unless b?.step
        b = new Block 
        b.draw()
        b.step = setInterval(->
          b.move KEY.DOWN
          b.draw()
          Tile.refresh() if b.done
        ,500)
    ,200)
    $(document).keydown (e)->
      console.log e.which
      b.move e.which
      b.draw()
      #   while b.step
      #  console.log b.step


 #     switch e.which
 #      when KEY.DOWN then do ->
 #        b.down()
 #        b.draw()
 #      when KEY.LEFT then do ->
 #        b.left()
 #        b.draw()
 #      when KEY.RIGHT then do ->
 #        b.right()
 #        b.draw()
 #      when KEY.UP then do ->
 #        b.transform()
 #        b.draw()
 #      else
          #Tile.edgeDetect
)



