import { Component, Input, HostBinding } from '@angular/core';
import { Notification, NotificationTypes } from '../models/notification.model';

@Component({
  selector: 'app-toasty',
  templateUrl: './toasty.component.html',
  styleUrls: ['./toasty.component.scss']
})
export class ToastyComponent {
  @Input() public set notification (n: Notification) {
    this._notification = n;
    this.animate = false;

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setTimeout(() => {
      this.animate = true;
      this.timer = setTimeout(() => {
        this.animate = false;
        this.timer = null;
      }, 3000);
    }, 10);
  }
  public get notification() {
    return this._notification;
  }
  private _notification: Notification;
  private timer;

  @HostBinding('class.animate') private animate = false;

  public getClass() {
    return {
      'alert-success': this.notification.type === NotificationTypes.SUCCESS,
      'alert-danger': this.notification.type === NotificationTypes.ERROR,
      'alert-warning': this.notification.type === NotificationTypes.WARNING,
    };
  }
}
