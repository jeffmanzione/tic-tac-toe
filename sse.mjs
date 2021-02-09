import EventEmitter from 'eventemitter3';

export class SSEManager {
  constructor() {
    this._emitter = new EventEmitter();
  }

  subscribe(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    // Heartbeat
    const hbt = setInterval(() => res.write('\n'), 15000);
    const onEvent = (data) => {
      res.write('retry: 500\n');
      res.write('event: event\n');
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
    this._emitter.on('event', onEvent);
    // Clear heartbeat and listener
    req.on('close', () => {
      clearInterval(hbt);
      this._emitter.removeListener('event', onEvent);
    });
  }

  publish(eventData) {
    this._emitter.emit('event', eventData);
  }
}
