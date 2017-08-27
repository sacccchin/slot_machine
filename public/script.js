var icons = [
  'Symbol_0.png','Symbol_1.png','Symbol_2.png','Symbol_3.png','Symbol_4.png','Symbol_5.png'
];

var slots = document.querySelector('.slots');
var cols = document.querySelectorAll('.col');
for(var i in cols) {
  if (!cols.hasOwnProperty(i))
    continue;
  var col = cols[i];
  var str = '';
  var firstThree = '';
  for(var x = 0; x < 30; x++) {
    var part = '<div class="icon icon-'+ x +'"><img src="'+icons[Math.floor(Math.random()*icons.length)]+'"/></div>';
    str += part
    if (x < 3) firstThree += part;
  }
  col.innerHTML = str+firstThree;
}

function spin(elem) {
  elem.setAttribute('disabled', true);
  slots.classList.toggle('spinning', true);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET","http://127.0.0.1:8888/spin", true);
  xmlhttp.onreadystatechange=function(){
  	if (xmlhttp.readyState==4 && xmlhttp.status==200){
  		var r = JSON.parse(xmlhttp.responseText);  		
  		var el = document.getElementById("result");
  		var img_1 = cols[0].querySelectorAll('div.icon-1 img');
  		var img_2 = cols[1].querySelectorAll('div.icon-1 img');
  		var img_3 = cols[2].querySelectorAll('div.icon-1 img');
  		
  		window.setTimeout(function() {
  			img_1[0].setAttribute('src', 'Symbol_'+ r.a + '.png');
  			img_1[1].setAttribute('src', 'Symbol_'+ r.a + '.png');
  			img_2[0].setAttribute('src', 'Symbol_'+ r.b + '.png');
				img_2[1].setAttribute('src', 'Symbol_'+ r.b + '.png');
				img_3[0].setAttribute('src', 'Symbol_'+ r.c + '.png');
				img_3[1].setAttribute('src', 'Symbol_'+ r.c + '.png');
  		}, 1500);
  		
  		window.setTimeout(function() {
  			el.innerHTML = outcome_message(r);
  		  slots.classList.toggle('spinning', false);
  		  elem.removeAttribute('disabled');
  		  elem.focus();
  		  if( r.is_bonus) {
  		  	spin(document.getElementById('spin'))
  		  }
  		}.bind(elem), 3500);
  	}
  }
  xmlhttp.send();
  
}

function outcome_message(r) {
	var m = "The result of the round is " + r.outcome.toLowerCase() + ".";
	if (r.is_bonus) {
		m += " You have won a bonus win. With this you get a free spin."
	}
	return m;
}
