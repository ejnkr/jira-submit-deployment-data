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
const getJiraCloudId_1 = __importDefault(require("./fetcher/getJiraCloudId"));
function submitDeploymentData(token) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = core.getInput('jiraBaseUrl');
        const cloudId = yield getJiraCloudId_1.default(baseUrl);
        const deploymentSequenceNumber = (_a = Number(core.getInput('deploymentSequenceNumber'))) !== null && _a !== void 0 ? _a : process.env['GITHUB_RUN_ID'];
        const updateSequenceNumber = (_b = Number(core.getInput('updateSequenceNumber'))) !== null && _b !== void 0 ? _b : process.env['GITHUB_RUN_NUMBER'];
        const jiraKeys = core.getInput('jiraKeys') || '';
        const displayName = core.getInput('displayName') || '';
        const url = core.getInput('url') ||
            `${(_c = github.context.payload.repository) === null || _c === void 0 ? void 0 : _c.html_url}/actions/runs/${process.env['GITHUB_RUN_ID']}`;
        const description = (_d = core.getInput('description')) !== null && _d !== void 0 ? _d : '';
        const lastUpdated = core.getInput('lastUpdated')
            ? dateformat_1.default(core.getInput('lastUpdated'), "yyyy-mm-dd'T'HH:MM:ss'Z'")
            : '';
        const label = (_e = core.getInput('label')) !== null && _e !== void 0 ? _e : '';
        const state = (_f = core.getInput('state')) !== null && _f !== void 0 ? _f : '';
        const pipelineId = (_g = core.getInput('pipelineId')) !== null && _g !== void 0 ? _g : `${(_h = github.context.payload.repository) === null || _h === void 0 ? void 0 : _h.full_name} ${github.context.workflow}`;
        const pipelineDisplayName = (_j = core.getInput('pipelineDisplayName')) !== null && _j !== void 0 ? _j : `Workflow: ${github.context.workflow} (#${process.env['GITHUB_RUN_NUMBER']})`;
        const pipelineUrl = (_k = core.getInput('pipelineUrl')) !== null && _k !== void 0 ? _k : `${(_l = github.context.payload.repository) === null || _l === void 0 ? void 0 : _l.url}/actions/runs/${process.env['GITHUB_RUN_ID']}`;
        const environmentId = core.getInput('environmentId') || '';
        const environmentDisplayName = core.getInput('environmentDisplayName') || '';
        const environmentType = core.getInput('environmentType') || '';
        const deployment = {
            schemaVersion: '1.0',
            deploymentSequenceNumber,
            updateSequenceNumber,
            associations: {
                associationType: 'issueKeys',
                values: jiraKeys.split(','),
            },
            displayName,
            url,
            description,
            lastUpdated,
            label,
            state,
            pipeline: {
                id: pipelineId,
                displayName: pipelineDisplayName,
                url: pipelineUrl,
            },
            environment: {
                id: environmentId,
                displayName: environmentDisplayName,
                type: environmentType,
            },
        };
        const body = JSON.stringify([deployment]);
    });
}
