"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const dateformat_1 = __importDefault(require("dateformat"));
const fetcher_1 = require("./fetcher");
function submitDeploymentData(token) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __awaiter(this, void 0, void 0, function* () {
        core.startGroup('🚀 Get Jira Cloud ID');
        const baseUrl = core.getInput('baseUrl');
        const cloudId = yield fetcher_1.getJiraCloudId(baseUrl);
        core.endGroup();
        core.startGroup('📡 Upload deployment data to Jira Cloud');
        core.info(`env run id: ${process.env['GITHUB_RUN_ID']}`);
        core.info(`env run number: ${process.env['GITHUB_RUN_NUMBER']}`);
        core.info(`context run id: ${github.context.runId}`);
        core.info(`context run number: ${github.context.runNumber}`);
        const deployment = {
            schemaVersion: '1.0',
            deploymentSequenceNumber: (_a = Number(core.getInput('deploymentSequenceNumber'))) !== null && _a !== void 0 ? _a : process.env['GITHUB_RUN_ID'],
            updateSequenceNumber: (_b = Number(core.getInput('updateSequenceNumber'))) !== null && _b !== void 0 ? _b : process.env['GITHUB_RUN_NUMBER'],
            associations: {
                associationType: 'issueKeys',
                values: core.getInput('jiraKeys')
                    ? core.getInput('jiraKeys').split(',')
                    : [],
            },
            displayName: core.getInput('displayName') || '',
            url: core.getInput('url') ||
                `${(_c = github.context.payload.repository) === null || _c === void 0 ? void 0 : _c.html_url}/actions/runs/${process.env['GITHUB_RUN_ID']}`,
            description: (_d = core.getInput('description')) !== null && _d !== void 0 ? _d : '',
            lastUpdated: core.getInput('lastUpdated')
                ? dateformat_1.default(core.getInput('lastUpdated'), "yyyy-mm-dd'T'HH:MM:ss'Z'")
                : '',
            label: (_e = core.getInput('label')) !== null && _e !== void 0 ? _e : '',
            state: (_f = core.getInput('state')) !== null && _f !== void 0 ? _f : '',
            pipeline: {
                id: (_g = core.getInput('pipelineId')) !== null && _g !== void 0 ? _g : `${(_h = github.context.payload.repository) === null || _h === void 0 ? void 0 : _h.full_name} ${github.context.workflow}`,
                displayName: (_j = core.getInput('pipelineDisplayName')) !== null && _j !== void 0 ? _j : `Workflow: ${github.context.workflow} (#${process.env['GITHUB_RUN_NUMBER']})`,
                url: (_k = core.getInput('pipelineUrl')) !== null && _k !== void 0 ? _k : `${(_l = github.context.payload.repository) === null || _l === void 0 ? void 0 : _l.url}/actions/runs/${process.env['GITHUB_RUN_ID']}`,
            },
            environment: {
                id: core.getInput('environmentId') || '',
                displayName: core.getInput('environmentDisplayName') || '',
                type: core.getInput('environmentType') || '',
            },
        };
        const body = JSON.stringify([deployment]);
        const response = yield fetcher_1.submitDeploy(cloudId, token, body);
        core.info(`BODY: ${body}`);
        core.info(`RESPONSE: ${response}`);
        core.endGroup();
    });
}
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.startGroup('🤫 Get OAuth Credential');
            const clientId = core.getInput('clientId', { required: true });
            const clientSecret = core.getInput('clientSecret', { required: true });
            const token = yield fetcher_1.getAccessToken(clientId, clientSecret);
            core.endGroup();
            yield submitDeploymentData(token);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
})();
