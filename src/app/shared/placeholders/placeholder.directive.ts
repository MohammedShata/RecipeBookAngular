import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector:'[appPlaceHolder]'
})
export class placeholderDirective{
constructor(public viewContainerRef:ViewContainerRef){}
}