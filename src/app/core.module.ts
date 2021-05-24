import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthGuard } from "./auth/auth-Guard.services";
import { authInterceptorServices } from "./auth/auth-intercetor.services";
import { RecipeService } from "./recipes/recipe.service";
import { ShoppingListService } from "./shopping-list/shopping-list.service";

@NgModule({
  providers: [
    ShoppingListService,
    RecipeService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: authInterceptorServices,
      multi: true,
    },
  ],
})
export class CoreModule {}
