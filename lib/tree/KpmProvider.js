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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.KpmProvider = exports.connectKpmTreeView = void 0;
var vscode_1 = require("vscode");
var KpmProviderManager_1 = require("./KpmProviderManager");
var EventManager_1 = require("../managers/EventManager");
var kpmProviderMgr = KpmProviderManager_1.KpmProviderManager.getInstance();
var kpmCollapsedStateMap = {};
exports.connectKpmTreeView = function (view) {
    return vscode_1.Disposable.from(view.onDidCollapseElement(function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var item;
        return __generator(this, function (_a) {
            item = e.element;
            kpmCollapsedStateMap[item.label] =
                vscode_1.TreeItemCollapsibleState.Collapsed;
            return [2 /*return*/];
        });
    }); }), view.onDidExpandElement(function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var item;
        return __generator(this, function (_a) {
            item = e.element;
            kpmCollapsedStateMap[item.label] =
                vscode_1.TreeItemCollapsibleState.Expanded;
            if (item.eventDescription) {
                EventManager_1.EventManager.getInstance().createCodeTimeEvent("mouse", "click", "TreeViewItemExpand_" + item.eventDescription);
            }
            return [2 /*return*/];
        });
    }); }), view.onDidChangeSelection(function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var item;
        return __generator(this, function (_a) {
            if (!e.selection || e.selection.length === 0) {
                return [2 /*return*/];
            }
            item = e.selection[0];
            KpmProviderManager_1.handleKpmChangeSelection(view, item);
            return [2 /*return*/];
        });
    }); }), view.onDidChangeVisibility(function (e) {
        if (e.visible) {
            EventManager_1.EventManager.getInstance().createCodeTimeEvent("mouse", "click", "ShowTreeView");
        }
    }));
};
var KpmProvider = /** @class */ (function () {
    function KpmProvider() {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this
            ._onDidChangeTreeData.event;
        //
    }
    KpmProvider.prototype.bindView = function (kpmTreeView) {
        this.view = kpmTreeView;
    };
    KpmProvider.prototype.getParent = function (_p) {
        return void 0; // all playlists are in root
    };
    KpmProvider.prototype.refresh = function () {
        this._onDidChangeTreeData.fire();
    };
    KpmProvider.prototype.refreshParent = function (parent) {
        this._onDidChangeTreeData.fire(parent);
    };
    KpmProvider.prototype.getTreeItem = function (p) {
        var treeItem = null;
        if (p.children.length) {
            var collasibleState = kpmCollapsedStateMap[p.label];
            if (!collasibleState) {
                treeItem = createKpmTreeItem(p, p.initialCollapsibleState);
            }
            else {
                treeItem = createKpmTreeItem(p, collasibleState);
            }
        }
        else {
            treeItem = createKpmTreeItem(p, vscode_1.TreeItemCollapsibleState.None);
        }
        return treeItem;
    };
    KpmProvider.prototype.getChildren = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            var kpmItems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        kpmItems = [];
                        if (!element) return [3 /*break*/, 1];
                        // return the children of this element
                        kpmItems = element.children;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, kpmProviderMgr.getDailyMetricsTreeParents()];
                    case 2:
                        // return the parent elements
                        kpmItems = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, kpmItems];
                }
            });
        });
    };
    return KpmProvider;
}());
exports.KpmProvider = KpmProvider;
/**
 * Create the playlist tree item (root or leaf)
 * @param p
 * @param cstate
 */
function createKpmTreeItem(p, cstate) {
    return new KpmProviderManager_1.KpmTreeItem(p, cstate);
}
