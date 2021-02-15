import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appParallax]'
})
export class ParallaxDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('ratio') parallaxRatio = 1;
  initialTop = 0;

  constructor(private eleRef: ElementRef) {
    this.initialTop = this.eleRef.nativeElement.getBoundingClientRect().top;
    this.eleRef.nativeElement.classList.add('parallax');
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event): void {
    const position = (this.initialTop - (window.scrollY * this.parallaxRatio));
    this.eleRef.nativeElement.style.transform = `translate(0, ${position}px)`;
  }
}
