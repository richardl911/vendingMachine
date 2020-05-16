function vendingMachine() {
  this.itemList = {};
  this.creditVal = 0;
  this.insertedCoin = {};
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

vendingMachine.prototype.getCredit = function() {
  return this.creditVal;
}

vendingMachine.prototype.addCoin = function(name, val) {
  this.creditVal += val;
  this.insertedCoin[name] = ++this.insertedCoin[name] || 1;
  return this.creditVal;
}

vendingMachine.prototype.returnCoins = function() {
  this.creditVal = 0;
  let temp = this.insertedCoin;
  this.insertedCoin = {};
  return temp;
}

vendingMachine.prototype.getItem = function(name) {
  if(this.itemList[name] == undefined) return null;
  return this.itemList[name];
}

vendingMachine.prototype.getItemList = function() {
  return this.itemList;
}

vendingMachine.prototype.retrieveItem = function(name) {
  if(this.itemList[name] == undefined || this.itemList[name].quantity == 0) return false;
  if(this.itemList[name].cost > this.creditVal) return false;

  this.itemList[name].quantity--;
  this.creditVal -= this.itemList[name].cost;

  this.updateInsertedCoins();

  return true;
}

vendingMachine.prototype.updateInsertedCoins = function() {
  let num = Math.round(this.creditVal/0.05);
console.log(num, this.creditVal);
  this.insertedCoin = { 'nickel' : num };
  return num; 
}
