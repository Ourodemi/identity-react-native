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
import * as LocalStorage from './LocalStorage';
/**
 * Manages local user profiles
 */
var LocalIdentity = /** @class */ (function () {
    function LocalIdentity(api, user_id, props, tokens) {
        this.user_id = undefined;
        this.props = {};
        this.tokens = {};
        this.isRefreshing = false;
        this.isLoading = false;
        this.user_id = user_id;
        this.api = api;
        if (user_id && props && tokens) {
            this.props = props;
            this.tokens = tokens;
            this.isLoading = false;
            this.save();
        }
        else {
            this.loadIdentity();
        }
    }
    // Currently loaded profile's authentication status
    LocalIdentity.prototype.isAuthenticated = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hasLoaded()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getAccessToken()];
                    case 2:
                        if (_a.sent()) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    // Wait-loop until "isLoading" is false
    LocalIdentity.prototype.hasLoaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, _) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            if (this.isLoading) {
                                return [2 /*return*/, setTimeout(function () {
                                        return resolve(_this.hasLoaded());
                                    }, 100)];
                            }
                            else {
                                return [2 /*return*/, resolve(true)];
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    // Check the validity of the refresh token
    LocalIdentity.prototype.getRefreshToken = function () {
        if (!this.tokens.refresh_token_expiry ||
            this.timestamp() > this.tokens.refresh_token_expiry) {
            return undefined;
        }
        return this.tokens.refresh_token;
    };
    // Return access token if valid else attempt to fetch a new one
    LocalIdentity.prototype.getAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, _) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, status_1, data, access_token_expiry, access_token, user;
                        var _this = this;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    // Prioritize validity of refresh token over access token?
                                    if (!this.getRefreshToken()) {
                                        return [2 /*return*/, resolve(undefined)];
                                    }
                                    if (!(!this.tokens.access_token_expiry ||
                                        this.timestamp() > this.tokens.access_token_expiry)) return [3 /*break*/, 5];
                                    // is it already trying to fetch a token?
                                    if (this.isRefreshing) {
                                        // wait for the previous request to finish via polling?
                                        return [2 /*return*/, setTimeout(function () {
                                                resolve(_this.getAccessToken());
                                            }, 500)];
                                    }
                                    // attempt to get a new access token
                                    this.isRefreshing = true;
                                    return [4 /*yield*/, this.api.request('auth', {
                                            useAuth: true
                                        })];
                                case 1:
                                    _a = _b.sent(), status_1 = _a.status, data = _a.data;
                                    if (!(status_1 == 200 || status_1 == 201)) return [3 /*break*/, 4];
                                    access_token_expiry = data.access_token_expiry, access_token = data.access_token, user = data.user;
                                    return [4 /*yield*/, this.setAuthenticationTokens({
                                            access_token: access_token,
                                            access_token_expiry: access_token_expiry
                                        })];
                                case 2:
                                    _b.sent();
                                    return [4 /*yield*/, this.setUserProps(user)];
                                case 3:
                                    _b.sent();
                                    this.isRefreshing = false;
                                    return [2 /*return*/, resolve(access_token)];
                                case 4:
                                    this.isRefreshing = false;
                                    return [2 /*return*/, resolve(undefined)];
                                case 5: return [2 /*return*/, resolve(this.tokens.access_token)];
                            }
                        });
                    }); })];
            });
        });
    };
    LocalIdentity.prototype.setAuthenticationTokens = function (tokens) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Object.assign(this.tokens, tokens);
                        return [4 /*yield*/, this.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LocalIdentity.prototype.loadIdentity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, user;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.isLoading = true; // "lock" function
                        _a = this;
                        _b = this.user_id;
                        if (_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getActiveIdentity()];
                    case 1:
                        _b = (_c.sent());
                        _c.label = 2;
                    case 2:
                        _a.user_id = _b;
                        // still no user_id found? no problemo
                        if (!this.user_id) {
                            this.isLoading = false;
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, LocalStorage.getLocalObject(this.user_id)];
                    case 3:
                        user = _c.sent();
                        if (!user) {
                            return [2 /*return*/, false];
                        }
                        this.props = user.props;
                        this.tokens = user.tokens;
                        this.isLoading = false;
                        return [2 /*return*/, true];
                }
            });
        });
    };
    LocalIdentity.prototype.setUserProps = function (props, reset) {
        if (reset === void 0) { reset = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (reset) {
                            this.props = props;
                        }
                        else {
                            Object.assign(this.props, props);
                        }
                        return [4 /*yield*/, this.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Save identity profile to local storage
    LocalIdentity.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.user_id) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, LocalStorage.setLocalObject(this.user_id, {
                                props: this.props,
                                tokens: this.tokens
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LocalIdentity.prototype.destroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.user_id) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, LocalStorage.deleteLocalItem(this.user_id)];
                    case 1:
                        if (_a.sent()) {
                            this.props = {};
                            this.user_id = undefined;
                            this.setAuthenticationTokens({});
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    // Set this identity profile as the default/active selection
    LocalIdentity.prototype.makeActive = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.user_id)
                            return [2 /*return*/];
                        return [4 /*yield*/, LocalStorage.setLocalItem('active', this.user_id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Get the id of the active identity
    LocalIdentity.prototype.getActiveIdentity = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, LocalStorage.getLocalItem('active')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // timestamp in seconds
    LocalIdentity.prototype.timestamp = function () {
        return Math.floor(Date.now() / 1000);
    };
    return LocalIdentity;
}());
export default LocalIdentity;
