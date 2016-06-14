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

  thickness(force, thickness){thickness = thickness? thickness : 3; return Math.max( thickness * force * force, 0.5 )}

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

  }

  addTouchPoint(touchpoint, timestamp){
    this.touchesOverTime.push(touchpoint);
  }

  clear(){
    let context:CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");
    context.clearRect(0, 0, this.canvas.nativeElement.width , this.canvas.nativeElement.height);
  }

  redraw(){
    setInterval( () => {
      if(this.normalizedTouches.length > 0){
        if(this.normalizedTouches[0]){
           let context:CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");

            context.beginPath();
            context.arc(this.normalizedTouches[0].x, this.normalizedTouches[0].y, this.thickness(this.normalizedTouches[0].pressure) , 0, 2 * Math.PI, false);  // a circle at the start
            context.fillStyle = 'blue';
            context.fill();
        }
        this.normalizedTouches.shift()
      }

    }, 10)
  }

  drawSignature(signature){
    for(var i=0; i<signature.length; i++){
        var currTouch = signature[i]
        if(currTouch){

            let context:CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");
            context.beginPath();
            context.arc(currTouch.x, currTouch.y, this.thickness(currTouch.pressure, 10) , 0, 2 * Math.PI, false);  // a circle at the start
            context.fillStyle = 'blue';
            context.fill();
        }
    }
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
  @Input() sign:Object;
  public signNormalized:Object;

  @ViewChild("signatureCanvas") signatureCanvas: ElementRef;
  @ViewChild(CanvasDrawer)
  private drawable:CanvasDrawer;

  constructor(){}

 ngOnInit(){

 }

  ngAfterViewInit(){
   if(this.sign){
    console.log("Signature with objg", this.sign)

    // this.drawable.redraw()
    setTimeout(() => {
        var width = this.drawable.canvas.nativeElement.width
        var height = this.drawable.canvas.nativeElement.height

        this.sign = this.trasformSignatureToSize(this.sign, width / this.sign.width, height / this.sign.height)

        this.signNormalized = this.convertSignature(this.sign)
        this.drawable.drawSignature(this.signNormalized)
      },250)
   }
  }

  convertSignature(signature){
    let converted = []
    for(var i=0; i<signature.x.length; i++){
      if(signature.x[i]){
        converted.push({
          x: signature.x[i],
          y: signature.y[i],
          pressure: signature.force[i]
        })
      }
    }
    return converted;
  }

  trasformSignatureToSize(signature, widthRatio, heightRatio){
    var newX = [], newY = []
    for(var i=0; i<signature.x.length; i++){
      newX.push( signature.x[i] ? signature.x[i] * widthRatio : null )
      newY.push( signature.x[i] ? signature.y[i] * heightRatio : null)
    }
    signature.x = newX
    signature.y = newY
    return signature
  }

  clear(){
    // this.drawable.normalizedTouches = []
    this.drawable.clear()
  }

  getTouches(){
    return this.drawable.normalizedTouches
  }

  getWidth() {
      var xValues =  this.getTouches().map( (elem) => {return elem ? elem.x : null})
      var min = Math.min.apply(null, xValues)
      console.log(min)
      var max = Math.max.apply(null, xValues)
      console.log(max)
      return max - min
  }

  getHeight() {
      var yValues = this.getTouches().map( (elem) => {return elem ? elem.y : null})
      var min = Math.min.apply(null, yValues)
      console.log(min)
      var max = Math.max.apply(null, yValues)
      console.log(max)
      return 12
  }

}
