function awardsLinks(to, energy, memo) {
    let viz_social_bot_params = Buffer.from(to + '|' + Math.ceil(energy) + '|0|' + memo, 'utf8').toString('base64');
    let links = `<a href="'https://t.me/viz_social_bot?start=1${viz_social_bot_params}">Viz social bot</a>, <a href="https://my.viz.plus/assets/award">my.viz.plus</a>, <a href="https://dpos.space/viz/awards/link/${to}/0/${memo}/${energy}">dpos.space</a>, <a href="https://viz.cx/award?receiver={to}&energy={energy}&memo=${memo}">viz.cx</a>, <a href="https://testflight.apple.com/join/G1VtJ0NA">IOS приложение</a>, <a href="https://play.google.com/store/apps/details?id=my.viz">Android приложение</a>.
`;
    return links;
}

module.exports = {
    "start": "Start",
    "wait_award": "There are < 2 minutes left before the distribution of awards. Wait for her: then you can play on.",
    "home": "Home",
    "home_message": function(names, referer, referer_code, scores, level, locked_scores) {
        let hello = 'Hello';
if (names !== '') hello += `, ${names}`;
        return `${hello}! Welcome to @viz_mg_bot.
Play games and collect points. Once a day, there will be a distribution of awards from the Viz account among those who have received points in proportion to them.
Frequency: 28800 blocks Viz: about 24 hours.

Earn 0.08 points from each level 1 referral score and 0.02 points from a level 2 referral.
Your invitee: ${referer}.
Your referral link: https://t.me/viz_mg_bot?start=r${referer_code}

You have accumulated ${scores} points for today
Blocked in games: ${locked_scores} points,
Level (depends on the number of accumulated points, including blocked ones; serves as anti-spam): ${level}`;
    },
    "new_referal1": "A first-level referral has been registered on your link. Invite more and earn: ",
    "new_referal2": "A second-level referral has been registered on your link. Invite more and earn: ",
    "lang": "Choose a language",
    "selected_language": "You have chosen the language: English.",

    "games": "Games",
"games_text": "Choose a game",
"reytings": "Ratings",
"reytings_text": "Select a rating. Top scores and a list of artifact owners are available.",
    "scores_top": "Top of scores",
    "scores_top_text": function(before_award, top_list) {
        let timer_text = '';
        if(before_award !== '') {
            timer_text = `Until the distribution of awards is left ${before_award}.`;
        }
        return `${timer_text}
List of participants with scores greater than 0 (pay attention to the percentage of energy: if it is less than 0.01, you will not receive a reward; in total, 20% is distributed per day according to the recovery rate):
${top_list}`;
       },
        "is_blocks": "blocks",
"approximately": "approximately",
    "scores": "Scores",
    "of_energy": "of energy",
    
    "artifacts_owners": "Owners of artifacts and prizes",
    "artifacts_owners_text": "List of owners of artifacts (prizes, if any)",

    "fortune_telling": "Fortune telling",
    "ft_no_work": "I won't guess until you get the result of the previous guessing!",
    "ft_tomorrow": "I only guess a hundred times a day. Come back tomorrow.",
    "ft_text": "Gild the pen: I will tell your future. Just specify what you want to know, and I will answer: it will be or it will not be, yes or no. Left divination: ",
    "ft_no_correct": "You did not enter a question or the algorithm of protection against fraudsters considered that it has signs of an attempt to cheat... If this is still a question, write it to @blind_dev_chat - the algorithms will be tweaked.",
    "ft_message": "OK. Now choose whether you want to reward me for my work. If you do this, fortune-telling may be more accurate!",
    "ft_award": "Reward the fortune-teller",
    "ft_standart": "No reward",
    "ft_award_text": function(to, memo) {
    return `You chose the reward. Thank you.
    To begin with, I want to say that for the award you need a Viz account in @viz_social_bot or a Viz login if you want to use other links.
    Click on one of the award links:
    ${awardsLinks(to, 2, memo)}.`;
    },
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
    "more": "inasmuch as I am an honest fortune-teller, saying that was used in divination",
    "block_hash": "the hash of the block",
    "text_hash": "Hash of the text",
    "number_types": "Number: 0 (no) or 1 (to be) (it is also increased by 5 or 10 times (when awarded) times, point)",
    "generated_number": "Dropped out",
    "and_hash": "and its hash",
    "random_numbers": "Guess the number",
"rn_text": `Enter a three-digit number from 100 to 999.
If you guess one of the three, you will get 1 point at the zero level, 2 out of 3 - 2, 3 out of 3 - 3 points. Once a day, everyone will receive a reward according to the number of points.
With an increase in the difficulty level, which depends on the number of points, you will receive fewer of them.
The level increases when passing score multiple of 100 (100 - level 1, 200 - 2, 300 - 3, etc).
Final score = score - (level * 0.05).
For example, if you got 2 points, but the level 3,
2 - (3 * 0.05)) = 1.85.

At the same time, each number is compared in parts. For example, if you entered 294, and the bot specified 428, there will be such a comparison: 4 - you do not have, 2 - you have (deleted - becomes 48), 8 - you do not have, so 1 point.
Example 2: you have the number 521, and in the bot 121: 5 is not, 2 is (deleted, 11 remains), 1 is (deleted, 1 remains). That is, you got 2 out of 3 points.

To finish the game, click "Back" or "Home".`,
"rn_gaming_text": function(n, un, b, scores) {
return `The number ${n} dropped out. Your number: ${un}. Points: +${b}, total for the day: ${scores}`;
},
"not_number": "No number or extra characters entered",
"rn_finish": "Game over",
"rn_error": "Error. You probably entered a non-three-digit number",    

"my_viz_login": "Specify Viz login",
"viz_login_text": `Enter the Viz login.
You can find out about it at https://viz.plus , https://viz.dpos.space
Register at @viz_social_bot or here: https://start.viz.plus
For questions about Viz, write to @eng_viz_faq`,
"account_added": "Account added.",
"not_account": "There is no such account or a connection error with Viz.",

"crypto_bids": "Bid on the crypt rate",
"crypto_bids_active": "The collection of bids is completed. Wait for the next round, which starts about once every 5 minutes.",
"new_bids_round": "Раунд ставок завершён. Начался новый. Просьба дождаться окончания выбора победителей и проигравших, после чего ввести заново.",
"yes_crypto_bid": "You have already placed a bet. or you have 0 points.",
"crypto_bids_text": function(scores, btc_price, datetime, totalProfitCoefficients) {
    return `Enter the amount of points up to ${scores} that you are ready to bet on the movement of the BTC rate.
    If you win, you will receive your points + the points of the losers according to your share.

    Profitability coefficients:
For growth: ${totalprofitcoeffients[">"]}.
To drop: ${totalprofitcoeffients["<"]}.

<b>Check the time before the distribution of awards in the top by points, because if there are less than 30 minutes left, there is a risk of zeroing the bets, because they do not go to the next day.</b>

The BTC rate for ${datetime}: ${btc_price} $ (fixed at the beginning of the round).
`;
},
"crypto_bids_direction": "Choose the direction where the BTC rate will go: more or less than the current level",
"cb_more": "More",
"cb_less": "Less",
"crypto_bids_ok": "The bid is accepted. Expect results.",
"crypto_bids_failed": "An error occurred while entering data",
"crypto_bids_winn": function(amount) {
    return `You've won! The number of points awarded has been increased by ${amount}.`;
},
"crypto_bids_lost": "You lost by losing your points.",
"crypto_bids_data": function(old_price, now_price, direction, bid_amount) {
    if (direction === '>') {
        direction = 'More than';
    } else {
        direction = 'Less than or equal to';
    }
    return `
    The BTC price for the previous time: ${old_price} $,
Now: ${now_price} $,
The direction you have chosen: ${direction},
Bid amount: ${bid_amount} points.`;
},

"not_scores_award": function(scores, all_scores) {
    let share = (scores / all_scores) * 100;
        let energy_percent = 20 * (share / 100);
    return `Unfortunately, you will not receive the reward, because the accumulated points are not enough to receive it: the percentage of energy is less than 0.01%.
You have points: ${scores},
Total: ${all_scores},
Share: ${share},
Calculate the percentage of energy:
20 * (${share} / 100) = ${energy_percent}.`;
    },
    "yes_scores_award": `Hurray! You have accumulated the right amount of points to receive a reward! Congratulations!
    You will be able to see them either in the social capital. the capital of the account linked to the bot (if you did it), or in @viz_social_bot.
    Sending will happen after sending messages to the participants.`,

    "bk_game": "Bulls-cows",
    "bk_text": `1. The bot will guess the number. the number of characters depends on the level:
    Level 1 - 3 characters, 2 - 4, 3 - 5;
    2. You have to guess the right one several times (the fewer moves you make, the more points).
    3. Information will be given to you as hints:
How many bulls are the numbers that are in their place,
    Cows are numbers that are in the number, but which are not in their place.
The numbers in the number are not repeated.
    
    Maximum:
    +100 points at the 1st level of difficulty (excluding the level in the bot),
    + 200 points at the second level
    and + 500 at the third.
    
    The level in the bot reduces the number of points as follows:
    0 - 100% of the amount, 1 - 95% of the amount, 2 - 90% of the amount, etc.
    
    Select the difficulty level.`,
    "bk_level": "Level ",
    "bk_game_text": function(level, staps) {
    let text = '';
    if (staps !== '') {
    text = `Your steps:
    ${staps}`;
    }
        let number = 3;
        if (level === 2) number = 4;
    if (level === 3) number = 5;
    return `Difficulty level: ${level} (including ${number} characters).
    ${text}`;
    },
    "bulls": "Bulls",
    "cows": "Cows",
    "bk_stap": "step",
"bk_number": "Number",
    "bk_error": function(n) {
        return `Ошибка: you entered either a non-number, or a number consisting of non - ${n} characters.`;
    },
    "bk_gameing_text": function(n, sn, b, scores) {
        return `
        You found all the bulls in ${sn} steps! Congratulations!
${b} points awarded, total: ${scores} points.`;
    },

    "reset_game": "Reset the game",
"reset_text": "Do you really want to permanently destroy all your steps on the current game session?",
"reset_yes": function(bk_level) {
return `The ${bk_level} level game session has been reset.`;
},
"reset_no": `Reset canceled.
Go to the "Games" section to continue the game.`,
    "yes": "Yes",
    "no": "No",

"back": "back",
    "cancel": "Cancel",
    
    "partners": "Bot partners",
    "partners_text": `1. @viz_dice_bot and @viz_quiz_bot from @viz_cx;
    2. @viz_social_bot.`,"news": "News",

    "check_subscribes": "Check your subscription",
    "checking_subscribes": "To use the bot, you need to subscribe to the @blind_dev channel. Once you have done this, click on the subscription verification button.",

    "news": "News",
    "help": "Help",
    "help_text": `To start, just select one of the menu items.
    If the buttons are not visible, enter /start or click on "Show the bot keyboard".
    If you have any questions or problems, write to the chat @dpos_space or the personal @denis_skripnik
    P. S. Ideas of new games published in the chat that will be worthwhile will be rewarded.`
    }