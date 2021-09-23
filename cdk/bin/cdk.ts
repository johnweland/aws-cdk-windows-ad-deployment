#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { CdkStack } from "../lib/cdk-stack";
import * as config from "./config.json";

const app = new cdk.App();
new CdkStack(app, "ad-instance-stack", {
  env: {
    account: config.aws_account,
    region: config.aws_region,
  },
});
