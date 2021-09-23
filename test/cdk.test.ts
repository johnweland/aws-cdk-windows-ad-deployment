import { expect as expectCDK, haveResourceLike } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as Cdk from "../lib/cdk-stack";

test("Check InstanceType and SSH KeyName", () => {
  const app = new cdk.App();
  const stack = new Cdk.CdkStack(app, "MyTestStack");

  expectCDK(stack).to(
    haveResourceLike("AWS::EC2::Instance", {
      InstanceType: "t2.micro",
      KeyName: "test-instance-1-key",
    })
  );
});
