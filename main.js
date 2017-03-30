// TODO : ☓ボタンを追加する、ESCキーで表示解除する
var $ = require('jquery');
var $tool = $('#ariel_schedule_urlgen');
var ariel_protocol = $tool.data('protocol');
var ariel_hostname = $tool.data('hostname');
var ariel_systemname = $tool.data('systemname');
var shortener_api_key = $tool.data('shortener_api_key');

var convert_params = {
    // 【基本タブ】
    title: { name: "タイトル", type: "normal", tab: "basic" },
    label: { name: "ラベル", type: "checked", array: true, tab: "basic" },
    color: { name: "背景色", type: "normal", tab: "basic" },
    is_all_day: { name: "終日", type: "checked", tab: "basic" },
    dtstart: { name: "開始日時", type: "ymdhm", tab: "basic" },
    dtend: { name: "終了日時", type: "ymdhm", tab: "basic" },
    attendee: { name: "出席者", type: "resid", array: true, output: false, tab: "basic" },
    facility: { name: "施設", type: "resid", array: true, output: false, tab: "basic" },
    // 【詳細タブ】
    organizer: { name: "開催者", type: "resid", output: false, tab: "detail" },
    body_format_check: { name: "本文・文字修飾", type: "checked", output_key: "body_format", tab: "detail" },
    body: { name: "本文", type: "body", tab: "detail" },
    location: { name: "場所", type: "normal", tab: "detail" },
    address: { name: "住所", type: "normal", tab: "detail" },
    // 【システムタブ】
    banner: { name: "予定の種別", type: "checked", default: "0", tab: "sysytem" },
    scope: { name: "公開範囲", type: "normal", tab: "sysytem" },
    additional_public: { name: "その他の公開範囲", type: "resid", array: true, tab: "sysytem" },
    allow_attendee_edit: { name: "編集許可", type: "normal", tab: "sysytem" },
    view_presence_on_news: { name: "出欠と予約状況", type: "normal", tab: "sysytem" },
    delegate_allowed: { name: "代理出席", type: "normal", tab: "sysytem" },
    // 【繰り返しタブ】
    recurrent_type: { name: "パターン", type: "checked", default: "none", tab: "recurrent" },
    recurrent_interval: { name: "日・週・月・年毎", type: "normal", tab: "recurrent" },
    days_of_week: { name: "週毎の曜日", type: "checked", array: true, tab: "recurrent" },
    month_of_year: { name: "年毎の月", type: "normal", tab: "recurrent" },
    recurrent_subtype: { name: "月・年毎の特定日・週", type: "checked", tab: "recurrent" },
    day_of_month: { name: "月・年毎の特定日", type: "normal", tab: "recurrent" },
    week_of_month: { name: "月・年毎の特定週", type: "normal", tab: "recurrent" },
    day_of_week: { name: "月・年毎の特定週の曜日", type: "normal", tab: "recurrent" },
    is_all_day_recurrent: { name: "終日", type: "checked", tab: "recurrent" },
    irregular_dates: { name: "不定期日付", type: "ymd", array: true, tab: "recurrent" },
    dtstart_recurrent: { name: "開始時刻", type: "hm", output_key: "dtstart", tab: "recurrent" },
    dtend_recurrent: { name: "終了時刻", type: "hm", output_key: "dtend", tab: "recurrent" },
    recurrent_start: { name: "開始日", type: "normal", tab: "recurrent" },
    limit_type: { name: "期限", type: "checked", tab: "recurrent" },
    limit_count: { name: "反復回数", type: "normal", tab: "recurrent" },
    limit_date: { name: "終了日", type: "ymd", tab: "recurrent" },
    recurrent_except_rule: { name: "特例日の扱い", type: "normal", default: "0", tab: "recurrent" },
    recurrent_except_target: { name: "特例日対象", type: "checked", array: true, tab: "recurrent" },
    // 【その他タブ】
    radio_reflection: { name: "来館者の申請", type: "checked", default: "0", tab: "other" },
    visitor_company: { name: "来館者１会社名", type: "normal", tab: "other" },
    visitor_post: { name: "来館者１役職", type: "normal", tab: "other" },
    visitor_name: { name: "来館者１氏名", type: "normal", tab: "other" },
    visitor_company2: { name: "来館者２会社名", type: "normal", tab: "other" },
    visitor_post2: { name: "来館者２役職", type: "normal", tab: "other" },
    visitor_name2: { name: "来館者２氏名", type: "normal", tab: "other" },
    visitor_company3: { name: "来館者３会社名", type: "normal", tab: "other" },
    visitor_post3: { name: "来館者３役職", type: "normal", tab: "other" },
    visitor_name3: { name: "来館者３氏名", type: "normal", tab: "other" },
    visitor_company4: { name: "来館者４会社名", type: "normal", tab: "other" },
    visitor_post4: { name: "来館者４役職", type: "normal", tab: "other" },
    visitor_name4: { name: "来館者４氏名", type: "normal", tab: "other" },
    numeric_field: { name: "来館人数", type: "normal", default: "1", tab: "other" },
    wireless_select: { name: "無線LAN利用", type: "checked", default: "0", tab: "other" },
    group_field: { name: "面会者部門名", type: "resid", tab: "other" },
    tel_dept: { name: "面会者部門内線番号", type: "normal", tab: "other" },
    user_visitor: { name: "面会者氏名", type: "resid", tab: "other" },
    tel_extension: { name: "面会者内線番号", type: "normal", tab: "other" },
    group_field_2: { name: "代替者１部門名", type: "resid", tab: "other" },
    tel_dept_2: { name: "代替者１部門内線番号", type: "normal", tab: "other" },
    user_visitor_2: { name: "代替者１氏名", type: "resid", tab: "other" },
    tel_extension_2: { name: "代替者１内線番号", type: "normal", tab: "other" },
    group_field_3: { name: "代替者２部門名", type: "resid", tab: "other" },
    tel_dept_3: { name: "代替者２部門内線番号", type: "normal", tab: "other" },
    user_visitor_3: { name: "代替者２氏名", type: "resid", tab: "other" },
    tel_extension_3: { name: "代替者２部門内線番号", type: "normal", tab: "other" },
    text_field: { name: "受付への伝言", type: "normal", tab: "other" },
};


