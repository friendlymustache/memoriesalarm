/*
*  
*  Function for handling clicks on time or set alarm button.
*  Within this function, events for input to hour/minute fields are bound
*/			

$(function(){

	var clicked = false;
	$('#set_alarm_link, #alarm_time').one("click", (function(){
		if(clicked == false){
			
			var times_clicked = 1;
						
			$('#alarm').html("<input type = 'text' class = 'time' id = 'hour'> <h1 class = 'colon'>:</h1> </input>"); 
			$('#alarm').append("<input type = 'text' class = 'time' id = 'min'>  </input>");
			$('#alarm').append("<button id = 'time_button' class='btn btn-warning'> AM </button>");
			
			$('#hour').val("8");
			$('#min').val("00");
			
			$('#alarm').append("<br/><br/>");	
			
			// The first time #set_alarm_click is clicked, it turns into a start button for the alarm	
			$('#set_alarm_link').text("Start");
			
			
			clicked = true;
			
			$('#time_button').click(function(){		
				var button = $('#time_button');	
				var btn_class = button.attr("class");
				if(btn_class == 'btn btn-warning'){
					button.attr("class", "btn btn-inverse");
					button.text("PM");			
				}
				else{
					button.attr("class", "btn btn-warning");
					button.text("AM");
				}

			});			
		$(document).blur();
		$('#hour').focus();			
		}
		
		
	/*
	*  
	*  Function for handling input to minute field
	* 
	*/			
		

		
		$('#min').keydown(function(e){
			var input = String.fromCharCode(e.keyCode);			
			if( [8, 37, 39, 46, 13].indexOf(e.keyCode) == -1 && input != ""){
				
				// if input is a non-number, do nothing
				if(String.fromCharCode(e.keyCode).match(/[0-9]/) == null){
					return e.preventDefault();		
				}
				
				
				var val = $('#min').val();		
				var result = val + input;
				
				// if input will make minute value more than 2 chars	
				if( result.length > 2){
					return $('#min').val("");
				}				
				
				// if input causes minute value to exceed 59, reset the minute field and do nothing
				if(parseInt(result) > 59){
					$('#min').val("");					
					return e.preventDefault();
				}
								
			}
			else if(e.keyCode == 13){
				$('#set_alarm_link').click();
			}			

			
		});
	
		
	/*
	*  
	*  Function for handling input to hour field
	* 
	*/	
	

		
		$('#hour').keydown(function(e){
			var input = String.fromCharCode(e.keyCode);			
			if( [8, 37, 39, 46, 13].indexOf(e.keyCode) == -1 && input != ""){
				
				// if input is a non-number, do nothing
				if(String.fromCharCode(e.keyCode).match(/[0-9]/) == null){
					return e.preventDefault();		
				}
				
				
				var val = $('#hour').val();		
				var result = val + input;
				
				// if input will make hour value more than 2 chars	
				if( result.length > 2){
					return $('#hour').val("");
				}				
				
				// if input causes hour value to exceed 12, reset the minute field and do nothing
				if(parseInt(result) > 12 || parseInt(result) == 0){
					$('#hour').val(input);					
					return e.preventDefault();
				}
								
			}
			
			// if the enter button was pressed, shift to minute input
			else if(e.keyCode == 13){
				$('#hour').blur();
				$('#min').focus();
				$('#min').val("");
			}
											
			
		});
		
		

			
		
		$('#set_alarm_link').click(function(){
			// $('#wrapper').append("<div> Called second click handler </div>");			
			times_clicked +=1;

			// This is called when the "Start" alarm buton is clicked
			if(times_clicked == 2){
				
				// $('#wrapper').append("<div> Called times_Clicked = 2</div>");
				$('#set_alarm_link').text("Stop");	
			
	

				$('#hour, #min, #time_button').attr("disabled", "true");
				$('#time_button').css("opacity", "1");
			
				var hour = parseInt($('#hour').val());
				var min = parseInt($('#min').val());
			
				// if the time is PM, add 12 to the hour to get a 24-hour time value
				// don't do this if it's 12 PM
				if($('#time_button').text()=="PM"){
					if(hour != 12){
						hour+=12;						
					}
				}
				else if(hour == 12){
					hour = 0
				}
			
				var date = new Date();
				var hour_now = date.getHours();
				var min_now = date.getMinutes();
			
				var delay = 3600*(hour-hour_now)+60*(min-min_now);
				if(delay < 0){
					delay+= 3600*24*60;
				}
			
				delay*=1000
			
	
			
				// load alarm alert
				alarm_timeout = window.setTimeout(alarm_alert, delay);

				// Every 50 ms up to 5 seconds, resize the window
				
				// window.setTimeout(function(){
			
					
					
				// }, delay+1000);
			
			
			
			}
			
			// This is called when times_clicked is > 2 (the button has gone from set alarm --> start --> stop)
			else if(times_clicked == 3){
				$('#set_alarm_link').text("Set Alarm");					
				times_clicked = 1;
				$('#hour, #min, #time_button').removeAttr("disabled");
				
				if(typeof(alarm_timeout)!="undefined"){
					window.clearTimeout(alarm_timeout);					
				}

				
			}	
			
		// BRACES TO END #set_alarm_link.click FUNCTION	
		});		
		
		
		
	// BRACES TO END ONE FUNCTION FOR SETTING ALARM	
	})
	
	// PARENTHESIS TO END .one STATEMENT
	);
	
	
});

