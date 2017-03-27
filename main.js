// TODO : 参加者、主催者、施設のチェックボックスを表示しデフォルトの出力対象から外す
// TODO : convert_paramsを読み込んで、パラメータの出力有無選択
// TODO : convert_paramsを読み込んで、パラメータの生成
// TODO : convert_paramsを読み込んで、デフォルト値と同一の場合、パラメータ出力対象外とする
// TODO : clipboard.js(npm有) でのクリップボードのコピー
// TODO : ☓ボタンを追加する、ESCキーで表示解除する
var $ = require('jquery');
var $tool = $('#ariel_schedule_urlgen');
var ariel_protocol = $tool.data('protocol');
var ariel_hostname = $tool.data('hostname');
var ariel_systemname = $tool.data('systemname');
var shortener_api_key = $tool.data('shortener_api_key');

var convert_params = {
    // 【基本タブ】
    title: { name: "タイトル", type: "normal" },
    label: { name: "ラベル", type: "checked", array: true },
    color: { name: "背景色", type: "normal" },
    is_all_day: { name: "終日", type: "checked" },
    dtstart: { name: "開始日時", type: "ymdhm" },
    dtend: { name: "終了日時", type: "ymdhm" },
    attendee: { name: "出席者", type: "resid", array: true, output: false },
    facility: { name: "施設", type: "resid", array: true, output: false },
    // 【詳細タブ】
    organizer: { name: "開催者", type: "resid", output: false },
    body_format_check: { name: "本文・文字修飾", type: "checked", output_key: "body_format" },
    body: { name: "本文", type: "body" },
    location: { name: "場所", type: "normal" },
    address: { name: "住所", type: "normal" },
    // 【システムタブ】
    banner: { name: "予定の種別", type: "checked", default: "0" },
    scope: { name: "公開範囲", type: "normal" },
    additional_public: { name: "その他の公開範囲", type: "resid", array: true },
    allow_attendee_edit: { name: "編集許可", type: "normal" },
    view_presence_on_news: { name: "出欠と予約状況", type: "normal" },
    delegate_allowed: { name: "代理出席", type: "normal" },
    // 【繰り返しタブ】
    recurrent_type: { name: "パターン", type: "checked", default: "none" },
    recurrent_interval: { name: "日・週・月・年毎", type: "normal" },
    days_of_week: { name: "週毎の曜日", type: "checked", array: true },
    month_of_year: { name: "年毎の月", type: "normal" },
    recurrent_subtype: { name: "月・年毎の特定日・週", type: "checked" },
    day_of_month: { name: "月・年毎の特定日", type: "normal" },
    week_of_month: { name: "月・年毎の特定週", type: "normal" },
    day_of_week: { name: "月・年毎の特定週の曜日", type: "normal" },
    is_all_day_recurrent: { name: "終日", type: "checked" },
    irregular_dates: { name: "不定期日付", type: "ymd", array: true },
    dtstart_recurrent: { name: "開始時刻", type: "hm", output_key: "dtstart" },
    dtend_recurrent: { name: "終了時刻", type: "hm", output_key: "dtend" },
    recurrent_start: { name: "開始日", type: "normal" },
    limit_type: { name: "期限", type: "checked" },
    limit_count: { name: "反復回数", type: "normal" },
    limit_date: { name: "終了日", type: "ymd" },
    recurrent_except_rule: { name: "特例日の扱い", type: "normal" },
    recurrent_except_target: { name: "特例日", type: "checked", array: true },
    // 【その他タブ】
    radio_reflection: { name: "来館者の申請", type: "checked", default: "0" },
    visitor_company: { name: "来館者１会社名", type: "normal" },
    visitor_post: { name: "来館者１役職", type: "normal" },
    visitor_name: { name: "来館者１氏名", type: "normal" },
    visitor_company2: { name: "来館者２会社名", type: "normal" },
    visitor_post2: { name: "来館者２役職", type: "normal" },
    visitor_name2: { name: "来館者２氏名", type: "normal" },
    visitor_company3: { name: "来館者３会社名", type: "normal" },
    visitor_post3: { name: "来館者３役職", type: "normal" },
    visitor_name3: { name: "来館者３氏名", type: "normal" },
    visitor_company4: { name: "来館者４会社名", type: "normal" },
    visitor_post4: { name: "来館者４役職", type: "normal" },
    visitor_name4: { name: "来館者４氏名", type: "normal" },
    numeric_field: { name: "来館人数", type: "normal", default: "1" },
    wireless_select: { name: "無線LAN利用", type: "normal", default: "1" },
    group_field: { name: "面会者部門名", type: "resid" },
    tel_dept: { name: "面会者部門内線番号", type: "normal" },
    user_visitor: { name: "面会者氏名", type: "resid" },
    tel_extension: { name: "面会者内線番号", type: "normal" },
    group_field_2: { name: "代替者１部門名", type: "resid" },
    tel_dept_2: { name: "代替者１部門内線番号", type: "normal" },
    user_visitor_2: { name: "代替者１氏名", type: "resid" },
    tel_extension_2: { name: "代替者１内線番号", type: "normal" },
    group_field_3: { name: "代替者２部門名", type: "resid" },
    tel_dept_3: { name: "代替者２部門内線番号", type: "normal" },
    user_visitor_3: { name: "代替者２氏名", type: "resid" },
    tel_extension_3: { name: "代替者２部門内線番号", type: "normal" },
    text_field: { name: "受付の伝言", type: "normal" },
};

