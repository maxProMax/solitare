export interface IHistoryConsumer {
  applyFromHistory: (p?: Record<string, unknown>) => void;
}

export class History {
  private _stack: {
    from?: { instance?: IHistoryConsumer; data?: Record<string, unknown> };
    to?: { instance?: IHistoryConsumer; data?: Record<string, unknown> };
    single?: { instance?: IHistoryConsumer; data?: Record<string, unknown> };
  }[] = [];

  setHistorySingle(instance: IHistoryConsumer, data: Record<string, unknown>) {
    this._stack.push({ single: { instance, data } });
  }

  private preparePlace() {
    const [lastState] = this._stack.slice(-1);

    if (!lastState || lastState.single) {
      this._stack.push({});
    }
  }

  setHistoryFrom(instance: IHistoryConsumer, data: Record<string, unknown>) {
    this.preparePlace();

    const [last = {}] = this._stack.slice(-1);
    const from = { instance, data };

    if (last.from) {
      this._stack.push({ from });
    } else {
      last.from = from;
    }
  }

  setHistoryTo(instance: IHistoryConsumer, data: Record<string, unknown>) {
    this.preparePlace();

    const [last = {}] = this._stack.slice(-1);
    const to = { instance, data };

    if (last.to) {
      this._stack.push({ to });
    } else {
      last.to = to;
    }
  }

  historyBack() {
    const { single, from, to } = this._stack.pop() || {};

    // allow only one step back
    this._stack = [];

    single?.instance?.applyFromHistory(single.data);
    from?.instance?.applyFromHistory(from?.data);
    to?.instance?.applyFromHistory(to?.data);
  }

  isHistory() {
    return !this._stack.length;
  }
}
