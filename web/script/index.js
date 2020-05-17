let vApp;

document.addEventListener('DOMContentLoaded', function() {
  /// Configue dialog box
  $('#dialog').dialog({
    autoOpen : false,
    buttons : {
      "Okay" : function() {
        $(this).dialog('close');
      }
    }
  });


  // Gather coins input DOM
  Vue.component('coin-count', {
    props : {
      coin : {
        type : Object,
        default : {},
      },
      value :{
        type : Number,
        default : 0,
      }
    },
    template : `
      <div class='coin-count'>
        <label :for='coin.name'>{{coin.name}}</label>
        <input ref='input' v-bind:value='value' v-on:blur='sendValue($event.target.value)' type='number' min='0'></input>
    </div>
    `,
    methods : {
      sendValue : function(str) {
        if(isOnlyDigit(str)) {
          this.$emit("input", +str);
          this.$refs.input.value = +str;
        } else {
          openDialog('Error', 'You can only enter in digits.'); 
          this.$refs.input.value = this.value;
        }
      },
    }
  });

  // Insert coins into vending machine DOM
  Vue.component('insert-coin', {
    props : ['coin','loc'],
    methods : {
      putCoinIn : function(loc) {
        if(vApp.coins[loc].quantity == 0) return;
        vApp.coins[loc].quantity--;
        vApp.addCoinToVendor(vApp.coins[loc].name, vApp.coins[loc].val);
      }
    },
    template : `
      <tr class='insert-coin'>
        <td class='name'>{{coin.name}}</td>
        <td>{{coin.quantity}}</td>
        <td> <button class='ui-corner-all ui-button' @click='putCoinIn(loc)'> + </button> </td>
      </tr>
    `,
  });

  // Vending item info DOM
   Vue.component('vending-item', {
    props : ['item','loc'],
    methods : {
      getDollars : function(val) {
        return getDollars(val);
      }
    },
    template : `
      <tr class='vending-items'>
        <td>{{item.name}}</td>
        <td>{{item.quantity}}</td>
        <td>\${{ getDollars(item.cost) }}</td>
      </tr>
    `,
  });

  vApp = new Vue({
    el : '#app',
    data : {
      coins : [],                     // Coins gather by user
      vending : [],                   // Items in vending machine
      coinsInVendor : {},             // Coins in the vending machine
      itemInBag : [],                 // Items in user's bag
      sum : 0,                        // Sum of money in vending machine
      picked : '',                    // Item selected by user
    },
    methods : {
      addCoin : function(name, quantity, val) {
        let coin = this.getElement(this.coins, name);
        if(coin == null) this.coins.push({ name : name, quantity : 5, val : val });
        else coin.quantity += quantity;
      },
      addItemToVendor : function(name, quantity, cost) {
        let item = this.getElement(this.vending, name);
        if(item == null) this.vending.push({ name : name, quantity : 10, cost : cost });
        else item.quantity += quantity;
      },
      addCoinToVendor : function(name, val) {
        this.coinsInVendor[name] = ++this.coinsInVendor[name] || 1;
        this.sum += val;
      },
      getItem : function(evt) {
        let name = evt.value;
        let item = this.getElement(this.vending, name);
        if(item == null) return;
        if(item.quantity > 0 && this.sum >= item.cost) {
          // Update item status
          item.quantity--;
          this.sum -= item.cost;
          this.findChange();
          this.itemInBag.push(item.name);

          // Wait 500 before deselecting radio
          setTimeout(() => { this.picked = '' }, 500);
        } else {
          this.picked = '';
          if(item.quantity == 0) openDialog('Error', `-${item.name}- is out. Funds are refunded.`);
          else openDialog('Error', `You have insufficient fund ($${getDollars(this.sum)}) in the machine to buy -${name}-. Funds are refunded.`);
        }
  
        this.returnCoins();
      },
      returnCoins : function() {
        for(let coin of this.coins) {
          if(this.coinsInVendor[coin.name]) coin.quantity += this.coinsInVendor[coin.name]; 
        }
        this.coinsInVendor = {};
        this.sum = 0;
      },
      findChange : function() {
        // Assumed change can only be returned in nickel
        let numOfNickel = Math.round(this.sum/0.05);
        this.coinsInVendor = {};
        this.coinsInVendor['nickel'] = numOfNickel;
      },
      getDollars : function(val) {
        return getDollars(val);
      },
      getElement : function(array, name) {
        for(let i  = 0; i < array.length; i++) {
          if(array[i].name == name) return array[i];
        }
        return null;
      },
    },
    mounted : function() {
      $('#app').accordion({heightStyle : 'content'});
      $('#returnB').button();
    }
  })

  // Add definition of coins
  for(let coin of coinDef) {
    vApp.addCoin(coin.name, coin.quantity, coin.val);
    $('.coin-count input').spinner();
  }
  
  // Add items to vending machine
  for(let item of items) {
    vApp.addItemToVendor(item.name, item.quantity, item.cost);
  }
});

function openDialog(title, context) {
  $('#dialog').dialog('option', 'title', title);
  $('#dialog p').text(context);
  $('#dialog').dialog('open');
}

function getDollars(val) {
  val = val >= 100 ? (val/100).toFixed(2) : val;
  val = (Math.round(val * 100) / 100).toFixed(2);
  return val;
}

function isOnlyDigit(str) {
  if(str.length == 0) return false;
  return str.match(/[^0-9]/g) == null;
}
