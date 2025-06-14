
export class AGINotificationManager {
  private observers: Array<() => void> = [];

  subscribe(observer: () => void) {
    this.observers.push(observer);
  }

  unsubscribe(observer: () => void) {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notify() {
    this.observers.forEach((cb) => cb());
  }
}
