import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { User } from '@supabase/supabase-js';

import { Account } from './account';
import { UserApi } from '../../core/supabase/user-api';

describe('Account', () => {
  let component: Account;
  let fixture: ComponentFixture<Account>;
  const user = { id: 'user-id', email: 'test@example.com' } as User;
  const userApiMock = {
    getUser: async () => user,
    profile: async () => ({
      data: { username: 'tester', website: 'https://example.com', avatar_url: '' },
      error: null,
      status: 200,
    }),
    updateProfile: async () => ({ error: null }),
    signOut: async () => ({ error: null }),
    downloadImage: async () => ({ data: new Blob() }),
    uploadAvatar: async () => ({ data: null, error: null }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Account],
      providers: [provideRouter([]), { provide: UserApi, useValue: userApiMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Account);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
