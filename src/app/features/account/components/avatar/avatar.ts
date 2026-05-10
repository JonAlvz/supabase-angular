import { Component, inject, Input, output, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserApi } from '../../../../core/supabase/user-api';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class Avatar {
  private readonly supabase = inject(UserApi);
  private readonly dom = inject(DomSanitizer);

  _avatarUrl: SafeResourceUrl | undefined;
  uploading = signal(false);

  @Input()
  set avatarUrl(url: string | null) {
    if (url) {
      this.downloadImage(url);
    }
  }
  // @Output() upload = new EventEmitter<string>()
  upload = output<string>();

  async downloadImage(path: string) {
    try {
      const { data } = await this.supabase.downloadImage(path);
      if (data instanceof Blob) {
        this._avatarUrl = this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(data));
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error downloading image: ', error.message);
      }
    }
  }
  async uploadAvatar(event: any) {
    try {
      this.uploading.set(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;
      await this.supabase.uploadAvatar(filePath, file);
      this.upload.emit(filePath);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.uploading.set(false);
    }
  }
}
