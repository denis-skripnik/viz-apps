function awardsLinks(to, energy, memo) {
    let viz_social_bot_params = Buffer.from(to + '|' + Math.ceil(energy) + '|0|' + memo, 'utf8').toString('base64');
    let links = `<a href="https://t.me/viz_social_bot?start=1${viz_social_bot_params}">Viz social bot</a>, <a href="https://my.viz.plus/assets/award">my.viz.plus</a>, <a href="https://dpos.space/viz/awards/link/${to}/0/${memo}/${energy}">dpos.space</a>, <a href="https://viz.cx/award?receiver={to}&energy={energy}&memo=${memo}">viz.cx</a>, <a href="https://testflight.apple.com/join/G1VtJ0NA">IOS приложение</a>, <a href="https://play.google.com/store/apps/details?id=my.viz">Android приложение</a>.
`;
return links;
}

module.exports = {
    "start": "Старт",
    "wait_award": "До рассылки наград осталось < 2 минут. Дождитесь её: тогда сможете играть дальше.",
    "home": "Главная",
    "home_message": function(names, referer, referer_code, scores, level, locked_scores, viz_scores) {
        let hello = 'Здравствуйте';
if (names !== '') hello += `, ${names}`;
        return `${hello}! Добро пожаловать в @viz_mg_bot.
Играйте в игры  и набирайте баллы. Раз в сутки будет рассылка наград с Viz аккаунта среди получивших баллы пропорционально им.
Периодичность: 28800 блоков Viz: около 24 часов.

Зарабатывайте 0.08 балла с каждого балла реферала 1 уровня и 0.02 балла с реферала второго уровня.
Ваш пригласитель: ${referer}.
Ваша реферальная ссылка: https://t.me/viz_mg_bot?start=r${referer_code}

У вас за сегодня накоплено ${scores} баллов,
Viz баллов: ${viz_scores},
Заблокировано в играх: ${locked_scores} баллов,
Уровень (зависит от количества накопленных баллов, включая заблокированные; служит антиспамом): ${level}`;
    },
    "new_referal1": "По вашей ссылке зарегистрирован реферал первого уровня. Приглашайте ещё и зарабатывайте: ",
    "new_referal2": "По вашей ссылке зарегистрирован реферал второго уровня. Приглашайте ещё и зарабатывайте: ",
    "lang": "Выбрать язык",
    "selected_language": "Вы выбрали язык: Русский.",

"games": "Игры",
"games_text": "Выберите игру",
"reytings": "Рейтинги",
"reytings_text": "Выберите рейтинг. Доступны топ по баллам, топ по возрасту Тамагочи, их силе и список владельцев артефактов.",
"scores_top": "Топ по баллам",
"scores_top_text": function(before_award, top_list) {
    let timer_text = '';
    if (before_award !== '') {
        timer_text = `До рассылки наград осталось ${before_award}.`;
    }
    return `${timer_text}
Список участников с баллами больше 0 (обращайте внимание на процент энергии: если он меньше 0.01, вы не получите награду; всего распределяется 20% в сутки в соответствии со скоростью восстановления):
${top_list}`;
   },
   "t_age_top": "Топ возрастов Тамагочи",
   "t_age_top_text": function(top_list) {
       return `Список участников с возрастом Тамагочи:
${top_list}`;
      },
      "t_power_top": "Топ по силе Тамагочи",
      "t_power_top_text": function(top_list) {
          return `Список участников по силе Тамагочи:
   ${top_list}`;
         },


         "is_blocks": "блоков",
"approximately": "примерно",
"scores": "Баллов",
"of_energy": "энергии",

"added_viz_scores": "Добавлено Viz баллов",
 "all_scores": "всего баллов",
"add_viz_scores": "+ Viz баллы",
"viz_scores_adding": function(to, memo) {
    return `Отправьте награду через блокчейн Viz, чтоб получить Viz баллы (✖10 к сумме полученной награды). Вы с них не сможете получить награду в полночь, пока не используете в играх, например, ставках на курс крипты. В случае победы вы получите уже реальные баллы.
    Для начала хочу сказать, что для награждения тебе нужен Viz аккаунт в @viz_social_bot с Viz логином. Наградите <code>${to}</code> на <code>2</code>% с заметкой <code>${memo}</code> или выберите другой метод:
    ${awardsLinks(to, 200, memo)}.`;
        },

"artifacts_owners": "Владельцы артефактов и призов",
"artifacts_owners_text": "Список владельцев артефактов (призов, если есть)",

"fortune_telling": "Гадания",
    "ft_no_work": "Я не буду гадать, пока вы не получите результат предыдущего гадания!",
"ft_tomorrow": "Я гадаю только сто раз в день. Приходи завтра.",
    "ft_text": "Позолоти ручку: я расскажу будущее твоё. Только уточни, о чём хочешь узнать, а я отвечу: будет или не будет, да или нет. Осталось гаданий: ",
    "ft_no_correct": "Вы ввели не вопрос или алгоритм защиты от накрутчиков посчитал, что он имеет признаки попытки накрутки... Если это всё же вопрос, напишите в @blind_dev_chat его - алгоритмы будут подправлены.",
    "ft_message": "Хорошо. А теперь выбери, хочешь ли наградить меня за труд. Если сделаешь это, гадание может оказаться более точным! Кроме того, при обычном гадании будет начисляться 5 баллов за удачное число минус сумма за уровень, а при награждении 10 - сумма за уровень (формулу рассчёта уровня смотрите в справке).",
"ft_award": "Наградить гадалку",
"ft_standart": "Без награды",
    "ft_award_text": function(to, memo) {
return `Ты выбрал награду. Благодарю тебя.
Для начала хочу сказать, что для награждения тебе нужен Viz аккаунт в @viz_social_bot с Viz логином. Наградите <code>${to}</code> на <code>2</code>% с заметкой <code>${memo}</code> или выберите другой метод:
${awardsLinks(to, 200, memo)}.`;
    },
    "ft_cancel": "Отменить гадание",
    "ft_cancel_text": "Вы отменили гадание через награду - жаль...",
    "ft_type_text": "Скажи, на что ты хочешь, чтоб я погадала?",
0: [
    `Делать хоть сколько-нибудь долгосрочные прогнозы здесь не имеет смысла. Ситуация настолько непредсказуема, что любая мелочь может развернуть ее на 180 градусов.
    Постарайтесь быть готовым к любому исходу.`,
    `Вместе с этим вопросом приходит негативная энергия. Возможно вы сами не хотите чтобы это случилось или смежные темы вызывают у вас немало негативных эмоций. А может быть этот путь лежит через конфликты и сложности.`,
    `Сейчас неблагоприятное время для осуществления подобных желаний и добиться этого будет очень сложно.
    Звёзды советуют подождать и набраться сил.`,
    `Исход маловероятен. Даже если вы будете отдавать этому все силы, обстоятельства будут выводить вас из зоны комфорта и провоцировать вспышки эмоционального расстройства. Оставьте это дело или научитесь не принимать неудачи близко к сердцу.`,
    `Желаемое вряд-ли произойдет, но те усилия, которые вы потратите на реализацию задуманного сделают вас мудрее, рассудительнее, сосредоточеннее. Это наверняка поспособствуют раскрытию вашей индивидуальности. И всё это, конечно же, пойдёт вам на пользу.`,
`Вам не стоит ждать чего-то запредельно экстраординарного. Какие-то мелочи относительно желаемого конечно доставят вам удовольствие, но в остальном у вас могут возникнуть затруднения. Особенно внимательно просчитайте все элементы риска в данном вопросе.`,
],
1: [
    `Будущее готовит вам исключительно позитивное стечение обстоятельств. Все сложится так идеально, что вы и представить не можете. 
    Однако на пути к желаемому могут появляться препятствия и сомнения.`,
`Энергия вселенной в этом вопросе стремится к гармонии и стабильности. А значит, даже если никаких видимых предпосылок к этому нет, все сложится наилучшим образом.`,
`Сейчас очень благоприятный период для позитивного стечения обстоятельств. Вселенная не готовит для вас никаких преград. 
Такие периоды также отлично подходят для разрешения недоразумений и противоречий. И, если вы что-то подобное задумали, то воспользуйтесь случаем.`,
`Будущее довольно гармонично складывает события вокруг вас. Удача улыбается вам и все получается. Если вы очень хотите успешного разрешения данного вопроса, то так тому и быть.`,
'Вселенная расположена к вам благосклонно и люди вам доверяют. В их глазах сформировался образ человека надёжного, зрелого. Вы способны в жизни на многое, и это, несомненно, является исключительно привлекательным моментом для благоприятного стечения обстоятельств.',
`Это однозначно возможно. Причём это будущее весьма позитивно для вас, потому что несёт за собой спокойность и стабильность. Вместе с этим, добавит новых красок в то, что вам интересно и приятно.`
],
"more": "Так как я честная гадалка, говорю, что использовала при гадании",
"block_hash": "Хэш блока",
"text_hash": "Хэш текста",
"number_types": "Число: 0 (не будет) или 1 (будет)",
"generated_number": "Выпало",
"and_hash": "и его хэш",
"award_ft_author": `Понравился ответ гадалки? Награди автора текстов ответов при помощи Viz следующими способами:
${awardsLinks('optimisticdigit', 200, 'За тексты ответов гадалки в viz_mg_bot.')}.`,

"random_numbers": "Угадать число",
"rn_text": `Введите трёхзначное число от 100 до 999.
Если угадаете одно из трёх, получите на нулевом уровне 1 балл, 2 из 3 - 2, 3 из 3 - 3 балла. Раз в сутки каждый получит награду в соответствии с количеством баллов.
С повышением уровня сложности, который зависит от количества баллов, вы будете получать их в меньшем количестве.
Уровень повышается при прохождении балла, кратного 100 (100 - 1 уровень, 200 - 2, 300 - 3 и т. д).
Итоговый балл равен вычитанию из балла числа за уровень (формула с разъяснениями в справке).

При этом, каждое число сравнивается по частям. Например, если вы ввели 294, а бот указал 428, будет такое сравнение: 4 - у вас нет, 2 - есть (удаляется - становится 48), 8 - у вас нет, значит 1 балл.
Пример 2: у вас число 521, а в боте 121: 5 - нет, 2 - есть (удаляется, остаётся 11), 1 - есть (удаляется, остаётся 1). Т. е. вы получили 2 из 3 балла.

Для завершения игры нажмите "Назад" или "Главная".`,
"rn_gameing_text": function(n, un, b, scores) {
    return `Выпало число ${n}. Ваше число: ${un}. Баллов: +${b}, всего за день: ${scores}`;
},
"not_number": "Не число или введены лишние символы",
"rn_finish" : "Игра завершена",
"rn_error": "Ошибка. Вероятно, вы ввели не трёхзначное число",
    
"my_viz_login": "Указать Viz логин",
"viz_login_text": `Введите логин Viz.
О нём можно узнать на https://viz.plus, https://viz.dpos.space
Зарегистрировать в @viz_social_bot или здесь: https://start.viz.plus
По вопросам о Viz писать в @viz_support`,
"account_added": "Аккаунт добавлен.",
"not_account": "Нет такого аккаунта или ошибка соединения с Viz.",

"crypto_bids": "Ставка на курс крипты",
"crypto_bids_active": "Сбор ставок завершён. Ждите следующего раунда, который начинается примерно раз в 10 минут.",
"new_bids_round": "Раунд ставок завершён. Начался новый. Просьба дождаться окончания выбора победителей и проигравших, после чего ввести заново.",
"yes_crypto_bid": "Вы уже сделали ставку. или у вас 0 баллов.",
"crypto_bids_text": function(scores, btc_price, datetime, totalProfitCoefficients) {
    return `Введите сумму баллов до ${scores}, которую готовы поставить на движение курса BTC.
В случае победы вы получите свои баллы + баллы проигравших согласно своей доле.
Если все победили, добавится выигрыш в зависимости от ставки: чем больше поставили, тем меньше коэффициент (минимум - +5% к ставке). Например, при ставке до 100 баллов вы получите увеличение в 1.5 раза, от 100 до 200 чуть меньше и пр... Но важно, что описанное выше без учёта уменьшения начислений за счёт уровне в боте.

Коэффициенты прибыльности:
На рост: ${totalProfitCoefficients[">"]}.
На падение: ${totalProfitCoefficients["<"]}.

<b>Проверяйте время до рассылки наград в топе по баллам, потому что если осталось меньше 30 минут, есть риск обнуления ставок, т. к. они на следующий день не переходят.</b>

Курс BTC на ${datetime}: ${btc_price} $ (фиксируется в начале раунда).
`;
},
"crypto_bids_direction": "Выберите направление, куда пойдёт курс BTC: больше или меньше текущего уровня",
"cb_more": "Больше",
"cb_less": "Меньше",
"crypto_bids_ok": "Ставка принята. Ожидайте результатов.",
"crypto_bids_failed": "Произошла ошибка при вводе данных",
"crypto_bids_winn": function(amount, bid_scores, result_scores) {
    return `Вы выиграли!
Баллов выиграно: ${amount    }
Сумма выигрыша: ${result_scores}`;
},
"crypto_bids_lost": "Вы проиграли, потеряв свои баллы.",
"crypto_bids_data": function(old_price, now_price, direction, bid_amount) {
    if (direction === '>') {
        direction = 'больше';
    } else {
        direction = 'Меньше или равно';
    }
    return `
Ставка: ${bid_amount}

Курс BTC:
Начало раунда - ${old_price} $,
Конец раунда - ${now_price} $,
Направление: ${direction},

Источник курса: coincap.io`;
},

"not_scores_award": function(scores, all_scores) {
let share = (scores / all_scores) * 100;
    let energy_percent = 20 * (share / 100);
return `К сожалению вы не получите награду, потому что накопленных баллов недостаточно для её получения: процент энергии меньше 0.01%.
У вас баллов: ${scores},
Всего: ${all_scores},
Доля: ${share},
Вычисляем процент энергии:
20 * (${share} / 100) = ${energy_percent}.`;
},
"yes_scores_award": `Ура! Вы накопили нужное количество баллов для получения награды! Поздравляем!
Вы сможете увидеть их либо в соц. капитале привязанного к боту аккаунта (если делали это), либо в @viz_social_bot.
Отправка произойдёт после рассылки сообщений участникам.`,

"bk_game": "Быки-коровы",
"bk_text": `1. Бот загадает число. количество символов зависит от уровня:
Уровень 1 - 3 символа, 2 - 4, 3 - 5;
2. Вы должны за несколько раз угадать верное (чем меньше ходов сделаете, тем больше баллов).
3. В качестве подсказок вам будет выдаваться информация:
Сколько быков - чисел, находящихся на своём месте,
Коров - чисел, которые есть в числе, но которые находятся не на своём месте.
Цифры в числе не повторяются.

Максимум:
+10 баллов на 1 уровне сложности (без учёта уровня в боте),
+ 25 баллов на втором уровне
и + 50 на третьем.

Чтоб узнать, как работает уменьшение числа начисляемых баллов в зависимости от уровня, переходите в справку.

Выберите уровень сложности.`,
"bk_level": "Уровень ",
"bk_no_level": "Вы выбрали неправильный уровень. Нажмите по соответствующей кнопке.",
"bk_game_text": function(level, staps) {
let text = '';
if (staps !== '') {
text = `Ваши шаги:
${staps}`;
}
    let number = 3;
    if (level === 2) number = 4;
if (level === 3) number = 5;
return `Уровень сложности: ${level} (в числе ${number} символов).
${text}`;
},
"bulls": "Быков",
"cows": "Коров",
"bk_stap": "шаг",
"bk_number": "Число",
"bk_error": function(n) {
    return `Ошибка: вы ввели либо не число, либо число, состоящее не из ${n} знаков.`;
},
"bk_gameing_text": function(n, sn, b, scores) {
    return `
Вы нашли всех быков за ${sn} шагов! Поздравляем!
Число: ${n}.
Начислено ${b} баллов, всего: ${scores} баллов.`;
},

"reset_game": "Сбросить игру",
"reset_text": "Вы действительно хотите окончательно уничтожить все свои шаги по текущему игровому сеансу?",
"reset_yes": function(bk_level) {
    return `Игровой сеанс уровня ${bk_level} сброшен.`;
},
"reset_no": `Сброс отменён.
Перейдите в раздел "Игры", чтоб продолжить игру.`,

"tamagotchi": "Тамагочи",
"from": "от",
"tamagotchi_params": {
    health: "здоровье",
satiety: "сытость",
happiness: "уровень счастья",
energy: "энергия",
cleanliness: "чистота",
age: "возраст",
power: "сила",
inventory: "Инвентарь"
},

"tamagotchi_stats": function(tamagotchi, action_changes) {  
    if (tamagotchi && Object.keys(tamagotchi).length === 0) return `К сожалению, у вас пока нет тамагочи... Заведите его, введя имя!`;
let exclude_params = ["name", "lastAgeUpdate", "sleap_time", "sleepEnergy"];
    let data = `<a href="https://telegra.ph/Igra-Tamogochi-v-viz-mg-bot-04-28">Об игре</a>.

    Ваш тамагочи ${tamagotchi.name}`;
for (let key in tamagotchi) {
       if (exclude_params.indexOf(key) > -1) continue;
let action_change = '';
    if (typeof action_changes !== 'undefined' && typeof action_changes[key] !== 'undefined') action_change = ` (${action_changes[key]})`;
    data += `
${this.tamagotchi_params[key]}: ${tamagotchi[key]}${action_change}`;
}
data += `

Выберите действие...`;
return data;
},
tamagotchi_sleeping: function(tamagotchi) {
    const sleepTime = new Date(tamagotchi.sleap_time);
const now = new Date();

const sleepDuration = (now.getTime() - sleepTime.getTime()) / (1000 * 60); // в минутах
const remainingSleep = Math.max(100 - sleepDuration, 0); // оставшееся время сна в минутах

return `Тамагочи уснул в ${sleepTime.toLocaleTimeString()} и будет спать еще ${remainingSleep.toFixed(1)} минут.
Сейчас ${tamagotchi.energy}% энергии.
После достижения 100% энергии он проснётся, и вы снова сможете с ним играть.`;
},

"t_game": "играть",
"t_feed": "кормить",
"t_heal": "Лечить",
"t_wash": "Мыть",
"t_sleap": "Спать",

"t_shop": "Магазин",
"t_shop_text": `Товар - стоимость: описание
Energetic_100, Energetic_50, Energetic_20 - 100, 50 или 20 баллов: восстанавливает энергию Тамагочи на 100%, 50% или 20%, но не более 100%. Активация 1 раз, после чего товар удаляется из инвентаря, но вы можете купить несколько.`,
"energetic": "Energetic",
"t_shop_buy": "В инвентаре вашего тамагочи теперь есть",
"not_tamagotchi": "У вас нет Тамагочи",
"not_in_inv": "У вас в инвентаре нет товара.",
"buy_no_scores": "Недостаточно баллов для покупки.",
"product_applied": "применён.",
"inventory": "Инвентарь",
"not_inventory": "В инвентаре нет предметов.",
"inventory_select": "Выберите, что хотите потратить из инвентаря.",
"product_not_found": "Товар не найден.",
"t_shop_elements": ["Energetic_100", "Energetic_50", "Energetic_20"],
"t_shop_prices": [100, 50, 20],

"t_ring": "Ринг",
"t_ring_with_params": "Ринг с параметрами:",
"t_ring_scores": "Укажите ставку в баллах.",
"t_ring_no_scores": "Не хватает баллов для ставки.",
"t_ring_auto_on": "Вкл. авто режим",
"t_ring_auto_off": "Выкл. авто режим",
"t_ring_auto_true": "Автоматический режим участия в ринге включён",
"t_ring_auto_false": "Автоматический режим участия в ринге выключен.",
"t_ring_text": `Выберите активный ринг или создайте новый.
<b>Предупреждение: обращайте внимание на силу противника (от этого зависит затрачиваемое за 1 успешный удар здоровье)</b>.
Вероятность успешного удара или успешной защиты зависит от сытости вашего тамагочи и от его процента энергии.
Структура данных в кнопках:
Сила Число_ударов Здоровье Количество_баллов`,
"blow": "удара",
"blows": "ударов",
"create_ring": "🆕",
"t_ring_created": "Ринг создан!",
"t_ring_active": "Ринг активен: собрал 2 участника. Выбирайте другой.",
"t_ring_no_power": "Сила вашего тамагочи отличается больше чем на 2 единицы от силы создателя ринга или превышает силу создателя ринга.",
"t_ring_sleep": "Тамагочи спит. Вы не можете присоединяться к рингам.",
"t_ring_joined": "Вы присоединились к рингу.",
"t_ring_you": "Вы",
"t_ring_opponent": "Противник",
"t_ring_creator": "Вы являетесь создатеем данного ринга. Вы можете удалить его. <b>Важно: клик по кнопке активирует необратимую операцию.</b>",
"t_ring_hit": "Ударить",
"t_ring_no_hit": "Вы не можете ударить: очередь за вашим противником",
"t_ring_failure": "Вы не смогли ударить противника: он защитился.",
"t_ring_hit_ok": "Вы успешно ударили противника, и уменьшили ему здоровье на ",
"t_ring_critical_strike": "Критический удар! Ваш тамагочи нанёс значительный урон противнику, уменьшив здоровье на ",
"t_ring_opponent_crytical_hit": "Прошёл критический удар против вашего тамагочи, уменьшив ему здоровье на ",
"your_health": "Здоровье вашего тамагочи",
"opponent_health": "Здоровье тамагочи противника",
"t_ring_opponent_no_hit": "Противник не смог нанести удар по вашему тамагочи!",
"t_ring_opponent_yes_hit": "Противник ударил вашего тамагочи, уменьшив здоровье на",
"t_ring_winner": "Поздравляем! Ваш тамагочи победил в ринге! Начислено баллов +",
"t_ring_not_winner": "Ваш тамагочи к сожалению проиграл. Пробуйте свои силы в других раундах: может тогда вам попадётся не столь опытный противник.",
"t_ring_delete": "Удалить ринг",
"t_ring_deleted": "Ринг удалён...",
"t_ring_returned": "Ставки возвращены.",
"t_ring_forgotten": "Забытые",
"t_ring_forgotten_text": `Выберите забытый вами ринг. Забытые ринги - ринги, где противники ждут вашего удара. Нажатие автоматически активирует удар.
Структура данных в кнопках:
Сила Число_ударов Количество_баллов`,


"tamagotchi_action": "действие",
"tamagotchi_not_wants": "Тамагочи не хочет",
"tm_with_actions": {
    "t_game": "играть",
"t_feed": "есть",
"t_heal": "Лечиться",
"t_wash": "Мыться",
"t_sleap": "Спать",
},

"tm_ok_actions": {
    "t_game": "поиграл",
"t_feed": "поел",
"t_heal": "полечился",
"t_wash": "помылся",
"t_sleap": "спит",
},

"tamagotchi_ok": "Тамагочи рад, что",
"tamagotchi_set_name": "На свет появился тамогочи по имени",
"tamagotchi_died": "К сожалению, ваш тамагочи умер... Создайте его заново...",

"yes": "Да",
"no": "Нет",

"back": "назад",
    "cancel": "Отмена",
"to_game": "К игре",

    "partners": "Партнёры бота",
"partners_text": `1. @viz_dice_bot и @viz_quiz_bot от @viz_cx;
2. @viz_social_bot.`,
    

"check_subscribes": "Проверить подписку",
"checking_subscribes": "Чтобы пользоваться ботом, вам надо подписаться на канал @blind_dev. Как сделаете это, нажмите на кнопку проверки подписки.",

"news": "Новости",
    "help": "Помощь",
    "help_text": `Для начала просто выберите один из пунктов меню.
Коли не видны кнопки, введите /start или нажмите на "Показать клавиатуру бота".
Если будут вопросы или проблемы, пишите в чат @dpos_space или личку @denis_skripnik

Про уровни.
Они созданы для конкурентоспособности игр и большей конкуренции между игроками.
Формула:
score = Math.min(Math.max(0, Math.floor(score * Math.pow(0.95, level) * 100) / 100), maxScore);

Разъясняем:
Простым языком, чтобы вычислить количество баллов, которые вы заработаете на втором уровне с максимальным количеством баллов равным 50 и начисляемыми баллами 35, вам нужно умножить количество начисленных баллов (35) на 0,95 во второй степени (что дает 31,58).
Затем округлите результат до двух знаков после запятой и убедитесь, что результат не превышает максимальное количество баллов (50).

<a href="https://telegra.ph/Igra-Tamogochi-v-viz-mg-bot-04-28">О тамагочи</a>

P. S. Идеи новых игр, опубликованные в чате, которые окажутся стоящими, будут вознаграждаться.`
}