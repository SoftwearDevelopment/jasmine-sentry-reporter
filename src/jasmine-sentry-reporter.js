'use strict';

class ExpectationError extends Error {
  constructor(message, stack) {
    super(message);
    this.name = stack.indexOf(':') > 0 ? stack.split(':', 1)[0] : this.constructor.name;
    this.message = message;
    this.stack = stack;
  }
}

class JasmineSentryReporter {
  constructor(ravenClient) {
    this.ravenClient = ravenClient;
  }

  specDone(result) {
    if (result.status === 'failed') {
      result.failedExpectations
        .forEach((failedExpectation) => this._reportToSentry(result, failedExpectation));
    }
  }

  _reportToSentry(result, failedExpectation) {
    const err = new ExpectationError(result.fullName, failedExpectation.stack);
    this.ravenClient.captureException(err, {message: failedExpectation.message});
  }
}

module.exports = JasmineSentryReporter;
