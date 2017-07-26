import Path from 'path';
import Mustache from 'mustache';
import _ from 'lodash';
import fs from 'fs';
import beautify from 'js-beautify';
import ts  from './typescript';

class CodeGen {
	constructor({
		pathBaseRefs = '',
		encode = 'utf-8',
		mainFile,
		swaggerObject = false,
		className = 'Api',
		moduleName,
		templates,
		imports,
		mustacheVariables = {},
		type = 'es6',
		contentTemplates = { class: '', method: '', type:''},
		beautify = {
			indent_size: 4,
			indent_with_tabs: true,
			max_preserve_newlines: 2
		}
	}) {
		const root = Path.resolve(__dirname, '..');

		this.pathBaseRefs = pathBaseRefs;
		this.source = '';
		this.encode = encode;
		this.type = type; // TODO: preparar para outros tipos de dados
		this.mainFile = mainFile;
		this.swaggerObject = swaggerObject;
		this.className = className;
		this.moduleName = moduleName;
		this.imports = imports;
		this.contentTemplates = contentTemplates;
		this.templates = {
			class: Path.join(root, 'templates/my-class-' + this.type + '.mustache'),
			method: Path.join(root, 'templates/my-method-' + this.type + '.mustache'),
			type: Path.join(root, 'templates/my-type-' + this.type + '.mustache'),
		} || templates;
		this.mustacheVariables = mustacheVariables;
		this.beautify = beautify;

		return this.init();
	}

	getAuthorizedMethods() {
		return [
			'GET',
			'POST',
			'PUT',
			'DELETE',
			'PATCH',
			'COPY',
			'HEAD',
			'OPTIONS',
			'LINK',
			'UNLIK',
			'PURGE',
			'LOCK',
			'UNLOCK',
			'PROPFIND'
		]
	}

	normalizeName(id) {
		return id.replace(/\.|\-|\{|\}/g, '_');
	};

	getPathToMethodName(method, path) {
		if (path === '/' || path === '') {
			return method;
		}

		// clean url path for requests ending with '/'
		let cleanPath = path.replace(/\/$/, '');

		var segments = cleanPath.split('/').slice(1);
		segments = _.transform(segments, (result, segment) => {
			if (segment[0] === '{' && segment[segment.length - 1] === '}') {
				segment = 'by' + segment[1].toUpperCase() + segment.substring(2, segment.length - 1);
			}
			result.push(segment);
		});
		var result = _.camelCase(segments.join('-'));
		return method.toLowerCase() + result[0].toUpperCase() + result.substring(1);
	};

	loadTemplates() {
		if (this.type === 'custom') {
			if (!_.isObject(this.contentTemplates) || !_.isString(this.contentTemplates.class)  || !_.isString(this.contentTemplates.method)) {
				throw new Error(
					`Unprovided custom template. Please use the following template:
					contentTemplates: {
						class: "...", method: "...", request: "..."
					}`
				);
			}
		} else {
			if (!_.isObject(this.templates)) {
				this.templates = {};
			}

			Object.keys(this.templates).map((item) => {
				this.contentTemplates[item] = this.readFile(
					this.templates[item]
				);
			});
		}
	}

	readFile(fullPathFile) {
		let content = '';
		try {
			if (!!fullPathFile && fs.existsSync(fullPathFile)) {
				content = fs.readFileSync(fullPathFile, this.encode);
			} else {
				console.log(`😨  File not exists: ${fullPathFile}`);
				content = false;
			}
		} catch (e) {
			console.log(e);
		}

		return content;
	}

	getViewForSwagger1() {
		console.log(`⛔️   Aborting..., getViewForSwagger1 not implemented!`);
		process.exit(0);
	}

	getViewForSwagger2() {
		const swagger = this.swaggerObject;
		var data = {
			isNode: true,
			description: swagger.info.description,
			isSecure: swagger.securityDefinitions !== undefined,
			moduleName: this.moduleName,
			className: this.className,
			imports: this.imports,
			domain: (swagger.schemes && swagger.schemes.length > 0 && swagger.host) ? swagger.schemes[0] + '://' + swagger.host : '',
			basePath: (!!swagger.basePath ? swagger.basePath : ''),
			methods: [],
			definitions: []
		};

		_.forEach(swagger.paths, (api, path) => {
			const globalParams = this.getGlobalParamns(api);
			api = this.getMethodsFromRef(api, path);
			data.methods = data.methods.concat(
				this.getMethodsEndPoint(swagger, data, api, path, globalParams)
			);
			data.definitions = data.definitions.concat(
				this.getDefinitionsEndPoint(swagger, data, api, path, globalParams)
			);
		});



		return data;
	}

	getGlobalParamns(api) {
		let globalParams = [];
		/*
		* @param {Object} op - meta data for the request
		* @param {string} m - HTTP method name - eg: 'get', 'post', 'put', 'delete'
		*/
		_.forEach(api, function(operation, method) {
			if (method.toLowerCase() === 'parameters') {
				globalParams = operation; // TODO: validar se é correto indicar que somente pode existir 1 'parameters'.
			}
		});

		return globalParams;
	}

	getDefinitionsEndPoint(swagger, swaggerConfig, api, path, globalParams) {
		let definitions = [];
		_.forEach(swagger.definitions, (definition, name) => {
			definitions.push({
				name: name,
				description: definition.description,
				tsType: ts.convertType(definition, swagger)
			});
		});

		return definitions;
	}

