#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack, EnvironmentType, TargetEnvironment } from '@submanagementgroup/cdk-pipelines-client';
import { Construct } from 'constructs';
import { MailboxFeStack } from '../lib/mailbox-fe-stack';

const app = new cdk.App();

// ============================================
// DEVELOPMENT PIPELINE
// ============================================
const devPipeline = new PipelineStack(app, 'dev-mailbox-fe-pipeline', {
  branch: "develop",
  codeconnectionArn: "arn:aws:codeconnections:ca-central-1:484907522964:connection/64a3746c-a26c-410a-8acc-1741c50813be",
  env: {
    account: "484907522964",
    region: "ca-central-1",
  },
  owner: "submanagementgroup",
  repo: "mailbox-fe",
  // Build React app before CDK synth
  synthCommands: [
    'npm ci',
    'npm run build',        // Build React app to ./build/
    'npm run build:cdk',    // Build CDK TypeScript
    'npx cdk synth'
  ],
  targetEnvironments: [{
    name: "mailbox-fe-dev",
    type: EnvironmentType.DEVELOPMENT,
    account: "484907522964",
    region: "ca-central-1",
  }],
  stacks(context: Construct, env: TargetEnvironment) {
    const stack = new MailboxFeStack(context, 'MailboxFe', {
      name: "mailbox-fe-dev",
      env: env,
      acmCertArn: "arn:aws:acm:us-east-1:484907522964:certificate/TBD", // TODO: Create cert in us-east-1
      domainName: "mail.dev.submanagementgroup.com",
    });
    cdk.Tags.of(stack).add('Component', 'mailbox-fe');
    cdk.Tags.of(stack).add('Environment', 'Development');
  }
});
cdk.Tags.of(devPipeline).add('Component', 'mailbox-fe-pipeline');

// ============================================
// PRODUCTION PIPELINE
// ============================================
const prodPipeline = new PipelineStack(app, 'prod-mailbox-fe-pipeline', {
  branch: "main",
  codeconnectionArn: "arn:aws:codeconnections:ca-central-1:794038237156:connection/TBD", // TODO: Get prod CodeConnection ARN
  env: {
    account: "794038237156",
    region: "ca-central-1",
  },
  owner: "submanagementgroup",
  repo: "mailbox-fe",
  // Build React app before CDK synth
  synthCommands: [
    'npm ci',
    'npm run build',        // Build React app to ./build/
    'npm run build:cdk',    // Build CDK TypeScript
    'npx cdk synth'
  ],
  targetEnvironments: [{
    name: "mailbox-fe-prod",
    type: EnvironmentType.PRODUCTION,
    account: "794038237156",
    region: "ca-central-1",
  }],
  stacks(context: Construct, env: TargetEnvironment) {
    const stack = new MailboxFeStack(context, 'MailboxFe', {
      name: "mailbox-fe-prod",
      env: env,
      acmCertArn: "arn:aws:acm:us-east-1:794038237156:certificate/TBD", // TODO: Create cert in us-east-1
      domainName: "mail.submanagementgroup.com",
    });
    cdk.Tags.of(stack).add('Component', 'mailbox-fe');
    cdk.Tags.of(stack).add('Environment', 'Production');
  }
});
cdk.Tags.of(prodPipeline).add('Component', 'mailbox-fe-pipeline');