var param_map = {};

var gcal_url = $('a[href*="//www.google.com/calendar/event?"],' +
    'a[href*="//www.google.com/calendar/render?"]').prop('href');
if (gcal_url) {
    var gcal_param = gcal_url.match(/[?].+/)[0].substr(1);
    var pair = gcal_param.split('&');
    for (var i = 0; pair[i]; i++) {
        var kv = pair[i].split('=');
        var key = kv[0];
        var value = decodeURIComponent((kv[1] || '').replace(/[+]/g, '%20'));
        switch (key) {
            case 'text':
                param_map.title = value;
                break;
            case 'details':
                param_map.body = value;
                break;
            case 'location':
                param_map.location = value;
                break;
            case 'dates':
                var dates = value.split('/');
                param_map.dtstart = formatToArielDate(dates[0]);
                param_map.dtend = formatToArielDate(dates[1]);
                break;
        }
    }
} else {
    if (window.location.hostname == ariel_hostname) {
        if ($(':input[name="resourceType"][value="/atypes/ariel/schedule"]')) {

            Object.keys(convert_params).forEach(function(key) {
                var param = param_map[key];
                var output_key = param.output_key === undefined ? param.output_key : key;
                var selector, val, year, month, day, hour, minute;
                switch (param.type) {
                    case 'normal':
                    case 'checked':
                        selector = ':input[name="' + key + '"]';
                        if (param.type == 'checked') {
                            selector += ':checked';
                        }
                        $(selector).each(function() {
                            val = $(this).val();
                            if (val != param.default) {
                                if (param_map[output_key] === undefined) {
                                    param_map[output_key] = [];
                                }
                                param_map[output_key].push();
                            }
                        });
                        break;
                    case 'ymdhm':
                    case 'ymd':
                    case 'hm':
                        $('#' + key + ' .inputdate').each(function() {
                            year = $(this).find(':input[name^="year_' + key + '"]').val();
                            month = $(this).find(':input[name^="month_' + key + '"]').val();
                            day = $(this).find(':input[name^="day_' + key + '"]').val();
                            hour = $(this).find(':input[name^="hour_' + key + '"]').val();
                            minute = $(this).find(':input[name^="minute_' + key + '"]').val();
                            switch (param.type) {
                                case 'ymdhm':
                                    if (year && month && day && hour && minute) {
                                        if (param_map[output_key] === undefined) {
                                            param_map[output_key] = [];
                                        }
                                        param_map[output_key].push(year + '-' +
                                            ('00' + month).slice(-2) + '-' +
                                            ('00' + day).slice(-2) + ' ' +
                                            ('00' + hour).slice(-2) + ':' +
                                            ('00' + minute).slice(-2) + ':00');
                                    }
                                    break;
                                case 'ymd':
                                    if (year && month && day) {
                                        if (param_map[output_key] === undefined) {
                                            param_map[output_key] = [];
                                        }
                                        param_map[output_key] = year + '-' +
                                            ('00' + month).slice(-2) + '-' +
                                            ('00' + day).slice(-2) + ' ';
                                    }
                                    break;
                                case 'hm':
                                    if (hour && minute) {
                                        if (param_map[output_key] === undefined) {
                                            param_map[output_key] = [];
                                        }
                                        param_map[output_key] = '2017-01-01 ' +
                                            ('00' + hour).slice(-2) + ':' +
                                            ('00' + minute).slice(-2) + ':00';
                                    }
                                    break;
                            }
                        });
                        break;
                    case 'resid':
                        $('#' + key + ' .selectlistline').each(function() {
                            if (param_map[output_key] === undefined) {
                                param_map[output_key] = [];
                            }
                            param_map[output_key].push($(this).attr('resid').replace(/^.+\//, ''));
                        });
                        break;
                    case 'body':
                        /* 文字修飾を使用している場合、textarea[name=body]は、初期表示時の内容から更新されない為、
                        iframe内のhtmlを直接読み取る。ただし、タブを開いていない場合iframeが生成され無い為、
                        その場合、textareaを読み取る。
                         */
                        if (param_map.body_format && $('#body iframe').length > 0) {
                            param_map.body = $('#body iframe').contents().find('body.cke_editable').html();
                        } else {
                            param_map.body = $(':input[name="body"]').val();
                        }
                        break;
                }
            });



            // // 【基本タブ】
            // param_map.title = $(':input[name="title"]').val();
            // param_map.label = [];
            // $(':input[name="label"]:checked').each(function() {
            //     param_map.label.push($(this).val());
            // });
            // param_map.color = $(':input[name="color"]').val();
            // param_map.is_all_day = $(':input[name="is_all_day"]:checked').val();
            // var year_dtstart = $(':input[name^="year_dtstart"]').val();
            // var month_dtstart = $(':input[name^="month_dtstart"]').val();
            // var day_dtstart = $(':input[name^="day_dtstart"]').val();
            // var hour_dtstart = $(':input[name^="hour_dtstart"]').val();
            // var minute_dtstart = $(':input[name^="minute_dtstart"]').val();
            // param_map.dtstart = year_dtstart + '-' +
            //     ('00' + month_dtstart).slice(-2) + '-' +
            //     ('00' + day_dtstart).slice(-2) + ' ' +
            //     ('00' + hour_dtstart).slice(-2) + ':' +
            //     ('00' + minute_dtstart).slice(-2) + ':00';

            // var year_dtend = $(':input[name^="year_dtend"]').val();
            // var month_dtend = $(':input[name^="month_dtend"]').val();
            // var day_dtend = $(':input[name^="day_dtend"]').val();
            // var hour_dtend = $(':input[name^="hour_dtend"]').val();
            // var minute_dtend = $(':input[name^="minute_dtend"]').val();
            // param_map.dtend = year_dtend + '-' +
            //     ('00' + month_dtend).slice(-2) + '-' +
            //     ('00' + day_dtend).slice(-2) + ' ' +
            //     ('00' + hour_dtend).slice(-2) + ':' +
            //     ('00' + minute_dtend).slice(-2) + ':00';
            // param_map.attendee = [];
            // $('#attendee .selectlistline').each(function() {
            //     param_map.attendee.push($(this).attr('resid').split('/')[2]);
            // });
            // param_map.facility = [];
            // $('#facility .selectlistline').each(function() {
            //     param_map.facility.push($(this).attr('resid'));
            // });
            // // 【詳細タブ】
            // param_map.organizer = $('#organizer .selectlistline').attr('resid').split('/')[2];
            // param_map.body_format = $(':input[name="body_format_check"]:checked').val();
            // /* 文字修飾を使用している場合、textarea[name=body]は、初期表示時の内容から更新されない為、
            // iframe内のhtmlを直接読み取る。ただし、タブを開いていない場合iframeが生成され無い為、
            // その場合、textareaを読み取る。
            //  */
            // if (param_map.body_format && $('#body iframe').length > 0) {
            //     param_map.body = $('#body iframe').contents().find('body.cke_editable').html();
            // } else {
            //     param_map.body = $(':input[name="body"]').val();
            // }
            // param_map.location = $(':input[name="location"]').val();
            // param_map.address = $(':input[name="address"]').val();
            // // 【システムタブ】
            // param_map.banner = $(':input[name="banner"]:checked').val();
            // param_map.scope = $(':input[name="scope"]').val();
            // param_map.additional_public = [];
            // $('#additional_public .selectlistline').each(function() {
            //     param_map.additional_public.push($(this).attr('resid').split('/')[2]);
            // });
            // param_map.allow_attendee_edit = $(':input[name="allow_attendee_edit"]').val();
            // param_map.view_presence_on_news = $(':input[name="view_presence_on_news"]').val();
            // param_map.delegate_allowed = $(':input[name="delegate_allowed"]').val();
            // // 【繰り返しタブ】
            // param_map.recurrent_type = $(':input[name="recurrent_type"]:checked').val();

            // if (param_map.recurrent_type != 'none') {
            //     param_map.recurrent_interval = $(':input[name="recurrent_interval"]').val();
            //     param_map.days_of_week = [];
            //     $(':input[name="days_of_week"]:checked').each(function() {
            //         param_map.days_of_week.push($(this).val());
            //     });
            //     param_map.day_of_week = $(':input[name="day_of_week"]').val();
            //     param_map.day_of_month = $(':input[name="day_of_month"]').val();
            //     param_map.recurrent_subtype = $(':input[name="recurrent_subtype"]:checked').val();
            //     param_map.week_of_month = $(':input[name="week_of_month"]').val();
            //     param_map.month_of_year = $(':input[name="month_of_year"]').val();
            //     param_map.is_all_day_recurrent = $(':input[name="is_all_day_recurrent"]:checked').val();

            //     param_map.irregular_dates = [];
            //     $('#irregular_dates .inputdate').each(function() {
            //         var year_irregular = $(this).find(':input[name^="year_irregular_dates"]').val();
            //         var month_irregular = $(this).find(':input[name^="month_irregular_dates"]').val();
            //         var day_irregular = $(this).find(':input[name^="day_irregular_dates"]').val();
            //         if (year_irregular && month_irregular && day_irregular) {
            //             param_map.irregular_dates.push(year_irregular + '-' +
            //                 ('00' + month_irregular).slice(-2) + '-' +
            //                 ('00' + day_irregular).slice(-2));
            //         }
            //     });
            //     var hour_dtstart_recurrent = $(':input[name^="hour_dtstart_recurrent"]').val();
            //     var minute_dtstart_recurrent = $(':input[name^="minute_dtstart_recurrent"]').val();
            //     if (hour_dtstart_recurrent && minute_dtstart_recurrent) {
            //         param_map.dtstart = '2017-01-01 ' +
            //             ('00' + hour_dtstart_recurrent).slice(-2) + ':' +
            //             ('00' + minute_dtstart_recurrent).slice(-2) + ':00';
            //     }
            //     var hour_dtend_recurrent = $(':input[name^="hour_dtend_recurrent"]').val();
            //     var minute_dtend_recurrent = $(':input[name^="minute_dtend_recurrent"]').val();
            //     if (hour_dtend_recurrent && minute_dtend_recurrent) {
            //         param_map.dtend = '2017-01-01 ' +
            //             ('00' + hour_dtend_recurrent).slice(-2) + ':' +
            //             ('00' + minute_dtend_recurrent).slice(-2) + ':00';
            //     }
            //     var year_recurrent_start = $(':input[name^="year_recurrent_start"]').val();
            //     var month_recurrent_start = $(':input[name^="month_recurrent_start"]').val();
            //     var day_recurrent_start = $(':input[name^="day_recurrent_start"]').val();
            //     if (year_recurrent_start && month_recurrent_start && day_recurrent_start) {
            //         param_map.recurrent_start = year_recurrent_start + '-' +
            //             ('00' + month_recurrent_start).slice(-2) + '-' +
            //             ('00' + day_recurrent_start).slice(-2);
            //     }
            //     param_map.limit_type = $(':input[name="limit_type"]:checked').val();
            //     param_map.limit_count = $(':input[name="limit_count"]').val();
            //     var year_limit_date = $(':input[name^="year_limit_date"]').val();
            //     var month_limit_date = $(':input[name^="month_limit_date"]').val();
            //     var day_limit_date = $(':input[name^="day_limit_date"]').val();
            //     if (year_limit_date && month_limit_date && day_limit_date) {
            //         param_map.limit_date = year_limit_date + '-' +
            //             ('00' + month_limit_date).slice(-2) + '-' +
            //             ('00' + day_limit_date).slice(-2);
            //     }
            //     param_map.recurrent_except_rule = $(':input[name="recurrent_except_rule"]').val();
            //     param_map.recurrent_except_target = [];
            //     $(':input[name="recurrent_except_target"]:checked').each(function() {
            //         param_map.recurrent_except_target.push($(this).val());
            //     });
            // }
            // // 【その他タブ】
            // param_map.radio_reflection = $(':input[name="radio_reflection"]:checked').val();
            // param_map.visitor_company = $(':input[name="visitor_company"]').val();
            // param_map.visitor_post = $(':input[name="visitor_post"]').val();
            // param_map.visitor_name = $(':input[name="visitor_name"]').val();
            // param_map.visitor_company2 = $(':input[name="visitor_company2"]').val();
            // param_map.visitor_post2 = $(':input[name="visitor_post2"]').val();
            // param_map.visitor_name2 = $(':input[name="visitor_name2"]').val();
            // param_map.visitor_company3 = $(':input[name="visitor_company3"]').val();
            // param_map.visitor_post3 = $(':input[name="visitor_post3"]').val();
            // param_map.visitor_name3 = $(':input[name="visitor_name3"]').val();
            // param_map.visitor_company4 = $(':input[name="visitor_company4"]').val();
            // param_map.visitor_post4 = $(':input[name="visitor_post4"]').val();
            // param_map.visitor_name4 = $(':input[name="visitor_name4"]').val();
            // param_map.numeric_field = $(':input[name="numeric_field"]').val();
            // param_map.wireless_select = $(':input[name="wireless_select"]').val();
            // param_map.group_field = ($('#group_field .selectlistline').attr('resid') || '').split('/')[2];
            // param_map.tel_dept = $(':input[name="tel_dept"]').val();
            // param_map.user_visitor = ($('#user_visitor .selectlistline').attr('resid') || '').split('/')[2];
            // param_map.tel_extension = $(':input[name="tel_extension"]').val();
            // param_map.group_field_2 = ($('#group_field_2 .selectlistline').attr('resid') || '').split('/')[2];
            // param_map.tel_dept_2 = $(':input[name="tel_dept_2"]').val();
            // param_map.user_visitor_2 = ($('#user_visitor_2 .selectlistline').attr('resid') || '').split('/')[2];
            // param_map.tel_extension_2 = $(':input[name="tel_extension_2"]').val();
            // param_map.group_field_3 = ($('#group_field_3 .selectlistline').attr('resid') || '').split('/')[2];
            // param_map.tel_dept_3 = $(':input[name="tel_dept_3"]').val();
            // param_map.user_visitor_3 = ($('#user_visitor_3 .selectlistline').attr('resid') || '').split('/')[2];
            // param_map.tel_extension_3 = $(':input[name="tel_extension_3"]').val();
            // param_map.text_field = $(':input[name="text_field"]').val();
        }
    }
}

var ariel_url = generateArielUrl(param_map);
//if(window.prompt(ariel_systemname +"予定登録用URLです。コピーして使ってください。\n「OK」で生成したURLを別ウィンドウで開きます。",ariel_url)){
//	window.open(ariel_url);
//}
$('#js-GlayLayer').remove();
$('#js-Info').remove();
$("body").append('<div id="js-GlayLayer"><style>#js-GlayLayer{background: #000 none repeat scroll 0 0;height: 100%;left: 0;opacity: 0.6;position: fixed;top: 0;width: 100%;z-index: 9999;}</style></div>');
$("body").append('<div id="js-Info" class="fadeInUp"><style>#js-Info {border-radius:8px;border:2px solid #333;position:absolute;left:50%;margin-left: -480px;top:50px;padding: 20px;width:920px;background: #fff;z-index:9999;}.titlestyle03{padding:0 15px 10px 0;}@-webkit-keyframes fadeInUp {0% {opacity: 0;transform: translate3d(0, 100%, 0);}100% {opacity: 1;transform: none;}}@keyframes fadeInUp {0% {opacity: 0;transform: translate3d(0, 100%, 0);}100% {opacity: 1;transform: none;}}.fadeInUp {animation-name: fadeInUp;animation-duration: 0.3s;animation-fill-mode: both;}</style></div>');
var $layer = $('#js-GlayLayer');
var $info = $('#js-Info');

/*メイン処理*/
var info_html = '';
info_html += '<h1 style="margin-bottom:30px;font-size:24px">' + ariel_systemname + '予定登録用URL生成' + '</h1>';
info_html += '<p style="margin-bottom:30px">使い方はとっても簡単です。</p>';
info_html += '<div><input type="checkbox" name="xxx"/><input type="checkbox" name="yyy"/></div>';
info_html += '<textarea id="decodeUrl" rows="6" cols="100" readonly>' + decodeURIComponent(ariel_url) + '</textarea><br />';
info_html += '<textarea id="longUrl" rows="6" cols="100">' + ariel_url + '</textarea><button id="copyLongUrl" >コピー</button><button id="openLongUrl" >オープン</button><br />';
info_html += '<button id="generateShortUrl" >短縮URL生成</button><br />';
info_html += '<input type="text" id="shortUrl" readonly /><button id="copyShortUrl" >コピー</button><button id="openShortUrl" >オープン</button><br />';

$info.append(info_html);

$('#generateShortUrl').on('click', function() {
    $.ajax({
        type: "POST",
        url: "https://www.googleapis.com/urlshortener/v1/url?key=" + shortener_api_key,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "longUrl": $('#longUrl').text()
        }),
        success: function(j_data) {
            $('#shortUrl').val(j_data.id);
        }
    });
});

