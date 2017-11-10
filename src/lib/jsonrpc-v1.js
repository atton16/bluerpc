const arrify = require('arrify');
const prettyFormat = require('pretty-format');
const isObject = require('isobject');

class JSONRPC_V1 {
  request(method, params, id, _raw) {
    method = (typeof method !== 'string') ? prettyFormat(method) : method;
    const ret = { method: method, params: arrify(params), id: id };
    if (_raw === 'raw') return ret; else return JSON.stringify(ret);
  }

  response(result, id, _raw) {
    const ret = { result: result, error: null, id: id };
    if (_raw === 'raw') return ret; else return JSON.stringify(ret);
  }

  error(err, id, _raw) {
    const ret = { result: null, error: err, id: id };
    if (_raw === 'raw') return ret; else return JSON.stringify(ret);
  }

  notify(method, params, _raw) {
    method = (typeof method !== 'string') ? prettyFormat(method) : method;
    const ret = { method: method, params: arrify(params), id: null };
    if (_raw === 'raw') return ret; else return JSON.stringify(ret);
  }

  isRequest(req) {
    if (!isObject(req))
      return false;
    if (typeof req.method !== 'string')
      return false;
    if (!Array.isArray(req.params))
      return false;
    if (req.id === undefined)
      return false;
    return true;
  }

  isNotification(req) {
    if (!isObject(req))
      return false;
    if (typeof req.method !== 'string')
      return false;
    if (!Array.isArray(req.params))
      return false;
    if (req.id === undefined)
      return false;
    if (req.id === null)
      return true;
    return false;
  }
}

module.exports = JSONRPC_V1;
