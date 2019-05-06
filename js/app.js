var choiceFood = $('#choiceFood');
var foodName = $('#foodName');
var foodCal = $('#foodCal');
var serving = $('#serving');

var bank_item_clicked = function(el) {
	event.stopPropagation();
	name = $(el).find('.name').text();
	cal = $(el).find('.cal').text();
	foodName.text(name);
	foodCal.text(cal);
	if (choiceFood.hasClass('hide')) {
		choiceFood.removeClass('hide');
		choiceFood.addClass('show');
	}
};

(function() {
	var my_foods, day, month, year, day_now, month_now, year_now, prev_date, history, serve, totalCal, html, foods, foundFoods, html, self, li, lis, ln, i, btn;
	var par, food, date, name, cal, sum, val, m_date, title, calories;
	var day_nd_time = [];
	var day_nd_time_now = [];

	var home = $('#home');
	var foodBank = $('#foodBank');
	var cal_record = $('#cal_record');
	var go_manual = $('#go_manual');
	var contact_us = $('#contact_us');

	var search_internet = $('#search_internet');
	var api_data_list = $('#api_data_list');
	var add_food_manually = $('#add_food_manually');
	var dailySummary = $('#dailySummary');
	var records = $('#records');
	var food_bank = $('#food_bank');
	var contact_msg = $('#contact_msg');

	var query_bank = $('#query_bank');
	var bank_list = $('#bank_list');
	var add_foodname = $('#add_foodname');
	var add_calories = $('#add_calories');
		
	var edit_dailySummary = $('#edit_dailySummary');
	var daily_list = $('#daily_list');

	var robo_checker = $('#robo_checker');
	var robo_test = $('#robo_test');
	var robo_answer = $('#robo_answer');
	var robo_btn =  $('#robo_btn');
	var contact_form = $('#contact_form');
	var submit_msg = $('#submit_msg');
	var message = $('#message');
	var message_alarm = $('#message_alarm');

	home.on('click', function() {
		location.reload();
	});

	foodBank.on('click', function() {
		food_bank.removeClass('hide');
		food_bank.addClass('show');

		search_internet.removeClass('show');
		search_internet.addClass('hide');
		api_data_list.removeClass('show');
		api_data_list.addClass('hide');
		dailySummary.removeClass('show');
		dailySummary.addClass('hide');
		records.removeClass('show');
		records.addClass('hide');
		add_food_manually.removeClass('show');
		add_food_manually.addClass('hide');
		choiceFood.removeClass('show');
		choiceFood.addClass('hide');
		contact_msg.removeClass('show');
		contact_msg.addClass('hide');

		query_bank.val('');
		ln = bank_list.find('li').length;
		lis = bank_list.find('li');
		for (i = 0; i < ln; i++) {
			li = lis.eq(i);
			li.removeClass('hide');
			li.addClass('show');
		}
	});

	go_manual.on('click', function() {
		add_food_manually.removeClass('hide');
		add_food_manually.addClass('show');
		add_foodname.val('');
		add_calories.val('');

		search_internet.removeClass('show');
		search_internet.addClass('hide');
		api_data_list.removeClass('show');
		api_data_list.addClass('hide');
		dailySummary.removeClass('show');
		dailySummary.addClass('hide');
		records.removeClass('show');
		records.addClass('hide');
		choiceFood.removeClass('show');
		choiceFood.addClass('hide');
		food_bank.removeClass('show');
		food_bank.addClass('hide');
		contact_msg.removeClass('show');
		contact_msg.addClass('hide');
	});

	cal_record.on('click', function() {
		records.removeClass('hide');
		records.addClass('show');

		search_internet.removeClass('show');
		search_internet.addClass('hide');
		api_data_list.removeClass('show');
		api_data_list.addClass('hide');		
		dailySummary.removeClass('show');
		dailySummary.addClass('hide');
		add_food_manually.removeClass('show');
		add_food_manually.addClass('hide');
		choiceFood.removeClass('show');
		choiceFood.addClass('hide');
		food_bank.removeClass('show');
		food_bank.addClass('hide');
		contact_msg.removeClass('show');
		contact_msg.addClass('hide');
	});

	contact_us.on('click', function() {
		randomString(robo_test, 5);
		robo_answer.val('');
		robo_btn.prop("disabled", false);
		contact_msg.removeClass('hide');
		contact_msg.addClass('show');

		search_internet.removeClass('show');
		search_internet.addClass('hide');
		api_data_list.removeClass('show');
		api_data_list.addClass('hide');
		dailySummary.removeClass('show');
		dailySummary.addClass('hide');
		records.removeClass('show');
		records.addClass('hide');
		add_food_manually.removeClass('show');
		add_food_manually.addClass('hide');
		choiceFood.removeClass('show');
		choiceFood.addClass('hide');
		food_bank.removeClass('show');
		food_bank.addClass('hide');

		contact_form.removeClass('show');
		contact_form.addClass('hide');
		robo_checker.removeClass('hide');
		robo_checker.addClass('show');
	});

	var get_day_nd_time_now = function() {		
		//using British format only not British time
		time = new Date().toLocaleString("en-GB", options = {
		hc: 'h24',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
		});

		day_now = time.slice(0, 2);
		month_now = time.slice(3, 5);
		year_now = time.slice(6, 10);
		day_nd_time_now.push(day_now, month_now, year_now);
		return(day_nd_time_now);
	};

	var Food = Backbone.Model.extend({
	    defaults: {
			title: '', // e.g. bread, egg
			calories: 0,
			date: '', // daily consumption
			day: '',
			month: '',
			year: '',
			history: false
		}
	});

	var Foods = Backbone.Collection.extend({  
	    model: Food,
		// Implement localstorage
		localStorage: new Backbone.LocalStorage('Health-Tracker')
	});

	my_foods = new Foods;

	var ls = new Backbone.LocalStorage('Health-Tracker');
	var res = ls.findAll();
	var n = res.length;
	var i;
	var bank_items = '';
	var daily_items = '';
	var history_items = '';
	sum = 0;
	hist_sum = 0;
	day_nd_time_now = get_day_nd_time_now();
	day_now = day_nd_time_now[0];
	month_now = day_nd_time_now[1];
	year_now = day_nd_time_now[2];

	for (i = 0; i < n; i++) {
		food = res[i];
		title = food['title'];
		calories = food['calories'];
		date = food['date'];
		day = food['day'];
		month = food['month'];
		year = food['year'];
		close = food['close'];
		history = food['history'];
		if (date === '') {
			bank_items += '<li class="bank_item grab" onclick="bank_item_clicked(this)"><span class="name">' + title + ' </span><span class="cal"> ' + calories + ' </span><span class="red_font"> cal</span></li>';
		}

		if (date !== '' && !history) {
			if ((year_now === year) && (month_now === month) && (day_now === day)) {
				daily_items += '<li class="daily_item grab"><span class="date">' + date + ' </span><span class="name"> ' + title + '</span><span class="cal"> ' + calories + '</span><span class="red_font"> cal</span></li>';
				sum += parseInt(calories);
			}
		}

		if (date !== '' && history) {
			history_items += '<li class="history_item"><span class="date">' + date + ' </span><span class="cal"> ' + calories + '</span><span class="red_font"> cal</span></li>';
		}
		
		if (day !== '' && month !== '' && year !== '' && !history) {
			if ((year_now > year) || (month_now > month) || (day_now > day)) {
				hist_sum += parseInt(calories);
				if (prev_date !== date) {
					prev_date = date;
				}
			}
		}
	}

	my_foods.fetch();
	my_foods.models.forEach(function(food){
		day = food.get('day');
		month = food.get('month');
		year = food.get('year');
	    if (day !== '' && month !== '' && year !== '') {
			if ((year_now > year) || (month_now > month) || (day_now > day)) {
				food.destroy();
			}
		}
	});

	bank_list.html(bank_items);
	$('#daily_list').html(daily_items);
	$('#sum_day_cal').text(sum);

	$('#cal_history').html(history_items);
	var found_history = my_foods.where({'date': date, 'history': true});
	if (found_history.length === 0 & hist_sum > 0) {
		food = new Food({date: prev_date, calories: hist_sum, history: true});
		my_foods.add(food);
		food.save();
		var history_item = '<li class="item"><span class="date">' + date + ' </span><span class="cal red_font"> ' + calories + '</span><span class="red_font"> cal</span></li>';
		$('#cal_history').append(history_item);
	}

	var update_food_bank = function(name, calories) {		
		html = '<li class="bank_item grab" onclick="bank_item_clicked(this)"><span class="name">' + name + ' </span><span class="cal"> ' + calories + ' cal</span></li>';
		bank_list.append(html); // append to list	
	};

	var update_daily_summary = function(date, name, cal) {
		html = '<li class="daily_item grab"><span class="date">' + date + ' </span><span class="name"> ' + name + ' </span><span class="cal">' + cal + ' cal</span></li>';
		$('#daily_list').append(html); // append to list
		var sum = $('#sum_day_cal').text();
		$('#sum_day_cal').text(parseInt(sum) + parseInt(cal));
	};	

	var reset_choice_food = function() {
		foodName.text('');
		foodCal.text('');
		serving.val(1);
		choiceFood.removeClass('show');
		choiceFood.addClass('hide');
	};

	var query_btn = $('#query_btn');
	var query;
	query_btn.on('click', function() {
		query = $('#query').val().toLowerCase();		
		if(!query) {
			return;
		}

		$('#api_data').html('');		
		$.ajax({
			type: 'GET',
			dataType: 'json',
			cache: true,
			url: 'https://api.nutritionix.com/v1_1/search/' + query + '?results=0:10&fields=item_name,brand_name,item_id,nf_calories&appId=78501114&appKey=ecf54b163750b074da294925414a80f7'
							
		}).done(function(data) {
			var results = data.hits;
			var nu = results.length;
			if (nu < 1) {
				add_food_manually.removeClass('hide');
				add_food_manually.addClass('show');
				return;
			}

			var items = '';				
			for(var i = 0; i < nu; i++) {
				var result = data.hits[i];
				if(result.fields.nf_calories > 0) {
					items += '<li class="api_item grab"><span class="name">' + result.fields.item_name + ', ' + result.fields.brand_name + ' </span><span class="cal"> ' + result.fields.nf_calories + ' </span><span class="red_font"> cal</span></li>';
				}
			}

			$('#api_data').html(items);
			$('#query').val('');
			$('#api_data_list').removeClass('hide');
			$('#api_data_list').addClass('show');

			$('.api_item').on('click', function(e) {
				e.stopPropagation();
				name = $(this).find('.name').text();
				cal = $(this).find('.cal').text();
				foodName.text(name);
				foodCal.text(cal);
				if (choiceFood.hasClass('hide')) {
					choiceFood.removeClass('hide');
					choiceFood.addClass('show');
				}
			});

			$('#clear_api_result').on('click', function() {
				$('#api_data').html('');
			});
		})
	});
	//choice food options
	var save_food = $('#save_food');
	var save_nd_eat_food = $('#save_nd_eat_food');
	save_food.on('click', function() {
		name = $('#foodName').text().toString();
		calories = parseFloat($('#foodCal').text());		
		if (!name || !calories) {
			return;
		}

		foundFoods = my_foods.where({'title': name});
		if (foundFoods.length === 0) {
			food = new Food({title: name, calories: calories});
			my_foods.add(food);
			food.save();
			update_food_bank(name, calories);
			alert('Your choice food has been saved');
		} else {
			alert('This food has been saved earlier. You are good to go');
		}
		reset_choice_food();
	});

	save_nd_eat_food.on('click', function() {
		date = $('#date').text();
		day_nd_time = get_day_nd_time_now();
		day = day_nd_time[0];
		month = day_nd_time[1]
		year = day_nd_time[2];
		serve = serving.val();
		name = foodName.text().toString();
		//console.log(name);
		calories = parseInt(foodCal.text());
		if (!date || !name || !calories) {
			return;
		}

		if (serve < 1) {
			serve = 1;
		}
		// Calculate expiry time			
		totalCal = parseInt(parseInt(serve) * parseFloat(calories));
		foundFoods = my_foods.where({'title': name});
		if (foundFoods.length === 0) {
			var food = new Food({title: name, calories: calories});
			my_foods.add(food);
			food.save();  // Save in foodlist
			update_food_bank(name, calories);
		}

		food = new Food({date: date, title: name, calories: totalCal, year: year, month: month, day: day}); //Save day's food
		my_foods.add(food);
		food.save();		
		reset_choice_food();
		update_daily_summary(date, name, totalCal);
		alert('Your daily consumption has been updated and food saved in your food bank for future use');
		location.reload();
	});

	$('#clear_choiceFood').on('click', function() {
		foodName.text('');
		foodCal.text('');
		serving.val(1);
		if (choiceFood.hasClass('show')) {
			choiceFood.removeClass('show');
			choiceFood.addClass('hide');
		}

	});
	// add food manually
	btn = $('#add_food_manually_btn');
	btn.on('click', function() {
		name = add_foodname.val();
		cal = add_calories.val();
		if (name && cal) {
			foodName.text(name);
			foodCal.text(cal);
			choiceFood.removeClass('hide');
			choiceFood.addClass('show');
		}
	});
	// search bank
	var ln = bank_list.find('li').length;
	var i, bank_food, li;
	var count = 0;
	query_bank.on('keyup', function() {
		query = query_bank.val().toLowerCase();
		if (query) {
			for (i = 0; i < ln; i++) {
				li = bank_list.find('li').eq(i);
				bank_food = li.text().toLowerCase();
				if (bank_food.includes(query)) {
					li.removeClass('hide');
					li.addClass('show');
					count += 1;
				} else {
					li.removeClass('show');
					li.addClass('hide');
				}
			}

			if (count === 0) {
				alert('This food has not been saved before. You can either search the internet or if you know the calories, add manually to your meal. You may also limit your search to few words');
				for (i = 0; i < ln; i++) {
					li = bank_list.find('li').eq(i);
					li.removeClass('hide');
					li.addClass('show');
				}
			}
		} else {
			for (i = 0; i < ln; i++) {
				li = bank_list.find('li').eq(i);
				li.removeClass('hide');
				li.addClass('show');
			}
		}
	});
	// delete food from daily summary
	$('.daily_item').on('click', function() {
		self = this;
		event.stopPropagation();
		edit_dailySummary.removeClass('hide');
		edit_dailySummary.addClass('show');
		food = $(this).text();
		par = $('#delete_from_daily_list');		
		par.text(food);
		date = $(this).find('.date').text();
		name = $(this).find('.name').text();
		cal = $(this).find('.cal').text();
		sum = $('#sum_day_cal').text();
		$('#delete_food').on('click', function() {
			my_foods.fetch();
			my_foods.models.forEach(function(food){
				m_date = food.get('date');
				title = food.get('title');
				calories = food.get('calories');
			    if (m_date == date && title == name && calories == cal) {
					food.destroy();
				}
			});
			$(self).remove();
			val = parseInt(sum) - parseInt(cal);
			$('#sum_day_cal').text(val);
			par.text('');
			edit_dailySummary.removeClass('show');
			edit_dailySummary.addClass('hide');
		});

		$('#dont_delete_food').on('click', function() {
			par.find('span').eq(0).text('');
			edit_dailySummary.removeClass('show');
			edit_dailySummary.addClass('hide');
		});	
	});

	robo_btn.on('click', function() {
		if (robo_answer.val() === '') {
			return;
		}
		
		if (robo_test.text().toString() !== robo_answer.val().toString()) {
			randomString(robo_test, 5);
			robo_answer.val('');
			alert ('Incorrect answer. Retry');
			return;
		}

		robo_btn.prop("disabled", true);
		robo_checker.removeClass('show');
		robo_checker.addClass('hide');
		contact_form.removeClass('hide');
		contact_form.addClass('show');
	});

	submit_msg.on('blur', function() {
		message_alarm.text('');
	});

	submit_msg.on('click', function() {
		if (validate_message(message, message_alarm)) {
			var msg = {
				message: message.val(),
				date: time
			};

			$.post('./php/submit_public_msg.php', msg, function(data) {
				if (data == 0) {
					alert('Error connecting to server. Check your internet connection or retry later');
					return;
				}

				alert('Thank you. We will work on your comment');
				contact_msg.removeClass('show');
				contact_msg.addClass('hide');
			});
		}
	});  
})();