/*レイヤー削除*/
// TODO: ESCキーが押されたらを追加
$(document).on('click', $layer, function(evt) {
    if (!$(evt.target).closest('#js-Info').length) {
        $info.remove();
        $layer.remove();
        $tool.remove();
    }
});

function formatToArielDate(iso8601DateTime) {
    /* 20170225T010101Z (UTC) => 2017-02-25 10:01:01 */
    /* 20170225T010101 (local)=> 2017-02-25 01:01:01 */
    if (iso8601DateTime === null) { return null; }
    var date = Number(iso8601DateTime.slice(0, 8));
    var time = Number(iso8601DateTime.slice(9, 15));
    var UTCflag = iso8601DateTime.slice(15, 16);
    if (UTCflag == 'Z') {
        time += 90000;
        if (time >= 240000) {
            date++;
            time -= 240000;
        }
    }
    var jstDateTime = String(date) + ('000000' + String(time)).slice(-6);
    return jstDateTime.replace(/(....)(..)(..)(..)(..)(..)/, "$1-$2-$3 $4:$5:$6");
}

function generateArielUrl(param_map) {
    var ariel_param = "";
    Object.keys(param_map).forEach(function(key) {
        var param = param_map[key];
        if (param instanceof Array) {
            for (i = 0; i < param.length; i++) {
                ariel_param += key + '=' + encodeURIComponent(param[i]) + '&';
            }
        } else {
            if (param) {
                ariel_param += key + '=' + encodeURIComponent(param) + '&';
            }
        }
    });
    return ariel_protocol + "://" + ariel_hostname + "/aqua/0/schedule/create?" + ariel_param;
}