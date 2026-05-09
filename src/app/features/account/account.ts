import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Profile } from '../../core/supabase/model/profile.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '@supabase/supabase-js';
import { UserApi } from '../../core/supabase/user-api';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  private readonly supabase = inject(UserApi);
  private readonly formBuilder = inject(FormBuilder);

  loading = signal(false);
  profile!: Profile;

  updateProfileForm = this.formBuilder.group({
    username: '',
    website: '',
    avatar_url: '',
  });

  user = input.required<User>();

  async ngOnInit() {
    await this.getProfile();
  }

  async getProfile() {
    try {
      this.loading.set(true);
      const { data: profile, error, status } = await this.supabase.profile(this.user());
      if (error && status !== 406) {
        throw error;
      }
      if (profile) {
        this.profile = profile;
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading.set(false);
    }
  }

  async updateProfile(): Promise<void> {
    try {
      this.loading.set(true);
      const username = this.updateProfileForm.value.username as string;
      const website = this.updateProfileForm.value.website as string;
      const avatar_url = this.updateProfileForm.value.avatar_url as string;
      const { error } = await this.supabase.updateProfile({
        id: this.user().id,
        username,
        website,
        avatar_url,
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading.set(false);
    }
  }

  async signOut() {
    await this.supabase.signOut();
  }
}
