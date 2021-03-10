import * as core from '@actions/core';
import fetch from 'node-fetch';

export const getAccessToken = async (
  clientId: string,
  clientSecret: string,
) => {
  try {
    const body = {
      audience: 'api.atlassian.com',
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    };

    const response = await fetch('https://api.atlassian.com/oauth/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!result.error) {
      core.info('Success');
      return result.access_token;
    } else {
      throw {
        message: result.error_description,
      };
    }
  } catch (e) {
    core.setFailed(e.message);
  }
};