function readParameter() {
    var param_map = {};

    var gcal_url = $('a[href*="//www.google.com/calendar/event?"],' +
        'a[href*="//www.google.com/calendar/render?"]').prop('href');
    if (gcal_url) {
        var gcal_param = gcal_url.match(/[?].+/)[0].substr(1);
        var pair = gcal_param.split('&');
        for (var i = 0; pair[i]; i++) {
            var kv = pair[i].split('=');
            var key = kv[0];
            var value = kv[1] || '';
            // 以降の処理の為に、URIエンコーディングの+を空白に変換してからデコード
            value = decodeURIComponent(value.replace(/[+]/g, '%20'));
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
                var $form = $('form[name="edit"]');
                var recurrent_type = $form.find(':input[name="recurrent_type"]:checked').val();

                Object.keys(convert_params).forEach(function(key) {
                    var param = convert_params[key];
                    var output_key = param.output_key || key;
                    // 繰り返し指定がないときは繰返し項目を出力しない。
                    if (param.output !== false && (param.tab !== 'recurrent' || recurrent_type !== 'none')) {
                        // 一旦全ての項目を配列項目として処理
                        param_map[output_key] = [];
                        switch (param.type) {
                            case 'normal':
                            case 'checked':
                                var selector = ':input[name="' + key + '"]';
                                if (param.type === 'checked') {
                                    selector += ':checked';
                                }
                                $form.find(selector).each(function() {
                                    var val = $(this).val();
                                    // 空及びデフォルト値の場合出力しない
                                    if (val && val != param.default) {
                                        param_map[output_key].push(val);
                                    }
                                });
                                break;
                            case 'ymdhm':
                            case 'ymd':
                            case 'hm':
                                $form.find('#' + key + ' .inputdate').each(function() {
                                    var $this = $(this);
                                    var year = $this.find(':input[name^="year_' + key + '"]').val();
                                    var month = $this.find(':input[name^="month_' + key + '"]').val();
                                    var day = $this.find(':input[name^="day_' + key + '"]').val();
                                    var hour = $this.find(':input[name^="hour_' + key + '"]').val();
                                    var minute = $this.find(':input[name^="minute_' + key + '"]').val();
                                    var ymd = year + '-' + ('00' + month).slice(-2) + '-' + ('00' + day).slice(-2);
                                    var hm = ('00' + hour).slice(-2) + ':' + ('00' + minute).slice(-2) + ':00';
                                    switch (param.type) {
                                        case 'ymdhm':
                                            if (year && month && day && hour && minute) {
                                                param_map[output_key].push(ymd + ' ' + hm);
                                            }
                                            break;
                                        case 'ymd':
                                            if (year && month && day) {
                                                param_map[output_key].push(ymd);
                                            }
                                            break;
                                        case 'hm':
                                            if (hour && minute) {
                                                param_map[output_key].push('0001-01-01 ' + hm);
                                            }
                                            break;
                                    }
                                });
                                break;
                            case 'resid':
                                $form.find('#' + key + ' .selectlistline').each(function() {
                                    param_map[output_key].push($(this).attr('resid').replace(/^.+\//, ''));
                                });
                                break;
                            case 'body':
                                /* 文字修飾なし,文字修飾あり(タブ未表示)の場合、textarea[name=body]を、文字修飾あり(タブ表示済)の場合、iframe内の情報を取得
                                  (文字修飾が有っても、タブを開いていない場合iframeが生成され無い) */
                                if ($form.find('#body iframe').length > 0) {
                                    param_map[output_key].push($form.find('#body iframe').contents().find('body.cke_editable').html());
                                } else {
                                    param_map[output_key].push($form.find(':input[name="body"]').val());
                                }
                                break;
                        }
                        // 空パラメータは削除、配列許容項目以外は先頭項目を再設定
                        if (param_map[output_key].length === 0) {
                            delete param_map[output_key];
                        } else if (!param.array) {
                            param_map[output_key] = param_map[output_key][0];
                        }
                    }
                });
            }
        }
    }
    return param_map;
}

$('#js-GlayLayer').remove();
$('#js-Info').remove();
$("body").append('<div id="js-GlayLayer"><style>#js-GlayLayer{background: #000 none repeat scroll 0 0;height: 100%;left: 0;opacity: 0.6;position: fixed;top: 0;width: 100%;z-index: 9999;}</style></div>');
$("body").append('<div id="js-Info" class="fadeInUp"><style>#js-Info {border-radius:8px;border:2px solid #333;position:absolute;left:50%;margin-left: -480px;top:50px;padding: 20px;width:920px;background: #fff;z-index:9999;}.titlestyle03{padding:0 15px 10px 0;}@-webkit-keyframes fadeInUp {0% {opacity: 0;transform: translate3d(0, 100%, 0);}100% {opacity: 1;transform: none;}}@keyframes fadeInUp {0% {opacity: 0;transform: translate3d(0, 100%, 0);}100% {opacity: 1;transform: none;}}.fadeInUp {animation-name: fadeInUp;animation-duration: 0.3s;animation-fill-mode: both;}</style></div>');
var $layer = $('#js-GlayLayer');
var $info = $('#js-Info');

var info_html = '';
info_html += '<h1 id="modaltitle" style="margin-bottom:30px;font-size:24px"></h1>';
info_html += '<p style="margin-bottom:30px">出力内容をJSONで確認して下さい。短縮URLは、削除不可の為、内容確認後に生成して下さい。(生成にはapi-keyが必要です)</p>';
info_html += '<h2 style="margin-bottom:15px;font-size:20px">出力要否(必要な場合チェック)</h2>';
info_html += '<div><input type="checkbox" id="organizer_flag" /><label for="organizer_flag">開催者</label><input type="checkbox" id="attendee_flag" /><label for="attendee_flag">出席者</label><input type="checkbox" id="facility_flag"/><label for="facility_flag">施設</label>';
info_html += '<h2 style="margin-bottom:15px;font-size:20px">出力内容(JSON)</h2>';
info_html += '<textarea id="paramJson" rows="10" cols="100" spellcheck="false"></textarea><br />';
info_html += '<h2 style="margin-bottom:15px;font-size:20px">出力内容(LongURL)</h2>';
info_html += '<textarea id="longUrl" rows="6" cols="100" spellcheck="false" style="word-break:break-all;"></textarea><button id="copyLongUrl">コピー</button><button id="openLongUrl" >オープン</button><br />';
info_html += '<h2 style="margin-bottom:15px;font-size:20px">Google Shortener URL　※要api-key設定、削除不可であることに注意</h2>';
info_html += '<button id="generateShortUrl" >短縮URL生成</button><br />';
info_html += '<input type="text" id="shortUrl" /><button id="copyShortUrl">コピー</button><button id="openShortUrl" >オープン</button><br />';
$info.append(info_html);

$('#modaltitle').text(ariel_systemname + '予定登録用URL生成');
var param_map = readParameter();
$('#paramJson').val(JSON.stringify(param_map, null, "    "));
$('#longUrl').val(generateArielUrl(param_map));

$('#organizer_flag, #attendee_flag, #facility_flag').on('change', function() {
    convert_params.organizer.output = $('#organizer_flag').prop('checked');
    convert_params.attendee.output = $('#attendee_flag').prop('checked');
    convert_params.facility.output = $('#facility_flag').prop('checked');
    var param_map2 = readParameter();
    $('#paramJson').val(JSON.stringify(param_map2, null, "    "));
    $('#longUrl').val(generateArielUrl(param_map2));
});
$('#paramJson').on('keyup', function() {
    $('#longUrl').val(generateArielUrl(JSON.parse($('#paramJson').val())));
});
$('#copyLongUrl').on('click', function() {
    clipboadCopy('longUrl');
});
$('#openLongUrl').on('click', function() {
    window.open($('#longUrl').val());
});
$('#copyShortUrl').on('click', function() {
    clipboadCopy('shortUrl');
});
$('#openShortUrl').on('click', function() {
    window.open($('#shortUrl').val());
});
$('#generateShortUrl').on('click', function() {
    $('#shortUrl').val('');
    $.ajax({
        type: "POST",
        url: "https://www.googleapis.com/urlshortener/v1/url?key=" + shortener_api_key,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({ "longUrl": $('#longUrl').val() }),
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
    ariel_param = ariel_param.substr(0, ariel_param.length - 1);
    return ariel_protocol + "://" + ariel_hostname + "/aqua/0/schedule/create?" + ariel_param;
}

function clipboadCopy(id) {
    document.getElementById(id).select();
    document.execCommand("copy");
}