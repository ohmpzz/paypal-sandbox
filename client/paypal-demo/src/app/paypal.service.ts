import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

import { map } from 'rxjs/operators';

interface ApprovalURL {
  approval_url: {
    href?: string;
    rel?: string;
    method?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class PaypalService {
  constructor(private http: HttpClient) {}

  createPayment({ quantity }) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(quantity);

    return this.http
      .post(`${environment.api}/payment/paypal`, { quantity }, { headers })
      .pipe(
        map((payload: ApprovalURL) => {
          const url = payload.approval_url.href;
          console.log(payload);

          return (window.location.href = url);
        })
      );
  }
}
