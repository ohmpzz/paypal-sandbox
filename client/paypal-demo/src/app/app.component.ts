import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { PaypalService } from './paypal.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  form: FormGroup = this.fb.group({
    quantity: [1, Validators.required],
  });

  callback: Observable<any>;
  isClick: boolean = false;

  constructor(
    private paypalService: PaypalService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.callback = this.route.queryParams;
  }

  onCheckoutWithPaypal(form: FormGroup) {
    const { valid, value } = form;
    if (valid) {
      this.isClick = true;
      return this.paypalService.createPayment(value).subscribe();
    } else {
      this.isClick = false;
      return window.alert('Please, complete the form');
    }
  }
}
