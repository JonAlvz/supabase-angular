import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserApi } from '../supabase/user-api';

export const redirectAuthenticatedGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const supabase = inject(UserApi);
  const user = await supabase.getUser();

  return user ? router.createUrlTree(['/account']) : true;
};

export const requireAuthGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const supabase = inject(UserApi);
  const user = await supabase.getUser();

  return user ? true : router.createUrlTree(['/']);
};