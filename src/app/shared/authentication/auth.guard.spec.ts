import { of } from 'rxjs';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const router: any = { navigate: () => {} };
  const authService: any = { isAuthenticated: () => {} };
  let guard: AuthGuard;

  beforeEach(() => {
    guard = new AuthGuard(authService, router);
  });

  it('should redirect to /auth/login', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(of(false));
    spyOn(router, 'navigate');

    guard.canActivate().subscribe();

    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should not redirect to /auth/login', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(of(true));
    spyOn(router, 'navigate');

    guard.canActivate().subscribe();

    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
