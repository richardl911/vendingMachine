function vendingMachine() {
  this.itemList = {};
  this.sumOfCoin = 0;
}

vendingMachine.prototype.addItem = function(name, cost, quantity) {
  if(this.itemList[name]) return false;

  this.itemList[name] = {
    name : name,
    quantity : quantity,
    cost : cost,
  };

  return true;
}

vendingMachine.prototype.getValue = function() {
  return this.sumOfCoins;
}

vendingMachine.prototype.addCoin = function(val) {
  this.sumOfCoins += val;
  return this.sumOfCoins;
}

vendingMachine.prototype.returnCoins = function() {
  this.sumOfCoins = 0;
}

vendingMachine.prototype.getItem = function(name) {
  if(this.itemList[name] == undefined) return null;
  return this.itemList[name];
}

