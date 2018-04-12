const steps = [
  require('./shared.steps'),
  require('./home.steps'),
  require('./help.steps'),
  require('./sideMenu.steps'),
];

module.exports = function () {
  steps.forEach(function (step) {
    step.call(this);
  }.bind(this));
};