'use strict'
/**
 * Component that allows signing within the browser on a Canvas
 * It receives all touches with their respective x,y coordinates and eventually the pressure
 * it stores the values and normalizes them. 
 */

import {Directive, HostListener, Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';

var normalizedTouches = []

@Directive({
  selector: 'canvas[drawable]'
})


class CanvasDrawer {
  public startTime = null
  public lastOrientation = null
  public lastAcceleration = null
  private canvas: ElementRef;
  private currentTouch = []
  private touchesOverTime = []
  private orientationOverTime = []
  private accelerationOverTime = []
  public numStrokes = 0;
  private lastBegin = Date.now()
  private lastEnd = null
  private secondLastEnd = null
  public normalizedTouches = []
  public normalizedOrientation = []
  public normalizedAcceleration = []

  constructor(el: ElementRef) {
      this.canvas = el;

      setTimeout(function(){
        el.nativeElement.width = el.nativeElement.clientWidth
      },200)

  }

  @HostListener('touchstart', ['$event.target', '$event'])
  touchStart(canvas, event) {
    this.lastBegin = Date.now()
    if (!this.startTime) {
        this.startTime = this.lastBegin
        let index = this.getIndexForTimestamp(this.lastBegin)
        this.addEntryToArrayAtIndex(this.lastOrientation, this.orientationOverTime, index)
        this.addEntryToArrayAtIndex(this.lastAcceleration, this.accelerationOverTime, index)
    }
    this.numStrokes++;
    event.preventDefault()
    let context:CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");

    var touches = event.changedTouches;

    for (var i = 0; i < 1; i++) { 
      var x = touches[i].pageX - event.srcElement.offsetLeft
      var y = touches[i].pageY - canvas.offsetTop
      var force = touches[i].force;
      this.addTouchPoint({
        timestamp: Date.now(),
        x: x,
        y: y,
        pressure: force
      }, Date.now() )

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

    for (var i = 0; i < 1; i++) { 
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

      if(touch.length == 1){
        context.beginPath();

        context.moveTo(touch[0].x, touch[0].y);

        context.lineTo(x, y);
        context.lineWidth = this.thickness(touches[i].force, null);
        context.strokeStyle = 'blue';
        context.stroke();

        this.currentTouch.splice(ind, 1)
        this.currentTouch.push( { id: touches[i].identifier, x: x, y: y })
      }

      }

  }

  thickness(force, thickness){thickness == thickness? thickness : 3; return Math.max( thickness * force * force, 0.5 )}

  @HostListener('touchend', ['$event.target', '$event'])
  touchEnd(canvas, event) {
    this.lastEnd = Date.now()
    event.preventDefault()
    var touches = event.changedTouches;

    var index = this.getIndexForTimestamp(this.lastEnd)

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

    var  thing = this;

  }

  addTouchPoint(touchpoint, timestamp){
    var index = this.getIndexForTimestamp(timestamp)
    this.addEntryToArrayAtIndex(touchpoint, this.normalizedTouches, index)
  }

  clear(){
    let context:CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d")
    context.clearRect(0, 0, this.canvas.nativeElement.width , this.canvas.nativeElement.height)
    this.numStrokes = 0
  }

  addEntryToArrayAtIndex(entry, array, index, filler = null) {
    if (array[index]) {
        return;
    }
    for (var i = array.length; i < index; i++) {
        array[i] = filler;
    }
    array[index] = entry;
  }

  getIndexForTimestamp(timestamp) {
    if (!this.startTime) {
        return undefined
    }
    var diff = timestamp - this.startTime;
    var index = Math.floor(diff / 10);
    return index;
  }

  redraw(){
    setInterval( () => {
      if(this.normalizedTouches.length > 0){
        if(this.normalizedTouches[0]){
           let context:CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");

            context.beginPath();
            context.arc(this.normalizedTouches[0].x, this.normalizedTouches[0].y, this.thickness(this.normalizedTouches[0].pressure, 2) , 0, 2 * Math.PI, false);  // a circle at the start
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
    var that = this;

    window.addEventListener('deviceorientation', function(event) {
      var entry = event.alpha
      that.drawable.lastOrientation = entry
      var index = that.drawable.getIndexForTimestamp(Date.now())
      if (index) {
          that.drawable.addEntryToArrayAtIndex(entry, that.drawable.normalizedOrientation, index, entry)
      }
    })

    window.addEventListener("devicemotion", function(event) {
        var entry = Math.sqrt(event.rotationRate.alpha*event.rotationRate.alpha + event.rotationRate.beta*event.rotationRate.beta + event.rotationRate.gamma*event.rotationRate.gamma)
        that.drawable.lastAcceleration = entry
        var index = that.drawable.getIndexForTimestamp(Date.now())
        if (index) {
            that.drawable.addEntryToArrayAtIndex(entry, that.drawable.normalizedAcceleration, index)
        }
    })
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
    console.log("Clear called!")
    this.drawable.startTime = null
    this.drawable.normalizedTouches = []
    this.drawable.normalizedOrientation = []
    this.drawable.normalizedAcceleration = []
    this.drawable.clear()
  }

  getTouches(){
    return this.drawable.normalizedTouches.slice()
  }

  getOrientation(){
    var cutOrientation = this.drawable.normalizedOrientation.slice(0, this.getTouches().length)

    while (cutOrientation.length < this.getTouches().length) {
        cutOrientation.push(this.drawable.lastOrientation)
    }
    return cutOrientation
  }

  getAcceleration(){
    var cutAcceleration = this.drawable.normalizedAcceleration.slice(0, this.getTouches().length)

    while (cutAcceleration.length < this.getTouches().length) {
        cutAcceleration.push(null)
    }
    return cutAcceleration
  }

  getWidth() {
      var xValues =  this.getTouches().map( (elem) => {return elem ? elem.x : null})
      var min = Math.min.apply(null, xValues)
      var max = Math.max.apply(null, xValues)
      return Math.round(max - min)
  }

  getHeight() {
      var yValues = this.getTouches().map( (elem) => {return elem ? elem.y : null})
      var min = Math.min.apply(null, yValues)
      var max = Math.max.apply(null, yValues)
      return Math.round(max - min)
  }

  getNumStrokes() {
      return this.drawable.numStrokes
  }

}
