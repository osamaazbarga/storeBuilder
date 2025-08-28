import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  host?: string;
}

@Injectable({ providedIn: 'root' })
export class TenantService {
  private _tenant?: Tenant;

  constructor(private http: HttpClient) {}

  async load(): Promise<void> {
    const host = window.location.hostname.toLowerCase();
    this._tenant = await firstValueFrom(
      this.http.get<Tenant>(`/api/tenants/resolve?host=${encodeURIComponent(host)}`)
    );
  }

  get tenant(): Tenant | undefined {
    return this._tenant;
  }

  get id(): string | undefined {
    return this._tenant?.id;
  }
}