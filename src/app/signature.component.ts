'use strict'
import {Directive, HostListener, Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';

var normalizedTouches = []

@Directive({
  selector: 'canvas[drawable]'
})
class CanvasDrawer {
  private canvas: ElementRef;
  private currentTouch = [];
  private touchesOverTime = [];
  private numStrokes = 0;
  private startTime = null;
  private lastBegin = Date.now()
  private lastEnd = Date.now()
  public normalizedTouches = []

  constructor(el: ElementRef) {
       this.canvas = el;
       console.log("Construced")
      //  console.log(JSON.parse(JSON.stringify(el.nativeElement)) )
      console.log(el,  el.nativeElement.clientWidth)
      setTimeout(function(){
        el.nativeElement.width = el.nativeElement.clientWidth
      },200)
      
  }

  @HostListener('touchstart', ['$event.target', '$event'])
  touchStart(canvas, event) {
    this.lastBegin = Date.now()
    this.numStrokes++;
    event.preventDefault()
    let context:CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");

    var touches = event.changedTouches;

    // TODO: Decide, if we want to use more than one finger
    for (var i = 0; i < 1; i++) { // for now, only use first
      var x = touches[i].pageX - event.srcElement.offsetLeft
      var y = touches[i].pageY - canvas.offsetTop
      var force = touches[i].force;
      this.addTouchPoint({
        timestamp: Date.now(),
        x: x,
        y: y,
        pressure: force
      }, Date.now() )
    //   console.log(touches[i])
    //   console.log(touches[i].identifier)
      this.currentTouch.push( { id: touches[i].identifier, x: x, y: y })
   
      context.beginPath();
      context.arc(x, y, this.thickness(touches[i].force, 2), 0, 2 * Math.PI, false);  // a circle at the start
      context.fillStyle = 'blue';
      context.fill();
    }

  }

  @HostListener('touchmove', ['$event.target', '$event'])
  touchMove(canvas, event) {
    event.preventDefault()
    let context:CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");

    var touches = event.changedTouches;

    // console.log(event)


    for (var i = 0; i < 1; i++) { //see above
      var x = touches[i].pageX - event.srcElement.offsetLeft
      var y = touches[i].pageY - canvas.offsetTop
      var force = touches[i].force;
      var ind = -1
      this.addTouchPoint({
        timestamp: Date.now(),
        x: x,
        y: y,
        pressure: force
      }, Date.now());
      var touch = this.currentTouch.filter(function(t, index){
        ind = index
        if(t.id == touches[i].identifier){
          return true
        }
        return false
      })
    //   console.log(touch.length)
      // context.beginPath();
      // context.arc(x, y, 4 * touches[i].force, 0, 2 * Math.PI, false);  // a circle at the start
      // context.fillStyle = 'blue';
      // context.fill();

      if(touch.length == 1){
        context.beginPath();
        // log("context.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
        context.moveTo(touch[0].x, touch[0].y);
        // log("context.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
        context.lineTo(x, y);
        context.lineWidth = this.thickness(touches[i].force, null);
        context.strokeStyle = 'blue';
        context.stroke();

        this.currentTouch.splice(ind, 1)
        this.currentTouch.push( { id: touches[i].identifier, x: x, y: y })
      }

      }

  }

  thickness(force, thickness){thickness = thickness? thickness : 3; return thickness * force * force}

  @HostListener('touchend', ['$event.target', '$event'])
  touchEnd(canvas, event) {
    this.lastEnd = Date.now()
    event.preventDefault()
    var touches = event.changedTouches;

    // console.log(event)


    for (var i = 0; i < touches.length; i++) {
      var ind = -1

      var touch = this.currentTouch.filter(function(t, index){
        ind = index
        if(t.id == touches[i].identifier){
          return true
        }
        return false
      })
      if(ind > -1)
        this.currentTouch.splice(ind, 1)

    }
    this.numStrokes--;
    var  thing = this;
    this.normalizeTouches()
    // setTimeout(function(){
    //     // console.log(thing.numStrokes);
    //     if (thing.numStrokes === 0) {
    //         // TODO @Markus: save arrays
    //         thing.touchesOverTime = [];
    //         let context:CanvasRenderingContext2D = thing.canvas.nativeElement.getContext("2d");
    //         // context.clearRect(0, 0, canvas.width, canvas.height);
    //     }
    // }, 1000);
    // console.log(this.touchesOverTime)
  }
  
  addTouchPoint(touchpoint, timestamp){
    //Interval in ms
    this.touchesOverTime.push(touchpoint);
    // let interval = 10;
    // let timeDifference = timestamp - this.startTime
    
    // if(!this.startTime)
    //   this.startTime = timestamp
    // else{
    //   if(timeDifference == interval){
        
    //   }else if(timeDifference > interval){
    //     for(var i=0; i<Math.floor(timeDifference/interval); i++){
    //       this.touchesOverTime.push(null)
    //     }
    //   }
    // }
  }

  normalizeTouches(){
    var touches = this.touchesOverTime
    var normalized = []
    var last = {}
    var lastStamp = -1
    //Interval in ms
    var interval = 10
    var offset = 0
    
    if(this.normalizedTouches.length > 0){
      var pause = Math.floor( (touches[0].timestamp - this.normalizedTouches[this.normalizedTouches.length-1].timestamp ) / interval )
      for(var i=0; i < pause; i++){
        this.normalizedTouches.push(null)
      }
    }
    
    while(touches.length > 0){
      if( normalized.length == 0 ){
        normalized.push(touches[0])
        lastStamp = touches[0].timestamp
        last = touches[0]
        touches.shift()
      }else{
        
        if(touches[0].timestamp - lastStamp > interval + offset ){
          normalized.push( last )  
          offset += interval
        }else if(touches[0].timestamp - lastStamp <= interval + offset ){
          offset = 0
          normalized.push( touches[0] )
          lastStamp = touches[0].timestamp
          last = touches[0]
          touches.shift()
        }
        
      }
      
    }
    this.normalizedTouches = this.normalizedTouches.concat(normalized)
    normalizedTouches = this.normalizedTouches
  }
}

@Component({
  selector: 'signature',
  providers: [],
  directives: [CanvasDrawer],
  inputs: ['touches'],
  template: `
    <div class="canvas-wrapper">
      <canvas #signatureCanvas class="signatureCanvas" drawable>
        Your browser does not support canvas element.
      </canvas>
      
    </div>
  `
})

export class SignatureComponent implements OnInit, AfterViewInit{
  public touches;

  @ViewChild("signatureCanvas") signatureCanvas: ElementRef;

  constructor(
    ){
    }

  // ngOnInit(){
  // }

  ngAfterViewInit(){
    // setInterval( () => {
    //   console.log(normalizedTouches)
    // }, 2000)
  }

  touchstart(){
    console.log("Touchstart")
  }

}
