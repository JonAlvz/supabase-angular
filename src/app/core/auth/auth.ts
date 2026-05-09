import { Component, inject, signal } from '@angular/core';
import { UserApi } from '../supabase/user-api';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  private readonly supabase = inject(UserApi);
  private readonly formBuilder = inject(FormBuilder);

  loading = signal(false);

  signInForm = this.formBuilder.group({
    email: [''],
  });

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
