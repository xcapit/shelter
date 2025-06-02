import express from "express";
import {MetricsServer} from "./metrics-server";


describe('Metrics Server', () => {
  const aServer = express();
  const createPrometheusBundle = () => () => {};

  test('new', () => {
    expect(new MetricsServer(aServer, createPrometheusBundle)).toBeTruthy();
  });

  test('register', () => {
    const usersServer = new MetricsServer(aServer, createPrometheusBundle);

    usersServer.register();
  });
});
