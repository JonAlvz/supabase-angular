import { Component, inject, OnInit, signal } from '@angular/core';
import { Profile } from '../../core/supabase/model/profile.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { UserApi } from '../../core/supabase/user-api';
import { Avatar } from './components/avatar/avatar';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule, Avatar],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  private readonly supabase = inject(UserApi);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  loading = signal(false);
  profile: Profile = {
    username: '',
    website: '',
    avatar_url: '',
  };

  updateProfileForm = this.formBuilder.group({
    username: '',
    website: '',
    avatar_url: '',
  });

  user = signal<User | null>(null);

  get avatarUrl() {
    return this.updateProfileForm.value.avatar_url as string;
  }
  async updateAvatar(event: string): Promise<void> {
    this.updateProfileForm.patchValue({
      avatar_url: event,
    });
    await this.updateProfile();
  }

  async ngOnInit() {
    const user = await this.supabase.getUser();

    if (!user) {
      await this.router.navigate(['/']);
      return;
    }

    this.user.set(user);
    await this.getProfile();

    const { username, website, avatar_url } = this.profile;

    this.updateProfileForm.patchValue({
      username,
      website,
      avatar_url,
    });
  }

  async getProfile() {
    const user = this.user();

    if (!user) {
      return;
    }

    try {
      this.loading.set(true);
      const { data: profile, error, status } = await this.supabase.profile(user);
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
    const user = this.user();

    if (!user) {
      return;
    }

    try {
      this.loading.set(true);
      const username = this.updateProfileForm.value.username as string;
      const website = this.updateProfileForm.value.website as string;
      const avatar_url = this.updateProfileForm.value.avatar_url as string;
      const { error } = await this.supabase.updateProfile({
        id: user.id,
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
    await this.router.navigate(['/']);
  }
}
