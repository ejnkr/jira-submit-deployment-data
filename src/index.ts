import * as core from '@actions/core';
import * as github from '@actions/github';
import dateFormat from 'dateformat';

import {
  DeploymentData,
  EnvironmentType,
  StateType,
} from './types/DeploymentData';
import { getJiraCloudId, getAccessToken, submitDeploy } from './fetcher';

async function submitDeploymentData(token: string) {
  core.startGroup('🚀 Get Jira Cloud ID');
  const baseUrl = core.getInput('baseUrl');
  const cloudId = await getJiraCloudId(baseUrl);
  core.endGroup();

  core.startGroup('📡 Upload deployment data to Jira Cloud');
  const deployment: DeploymentData = {
    schemaVersion: '1.0',
    deploymentSequenceNumber:
      Number(core.getInput('deploymentSequenceNumber')) ??
      process.env['GITHUB_RUN_ID'],
    updateSequenceNumber:
      Number(core.getInput('updateSequenceNumber')) ??
      process.env['GITHUB_RUN_NUMBER'],
    associations: {
      associationType: 'issueKeys',
      values: core.getInput('jiraKeys')
        ? core.getInput('jiraKeys').split(',')
        : [],
    },
    displayName: core.getInput('displayName') || '',
    url:
      core.getInput('url') ||
      `${github.context.payload.repository?.html_url}/actions/runs/${process.env['GITHUB_RUN_ID']}`,
    description: core.getInput('description') ?? '',
    lastUpdated: core.getInput('lastUpdated')
      ? dateFormat(core.getInput('lastUpdated'), "yyyy-mm-dd'T'HH:MM:ss'Z'")
      : '',
    label: core.getInput('label') ?? '',
    state: (core.getInput('state') as StateType) ?? '',
    pipeline: {
      id:
        core.getInput('pipelineId') ??
        `${github.context.payload.repository?.full_name} ${github.context.workflow}`,
      displayName:
        core.getInput('pipelineDisplayName') ??
        `Workflow: ${github.context.workflow} (#${process.env['GITHUB_RUN_NUMBER']})`,
      url:
        core.getInput('pipelineUrl') ??
        `${github.context.payload.repository?.url}/actions/runs/${process.env['GITHUB_RUN_ID']}`,
    },
    environment: {
      id: core.getInput('environmentId') || '',
      displayName: core.getInput('environmentDisplayName') || '',
      type: (core.getInput('environmentType') as EnvironmentType) || '',
    },
  };

  const body = JSON.stringify([deployment]);

  const response = await submitDeploy(cloudId, token, body);

  core.info(`BODY: ${body}`);
  core.info(`RESPONSE: ${response}`);
  core.endGroup();
}

(async function () {
  try {
    core.startGroup('🤫 Get OAuth Credential');
    const clientId = core.getInput('client-id');
    const clientSecret = core.getInput('client-secret');
    const token = await getAccessToken(clientId, clientSecret);
    core.endGroup();
    await submitDeploymentData(token);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
