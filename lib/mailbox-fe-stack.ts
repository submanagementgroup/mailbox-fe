import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TargetEnvironment } from '@submanagementgroup/cdk-pipelines-client';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';

export interface MailboxFeStackProps extends cdk.StackProps {
  name: string;
  env: TargetEnvironment;
  acmCertArn: string;
  domainName: string;
}

export class MailboxFeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MailboxFeStackProps) {
    super(scope, id, props);

    const isProd = props.env.type === 'PRODUCTION';

    // Create a KMS key for the S3 bucket
    const bucketKey = new kms.Key(this, 'BucketKey', {
      enableKeyRotation: true,
      description: `KMS key for ${props.name} S3 bucket`,
    });

    new kms.Alias(this, 'BucketKeyAlias', {
      aliasName: `alias/${props.name}-bucket-key`,
      targetKey: bucketKey,
    });

    // Create a private S3 bucket to host the React app
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: `${props.name}-${props.env.account}`,
      removalPolicy: isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProd,
      publicReadAccess: false,
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: bucketKey,
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Deny HTTP requests (HTTPS only)
    siteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:*'],
      resources: [siteBucket.bucketArn, `${siteBucket.bucketArn}/*`],
      conditions: {
        Bool: { 'aws:SecureTransport': 'false' },
      },
      effect: iam.Effect.DENY,
      principals: [new iam.AnyPrincipal()],
    }));

    // S3 origin with Origin Access Control
    const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(siteBucket, {
      originAccessLevels: [cloudfront.AccessLevel.READ],
    });

    // Import ACM certificate (must be in us-east-1 for CloudFront)
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'Certificate',
      props.acmCertArn
    );

    // Create CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultBehavior: {
        origin: s3Origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
      },
      domainNames: [props.domainName],
      certificate: certificate,
      defaultRootObject: 'index.html',
      // Handle SPA routing - redirect 403/404 to index.html
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      comment: `${props.name} - Email MFA Platform Frontend`,
    });

    // Deploy React build to S3 with CloudFront invalidation
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('./build')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
      prune: true,
    });

    // Lookup hosted zone
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: isProd ? 'submanagementgroup.com' : 'dev.submanagementgroup.com',
    });

    // Create Route53 A record pointing to CloudFront
    new route53.ARecord(this, 'SiteARecord', {
      zone: hostedZone,
      recordName: props.domainName,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(distribution)
      ),
      comment: `${props.name} frontend`,
    });

    // Outputs
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'CloudFront distribution domain',
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront distribution ID',
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: siteBucket.bucketName,
      description: 'S3 bucket name',
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: `https://${props.domainName}`,
      description: 'Website URL',
    });
  }
}
