import * as core from '@actions/core';
import fetch from 'node-fetch';

export const submitDeploy = async (
  cloudId: string,
  token: string,
  body: string,
) => {
  try {
    const response = await fetch(
      `https://api.atlassian.com/jira/deployments/0.1/cloud/${cloudId}/bulk`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body,
      },
    );

    core.info(`RESPONSE : ${JSON.stringify(response)}`);

    const result = await response.json();

    core.info(`RESULT : ${JSON.stringify(result)}`);

    if (result[0].rejectedDeployments.length === 0) {
      core.info('🎉 Success submit deployment data');
      return result[0];
    } else {
      throw result[0];
    }
  } catch (e) {
    core.setFailed(e.message);
  }
};
