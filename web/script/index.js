let vApp;
let vVending;

document.addEventListener('DOMContentLoaded', function() {
  Vue.component('coin-count', {
    props : ['coin'],
    data : function() {
      return {}
    },
    template : `
      <div class='enter-coin'>
        <label :for='coin.name'>{{coin.name}}</label>
        <input :id='coin.name' min='0' v-model.number='coin.quantity'></input>
      </div>
    `,
  });

  Vue.component('insert-coin', {
    props : ['coin','loc'],
    methods : {
      putCoinIn : function(loc) {
        console.log(this);
        if(vApp.coins[loc].quantity == 0) return;
        vApp.coins[loc].quantity--;
        vApp.addCoinToVendor(vApp.coins[loc].name, vApp.coins[loc].val);
      }
    },
    template : `
      <tr class='insert-coin'>
        <td>{{coin.name}}</td>
        <td>{{coin.quantity}}</td>
        <td> <button @click='putCoinIn(loc)'> + </button> </td>
      </tr>
    `,
  });

   Vue.component('vending-item', {
    props : ['item','loc'],
    methods : {
    },
    template : `
      <tr class='vending-items'>
        <td>{{item.name}}</td>
        <td>{{item.quantity}}</td>
        <td>{{item.cost}}</td>
      </tr>
    `,
  });



  vApp = new Vue({
    el : '#app',
    data : {
      coins : [],
      vending : [],
      coinsInVendor : {},
      itemInBag : [],
      sum : 0,
      picked : '',
    },
    methods : {
      addCoin : function(name, quantity, val) {
        let i = this.hasType(this.coins, name);
        if(i == -1) this.coins.push({ name : name, quantity : 10, val : val });
        else this.coins[i].quantity += quantity;
      },
      addItemToVendor : function(name, quantity, cost) {
        let i = this.hasType(this.vending, name);
        if(i == -1) this.vending.push({ name : name, quantity : 2, cost : cost});
        else this.vending[i].quantity += quantity;
      },
      addCoinToVendor : function(name, val) {
        this.coinsInVendor[name] = ++this.coinsInVendor[name] || 1;
        this.sum += val;
      console.log(this.sum);
      },
      getItem : function(name) {
        let item = this.getElement(this.vending, name)
        if(item == null) return;
        
        if(item.quantity > 0 && this.sum >= item.cost) {
          item.quantity--;
          this.itemInBag.push(item.name);
          this.sum -= item.cost;
          this.findChange();
          //send item out
        }

        this.returnCoins();
        // Deselect radio button
        setTimeout(() => { vApp.picked = '' }, 750);
      },
      returnCoins : function() {
        for(let coin of this.coins) {
          if(this.coinsInVendor[coin.name]) coin.quantity += this.coinsInVendor[coin.name]; 
        }
        this.coinsInVecdor = {};
        this.sum = 0;
      },
      findChange : function() {
        let numOfNickel = this.sum/0.05;
        this.coinsInVendor = {};
        this.coinsInVendor['nickel'] = numOfNickel;
      },
      hasType : function(array, name) {
        for(let i  = 0; i < array.length; i++) {
          if(array[i].name == name) return i;
        }
        return -1;
      },
      getElement : function(array, name) {
        for(let i  = 0; i < array.length; i++) {
          if(array[i].name == name) return array[i];
        }
        return null;
      },

    }
  })

  // Add coin
  for(let coin of coinDef) {
    vApp.addCoin(coin.name, coin.quantity, coin.val); 
  }
  
  for(let item of items) {
    vApp.addItemToVendor(item.name, item.quantity, item.cost);
  }
});

