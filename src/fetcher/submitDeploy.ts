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

    core.info(`RESPONSE : ${response}`);

    const result = await response.json();

    core.info(`RESULT : ${result}`);

    if (result.code === 202) {
      core.info('🎉 Success submit deployment data');
      return result;
    } else {
      throw result;
    }
  } catch (e) {
    core.setFailed(e.message);
  }
};
