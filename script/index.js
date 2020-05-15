let userCoins = {};
let vending;

document.addEventListener('DOMContentLoaded', function() {

  /// Configue dialog box
  $('#dialog').dialog({ autoOpen : false });

  createCoinTab(coinDef);
  createVendingTab(items);

  $('h3#insertCoins').on('click', () => {
    updateCoinQuantity();
  });


  $('#returnB').on('click', returnCoins);

  animateUI();

});


function animateUI() {
  // Create menus
  $('#mainMenu').accordion({heightStyle : 'content'});
}

function createCoinTab(coinDef) {
  // Empty out list
  $('#coinList').empty();

  // Add coin to list and add to coin map
  for(let coin of coinDef) {
    if(coin.name == undefined || coin.val == undefined) continue;

    let name = coin.name;
    if(userCoins[name] == undefined) userCoins[name] = { val : coin.val, quantity : 0 };

    // Render coin
    let cSelector = `#coinList input#${name}`;
    $('#coinList').append(getPocketDOM(name));
    $(cSelector).spinner();

    // Add coin listener
    $(cSelector).on('focusout', () => {
      let _$ = $(cSelector);
      let name = _$.attr('name');

      // Check if value is a number
      let val = _$.val();

      if(!isDigit(+val)) {
        openDialog('Error', `${val} is not a valid number!!!`);
        _$.val(userCoins[name].quantity);
        return;
      }

      // Update coin info
      userCoins[name].quantity = +val;
      console.log(`${name} : x ${+val}`);
    });
  }

}

function openDialog(title, context) {
  $('#dialog').dialog('option', 'title', title);
  $('#dialog p').text(context);
  $('#dialog').dialog('open');
}


function isDigit(str) {
  if(str.length == 0) return false;
  return !isNaN(str);
}


function createVendingTab(){
  // Render and add items to vending machine
  vending = new vendingMachine();
  for(let item of items) {
    vending.addItem(item.name, item.cost, 10);

    // Create vending table display
    $('#vendingTable').append(getItemDisplayDOM(item.name, getDollars(item.cost), 10));

    // Create radio button
    $('#selectItemForm').append(getSelectItemDOM(item.name));
  }
  $('#returnB').button();


  // Render user input
  $('#selectItemForm input').checkboxradio();
  for(let name in userCoins) {
    let coinDef = userCoins[name];

    // Render rows to display coins that can be inserted by the user
    let bSelector = `button#insert_${name}`;
    $('#insertCoinTable').append(getInsertCoinDOM(name, coinDef.quantity));
    $(bSelector).button({
      icon : 'ui-icon-plusthick',
      showLabel : false,
    });

    // Add listener to button
    let clickFcn = () => {
      if(userCoins[name].quantity <= 0) return;

      // Update credit amount
      userCoins[name].quantity--;
      vending.addCoin(name, coinDef.val);

      // Re-render
      renderVendingTab(name);
    }
    $(bSelector).on('click', clickFcn.bind(null));
  }

  // Item selection listener
  $('#selectItemForm').on('change', () => {
    let selected = $('#selectItemForm input[name="pickThis"]:checked').val();
    if(vending.retrieveItem(selected)) console.log('Got item : ', selected);
    else openDialog('Error', `You have insufficient fund ($${getDollars(vending.getCredit())}) to buy -${selected}-`);
    returnCoins();
    updateItemQuantity();

    // Deselect radio button at X amount of time
    setTimeout( () => {
      $('#selectItemForm input[name="pickThis"]').prop('checked', false);
      $('#selectItemForm input').checkboxradio('refresh');
    }, 750);

    return;
  });
}



function returnCoins() {
  let coins = vending.returnCoins();

  for(let name in coins) {
    let num = coins[name];
    userCoins[name].quantity += num;
  }

  renderVendingTab();
}

function renderVendingTab(name=null) {
  updateCoinQuantity(name);
  updateCredit();
  updateItemQuantity();
}

function updateCoinQuantity(name=null) {
  // Default update all of the quantity
  if(name == null) {
    for(let name in userCoins) {
      let coinsLeft = userCoins[name].quantity;
      $(`#insertCoinTable tr.${name} .quantity`).html(userCoins[name].quantity);
    }
  } else {
    if(userCoins[name] == undefined) return;
    $(`#insertCoinTable tr.${name} .quantity`).html(userCoins[name].quantity);
  }
}

function updateItemQuantity(name=null) {
  // Default update all of the quantity
  if(name == null) {
    let list = vending.getItemList();
    for(let name in list) {
      let item = list[name];
      $(`#vendingTable tr.${name} .quantity`).html(item.quantity); 
    }
  } else {
    let item = vending.getItem(name);
    if(item == null) return;
    $(`#vendingTable tr.${name} .quantity`).html(item.quantity); 
  }
}


function updateCredit() {
  let credit = vending.getCredit();
  $('#amount').text(getDollars(credit));
}

function getDollars(val) {
  val = val >= 100 ? (val/100).toFixed(2) : val;
  val = (Math.round(val * 100) / 100).toFixed(2);
  return val;
}

function getPocketDOM(name, quantity=0) {
  return `<div class='pocket'>
            <label for=${name}>${name}</label>
            <input id=${name} name=${name} min='0' placeholder='0' value=${quantity}></input>
          </div>`;
}

function getInsertCoinDOM(name, quantity) {
  return `<tr id='${name}_info' class='${name}'>
            <td class='name'> ${name} </td>
            <td class='quantity'> ${quantity} </td>
            <td> <button id='insert_${name}' class='buttonStyle'></button> </td>
         </tr>`;
}

function getItemDisplayDOM(name, cost, quantity) {
  return `<tr id='vending_${name}' class='${name}'>
            <td class='name'> ${name} </td>
            <td class='quantity'> ${quantity} </td>
            <td class='cost'><span>$</span>${cost}</td>
          </td>`;
}

function getSelectItemDOM(name) {
  return `<label for='${name}Radio'> ${name} </label>
         <input type='radio' id='${name}Radio' name='pickThis' value=${name}></input>`;
}
