#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack, EnvironmentType, TargetEnvironment } from '@submanagementgroup/cdk-pipelines-client';
import { Construct } from 'constructs';
import { MailboxFeStack } from '../lib/mailbox-fe-stack';

const app = new cdk.App();

// Get the target environment from context or environment variables
const targetEnv = app.node.tryGetContext('target-env') || process.env.TARGET_ENV || 'dev';

// Determine which pipeline to create based on target environment
if (targetEnv === 'dev' || targetEnv === 'development') {
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
    'npm ci',               // TypeScript 4.9.5 compatible with both React and CDK
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
      acmCertArn: "arn:aws:acm:us-east-1:484907522964:certificate/5d2fc35d-703a-49e3-849e-de8c537a5f47", // Wildcard: *.dev.submanagementgroup.com
      domainName: "mail.dev.submanagementgroup.com",
    });
    cdk.Tags.of(stack).add('Component', 'mailbox-fe');
    cdk.Tags.of(stack).add('Environment', 'Development');
  }
  });
  cdk.Tags.of(devPipeline).add('Component', 'mailbox-fe-pipeline');
} else if (targetEnv === 'prod' || targetEnv === 'production') {
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
    'npm ci',               // TypeScript 4.9.5 compatible with both React and CDK
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
      acmCertArn: "arn:aws:acm:us-east-1:794038237156:certificate/PLACEHOLDER-CREATE-WILDCARD-CERT", // TODO: Create wildcard *.submanagementgroup.com in us-east-1
      domainName: "mail.submanagementgroup.com",
    });
    cdk.Tags.of(stack).add('Component', 'mailbox-fe');
    cdk.Tags.of(stack).add('Environment', 'Production');
  }
  });
  cdk.Tags.of(prodPipeline).add('Component', 'mailbox-fe-pipeline');
} else {
  throw new Error(`Unknown target environment: ${targetEnv}. Use 'dev' or 'prod'`);
}
