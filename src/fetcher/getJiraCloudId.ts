import * as core from '@actions/core';
import fetch from 'node-fetch';
import { URL } from 'url';

export const getJiraCloudId = async (baseUrl: string) => {
  try {
    const url = new URL('/_edge/tenant_info', baseUrl);
    const response = await fetch(url.href);

    const result = await response.json();

    if (result.cloudId) {
      return result.cloudId;
    } else {
      throw {
        message: 'Error',
      };
    }
  } catch (e) {
    core.setFailed(e.message);
  }
};
