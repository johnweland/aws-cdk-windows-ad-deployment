# AWS CDK Windows AD Deployment

Some AWS CDK to spit out Cloudformation for building EC2 instances of Windows Active Directory


## Setup

1. make sure you have the latest version of the CDK CLI installed.
2. make sure your AWK CLI credentials && profile are setup.
    ```output
    nano ~/.aws/credentials
        [default]
        aws_access_key_id = ############
        aws_secret_access_key = ############
    ```
    ```output
    nano ~/.aws/config
        [default]
        region = <your region>
        output = json
    ```

3. install dependancies with npm
    ```bash
    npm install
    ```
4. create an ssh key pair in AWS via the [Management Console](https://us-west-2.console.aws.amazon.com/ec2/v2/home?region=us-west-2#KeyPairs:) and save them to your AWS cli directory.

    ```bash
    ~/.aws/pems/<yourpemfile>
    ```

    4.1. then give them the proper permissions
        ```bash
        chmod 400 ~/.aws/pems/<yourpemfile>
        ```
### Useage
1. Synth your CloudFormation Template 
    ```bash
    cdk synth --profile <yourprofile>
    ```
2. Deploy your CloudFormation Stack
    ```bash
    cdk deploy --profile <yourprofile>
    ```
3. Destroy your CloudFormation Stack
    ```bash
    cdk destroy --profile <yourprofile>
    ```


