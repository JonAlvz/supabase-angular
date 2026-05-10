import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
})
export class Autofocus {
  private host = inject(ElementRef);

  ngAfterViewInit() {
    this.host.nativeElement.focus();
  }
}
