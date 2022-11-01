var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
import LocalIdentity from './LocalIdentity';
import axios from 'axios';
var IdentityAPI = /** @class */ (function () {
    function IdentityAPI(domain, options) {
        this.apiVersion = 'v1';
        this.protocol = 'https';
        this.deauthHandler = function () { };
        this.authHandler = function () { };
        this.domain = domain;
        this.identity = new LocalIdentity(this);
        Object.assign(this, options);
    }
    IdentityAPI.prototype.isAuthenticated = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.identity.isAuthenticated()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* Authenticate using a Login ID and Password */
    IdentityAPI.prototype.auth = function (loginID, password) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, _) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, status, data, code;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, this.request('auth', {
                                        data: __assign(__assign({}, loginID), { password: password }),
                                        method: 'POST'
                                    })];
                                case 1:
                                    _a = _b.sent(), status = _a.status, data = _a.data, code = _a.code;
                                    if (!((status == 200 || status == 201) && data.user)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.initializeLocalIdentity(data)];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3: return [2 /*return*/, resolve({ status: status, data: data, code: code })];
                            }
                        });
                    }); })];
            });
        });
    };
    // deauthenticate user from server and destroy local data
    IdentityAPI.prototype.deauth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request('auth', { useAuth: true, method: 'DELETE' })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.identity.destroy()];
                    case 2:
                        res = _a.sent();
                        this.deauthHandler();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    IdentityAPI.prototype.initializeLocalIdentity = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, access_token, access_token_expiry, refresh_token, refresh_token_expiry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = data.user, access_token = data.access_token, access_token_expiry = data.access_token_expiry, refresh_token = data.refresh_token, refresh_token_expiry = data.refresh_token_expiry;
                        this.identity = new LocalIdentity(this, user.user_id, user, {
                            access_token: access_token,
                            access_token_expiry: access_token_expiry,
                            refresh_token: refresh_token,
                            refresh_token_expiry: refresh_token_expiry
                        });
                        return [4 /*yield*/, this.identity.makeActive()];
                    case 1:
                        _a.sent();
                        this.authHandler();
                        return [2 /*return*/];
                }
            });
        });
    };
    // SingleSignOnRequest = (loginID: LoginID): Promise<APIResponse> => {
    //     return this.request('sso', {
    //     });
    // }
    // VerifySingleSignOn = (ssoToken: string): Promise<APIResponse> => {
    //     return this.request('sso', {
    //     });
    // }
    /* Make a request to the identity API */
    IdentityAPI.prototype.request = function (endpoint, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, _) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, method, params, data, _b, headers, _c, useAuth, refreshToken;
                        var _this = this;
                        return __generator(this, function (_d) {
                            _a = options.method, method = _a === void 0 ? 'GET' : _a, params = options.params, data = options.data, _b = options.headers, headers = _b === void 0 ? {} : _b, _c = options.useAuth, useAuth = _c === void 0 ? false : _c;
                            /* Is authentication needed for this endpoint? */
                            if (useAuth) {
                                refreshToken = this.identity.getRefreshToken();
                                // is the token valid?
                                if (!refreshToken) {
                                    this.deauthHandler();
                                    return [2 /*return*/, resolve({ code: 'forbidden', status: 401, data: {} })];
                                }
                                headers['x-refresh-token'] = refreshToken;
                            }
                            axios({
                                url: this.getURL(endpoint),
                                headers: headers,
                                params: params,
                                method: method,
                                data: data
                            })
                                .then(function (_a) {
                                var data = _a.data;
                                return resolve(_this.parseApiResponse(data));
                            })
                                .catch(function (_a) {
                                var response = _a.response;
                                return resolve(_this.parseApiResponse(response === null || response === void 0 ? void 0 : response.data));
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    IdentityAPI.prototype.getURL = function (endpoint) {
        return "".concat(this.protocol, "://").concat(this.domain, "/").concat(this.apiVersion, "/").concat(endpoint);
    };
    // parse API response
    IdentityAPI.prototype.parseApiResponse = function (data) {
        return {
            code: (data === null || data === void 0 ? void 0 : data.code) || 'network_error',
            status: (data === null || data === void 0 ? void 0 : data.status) || 500,
            data: (data === null || data === void 0 ? void 0 : data.data) || {}
        };
    };
    return IdentityAPI;
}());
export default IdentityAPI;
