export enum NotificationTypes {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export interface Notification {
  type: NotificationTypes;
  message: string;
}
