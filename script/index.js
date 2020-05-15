let userCoins = {};

document.addEventListener('DOMContentLoaded', function() {
  /// Configue dialog box
  $('#dialog').dialog({ autoOpen : false });

  createCoinList(coinDef);
  createVendingTable();

  $('h3#insertCoins').on('click', () => {
    console.log('what');
    updateTableQuantity();
  });




  animateUI();

});


function animateUI() {
  // Create menus
  $('#mainMenu').accordion({heightSyle : 'content'});

  // Create spinners
//  $('#spinner').spinner();
//  $('#spinner2').spinner();
}

function createCoinList(coinDef) {
  // Empty out list
  $('#coinList').empty();

  // Add coin to list and add to coin map
  for(let coin of coinDef) {
    if(coin.name == undefined || coin.val == undefined) continue;

    let name = coin.name;
    if(userCoins[name] == undefined) userCoins[name] = { val : coin.val, quantity : 0 };

    // Render coin
    let cSelector = `#coinList input#${name}`;
    $('#coinList').append(getCoinDOM(name));
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



function createVendingTable(){
  for(let name in userCoins) {
    let coinDef = userCoins[name];

    // Render rows to display coins that can be inserted
    let bSelector = `button#insert_${name}`;
    $('#insertCoinTable').append(getCoinRowDOM(name, coinDef.quantity));
    $(bSelector).button({
      icon : 'ui-icon-plusthick',
      showLabel : false,
    });

    // Add listener to button
    let clickFcn = () => {
      if(userCoins[name].quantity <= 0) return;
      userCoins[name].quantity--;
      updateTableQuantity(name);
    }
    $(bSelector).on('click', clickFcn.bind(null));
  }
}

function updateTableQuantity(name=null) {
  // Default update all of the quantity
  if(name == null) {
    for(let name in userCoins) {
      let coinsLeft = userCoins[name].quantity;
    console.log(name, coinsLeft);
      $(`tr.${name} .quantity`).html(userCoins[name].quantity);
    }
  } else {
    if(userCoins[name] == undefined) return;
    $(`tr.${name} .quantity`).html(userCoins[name].quantity);
  }
}



function getCoinDOM(name, quantity=0) {
  return `<div>
            <label for=${name}>${name}</label>
            <input id=${name} name=${name} min='0' placeholder='0' value=${quantity}></input>
          </div>`;
}

function getCoinRowDOM(name, quantity) {
  return `<tr id='${name}_info' class='${name}'>
            <td class='name'> ${name} </td>
            <td class='quantity'> ${quantity} </td>
            <td> <button id='insert_${name}'></button> </td>
         </tr>`;
}

