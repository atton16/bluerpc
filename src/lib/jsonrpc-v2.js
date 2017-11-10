const prettyFormat = require('pretty-format');
const JSONRPC_V1 = require('./jsonrpc-v1');

class JSONRPC_V2 extends JSONRPC_V1 {
  request(method, params, id) {
    const ret = super.request(method, params, id, 'raw');
    ret['jsonrpc'] = '2.0'; // JSON-RPC 2.0 addition
    return JSON.stringify(ret);
  }

  response(result, id) {
    const ret = super.response(result, id, 'raw');
    ret['jsonrpc'] = '2.0'; // JSON-RPC 2.0 addition
    return JSON.stringify(ret);
  }

  // helper function
  error(code, message, meaning, id) {
    const ret = super.error({ code: code, message: message, meaning: meaning }, id, 'raw');
    ret['jsonrpc'] = '2.0'; // JSON-RPC 2.0 addition
    return JSON.stringify(ret);
  }

  notify(method, params) {
    const ret = super.notify(method, params, 'raw');
    ret['jsonrpc'] = '2.0'; // JSON-RPC 2.0 addition
    return JSON.stringify(ret);
  }

  isRequest(req, compat = true) {
    if(!super.isRequest(req))
      return false;
    if(compat === true)
      return true;
    if(req.jsonrpc !== '2.0')
      return false;
    return true;
  }

  // JSON-RPC 2.0 feature
  batch(requests) {
    return requests;
  }

  invalidJsonError() {
    return this.error(
      -32700,
      'Parse error', 
      'Invalid JSON was received by the server.\n'+
      'An error occurred on the server while parsing the JSON text.',
      null
    );
  }

  invalidRequestError() {
    return this.error(
      -32600,
      'Invalid Request',
      'The JSON sent is not a valid Request object.',
      null
    );
  }

  methodNotFoundError(id) {
    return this.error(
      -32601,
      'Method not found',
      'The method does not exist / is not available.',
      id
    );
  }

  invalidParamsError(id) {
    return this.error(
      -32602,
      'Invalid params',
      'Invalid method parameter(s).',
      id
    );
  }

  internalError(id) {
    return this.error(
      -32603,
      'Internal error',
      'Internal JSON-RPC error.',
      id
    );
  }

  /**
   * Implementation-defined server-errors.
   * @param  {number} code      Implementation-defined server-error code. Possible values: 0-100
   * @param  {string} meaning   Implementation-defined server-error meaning.
   * @return {JSONRPC Error} JSONRPC_V2 / JSONRPC_V1 error object.
   */
  serverError(code, meaning, id) {
    return this.error(
      -32000 - code,
      'Server error',
      meaning,
      id
    );
  }

  methodExecutionError(err, id) {
    return this.serverError(0, prettyFormat(err), id);
  }
}

module.exports = JSONRPC_V2;
