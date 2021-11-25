function awardsLinks(to, energy, memo) {
    let viz_social_bot_params = Buffer.from(to + '|' + Math.ceil(energy) + '|0|' + memo, 'utf8').toString('base64');
    let links = `<a href="https://t.me/viz_social_bot?start=1${viz_social_bot_params}">Viz social bot</a>, <a href="https://my.viz.plus/assets/award">my.viz.plus</a>, <a href="https://dpos.space/viz/awards/link/${to}/0/${memo}/${energy}">dpos.space</a>, <a href="https://viz.cx/award?receiver={to}&energy={energy}&memo=${memo}">viz.cx</a>, <a href="https://testflight.apple.com/join/G1VtJ0NA">IOS приложение</a>, <a href="https://play.google.com/store/apps/details?id=my.viz">Android приложение</a>.
`;
console.log(`https://t.me/viz_social_bot?start=1${viz_social_bot_params}`);
return links;
}

module.exports = {
    "start": "Старт",
    "home": "Главная",
    "home_message": "Здравствуйте! Это @viz_mg_bot: бот с мини-играми Viz! Выберите её в меню.",
    "lang": "Выбрать язык",
    "selected_language": "Вы выбрали язык: Русский.",
"fortune_telling": "Гадания",
    "ft_text": "Позолоти ручку: я расскажу будущее твоё. Только уточни, о чём хочешь узнать, а я отвечу: будет или не будет, да или нет.",
    "ft_message": "Хорошо. А теперь выбери, хочешь ли наградить меня за труд. Если сделаешь это, гадание может оказаться более точным!",
"ft_award": "Наградить гадалку",
"ft_standart": "Без награды",
    "ft_award_text": function(to, memo) {
return `Ты выбрал награду. Благодарю тебя.
Для начала хочу сказать, что для награждения тебе нужен Viz аккаунт или наличие Viz в @viz_social_bot.
Нажми на одну из ссылок для награждения:
${awardsLinks(to, 2, memo)}.`;
    },
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

    "back": "назад",
    "cancel": "Отмена",
   "news": "Новости",
    "help": "Помощь",
    "help_text": `Для начала просто выберите один из пунктов меню.
Коли не видны кнопки, введите /start или нажмите на "Показать клавиатуру бота".
Если будут вопросы или проблемы, пишите в чат @dpos_space или личку @denis_skripnik
P. S. Идеи новых игр, опубликованные в чате, которые окажутся стоящими, будут вознаграждаться.`
}