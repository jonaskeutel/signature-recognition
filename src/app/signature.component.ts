'use strict'
import {Directive, HostListener, Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';

@Directive({selector: 'canvas[drawable]'})
class CanvasDrawer {
  private canvas: ElementRef;
  private currentTouch = [];
  private touchesOverTime = [];
  private numStrokes = 0;

  constructor(el: ElementRef) {
       this.canvas = el;
       console.log(el)
       el.nativeElement.width = el.nativeElement.scrollWidth
  }

  @HostListener('touchstart', ['$event.target', '$event'])
  touchStart(canvas, event) {
    this.numStrokes++;
    event.preventDefault()
    let context:CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");

    var touches = event.changedTouches;

    // TODO: Decide, if we want to use more than one finger
    for (var i = 0; i < 1; i++) { // for now, only use first
      var x = touches[i].pageX - event.srcElement.offsetLeft
      var y = touches[i].pageY - canvas.offsetTop
      var force = touches[i].force;
      this.touchesOverTime.push({
        timestamp: Date.now(),
        x: x,
        y: y,
        pressure: force
      });
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
      this.touchesOverTime.push({
        timestamp: Date.now(),
        x: x,
        y: y,
        pressure: force
      });
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
    console.log(this.touchesOverTime);
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
    setTimeout(function(){
        console.log(thing.numStrokes);
        if (thing.numStrokes === 0) {
            // TODO @Markus: save arrays
            thing.touchesOverTime = [];
            let context:CanvasRenderingContext2D = thing.canvas.nativeElement.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, 1000);
  }

}

@Component({
  selector: 'signature',
  providers: [],
  directives: [CanvasDrawer],
  template: `
    <h1>Signature</h1>
    <div class="canvas-wrapper">
      <canvas #signatureCanvas class="signatureCanvas" drawable>
        Your browser does not support canvas element.
      </canvas>
    </div>
  `
})

export class SignatureComponent implements OnInit{

  @ViewChild("signatureCanvas") signatureCanvas: ElementRef;

  ngOnInit(){
  }

  ngAfterViewInit(){

  }

  touchstart(){
    console.log("Touchstart")
  }

}
