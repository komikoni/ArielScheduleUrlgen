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
    recurrent_interval: { name: "日・週・月・年毎", type: "normal", recurrent: true },
    days_of_week: { name: "週毎の曜日", type: "checked", array: true, recurrent: true },
    month_of_year: { name: "年毎の月", type: "normal", recurrent: true },
    recurrent_subtype: { name: "月・年毎の特定日・週", type: "checked", recurrent: true },
    day_of_month: { name: "月・年毎の特定日", type: "normal", recurrent: true },
    week_of_month: { name: "月・年毎の特定週", type: "normal", recurrent: true },
    day_of_week: { name: "月・年毎の特定週の曜日", type: "normal", recurrent: true },
    is_all_day_recurrent: { name: "終日", type: "checked", recurrent: true },
    irregular_dates: { name: "不定期日付", type: "ymd", array: true, recurrent: true },
    dtstart_recurrent: { name: "開始時刻", type: "hm", output_key: "dtstart", recurrent: true },
    dtend_recurrent: { name: "終了時刻", type: "hm", output_key: "dtend", recurrent: true },
    recurrent_start: { name: "開始日", type: "normal", recurrent: true },
    limit_type: { name: "期限", type: "checked", recurrent: true },
    limit_count: { name: "反復回数", type: "normal", recurrent: true },
    limit_date: { name: "終了日", type: "ymd", recurrent: true },
    recurrent_except_rule: { name: "特例日の扱い", type: "normal", default: "0", recurrent: true },
    recurrent_except_target: { name: "特例日", type: "checked", array: true, recurrent: true },
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
    wireless_select: { name: "無線LAN利用", type: "checked", default: "0" },
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
    text_field: { name: "受付への伝言", type: "normal" },
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
            $form = $('form[name="edit"]');

            Object.keys(convert_params).forEach(function(key) {
                var param = convert_params[key];
                var output_key = param.output_key || key;
                var selector, val, year, month, day, hour, minute, ymd, hm;
                if (param_map.recurrent_type === undefined && param.recurrent) {
                    // skip
                } else {
                    param_map[output_key] = [];
                    switch (param.type) {
                        case 'normal':
                        case 'checked':
                            selector = ':input[name="' + key + '"]';
                            if (param.type == 'checked') {
                                selector += ':checked';
                            }
                            $form.find(selector).each(function() {
                                val = $(this).val();
                                if (val && val != param.default) {
                                    param_map[output_key].push(val);
                                }
                            });
                            break;
                        case 'ymdhm':
                        case 'ymd':
                        case 'hm':
                            $form.find('#' + key + ' .inputdate').each(function() {
                                year = $(this).find(':input[name^="year_' + key + '"]').val();
                                month = $(this).find(':input[name^="month_' + key + '"]').val();
                                day = $(this).find(':input[name^="day_' + key + '"]').val();
                                hour = $(this).find(':input[name^="hour_' + key + '"]').val();
                                minute = $(this).find(':input[name^="minute_' + key + '"]').val();
                                ymd = year + '-' + ('00' + month).slice(-2) + '-' + ('00' + day).slice(-2);
                                hm = ('00' + hour).slice(-2) + ':' + ('00' + minute).slice(-2) + ':00';
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
                                            param_map[output_key].push('0000-00-00 ' + hm);
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
                            /* 文字修飾を使用している場合、textarea[name=body]は、初期表示時の内容から更新されない為、
                            iframe内のhtmlを直接読み取る。ただし、タブを開いていない場合iframeが生成され無い為、
                            その場合、textareaを読み取る。
                             */
                            // if (param_map.body_format && $form.find('#body iframe').length > 0) {
                            if ($form.find('#body iframe').length > 0) {
                                param_map.body = $form.find('#body iframe').contents().find('body.cke_editable').html();
                            } else {
                                param_map.body = $form.find(':input[name="body"]').val();
                            }
                            break;
                    }
                    if (param_map[output_key].length === 0) {
                        delete param_map[output_key];
                    } else if (param.array) {
                        param_map[output_key] = param_map[output_key][0];
                    }
                }
            });
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
info_html += '<textarea id="paramJson" rows="6" cols="100" readonly>' + JSON.stringify(param_map, null, "    ") + '</textarea><br />';
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
    ariel_param = ariel_param.substr(0, ariel_param.length - 1);
    return ariel_protocol + "://" + ariel_hostname + "/aqua/0/schedule/create?" + ariel_param;
}