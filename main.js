//TODO: 文字修飾時の読み取りは、ID=cke_1_contentsの内容を読み取るべき。bodyは更新前の内容となる為、

var $ = require('jquery');
var ariel_protocol=$('#ariel_schedule_urlgen').data('protocol');
var ariel_hostname=$('#ariel_schedule_urlgen').data('hostname');
var ariel_systemname=$('#ariel_schedule_urlgen').data('systemname');

var gcal_url =$('a[href*="//www.google.com/calendar/event?"],'+
								'a[href*="//www.google.com/calendar/render?"]').prop('href');
var ariel_param="";
if(gcal_url) {
	var gcal_param = gcal_url.match(/[?].+/)[0].substr(1);
	var arg = new Object;
	var pair=gcal_param.split('&');
	for(var i=0;pair[i];i++) {
		var kv = pair[i].split('=');
		var key = kv[0];
		var value = decodeURIComponent(kv[1].replace(/[+]/g,'%20'));
		switch (key) {
			case 'text' :
			case 'details' :
			case 'location' :
				var g2tmap={'text':'title','location':'location','details':'body'};
				ariel_param+=g2tmap[key]+'='+encodeURIComponent(value)+'&';
				break;
			case 'dates' :
				var dates = value.split('/');
				ariel_param+='dtstart='+encodeURIComponent(formatToArielDate(dates[0]))+'&';
				ariel_param+='dtend='+encodeURIComponent(formatToArielDate(dates[1]))+'&';
				break;
			default :
		}
	}
} else {
	if (window.location.hostname == ariel_hostname){
		if($(':input[name="resourceType"][value="/atypes/ariel/schedule"]')){
			var param_map = {};
			// 【基本タブ】
			param_map['title'] = $(':input[name="title"]').val();
			param_map['label'] = [];
			$(':input[name="label"]:checked').each(function(){
				param_map['label'].push($(this).val());
			});
			param_map['color'] = $(':input[name="color"]').val();
			param_map['is_all_day'] = $(':input[name="is_all_day"]:checked').val();
			var year_dtstart = $(':input[name^="year_dtstart"]').val();
			var month_dtstart = $(':input[name^="month_dtstart"]').val();
			var day_dtstart = $(':input[name^="day_dtstart"]').val();
			var hour_dtstart = $(':input[name^="hour_dtstart"]').val();
			var minute_dtstart = $(':input[name^="minute_dtstart"]').val();
			param_map['dtstart'] = year_dtstart +'-'+
			 ('00'+month_dtstart).slice(-2)     +'-'+
			 ('00'+day_dtstart).slice(-2)       +' '+
			 ('00'+hour_dtstart).slice(-2)      +':'+
			 ('00'+minute_dtstart).slice(-2)    +':00';

			var year_dtend = $(':input[name^="year_dtend"]').val();
			var month_dtend = $(':input[name^="month_dtend"]').val();
			var day_dtend = $(':input[name^="day_dtend"]').val();
			var hour_dtend = $(':input[name^="hour_dtend"]').val();
			var minute_dtend = $(':input[name^="minute_dtend"]').val();
			param_map['dtend'] = year_dtend +'-'+
			 ('00'+month_dtend).slice(-2)   +'-'+
			 ('00'+day_dtend).slice(-2)     +' '+
			 ('00'+hour_dtend).slice(-2)    +':'+
			 ('00'+minute_dtend).slice(-2)  +':00';
			param_map['attendee'] = [];
			$('#attendee .selectlistline').each(function(){
				param_map['attendee'].push($(this).attr('resid').split('/')[2]);
			});
			param_map['facility'] = [];
			$('#facility .selectlistline').each(function(){
				param_map['facility'].push($(this).attr('resid'));
			});
			// 【詳細タブ】
			param_map['organizer'] = $('#organizer .selectlistline').attr('resid').split('/')[2];
			param_map['body_format'] = $(':input[name="body_format_check"]:checked').val();
			if(param_map['body_format']){
				param_map['body'] = $('#cke_1_contents :input[name="body"]').val();
			} else {
				param_map['body'] = $(':input[name="body"]').val();
			}
			param_map['location'] = $(':input[name="location"]').val();
			param_map['address'] = $(':input[name="address"]').val();
			// 【システムタブ】
			param_map['banner'] = $(':input[name="banner"]:checked').val();
			param_map['scope'] = $(':input[name="scope"]').val();
			param_map['additional_public'] = [];
			$('#additional_public .selectlistline').each(function(){
				param_map['additional_public'].push($(this).attr('resid').split('/')[2]);
			});
			param_map['allow_attendee_edit'] = $(':input[name="allow_attendee_edit"]').val();
			param_map['view_presence_on_news'] = $(':input[name="view_presence_on_news"]').val();
			param_map['delegate_allowed'] = $(':input[name="delegate_allowed"]').val();
			// 【繰り返しタブ】
			param_map['recurrent_type'] = $(':input[name="recurrent_type"]:checked').val();

			if(param_map['recurrent_type'] != 'none'){
				param_map['recurrent_interval'] = $(':input[name="recurrent_interval"]').val();
				param_map['days_of_week'] = [];
				$(':input[name="days_of_week"]:checked').each(function(){
					param_map['days_of_week'].push($(this).val());
				});
				param_map['day_of_week'] = $(':input[name="day_of_week"]').val();
				param_map['day_of_month'] = $(':input[name="day_of_month"]').val();
				param_map['recurrent_subtype'] = $(':input[name="recurrent_subtype"]:checked').val();
				param_map['week_of_month'] = $(':input[name="week_of_month"]').val();
				param_map['month_of_year'] = $(':input[name="month_of_year"]').val();
				param_map['is_all_day_recurrent'] = $(':input[name="is_all_day_recurrent"]:checked').val();

				param_map['irregular_dates'] = [];
				$('#irregular_dates .inputdate').each(function(){
					var year_irregular = $(this).find(':input[name^="year_irregular_dates"]').val();
					var month_irregular = $(this).find(':input[name^="month_irregular_dates"]').val();
					var day_irregular = $(this).find(':input[name^="day_irregular_dates"]').val();
					if (year_irregular && month_irregular && day_irregular){
						param_map['irregular_dates'].push(year_irregular +'-'+
						 ('00'+month_irregular).slice(-2)       +'-'+
						 ('00'+day_irregular).slice(-2));
					}
				})
				var hour_dtstart_recurrent = $(':input[name^="hour_dtstart_recurrent"]').val();
				var minute_dtstart_recurrent = $(':input[name^="minute_dtstart_recurrent"]').val();
				if (hour_dtstart_recurrent && minute_dtstart_recurrent) {
					param_map['dtstart'] = '2017-01-01 '+
					 ('00'+hour_dtstart_recurrent).slice(-2)  +':'+
					 ('00'+minute_dtstart_recurrent).slice(-2)+':00';
				}
				var hour_dtend_recurrent = $(':input[name^="hour_dtend_recurrent"]').val();
				var minute_dtend_recurrent = $(':input[name^="minute_dtend_recurrent"]').val();
				if(hour_dtend_recurrent && minute_dtend_recurrent) {
					param_map['dtend'] = '2017-01-01 '+
					 ('00'+hour_dtend_recurrent).slice(-2)    +':'+
					 ('00'+minute_dtend_recurrent).slice(-2)  +':00';
				}
				 var year_recurrent_start = $(':input[name^="year_recurrent_start"]').val();
				 var month_recurrent_start = $(':input[name^="month_recurrent_start"]').val();
				 var day_recurrent_start = $(':input[name^="day_recurrent_start"]').val();
				 if(year_recurrent_start && month_recurrent_start && day_recurrent_start) {
					 param_map['recurrent_start'] = year_recurrent_start +'-'+
						('00'+month_recurrent_start).slice(-2) +'-'+
						('00'+day_recurrent_start).slice(-2);
				 }
				 param_map['limit_type'] = $(':input[name="limit_type"]:checked').val();
				 param_map['limit_count'] = $(':input[name="limit_count"]').val();
				 var year_limit_date = $(':input[name^="year_limit_date"]').val();
				 var month_limit_date = $(':input[name^="month_limit_date"]').val();
				 var day_limit_date = $(':input[name^="day_limit_date"]').val();
				 if(year_limit_date && month_limit_date && day_limit_date) {
					 param_map['limit_date'] = year_limit_date +'-'+
						('00'+month_limit_date).slice(-2) +'-'+
						('00'+day_limit_date).slice(-2);
				 }
				 param_map['recurrent_except_rule'] = $(':input[name="recurrent_except_rule"]').val();
				 param_map['recurrent_except_target'] = [];
				 $(':input[name="recurrent_except_target"]:checked').each(function(){
					 param_map['recurrent_except_target'].push($(this).val());
				 });
			}
			// 【その他タブ】
			param_map['radio_reflection'] = $(':input[name="radio_reflection"]:checked').val();
			param_map['visitor_company'] = $(':input[name="visitor_company"]').val();
			param_map['visitor_post'] = $(':input[name="visitor_post"]').val();
			param_map['visitor_name'] = $(':input[name="visitor_name"]').val();
			param_map['visitor_company2'] = $(':input[name="visitor_company2"]').val();
			param_map['visitor_post2'] = $(':input[name="visitor_post2"]').val();
			param_map['visitor_name2'] = $(':input[name="visitor_name2"]').val();
			param_map['visitor_company3'] = $(':input[name="visitor_company3"]').val();
			param_map['visitor_post3'] = $(':input[name="visitor_post3"]').val();
			param_map['visitor_name3'] = $(':input[name="visitor_name3"]').val();
			param_map['visitor_company4'] = $(':input[name="visitor_company4"]').val();
			param_map['visitor_post4'] = $(':input[name="visitor_post4"]').val();
			param_map['visitor_name4'] = $(':input[name="visitor_name4"]').val();
			param_map['numeric_field'] = $(':input[name="numeric_field"]').val();
			param_map['wireless_select'] = $(':input[name="wireless_select"]').val();
			param_map['group_field'] = ($('#group_field .selectlistline').attr('resid')||'').split('/')[2];
			param_map['tel_dept'] = $(':input[name="tel_dept"]').val();
			param_map['user_visitor'] = ($('#user_visitor .selectlistline').attr('resid')||'').split('/')[2];
			param_map['tel_extension'] = $(':input[name="tel_extension"]').val();
			param_map['group_field_2'] = ($('#group_field_2 .selectlistline').attr('resid')||'').split('/')[2];
			param_map['tel_dept_2'] = $(':input[name="tel_dept_2"]').val();
			param_map['user_visitor_2'] = ($('#user_visitor_2 .selectlistline').attr('resid')||'').split('/')[2];
			param_map['tel_extension_2'] = $(':input[name="tel_extension_2"]').val();
			param_map['group_field_3'] = ($('#group_field_3 .selectlistline').attr('resid')||'').split('/')[2];
			param_map['tel_dept_3'] = $(':input[name="tel_dept_3"]').val();
			param_map['user_visitor_3'] = ($('#user_visitor_3 .selectlistline').attr('resid')||'').split('/')[2];
			param_map['tel_extension_3'] = $(':input[name="tel_extension_3"]').val();
			param_map['text_field'] = $(':input[name="text_field"]').val();

			Object.keys(param_map).forEach(function(key) {
				var param = param_map[key];
				if(param instanceof Array){
					for (i=0; i<param.length; i++) {
						ariel_param+=key+'='+encodeURIComponent(param[i])+'&';
					}
				} else {
					if(param){
						ariel_param+=key+'='+encodeURIComponent(param)+'&';
					}
				}
			})
		}
	}
}
var ariel_url = ariel_protocol+ "://"+ariel_hostname+"/aqua/0/schedule/create?"+ariel_param;
if(window.prompt(ariel_systemname +"予定登録用URLです。コピーして使ってください。\n「OK」で生成したURLを別ウィンドウで開きます。",ariel_url)){
	window.open(ariel_url);
}
function formatToArielDate(iso8601DateTime) {
	/* 20170225T010101Z (UTC) => 2017-02-25 10:01:01 */
	/* 20170225T010101 (local)=> 2017-02-25 01:01:01 */
	if(iso8601DateTime == null) {return null;}
	var date = Number(iso8601DateTime.slice(0, 8));
	var time = Number(iso8601DateTime.slice(9, 15));
	var UTCflag = iso8601DateTime.slice(15, 16);
	if (UTCflag == 'Z') {
		time +=90000;
		if (time >=240000){
			date++;
			time-=240000;
		}
	}
	var jstDateTime = String(date) + ('000000' + String(time)).slice(-6);
	return jstDateTime.replace(/(....)(..)(..)(..)(..)(..)/,"$1-$2-$3 $4:$5:$6");
}
