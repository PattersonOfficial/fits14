import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[NumbersOnly]',
})
export class NumbersonlyDirective {
  private regex: RegExp = new RegExp('^[0-9]*$');
  // private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g); //Decimal Number
  // private specialKeys: Array<string> = ['Backspace', 'ArrowLeft', 'ArrowRight'];
  private specialKeys: Array<string> = [
    'Backspace',
    'Delete',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];
  constructor(private elementRef: ElementRef) {}

  /**
   * Key board action
   * @param event
   */
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (
      this.specialKeys.indexOf(event.key) !== -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      ((event.key === 'a' || event.code === 'KeyA') &&
        event.ctrlKey === true) || // Allow: Ctrl+A
      ((event.key === 'c' || event.code === 'KeyC') &&
        event.ctrlKey === true) || // Allow: Ctrl+C
      ((event.key === 'v' || event.code === 'KeyV') &&
        event.ctrlKey === true) || // Allow: Ctrl+V
      ((event.key === 'x' || event.code === 'KeyX') &&
        event.ctrlKey === true) || // Allow: Ctrl+X
      ((event.key === 'a' || event.code === 'KeyA') &&
        event.metaKey === true) || // Allow: Cmd+A (Mac)
      ((event.key === 'c' || event.code === 'KeyC') &&
        event.metaKey === true) || // Allow: Cmd+C (Mac)
      ((event.key === 'v' || event.code === 'KeyV') &&
        event.metaKey === true) || // Allow: Cmd+V (Mac)
      ((event.key === 'x' || event.code === 'KeyX') && event.metaKey === true)
    ) {
      return;
    }
    const inputValue: string = this.elementRef.nativeElement.value.concat(
      event.key
    );
    // console.log(event.key);
    if (inputValue && !String(inputValue).match(this.regex)) {
      event.preventDefault();
    }

    return;
  }

  /**
   * Copy Paste action
   * @param event
   */
  @HostListener('paste', ['$event']) onPaste(event) {
    const clipboardData = (event.originalEvent || event).clipboardData.getData(
      'text/plain'
    );
    if (clipboardData) {
      const regEx = new RegExp('^[0-9]*$');
      if (!regEx.test(clipboardData)) {
        event.preventDefault();
      }
    }
    return;
  }
}
