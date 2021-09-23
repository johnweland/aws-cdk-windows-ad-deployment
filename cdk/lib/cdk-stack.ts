import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as iam from "@aws-cdk/aws-iam";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, "ad-instance-vpc", {
      isDefault: true,
    });

    const role = new iam.Role(this, "ad-instance-role", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    const securityGroup = new ec2.SecurityGroup(this, "ad-instance-sg", {
      vpc,
      allowAllOutbound: true,
      securityGroupName: "ad-instance-sg",
    });

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH access from Internet"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP access from Internet"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      "Allow HTTPS access from Internet"
    );

    const instance = new ec2.Instance(this, "ad-instance", {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      role,
      instanceName: "ad-instance",
      securityGroup,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: "test-instance-1-key",
    });

    new cdk.CfnOutput(this, "ad-instance-public-ip", {
      value: instance.instancePublicIp,
    });
  }
}
