import {CanActivateFn, Router} from '@angular/router';
import {StorageService} from "./storage.service";
import {inject} from "@angular/core";

/**
 * Authguard for forward control.
 *
 * @author Alexander Fuchs

 * Checks if routing can be done. For signed in only /report, /invoice, /account is accessible and redirect to /report
 * if something else is accessed. For not signed in only /, /signIn is accessible and redirect to /signIn if something
 * else is accessed.
 *
 * @param route route
 * @param state state
 */
export const AuthGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);

  let signedIn = inject(StorageService).isToken();
  let path = route.url.toString();

  if (path === 'report' || path === 'invoice' || path === 'account') {
    if (signedIn) {
      return true;
    } else {
      return router.createUrlTree(['/signIn']);
    }
  } else {
    if (!signedIn) {
      return true;
    } else {
      return router.createUrlTree(['/report']);
    }
  }
};
