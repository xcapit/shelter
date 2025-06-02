import {Express} from "express";
import promBundle from 'express-prom-bundle';
import {StatusMsg} from "./models/status-msg/status-msg";

export class MetricsServer {

  constructor(
    private _aServer: Express,
    private _createPrometheusBundle: CallableFunction = promBundle
  ) {
  }

  register() {
    this._aServer.get('/status', (req, res) => res.send(new StatusMsg("I'm healthy").toJson()));
    this.addMetricsMiddleware();
  }

  private addMetricsMiddleware() {
    this._aServer.use(this._createPrometheusBundle({
      includeMethod: true,
      includePath: true,
      includeStatusCode: true,
      includeUp: true,
      customLabels: {project_name: 'low-tech-wallet', project_type: 'api'},
      promClient: {
        collectDefaultMetrics: {},
      },
    }));
  }
}
