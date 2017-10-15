import * as http from 'http';
import {
  collectDefaultMetrics,
  register,
  Counter,
  Registry,
} from 'prom-client';

// Probe every 5th second.
collectDefaultMetrics({ timeout: 5000 });

export default class Prometheus {
  register: Registry;
  requests: Counter;
  clip_cnt: Counter;
  api_cnt: Counter;
  prometheus_cnt: Counter;

  constructor() {
    this.register = register;
    this.requests = new Counter({
      name: 'voice_requests',
      help: 'Total Requests Served',
    });
    this.clip_cnt = new Counter({
      name: 'voice_clips_requests',
      help: 'Total Clip Requests Served',
    });
    this.api_cnt = new Counter({
      name: 'voice_api_requests',
      help: 'Total API Requests Served',
    });
    this.prometheus_cnt = new Counter({
      name: 'voice_prometheus_requests',
      help: 'Total Prometheus Requests Served',
    });
  }

  /**
   * Is this request directed at the api?
   */
  isPrometheusRequest(request: http.IncomingMessage): boolean {
    return request.url.includes('/metrics');
  }

  countRequest(request: http.IncomingMessage) {
    this.requests.inc();
  }

  countClipRequest(request: http.IncomingMessage) {
    this.clip_cnt.inc();
  }

  countApiRequest(request: http.IncomingMessage) {
    this.api_cnt.inc();
  }

  countPrometheusRequest(request: http.IncomingMessage) {
    this.prometheus_cnt.inc();
  }

  /**
   * Give api response.
   */
  handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
    response.setHeader('Content-Type', this.register.contentType);
    response.writeHead(200);
    response.end(this.register.metrics());
  }
}
