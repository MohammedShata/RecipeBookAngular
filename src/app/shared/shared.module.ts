import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { placeholderDirective } from './placeholders/placeholder.directive';
import { DropdownDirective } from './dropdown.directive';


@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    placeholderDirective,
    DropdownDirective
  ],
  imports: [CommonModule],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    placeholderDirective,
    DropdownDirective,
    CommonModule
  ],
  entryComponents: [AlertComponent],

})
export class SharedModule {}
