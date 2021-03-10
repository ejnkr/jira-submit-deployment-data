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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __awaiter(this, void 0, void 0, function* () {
        core.startGroup('🚀 Get Jira Cloud ID');
        const baseUrl = core.getInput('baseUrl');
        const cloudId = yield fetcher_1.getJiraCloudId(baseUrl);
        core.endGroup();
        core.startGroup('📡 Upload deployment data to Jira Cloud');
        const deployment = {
            schemaVersion: '1.0',
            deploymentSequenceNumber: Number(core.getInput('deploymentSequenceNumber')) ||
                Number(process.env['GITHUB_RUN_ID']) ||
                0,
            updateSequenceNumber: Number(core.getInput('updateSequenceNumber')) ||
                Number(process.env['GITHUB_RUN_NUMBER']) ||
                0,
            associations: {
                associationType: 'issueKeys',
                values: core.getInput('jiraKeys')
                    ? core.getInput('jiraKeys').split(',')
                    : [],
            },
            displayName: core.getInput('displayName') || '',
            url: core.getInput('url') ||
                `${(_a = github.context.payload.repository) === null || _a === void 0 ? void 0 : _a.html_url}/actions/runs/${process.env['GITHUB_RUN_ID']}`,
            description: (_b = core.getInput('description')) !== null && _b !== void 0 ? _b : '',
            lastUpdated: core.getInput('lastUpdated')
                ? dateformat_1.default(core.getInput('lastUpdated'), "yyyy-mm-dd'T'HH:MM:ss'Z'")
                : '',
            label: (_c = core.getInput('label')) !== null && _c !== void 0 ? _c : '',
            state: (_d = core.getInput('state')) !== null && _d !== void 0 ? _d : '',
            pipeline: {
                id: (_e = core.getInput('pipelineId')) !== null && _e !== void 0 ? _e : `${(_f = github.context.payload.repository) === null || _f === void 0 ? void 0 : _f.full_name} ${github.context.workflow}`,
                displayName: (_g = core.getInput('pipelineDisplayName')) !== null && _g !== void 0 ? _g : `Workflow: ${github.context.workflow} (#${process.env['GITHUB_RUN_NUMBER']})`,
                url: (_h = core.getInput('pipelineUrl')) !== null && _h !== void 0 ? _h : `${(_j = github.context.payload.repository) === null || _j === void 0 ? void 0 : _j.url}/actions/runs/${process.env['GITHUB_RUN_ID']}`,
            },
            environment: {
                id: core.getInput('environmentId') || '',
                displayName: core.getInput('environmentDisplayName') || '',
                type: core.getInput('environmentType') || '',
            },
        };
        const body = JSON.stringify([deployment]);
        const response = yield fetcher_1.submitDeploy(cloudId, token, body);
        core.info(`RESPONSE INDEX: ${response}`);
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
