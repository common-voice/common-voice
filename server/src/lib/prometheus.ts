import * as http from 'http';
import { getConfig } from '../config-helper';
import {
  collectDefaultMetrics,
  register,
  Counter,
  Registry,
} from 'prom-client';

// Probe every 5th second.
collectDefaultMetrics({ timeout: 5000 });

export default class Prometheus {
  registry: Registry;
  requests: Counter;
  clip_cnt: Counter;
  api_cnt: Counter;
  prometheus_cnt: Counter;

  constructor() {
    this.registry = register;

    // Do not run prometheus endpoints on non prod site.
    if (getConfig().PROD) {
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
  }

  countRequest(request: http.IncomingMessage) {
    this.requests && this.requests.inc();
  }

  countClipRequest(request: http.IncomingMessage) {
    this.clip_cnt && this.clip_cnt.inc();
  }

  countApiRequest(request: http.IncomingMessage) {
    this.api_cnt && this.api_cnt.inc();
  }

  countPrometheusRequest(request: http.IncomingMessage) {
    this.prometheus_cnt && this.prometheus_cnt.inc();
  }
}
