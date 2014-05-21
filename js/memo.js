	document.onselectstart = function(){return false;};
    document.onmousedown = function(){return false;};
	var TILESNUMBER = 80;
	tilesLast = TILESNUMBER;
	var TILESLINEAR = 10;
	var movesNumber = 0;
	var tilesPars = 0;
	var tiles = [];
	var tilesCollected = [];
	var take = true;	
	
	var tilesImg = ['my_computer.png','findingnemo1_fav.png','findingnemo2_fav.png','findingnemo3_fav.png','findingnemo4_fav.png','findingnemo5_fav.png','oksana.png','findingnemo1.png','findingnemo2.png','findingnemo3.png',
					'findingnemo4.png','findingnemo5.png','bogdan.png','findingnemo1_help.png','findingnemo2_help.png','findingnemo3_help.png','findingnemo4_help.png','findingnemo5_help.png','media_player.png','findingnemo1_ok.png',
					'findingnemo2_ok.png','findingnemo3_ok.png','findingnemo4_ok.png','findingnemo5_ok.png','my_doc.png','findingnemo1_add.png','findingnemo2_add.png','findingnemo3_add.png','findingnemo4_add.png','findingnemo5_add.png',
					'findingnemo1_minus.png','findingnemo2_minus.png','findingnemo3_minus.png','findingnemo4_minus.png','findingnemo5_minus.png','findingnemo1_delete.png','findingnemo2_delete.png','findingnemo3_delete.png','findingnemo4_delete.png','findingnemo5_delete.png'
				];
	var channel_max = 10;										
	audiochannels = new Array();
	for (a=0;a<channel_max;a++) 
	{									
		audiochannels[a] = new Array();
		audiochannels[a]['channel'] = new Audio();						
		audiochannels[a]['finished'] = -1;							
	}
	paused = false;
	function playSound(s) 
	{
		for (a=0;a<audiochannels.length;a++) 
		{
			thistime = new Date();
			if (audiochannels[a]['finished'] < thistime.getTime()) 
			{			
				audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration*1000;
				audiochannels[a]['channel'].src = document.getElementById(s).src;
				audiochannels[a]['channel'].load();
				if(paused == true)
					audiochannels[a]['channel'].pause();
				else
					audiochannels[a]['channel'].play();
				break;
			}
		}
	}
	
	function audPlayPause() 
	{	
		if(paused == false)
		{
			paused = true;
			$('.muted').css({'background' : 'url(audio/gnome_audio_volume_muted.png)'}).toggle().fadeIn(500);
		}
		else
		{
			paused = false;
			$('.muted').css({'background' : 'url(audio/gnome_audio_volume_high.png)'}).toggle().fadeIn(500);
		}
	}
	
	
	function startGame() 
	{
	
		$('.area').fadeIn("slow");
		movesNumber = 0;
        tilesPars = 0;	
        tiles = [];
        tilesCollected = [];
        take = true;        

		var area = $('.area').empty();

		for (var i=0; i<TILESNUMBER; i++)
		{
			tiles.push(Math.floor(i/2));
		}
		
		Array.prototype.swap = function (a, b) 
		{

			var sw = this[a];
			this[a] = this[b];
			this[b] = sw;
 
		};
		
		for (i=TILESNUMBER-1; i>0; i--) 
		{
			var swap = Math.floor(Math.random()*i);	
			tiles.swap(i, swap);
		}

		for (i=0; i<TILESNUMBER; i++) 
		{
		
			var tile = $('<canvas class="field"></canvas>');
			area.append(tile);
			
			tile.data('fieldType',tiles[i]);
			tile.data('index', i);
			tile.css({left : 5+(tile.width()+5)*(i%TILESLINEAR),top : 5+(tile.height()+5)*(Math.floor(i/TILESLINEAR))});				
			tile.buttonMode = true;
			tile.bind('click', function() 
			{
				pushTile($(this));				
			});
		}		
		
		$('.moves').remove();		
		$('.surface').append('<div class="moves" >Ruchy: ' + movesNumber + '</div>');	
		$('.moves').insertBefore('.stop').insertBefore('.pars');
		$('.moves').toggle();	
	}

	function pushTile(element) 
	{		
		if (take) 
		{
			if (!tilesCollected[0] || (tilesCollected[0].data('index') != element.data('index'))) 
			{
				tilesCollected.push(element);				
				element.css({'background-image' : 'url('+'img/'+tilesImg[element.data('fieldType')]+')'})	
			}
			
			if (tilesCollected.length == 2) 
			{
				take = false;
				
				if (tilesCollected[0].data('fieldType')==tilesCollected[1].data('fieldType')) 
				{					
					setTimeout('removeTiles()', 500);
					$('.area').append('<h1 id="info">Para</h1>');			
					$('#info').css({marginTop: 600, opacity: '0.6'}).fadeIn();
					tilesLast -=2;
					$('.tilesLast').html("Zostało: " + tilesLast);
				} 
				else 
				{
					playSound('multiaudio2');
					setTimeout('refreshTiles()', 500);					
				}
				
				movesNumber++;				
				$('.moves').html("Ruchy: " + movesNumber);				
			}
		}
	}

	function removeTiles() 
	{
		var type = Math.floor((Math.random()*2)+1); 
		if( type < 2)
		{
			tilesCollected[0].toggle(function() 
			{
				$(this).remove();
			});		
			tilesCollected[1].toggle(function() 
			{
				$(this).remove();
				playSound('multiaudio3');
				tilesPars++;			
				$('.pars').html("Pary: " + tilesPars);
				$('#info').animate({ marginTop: '-600', paddingRight: '0', marginBottom: '300', marginLeft: '0', paddingLeft: '0',opacity:'0.3'  }, 2000 );	
				if (tilesPars >= TILESNUMBER / 2) 
				{
					clearInterval(myVar);
              
					take = false;
					tilesLast = TILESNUMBER;
					t = false;
					sec = 0;
					min = 0;
					hour = 0;
					tilesPars = 0;				
					$('.moves').fadeOut(); $('.stop').toggle(); 				
					$('.tilesLast').fadeOut(); $('#time').fadeOut();  $('.pars').fadeOut();  $('.muted').toggle();					
					$('.area').fadeOut();
				
					$('.gameOver').remove();
					$('.surface').append('<h1 class="gameOver">Koniec</h1>');
					$('.gameOver').fadeIn(6000);
					$('.gameOver').click(function()
					{
						window.onbeforeunload = false;
						location.reload().toggle("slow");		
					});				
				}
				take = true;
				tilesCollected = new Array();
			})
		}
		else
		{
			tilesCollected[0].fadeOut(function() 
			{
				$(this).remove();
			});
			tilesCollected[1].fadeOut(function() 
			{
				$(this).remove();
				playSound('multiaudio3');
				tilesPars++;				
				$('.pars').html("Pary: " + tilesPars);
				$('#info').animate({ marginTop: '-600', paddingRight: '0', marginBottom: '300', marginLeft: '0', paddingLeft: '0',opacity:'0.3'  }, 2000 );	
				if (tilesPars >= TILESNUMBER / 2) 
				{
					clearInterval(myVar);
              
					take = false;
					tilesLast = TILESNUMBER;
					t = false;
					sec = 0;
					min = 0;
					hour = 0;
					tilesPars = 0;				
					$('.moves').fadeOut(); $('.stop').toggle(); 				
					$('.tilesLast').fadeOut(); $('#time').fadeOut();  $('.pars').fadeOut();  $('.muted').toggle();					
					$('.area').fadeOut();
				
					$('.gameOver').remove();
					$('.surface').append('<h1 class="gameOver">Koniec</h1>');
					$('.gameOver').fadeIn(6000);
					$('.gameOver').click(function()
					{
						window.onbeforeunload = false;
						location.reload().toggle("slow");		
					});				
				}
				take = true;
				tilesCollected = new Array();
			})
		}		
	}

	function refreshTiles() 
	{
		tilesCollected[0].css({'background-image':'url(img/my_documents.png)'})
		tilesCollected[1].css({'background-image':'url(img/my_documents.png)'})
		tilesCollected = new Array();
		take = true;		
	}
	
	$(document).ready(function() 
	{
		$('.surface').append('<h1 class="startGame">Nowa gra</h1>');		
		
		$('.startGame').fadeIn(6000);
		add = false;
		$('.startGame').click(function() {
		
			startGame();
			if(add == false)
			{	
		
				$('.surface').append('<div class="pars" ></div>');
				$('.pars').insertBefore('.stop');
				$('.surface').append('<div class="tilesLast" ></div>');
				$('.tilesLast').insertBefore('.stop');
				$('.surface').append('<div id="time" ></div>');				
				$('#time').insertBefore('.stop');	
				$('.moves').insertBefore('.pars');
				
			}	
		
			add = true;
			$('.startGame').toggle(); 		
		
			$('.pars').html(" Pary: " + tilesPars).toggle("slow"); 
			$('.tilesLast').html("Zostało: " + tilesLast).toggle(); 
		
			$('#time').html("Czas trwania: <br/> 00:00:00").toggle("slow"); 
		
			$('.stop').fadeIn(3000); 
			$('.muted').fadeIn(3000); 
			$('.about').fadeIn(3000); 
			$('.help').fadeIn(3000); 
			myVar=setInterval(function(){times()},1000);
		
			window.onbeforeunload = function() {
				return "Czy na pewno chcesz opuścić grę?";
			}
		
		});	
	
		document.onkeydown = checkKeycode
		function checkKeycode(e) {
			var keycode;
			if (window.event)
				keycode = window.event.keyCode;
			else if (e)
				keycode = e.which;

			// Mozilla firefox
			if ($.browser.mozilla) 
			{
				if (keycode == 116 ||(e.ctrlKey && keycode == 82)) 
				{
					if (e.preventDefault)
					{
						e.preventDefault();
						e.stopPropagation();
					}
				}
			} 
			// Opera
			else if ($.browser.opera) 
			{
				if (keycode == 116 ||(e.ctrlKey && keycode == 82)) 
				{
					if (e.preventDefault)
					{
						e.preventDefault();
						e.stopPropagation();
					}	
				}
			} 	
			// IE
			else if ($.browser.msie) 
			{
				if (keycode == 116 || (window.event.ctrlKey && keycode == 82)) 
				{
					window.event.returnValue = false;
					window.event.keyCode = 0;
					window.status = "Odświerzanie wyłączone";
				}
			}
		}
		sec = 0;
		min = 0;
		hour = 0;
		t = false;
	
		function zero(element) 
		{ 
			if (element < 10) return element = "0" + element;
			return element;
		}
	
		function times() 
		{
 
			sec +=1;
	
			if((sec%60) == 0)
			{
				min++;
				sec = 0;
				t = true;	
			}  
			else if(t == true && (min%60) == 0)
			{
				hour++;
				min = 0;
				t = false;
			}
			else if(hour >= 24)
				clearInterval(myVar);	
    
			$('#time').html("Czas trwania: <br/>" + zero(hour) +":" + zero(min) + ":" + zero(sec));
		}
	
		p=false;
		$('.stop').click(function() 
		{
			if(p == false)
			{
				take = false;
				clearInterval(myVar);
				$(this).css({'background' : 'url(audio/gnome_media_playback_start.png)'});
				$(this).val("Wznów").toggle().fadeIn(500);

				p = true;
				take = false;
			} 
			else if(p == true)
			{
				myVar=setInterval(function(){times()},1000); 
				$(this).css({'background' : 'url(audio/gnome_media_playback_pause.png)'});
				$(this).val("Zatrzymaj").toggle().fadeIn(500);
				if(p == true)
					take = true;
				p = false;
			}
	
		});
		$('.muted').click(function() { audPlayPause(); });	
		$('.about').click(function() { alert("Andrzej Kostrzewa\nCopyright 2013"); });	
		$('.help').click(function() { alert("Instrukcja\n\n ..."); });
	});