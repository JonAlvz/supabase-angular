import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { UserApi } from '../supabase/user-api';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Autofocus } from '../../shared/directives/auto-focus/autofocus';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, Autofocus],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth implements OnInit {
  private readonly supabase = inject(UserApi);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  loading = signal(false);

  signInForm = this.formBuilder.group({
    email: [''],
  });

  ngOnInit() {
    const {
      data: { subscription },
    } = this.supabase.authChanges(async (_event, session) => {
      if (session) {
        await this.router.navigate(['/account']);
      }
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  async onSubmit() {
    try {
      this.loading.set(true);
      const email = this.signInForm.value.email as string;
      const { error } = await this.supabase.signIn(email);
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.signInForm.reset();
      this.loading.set(false);
    }
  }
}
