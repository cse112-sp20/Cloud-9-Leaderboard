"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchWebDashboardView = exports.buildWebDashboardUrl = void 0;
const Util_1 = require("../Util");
const Constants_1 = require("../Constants");
function buildWebDashboardUrl() {
    return __awaiter(this, void 0, void 0, function* () {
        return Constants_1.launch_url;
    });
}
exports.buildWebDashboardUrl = buildWebDashboardUrl;
function launchWebDashboardView() {
    return __awaiter(this, void 0, void 0, function* () {
        let webUrl = yield buildWebDashboardUrl();
        Util_1.launchWebUrl(`${webUrl}/login`);
    });
}
exports.launchWebDashboardView = launchWebDashboardView;
//# sourceMappingURL=MenuManager.js.map