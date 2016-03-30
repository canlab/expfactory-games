uniqueId = 12
var expfactory = new ExpFactory(uniqueId)
this.data = {}

function inputData(field, value) {
  this.data[field] = value
}

function sendData(trial) {
  inputData('trial', trial)
  expfactory.recordTrialData(data)
  this.data = {}
}
