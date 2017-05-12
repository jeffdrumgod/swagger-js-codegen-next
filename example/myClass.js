/*jshint -W069 */
/**
 * This is Infrashop Content API documentation. Here you will find operations to manage your website contet. You will be able to manage dynamic content, banners, static content (like images and css) and other.
 * @class Api
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var Api = (function() {
    'use strict';

    function Api(options) {
        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : '';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
    }

    Api.prototype.request = function(method, url, parameters, body, headers, queryParameters, form) {
        var req = {
            method: method,
            url: url,
            params: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        return axios(req);
    };

    /**
     * Retrieve your access token. This API will return a standard oauth2 JSON object containing an access token, token type (always "bearer"), expiration period and refresh token. Please use the access token in "Authorization" header like you can see in the examples.
     * @method
     * @name Api#getOauthToken
     * @param {string} clientId - This is Infrashop Content API documentation. Here you will find operations to manage your website contet. You will be able to manage dynamic content, banners, static content (like images and css) and other.
     * @param {string} clientSecret - This is Infrashop Content API documentation. Here you will find operations to manage your website contet. You will be able to manage dynamic content, banners, static content (like images and css) and other.
     * @param {string} grantType - This is Infrashop Content API documentation. Here you will find operations to manage your website contet. You will be able to manage dynamic content, banners, static content (like images and css) and other.
     * @param {string} scope - This is Infrashop Content API documentation. Here you will find operations to manage your website contet. You will be able to manage dynamic content, banners, static content (like images and css) and other.
     * @param {string} username - Your username
     * @param {string} password - Your password
     * 
     */
    Api.prototype.getOauthToken = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }

        var domain = this.domain;
        var path = '/oauth/token';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        headers['Content-Type'] = ['application/json'];

        if (parameters['clientId'] !== undefined) {
            queryParameters['client_id'] = parameters['clientId'];
        }

        if (parameters['clientId'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: clientId'));
        }

        if (parameters['clientSecret'] !== undefined) {
            queryParameters['client_secret'] = parameters['clientSecret'];
        }

        if (parameters['clientSecret'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: clientSecret'));
        }

        if (parameters['grantType'] !== undefined) {
            queryParameters['grant_type'] = parameters['grantType'];
        }

        if (parameters['grantType'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: grantType'));
        }

        if (parameters['scope'] !== undefined) {
            queryParameters['scope'] = parameters['scope'];
        }

        if (parameters['scope'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: scope'));
        }

        if (parameters['username'] !== undefined) {
            queryParameters['username'] = parameters['username'];
        }

        if (parameters['username'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: username'));
        }

        if (parameters['password'] !== undefined) {
            queryParameters['password'] = parameters['password'];
        }

        if (parameters['password'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: password'));
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        return this.request('GET', domain + path, parameters, body, headers, queryParameters, form);
    };
    /**
     * Retrieve dynamic content.
     * @method
     * @name Api#getV1Content
     * @param {number} page - Page number. Starts with 0. This number has no decimal places.
     * @param {number} size - The maximum number of records to retrieve. If not provided, a default value is used. This number has no decimal places.
     * @param {string} authorization - Authentication token provided by auth API, like "Bearer 926c6e54-df23-4da4-be38-b002f0454720"
     * 
     */
    Api.prototype.getV1Content = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }

        var domain = this.domain;
        var path = '/v1/content';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        headers['Content-Type'] = ['application/json'];

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        if (parameters['size'] !== undefined) {
            queryParameters['size'] = parameters['size'];
        }

        if (parameters['authorization'] !== undefined) {
            headers['Authorization'] = parameters['authorization'];
        }

        if (parameters['authorization'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: authorization'));
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        return this.request('GET', domain + path, parameters, body, headers, queryParameters, form);
    };
    /**
     * Creates a new dynamic content. contentId is optional. If it is not provided, a numeric unique ID will be provided.
     * @method
     * @name Api#postV1Content
     * @param {} body - This is Infrashop Content API documentation. Here you will find operations to manage your website contet. You will be able to manage dynamic content, banners, static content (like images and css) and other.
     * @param {string} authorization - Authentication token provided by auth API, like "Bearer 926c6e54-df23-4da4-be38-b002f0454720"
     * 
     */
    Api.prototype.postV1Content = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }

        var domain = this.domain;
        var path = '/v1/content';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        headers['Content-Type'] = ['application/json'];

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: body'));
        }

        if (parameters['authorization'] !== undefined) {
            headers['Authorization'] = parameters['authorization'];
        }

        if (parameters['authorization'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: authorization'));
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        return this.request('POST', domain + path, parameters, body, headers, queryParameters, form);
    };
    /**
     * Retrieve content based on its ID.
     * @method
     * @name Api#getV1ContentByContentId
     * @param {string} contentId - Content unique identifier.
     * @param {string} authorization - Authentication token provided by auth API, like "Bearer 926c6e54-df23-4da4-be38-b002f0454720"
     * 
     */
    Api.prototype.getV1ContentByContentId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }

        var domain = this.domain;
        var path = '/v1/content/{contentId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{contentId}', parameters['contentId']);

        if (parameters['contentId'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: contentId'));
        }

        if (parameters['authorization'] !== undefined) {
            headers['Authorization'] = parameters['authorization'];
        }

        if (parameters['authorization'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: authorization'));
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        return this.request('GET', domain + path, parameters, body, headers, queryParameters, form);
    };
    /**
     * Updates a preexisting dynamic content. contentId is optionsl. If it is not provided, a numeric unique ID will be provided.
     * @method
     * @name Api#putV1ContentByContentId
     * @param {string} contentId - Content unique identifier.
     * @param {} body - This is Infrashop Content API documentation. Here you will find operations to manage your website contet. You will be able to manage dynamic content, banners, static content (like images and css) and other.
     * @param {string} authorization - Authentication token provided by auth API, like "Bearer 926c6e54-df23-4da4-be38-b002f0454720"
     * 
     */
    Api.prototype.putV1ContentByContentId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }

        var domain = this.domain;
        var path = '/v1/content/{contentId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{contentId}', parameters['contentId']);

        if (parameters['contentId'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: contentId'));
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: body'));
        }

        if (parameters['authorization'] !== undefined) {
            headers['Authorization'] = parameters['authorization'];
        }

        if (parameters['authorization'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: authorization'));
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        return this.request('PUT', domain + path, parameters, body, headers, queryParameters, form);
    };
    /**
     * Deletes a preexisting dynamic content. 
     * @method
     * @name Api#deleteV1ContentByContentId
     * @param {string} contentId - Content unique identifier.
     * @param {string} authorization - Authentication token provided by auth API, like "Bearer 926c6e54-df23-4da4-be38-b002f0454720"
     * 
     */
    Api.prototype.deleteV1ContentByContentId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }

        var domain = this.domain;
        var path = '/v1/content/{contentId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{contentId}', parameters['contentId']);

        if (parameters['contentId'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: contentId'));
        }

        if (parameters['authorization'] !== undefined) {
            headers['Authorization'] = parameters['authorization'];
        }

        if (parameters['authorization'] === undefined) {
            return Promise.reject(new Error('Missing required  parameter: authorization'));
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        return this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form);
    };

    return Api;
})();