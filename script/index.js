let coinInfo = {};

document.addEventListener('DOMContentLoaded', function() {
  updateCoinList(coinDef);

  /// Configue dialog box
  $('#dialog').dialog({ autoOpen : false });


  animateUI();

});


function animateUI() {
  // Create menus
  $('#mainMenu').accordion({heightSyle : 'content'});

  // Create spinners
//  $('#spinner').spinner();
//  $('#spinner2').spinner();
}

function updateCoinList(coinDef) {
  // Empty out list
  $('#coinList').empty();

  // Add coin to list and add to coin map
  for(let coin of coinDef) {
    if(coin.name == undefined || coin.val == undefined) continue;

    let name = coin.name;
    if(coinInfo[name] == undefined) coinInfo[name] = { val : coin.val, quantity : 0 };

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
        _$.val(coinInfo[name].quantity);
        return;
      }

      // Update coin info
      coinInfo[name].quantity = +val;
      console.log(`${name} : x${+val}`);
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

function getCoinDOM(name, quantity=0) {
  return `<div>
            <label for=${name}>${name}</label>
            <input id=${name} name=${name} min='0' placeholder='0' value=${quantity}></input>
          </div>`;
}




