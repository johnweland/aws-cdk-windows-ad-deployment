import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as iam from "@aws-cdk/aws-iam";
import * as fs from "fs";

require("dotenv").config();

const config = {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION,
  },
};

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, { ...props, env: config.env });

    const vpc = ec2.Vpc.fromLookup(this, "ad-instance-vpc", {
      isDefault: true,
    });

    const role = new iam.Role(this, "ad-instance-role", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        {
          managedPolicyArn:
            "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
        },
      ],
    });

    const securityGroup = new ec2.SecurityGroup(this, "ad-instance-sg", {
      vpc,
      allowAllOutbound: true,
      securityGroupName: "ad-instance-sg",
    });
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3389),
      "Allow RDP access from Internet"
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
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.udp(123),
      "For: W32Time"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(135),
      "For: RPC Endpoint Mapper"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(464),
      "For: Kerberos password change"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.udp(464),
      "For: Kerberos password change"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcpRange(49152, 65535),
      "For: RPC for LSA, FRS RCP(*), DFRS RCP(*), SAM, Netlogon(*)"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(389),
      "For: LDAP"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.udp(389),
      "For: LDAP"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(636),
      "For: LDAP SSL"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3268),
      "For: LDAP GC"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3269),
      "For: LDAP GC SSL"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(53),
      "For: DNS"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.udp(636),
      "For: DNS"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(88),
      "For: Kerberos"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.udp(88),
      "For: Kerberos"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(445),
      "For: SMB"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(1723),
      "For: AD"
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
      machineImage: new ec2.WindowsImage(
        ec2.WindowsVersion.WINDOWS_SERVER_2016_ENGLISH_FULL_BASE
      ),
      keyName: "test-instance-1-key",
    });

    // .sh or .ps2 file for configuration
    instance.addUserData(fs.readFileSync("lib/ad-setup-script.ps1", "utf8"));
    new cdk.CfnOutput(this, "ad-instance-public-ip", {
      value: instance.instancePublicIp,
    });
  }
}
