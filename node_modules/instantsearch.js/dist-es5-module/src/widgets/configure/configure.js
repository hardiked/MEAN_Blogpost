'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configure;

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var usage = 'Usage:\nsearch.addWidget(\n  instantsearch.widgets.configure({\n    // any searchParameter\n  })\n);\nFull documentation available at https://community.algolia.com/instantsearch.js/v2/widgets/configure.html\n';

/**
 * The **configure** widget is a headless widget that let you configure the
 * settings of your search using the parameters described by the
 * [general Algolia documentation](https://www.algolia.com/doc/api-reference/search-api-parameters/)
 *
 * This widget has no visible UI, so you should only use it for search parameters
 * users shouldn't expect to change.
 *
 * @type {WidgetFactory}
 * @category filter
 * @param {SearchParameters} searchParameters The Configure widget options are search parameters
 * @returns {Object} A new Configure widget instance.
 * @example
 * search.addWidget(
 *   instantsearch.widgets.configure({
 *     analytics: true,
 *     ruleContexts: ['desktop', 'cool-users'],
 *     distinct: 3,
 *   })
 * );
 */
function configure() {
  var searchParameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!(0, _isPlainObject2.default)(searchParameters)) {
    throw new Error(usage);
  }
  return {
    getConfiguration: function getConfiguration() {
      return searchParameters;
    },
    init: function init() {},
    dispose: function dispose(_ref) {
      var state = _ref.state;

      return state.mutateMe(function (mutableState) {
        // widgetParams are assumed 'controlled',
        // so they override whatever other widgets give the state
        Object.keys(searchParameters).forEach(function (key) {
          delete mutableState[key];
        });
      });
    }
  };
}