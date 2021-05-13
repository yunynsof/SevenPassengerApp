import { Component, AfterViewInit, Input, ViewChild,  ElementRef, Renderer2 } from '@angular/core';
import { IonicPage} from 'ionic-angular';

/**
 * Generated class for the ExpandablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'app-expandable',
  templateUrl: 'expandable.html',
})
export class ExpandablePage implements AfterViewInit{
 
    @ViewChild("expandWrapper", { read: ElementRef }) expandWrapper: ElementRef;
    @Input("expanded") expanded: boolean = false;
    @Input("expandHeight") expandHeight: string = "150px";

  constructor(public renderer: Renderer2) {
  }

  ngAfterViewInit() {
    this.renderer.setStyle(this.expandWrapper.nativeElement, "max-height", this.expandHeight);
  }

}