function periodic_resize(duration, period){
	var loop_threshold = Math.ceil(duration/period);
	var num_of_loops = 0;
	var interval = setInterval(function(){
		num_of_loops+=1;
		//console.log(num_of_loops);
		$(window).resize();
		if(num_of_loops >= loop_threshold){
			clearInterval(interval);
		}
	}, period);	
}

function snooze(duration){
	
	$('#alarm_response_container').remove();
	$('#wrapper, #navbar_container').show();
	alarm.pause();
	if(typeof(alarm_timeout)!="undefined"){
		window.clearTimeout(alarm_timeout);					
	}	
		
	var min_val = parseInt($('#min').val());
	var hour_val = parseInt($('#hour').val());
	min_val+=5
		
	if(min_val >= 60){
		min_val%=60;
		min_val = "0"+min_val.toString();
		hour_val+=1;
		if(hour_val > 13){
			hour_val = 1;
			$('#time_button').click()
		}
	}
		
	$('#min').val(min_val);
	$('#hour').val(hour_val);
	$('#set_alarm_link').click();	
	
	window.clearTimeout;
	alarm = document.getElementById("alarm_audio");
	alarm.pause();
	window.setTimeout(alarm_alert, duration);
}


function alarm_alert(){
	// alert("Wake up!");
	$.get('/random', function(data){
		var img_start = data.search('<div id = "image_start">')+'<div id = "image_start">'.length;
		var img_end = data.search("image_end");
		
		
		var img = data.slice(img_start, img_end);
		
		var audio_start = data.search('<div id = "audio_start">');
		var audio_end = data.search('<div id = "audio_end">');
		
		var audio = data.slice(audio_start, audio_end);
		
		$('#wrapper').hide();
		$('#navbar_container').hide();
		
		$('#alarm_response_container').remove()
		$('body').append("<div id = 'alarm_response_container'>"+img+audio+"</div>");
		
		if($(window).width() > 700){
			$('#snooze_button, #dismiss_button').css({"font-size" : "28px", "height" : "50px"});
		}
		else{
			$('#snooze_button, #dismiss_button').css({"font-size" : "14px", "height" : "25px"});
		}	

		alarm = document.getElementById("alarm_audio");
		alarm.loop = true;
		alarm.play();
		
		periodic_resize(5000, 50);
		

		
		// $('#wrapper').append(data.length);
		// $('#wrapper').append(audio_start);
		// $('#wrapper').append(audio_end);				
	});
	



	$('#set_alarm_link').click();
	
	window.setTimeout(function(){
		
	var btns_height = $('#alarm_responses').outerHeight();
	var img_height = $('#content_image').height();
	var o = $('#content_image').offset();
	$('#alarm_responses').offset({"top" : o.top+(img_height-btns_height)/2});	
	
	$('#snooze_button').click(function(){	
		snooze(5*60*1000);
	});
	
	$('#dismiss_button').click(function(){
		$('#alarm_response_container').remove();
		$('#wrapper, #navbar_container').show();
		alarm.pause();
		if(typeof(alarm_timeout)!="undefined"){
					window.clearTimeout(alarm_timeout);					
		}		
		
	});		
	
	}, 500);
	
	
	$(window).off("resize").on("resize", function(){
		// console.log("scrolling or resizing");
		if($(window).width() > 700){
			$('#snooze_button, #dismiss_button').css({"font-size" : "28px", "height" : "50px"});
			$('#content_title_alarm').css("font-size", "18px");
		}
		else{
			$('#snooze_button, #dismiss_button').css({"font-size" : "14px", "height" : "25px"});
			$('#content_title_alarm').css("font-size", "12px");			
		}
		
		var btns_height = $('#alarm_responses').outerHeight();
		var img_height = $('#content_image').height();
		var img_width = $('#content_image').width();
		var window_height = $(window).height();
		var window_width = $(window).width();
		
		if(img_height > img_width){
			console.log("height bigger");
			$('#content_image').css("height", "100%");
		}
		else{
			console.log("width bigger");
			$('#content_image').css("width", "100%");
		}
		
		$('#alarm_responses').css("width", $('#content_image').width());
		
		
		var o = $('#content_image').offset();
		$('#alarm_responses').offset({"top" : o.top+(img_height-btns_height)/2, "left" : o.left});		
		
		// var window_offset = $(window).scrollTop();
		// $('#alarm_responses').offset({"top" : window_offset+(window_height-btns_height)/2, "left" : 0});		
		
		
	});
	

	
}




	


