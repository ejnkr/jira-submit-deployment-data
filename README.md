# Jira Submit Deployment Data
This Github Action upload deployment data to Jira Cloud issues.

Inspired by [jira-upload-deployment-info](https://github.com/HighwayThree/jira-upload-deployment-info)

## Requirements

### Install apps each service

#### [Github for Jira](https://marketplace.atlassian.com/apps/1219592/github-for-jira)

#### [Jira Software + Github](https://github.com/marketplace/jira-software-github)

## Action Specifications

### Input values

Inside your .yml file there should be something that looks like this required variable:

#### Required

> ### Get OAuth Credential first
>
> Jira Cloud -> Apps -> Manage Your Apps -> OAuth Credentials -> Create new credentials

- `clientId` - Access token found in OAth credentials of your Jira Cloud website
- `clientSecret` - Access token found in OAth credentials of your Jira Cloud website
- `baseUrl` - The base URL of your connected Jira Cloud.
  - ex> `https://ejn.atlassian.net`
- `jiraKeys` - Jira issue keys to update Deployment Data.
  - ex> `GOCRE-123,GOCRE124,GOCRE-125`
- `displayName` - The human-readable name for the deployment. Will be shown in the UI.
- `lastUpdated` - The last-updated timestamp to present to the user as a summary of the state of the deployment.
- `state` - The state of the deployment
  - `unknown`, `pending`, `in_progress`, `cancelled`, `failed`, `rolled_back`, `successful`
- `environmentId` - The identifier of this environment, must be unique for the provider so that it can be shared across pipelines.
- `environmentDisplayName` - The name of the environment to present to the user.
- `environmentType` - The type of the environment
  - `unmapped`, `development`, `testing`, `staging`, `production`

#### Optional

- `deploymentSequenceNumber` - This is the identifier for the deployment. It must be unique for the specified pipeline and environment. It must be a monotonically increasing number, as this is used to sequence the deployments.
  - `process.env['GITHUB_RUN_ID']`
- `updateSequenceNumber` - A number used to apply an order to the updates to the deployment, as identified by the deploymentSequenceNumber, in the case of out-of-order receipt of update requests. It must be a monotonically increasing number.
  - `process.env['GITHUB_RUN_NUMBER']`
- `url` - A URL users can use to link to this deployment, in this environment.
  - `${github.context.payload.repository?.html_url}/actions/runs/${process.env['GITHUB_RUN_ID']}`
- `description` - A short description of the deployment
- `label` - An (optional) additional label that may be displayed with deployment information.
- `pipelineId` - The identifier of this pipeline, must be unique for the provider.
  - `${github.context.payload.repository?.full_name} ${github.context.workflow}`
- `pipelineDisplayName` - The name of the pipeline to present to the user.
  - `Workflow: ${github.context.workflow} (#${process.env['GITHUB_RUN_NUMBER']})`
- `pipelineUrl` - A URL users can use to link to this deployment pipeline.
  - `${github.context.payload.repository?.url}/actions/runs/${process.env['GITHUB_RUN_ID']}`

## Usage

```yaml
  steps:
    - name: Get Jira keys
      id: getJiraKeys
      uses: ejnkr/get-jira-keys-from-pr@main
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    - name: Upload deployment data
      uses: ejnkr/jira-usbmit-deployment-data@main
      with:
        clientId: ${{ secrets.JIRA_CLIENT_ID }}
        clientSecret: '${{ secrets.JIRA_CLIENT_SECRET }}
        baseUrl: ${{ secrets.JIRA_BASE_URL }}
        jiraKeys: ${{ steps.getJiraKeys.outputs.jiraKeys }}
        displayName: Deployment Number 1
        last-updated: ${{ github.event.head_commit.timestamp }}
        state: success
        environment-id: ${{ github.run_id }}
        environment-display-name: Test
        environment-type: testing
```