	getMethodsEndPoint(swagger, swaggerConfig, api, path, globalParams) {
		const authorizedMethods = this.getAuthorizedMethods();
		let methods = [];
		_.forEach(api, (operation, method) => {
			const M = method.toUpperCase();
			if (M === '' || authorizedMethods.indexOf(M) === -1) {
				return;
			}

			const methodConfig = {
				domain: swaggerConfig.domain,
				basePath: swaggerConfig.basePath,
				path: path,
				className: this.className,
				methodName:  operation.operationId ? this.normalizeName(operation.operationId) : this.getPathToMethodName(method, path),
				method: M,
				isGET: M === 'GET',
				isPOST: M === 'POST',
				summary: (operation.description || operation.summary || '').trim(),
				externalDocs: operation.externalDocs,
				isSecure: swagger.security !== undefined || operation.security !== undefined,
				parameters: [],
				headers: []
			};

			if (operation.produces) {
				methodConfig.headers.push({
					name: 'Accept',
					value: `'${operation.produces.map(function(value) { return value; }).join(', ')}'`,
				});
			}

			const consumes = operation.consumes || swagger.consumes;
			if (consumes) {
				methodConfig.headers.push({ name: 'Content-Type', value: '\'' + consumes + '\'' });
			}


			let params = [];
			if (_.isArray(operation.parameters)) {
				params = operation.parameters;
			}

			params = params.concat(globalParams);
			methodConfig.hasParams = !_.isEmpty(params);

			_.forEach(params, (parameter) => {
				//Ignore parameters which contain the x-exclude-from-bindings extension
				if (parameter['x-exclude-from-bindings'] === true) {
					return;
				}

				// Ignore headers which are injected by proxies & app servers
				// eg: https://cloud.google.com/appengine/docs/go/requests#Go_Request_headers
				if (parameter['x-proxy-header'] && !data.isNode) {
					return;
				}

				if (_.isString(parameter.$ref)) {
					var segments = parameter.$ref.split('/');
					parameter = swagger.parameters[segments.length === 1 ? segments[0] : segments[2] ];
				}

				parameter.camelCaseName = _.camelCase(parameter.name);


				if (parameter.enum && parameter.enum.length === 1) {
					parameter.isSingleton = true;
					parameter.singleton = parameter.enum[0];
				}

				if (parameter.in === 'body') {
					parameter.isBodyParameter = true;
					methodConfig.hasBodyParameter = true;
				} else if (parameter.in === 'path') {
					parameter.isPathParameter = true;
					methodConfig.hasPathParameter = true;
				} else if (parameter.in === 'query') {
					if (parameter['x-name-pattern']) {
						parameter.isPatternType = true;
						parameter.pattern = parameter['x-name-pattern'];
					}

					parameter.isQueryParameter = true;
					methodConfig.hasQueryParameter = true;
				} else if (parameter.in === 'header') {
					if (parameter.camelCaseName === 'authorization') {
						parameter.allowGetExternal = true;
					}
					parameter.isHeaderParameter = true;
					methodConfig.hasHeaderParameter = true;
				} else if (parameter.in === 'formData') {
					parameter.isFormParameter = true;
					methodConfig.hasFormParameter = true;
				}

				parameter.tsType = ts.convertType(parameter);
				parameter.cardinality = parameter.required ? '' : '?';
				methodConfig.parameters.push(parameter);
			});

			console.log(
				[methodConfig.domain, methodConfig.basePath, methodConfig.path].join('') + '(' + methodConfig.method + ') ',
			);

			methods.push(methodConfig);
		});

		return methods;
	}

	/**
	 * For $ref used as include
	 * @return {[type]} [description]
	 */
	getMethodsFromRef(api, path) {
		_.forEach(api, (file, method) => {
			if (method.toLowerCase() === '$ref') {
				var config = file.split('#/');
				if (config.length === 2) {
					var fileRef = Path.join(this.pathBaseRefs, config[0]);
					if (fs.existsSync(fileRef)) {
						var fileRef = this.readFile(fileRef);
						var jsonRef = '';
						try {
							jsonRef = JSON.parse(fileRef);
						} catch (e) {
							jsonRef = false;
						}

						if (jsonRef) {
							const methods = _.get(jsonRef, config[1].replace(/\//g, '.'));

							if (Object.keys(methods).length) {
								api = methods;
							}
						} else {
							console.log('😨  file is invalid JSON: ', fileRef);
						}
					} else {
						console.log('😨  file not exist: ', fileRef);
					}
				}
			}
		});

		return api;
	}

	generate() {
		try {
			this.swaggerObject = JSON.parse(this.swaggerObject);
		} catch (e) {
			this.swaggerObject = false;
		}

		if (!this.swaggerObject) {
			console.log(`⛔️   Aborting..., swaggerObject is not valid JSON!`);
			process.exit(0);
		}

		let data = this.swaggerObject.swagger === '2.0' ? this.getViewForSwagger2() : this.getViewForSwagger1();

		if (this.mustacheVariables) {
			_.assign(data, this.mustacheVariables);
		}

		this.source = Mustache.render(this.contentTemplates.class, data, this.contentTemplates);

		if (_.isObject(this.beautify)) {
			this.source = beautify(
				this.source,
				this.beautify
			);
		} else {
			this.source = source;
		}
	}

	getCode() {
		return this.source;
	}

	writeFile(fullFilePath, options = {encoding: 'utf8'}) {
		return fs.writeFile(fullFilePath, this.source, options, (err) => {
			if (err) throw err;
			console.log(
				'✅  The file has been saved: ' +
				fullFilePath
			);
		});
	}

	init() {
		if (!this.swaggerObject && !!this.mainFile) {
			this.swaggerObject = this.readFile(
				this.mainFile
			);
		}

		if (!this.swaggerObject) {
			console.log(`⛔️   Aborting..., swaggerObject is empty!`);
			process.exit(0);
		}

		this.loadTemplates();

		this.generate();

		return this;
	}
}

export default CodeGen;
