import { NumbersonlyDirective } from './../../../directives/numbersonly.directive';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [NumbersonlyDirective],
  exports: [NumbersonlyDirective],
})
export class NumbersonlyModule {}