window.onscroll = function() {
	if (window.pageYOffset >= $('#navbar').offset().top) {
    $('#navbar').addClass('sticky');
  } else {
     $('#navbar').removeClass('sticky');
  }
};

var validate_message = function(msg, alarm) {
	var regex = /[^\d\w\s,;.()-@# ]/m;
	var val = $(msg).val();
	if (val === '') {
		return false;
	}
	//Check for invalid xters
	if (regex.test(val)) {
		$(alarm).text('You entered invalid characters');
		return false;
	}

	$(alarm).text ('');
	return true;
};

var randomString = function (el, len) {
    var chars = '23456789ABCDEFGHJKMNPQRSTUVWXTZabcdefghkmnpqrstuvwxyz';
    var string_length = len;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    el.text(randomstring);
};

(function() {	
	// date
	var time = new Date().toLocaleString("en-US", options = { 
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric'
		//hour: '2-digit',
		//minute: '2-digit'
	});

	$('#date').text(time);
	// clock
	function startTime() {
		var today = new Date();
		var h = today.getHours();
		var m = today.getMinutes();
		var s = today.getSeconds();
		m = checkTime(m);
		s = checkTime(s);
		$("#clock").text(h + ":" + m + ":" + s);
		var t = setTimeout(startTime, 500);
	}

	function checkTime(i) {
	if (i < 10) {i = "0" + i}; //add zero in front of numbers < 10
	return i;
	}

	startTime();
})();