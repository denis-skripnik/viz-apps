function awardsLinks(to, energy, memo) {
    let viz_social_bot_params = Buffer.from(to + '|' + Math.ceil(energy) + '|0|' + memo, 'utf8').toString('base64');
    let links = `<a href="'https://t.me/viz_social_bot?start=1${viz_social_bot_params}">Viz social bot</a>, <a href="https://my.viz.plus/assets/award">my.viz.plus</a>, <a href="https://dpos.space/viz/awards/link/${to}/0/${memo}/${energy}">dpos.space</a>, <a href="https://viz.cx/award?receiver={to}&energy={energy}&memo=${memo}">viz.cx</a>, <a href="https://testflight.apple.com/join/G1VtJ0NA">IOS приложение</a>, <a href="https://play.google.com/store/apps/details?id=my.viz">Android приложение</a>.
`;
    return links;
}

module.exports = 
{
"start": "Start",
"wait_award": "There are < 2 minutes left before the distribution of awards. Wait for her: then you can play on.",
"home": "Main",
"home_message": function(names, referer, referer_code, scores, level, locked_scores) {
        let hello = 'Здравствуйте';
if (names !== '') hello += `, ${names}`;
        return `${hello}! Добро пожаловать в @viz_mg_bot.
Играйте в игры  и набирайте баллы. Раз в сутки будет рассылка наград с Viz аккаунта среди получивших баллы пропорционально им.
Периодичность: 28800 блоков Viz: около 24 часов.

Зарабатывайте 0.08 балла с каждого балла реферала 1 уровня и 0.02 балла с реферала второго уровня.
Ваш пригласитель: ${referer}.
Ваша реферальная ссылка: https://t.me/viz_mg_bot?start=r${referer_code}

У вас за сегодня накоплено ${scores} баллов,
Заблокировано в играх: ${locked_scores} баллов,
Уровень (зависит от количества накопленных баллов, включая заблокированные; служит антиспамом): ${level}`;
    },
"new_referal1": "A first-level referral has been registered using your link. Invite more and earn: ",
"new_referal2": "A second-level referral has been registered using your link. Invite more and earn: ",
"lang": "Choose a language",
"selected_language": "You have chosen the language: Russian.",
"games": "Games",
"games_text": "Choose a game",
"reytings": "Ratings",
"reytings_text": "Select a rating. Top scores and a list of artifact owners are available.",
"scores_top": "Top in points",
"scores_top_text": function(before_award, top_list) {
    let timer_text = '';
    if (before_award !== '') {
        timer_text = `До рассылки наград осталось ${before_award}.`;
    }
    return `${timer_text}
Список участников с баллами больше 0 (обращайте внимание на процент энергии: если он меньше 0.01, вы не получите награду; всего распределяется 20% в сутки в соответствии со скоростью восстановления):
${top_list}`;
   },
"is_blocks": "blocks",
"approximately": "approximately",
"scores": "Points",
"of_energy": "energy",
"artifacts_owners": "Owners of artifacts and prizes",
"artifacts_owners_text": "List of artifact owners (prizes, if any)",
"fortune_telling": "Divination",
"ft_no_work": "I won't guess until you get the result of the previous guessing!",
"ft_tomorrow": "I only guess a hundred times a day. Come back tomorrow.",
"ft_text": "Gild the pen: I will tell your future. Just specify what you want to know about, and I will answer: it will be or it will not be, yes or no. There are no divinations left: ",
"ft_no_correct": "You did not enter a question or the algorithm of protection against fraudsters considered that it has signs of an attempt to cheat... If this is still a question, write it to @blind_dev_chat - the algorithms will be tweaked.",
"ft_message": "Good. Now choose whether you want to reward me for my work. If you do this, divination may be more accurate! In addition, with ordinary fortune-telling, 5 points will be awarded for a successful number minus the amount per level, and when awarding 10 - the amount per level (see the formula for calculating the level in the help).",
"ft_award": "Reward a fortune teller",
"ft_standart": "No reward",
"ft_award_text": function(to, memo) {
    return `You chose the reward. Thank you.
    To begin with, I want to say that for the award you need a Viz account in @viz_social_bot with a Viz login. Award <code>${to}</code> to <code>2</code>% with a note <code>${memo}</code> or choose another method:
    ${awardsLinks(to, 200, memo)}.`;
        },
        "ft_cancel": "Cancel fortune-telling",
    "ft_cancel_text": "You canceled fortune-telling through a reward - sorry...",
"ft_type_text": "Tell me, what do you want me to tell fortunes on?",
"ft_type_text": "Tell me what you want me to tell fortunes?",
0: [
    `It doesn't make sense to make any long-term forecasts here. The situation is so unpredictable that any little thing can turn it 180 degrees.
    Try to be prepared for any outcome.`,
    `Along with this question comes negative energy. Perhaps you yourself don't want this to happen, or related topics cause you a lot of negative emotions. Or maybe this path lies through conflicts and difficulties.`,
    `Now is an unfavorable time for the realization of such desires and it will be very difficult to achieve this.
    The stars advise you to wait and gain strength.`,
    'The outcome is unlikely. Even if you give it your all, circumstances will take you out of your comfort zone and provoke outbursts of emotional distress. Leave it alone or learn not to take failure to heart.',
    `The desired is unlikely to happen, but the efforts that you will spend on the implementation of your plans will make you wiser, more reasonable, more focused. This will certainly contribute to the disclosure of your personality. And all this, of course, will benefit you.`,
    `You shouldn't expect something extremely extraordinary. Some little things about what you want will certainly give you pleasure, but otherwise you may have difficulties. Especially carefully calculate all the elements of risk in this matter.`,
    ],
1: [
    `The future holds for you an exceptionally positive set of circumstances. Everything will turn out so perfectly that you can't even imagine.
    However, obstacles and doubts may appear on the way to the desired.`,
    'The energy of the universe in this matter strives for harmony and stability. So, even if there are no visible prerequisites for this, everything will work out in the best way.',
    `Now is a very favorable period for a positive combination of circumstances. The universe does not prepare any obstacles for you.
    Such periods are also great for resolving misunderstandings and contradictions. And, if you have something like this in mind, then take advantage of the opportunity.`,
    'The future quite harmoniously puts events around you. Luck smiles on you and everything turns out. If you really want a successful resolution of this issue, then so be it.',
    `The universe is well disposed towards you and people trust you. In their eyes, the image of a reliable, mature person was formed. You are capable of a lot in life, and this is undoubtedly an exceptionally attractive moment for a favorable combination of circumstances.`,
    `It's definitely possible. Moreover, this future is very positive for you, because it brings calmness and stability. At the same time, it will add new colors to what is interesting and pleasant for you.`
    ],
"more": "Since I am an honest fortune teller, I say that I used it when guessing",
"block_hash": "Block hash",
"text_hash": "Hash of the text",
"number_types": "Number: 0 (will not be) or 1 (will be)",
"generated_number": "Dropped out",
"and_hash": "and its hash",
"random_numbers": "Guess the number",
"rn_text": `Enter a three-digit number from 100 to 999.
If you guess one of the three, you will get 1 point at the zero level, 2 out of 3 - 2, 3 out of 3 - 3 points. Once a day, everyone will receive a reward according to the number of points.
With an increase in the difficulty level, which depends on the number of points, you will receive fewer of them.
The level increases when passing a score multiple of 100 (100 - 1 level, 200 - 2, 300 - 3, etc.).
The final score is equal to subtracting the number per level from the score (formula with explanations in the help).

At the same time, each number is compared in parts. For example, if you entered 294, and the bot specified 428, there will be such a comparison: 4 - you do not have, 2 - there is (deleted - becomes 48), 8 - you do not have, so 1 point.
Example 2: you have the number 521, and in the bot 121: 5 is not, 2 is (deleted, 11 remains), 1 is (deleted, 1 remains). That is, you got 2 out of 3 points.

To finish the game, click "Back" or "Home".`,
"rn_gameing_text": function(n, un, b, scores) {
    return `Выпало число ${n}. Ваше число: ${un}. Баллов: +${b}, всего за день: ${scores}`;
},
"not_number": "Not a number or extra characters are entered",
"rn_finish": "The game is over",
"rn_error": "Mistake. You probably entered a non-three-digit number",
"my_viz_login": "Specify Viz login",
"viz_login_text": `Enter the Viz login.
You can find out about it at https://viz.plus , https://viz.dpos.space
Register at @viz_social_bot or here: https://start.viz.plus
For questions about Viz, write to @viz_support`,
"account_added": "Account added.",
"not_account": "There is no such account or a connection error with Viz.",
"crypto_bids": "Rate on the crypt rate",
"crypto_bids_active": "The collection of bids is completed. Wait for the next round, which starts about once every 5 minutes.",
"new_bids_round": "The betting round is over. A new one has begun. Please wait until the end of the selection of winners and losers, and then enter again.",
"yes_crypto_bid": "You have already placed a bet. or you have 0 points.",
"crypto_bids_text": function(scores, btc_price, datetime, totalProfitCoefficients) {
    return `Введите сумму баллов до ${scores}, которую готовы поставить на движение курса BTC.
В случае победы вы получите свои баллы + баллы проигравших согласно своей доле - 5% от суммы получаемых баллов.
Если все победили, добавится 5% к поставленным баллам.

Коэффициенты прибыльности:
На рост: ${totalProfitCoefficients[">"]}.
На падение: ${totalProfitCoefficients["<"]}.

<b>Проверяыйте время до рассылки наград в топе по баллам, потому что если осталось меньше 30 минут, есть риск обнуления ставок, т. к. они на следующий день не переходят.</b>

Курс BTC на ${datetime}: ${btc_price} $ (фиксируется в начале раунда).
`;
},
"crypto_bids_direction": "Choose the direction where the BTC rate will go: more or less than the current level",
"cb_more": "More",
"cb_less": "Less",
"crypto_bids_ok": "The bid is accepted. Expect results.",
"crypto_bids_failed": "An error occurred while entering data",
"crypto_bids_winn": function(amount) {
    return `Вы выиграли! Количество поставленных баллов увеличено на ${amount}.`;
},
"crypto_bids_lost": "You lost by losing your points.",
"crypto_bids_data": function(old_price, now_price, direction, bid_amount) {
    if (direction === '>') {
        direction = 'больше';
    } else {
        direction = 'Меньше или равно';
    }
    return `
Курс BTC в предыдущий раз: ${old_price} $,
Сейчас: ${now_price} $,
Выбранное вами направление: ${direction},
Сумма ставки: ${bid_amount} баллов.`;
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
"yes_scores_award": `Hurray! You have accumulated the right amount of points to receive a reward! Congratulations!
You will be able to see them either in the social network. the capital of the account linked to the bot (if you did it), or in @viz_social_bot.
Sending will happen after sending messages to the participants.`,
"bk_game": "Bulls-cows",
"bk_text": `1. The bot will guess a number. the number of characters depends on the level:
Level 1 - 3 characters, 2 - 4, 3 - 5;
2. You have to guess the right one several times (the fewer moves you make, the more points).
3. As hints, you will be given information:
How many bulls are numbers that are in their place,
Cows are numbers that are in the number, but which are not in their place.
The numbers in the number are not repeated.

Maximum:
+100 points on the 1st level of difficulty (excluding the level in the bot),
+ 250 points on the second 

level
and +500 on the third.

For the formula for reducing the number of points depending on the level, see the help.
Select the difficulty level.`,
"bk_level": "Level ",
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
"bulls": "Bulls",
"cows": "Cows",
"bk_stap": "step",
"bk_number": "Number",
"bk_error": function(n) {
    return `Ошибка: вы ввели либо не число, либо число, состоящее не из ${n} знаков.`;
},
"bk_gameing_text": function(n, sn, b, scores) {
    return `
Вы нашли всех быков за ${sn} шагов! Поздравляем!
Число: ${n}.
Начислено ${b} баллов, всего: ${scores} баллов.`;
},
"reset_game": "Reset the game",
"reset_text": "Do you really want to permanently destroy all your moves on the current game session?",
"reset_yes": function(bk_level) {
    return `Игровой сеанс уровня ${bk_level} сброшен.`;
},
"reset_no": `Reset canceled.
Go to the "Games" section to continue the game.`,
"yes": "Yes",
"no": "No",
"back": "back",
"cancel": "Cancel",
"partners": "Bot Partners",
"partners_text": `1. @viz_dice_bot and @viz_quiz_bot from @viz_cx;
2. @viz_social_bot.`,
"check_subscribes": "Check your subscription",
"checking_subscribes": "To use the bot, you need to subscribe to the @blind_dev channel. Once you have done this, click on the subscription verification button.",
"news": "News",
"help": "Help",
"help_text": `To get started, just select one of the menu items.
If the buttons are not visible, enter /start or click on "Show the bot keyboard".
If you have any questions or problems, write to the chat @dpos_space or personal @denis_skripnik

About the levels.
They are created for the competitiveness of games and greater competition between players.
Formula:
score = Math.min(Math.max(0, Math.floor(score * Math.pow(0.95, level) * 100) / 100), maxScore);

To clarify:
In simple terms, to calculate the number of points you will earn at the second level with a maximum of 50 points and 35 points awarded, you need to multiply the number of points awarded (35) by 0.95 in the second degree (which gives 31.58).
Then round the result to two decimal places and make sure that the result does not exceed the maximum number of points (50).

PS Ideas of new games published in the chat, which will be worthwhile, will be rewarded.`,

}
