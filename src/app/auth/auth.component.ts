import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  private closeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    const email = authForm.value.email;
    const password = authForm.value.password;

    let authObs: Observable<AuthResponseData>

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password)
    }

    authObs.subscribe({
      next: (resData) => {
        this.isLoading = false,
          console.log(resData),
          this.router.navigate(['/recipes'])
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false
      },
    });

    authForm.reset();
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  private showErrorAlert(message: string) {
    this.alertHost.viewContainerRef.clear();
    const componentRef = this.alertHost.viewContainerRef.createComponent(AlertComponent);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close
      .subscribe(() => {
        this.closeSub.unsubscribe();
        this.alertHost.viewContainerRef.clear();
      });
  }
}
