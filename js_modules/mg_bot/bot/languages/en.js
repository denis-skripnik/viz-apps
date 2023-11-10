function awardsLinks(to, energy, memo) {
    let viz_social_bot_params = Buffer.from(to + '|' + Math.ceil(energy) + '|0|' + memo, 'utf8').toString('base64');
    let links = `<a href="'https://t.me/viz_social_bot?start=1${viz_social_bot_params}">Viz social bot</a>, <a href="https://my.viz.plus/assets/award">my.viz.plus</a>, <a href="https://dpos.space/viz/awards/link/${to}/0/${memo}/${energy}">dpos.space</a>, <a href="https://viz.cx/award?receiver={to}&energy={energy}&memo=${memo}">viz.cx</a>, <a href="https://testflight.apple.com/join/G1VtJ0NA">IOS приложение</a>, <a href="https://play.google.com/store/apps/details?id=my.viz">Android приложение</a>.
`;
    return links;
}

module.exports = {
    "start": "Start",
    "wait_award": "Less than 2 minutes left until the award distribution. Please wait to continue playing.",
    "home": "Home",
    "home_message": function(names, referer, referer_code, scores, level, locked_scores, viz_scores) {
    let hello = 'Hello';
    if (names !== '') hello += `, ${names}`;
    return `${hello}! Welcome to @viz_mg_bot.
    Play games and earn points. Once a day, rewards will be distributed from the Viz account among those who have earned points proportionally.
    Frequency: approximately every 24 hours or 28,800 Viz blocks.
    Earn 0.08 points from each point of your 1st-level referral and 0.02 points from each point of your 2nd-level referral.
    Your inviter: ${referer}.
    Your referral link: https://t.me/viz_mg_bot?start=r${referer_code}
    Today you have accumulated ${scores} points,
    Viz points: ${viz_scores},
    Points locked in games: ${locked_scores},
    Level (depends on the total accumulated points, including locked ones; serves as anti-spam): ${level}`;
    },
    "new_referal1": "A 1st-level referral has registered using your referral link. Invite more and earn: ",
    "new_referal2": "A 2nd-level referral has registered using your referral link. Invite more and earn: ",
    "lang": "Select language",
    "selected_language": "You have selected the language: English.",
    "games": "Games",
    "games_text": "Choose a game",
    "reytings": "Ratings",
    "reytings_text": "Select a rating. The top by points, the top by age of Tamagotchi, their strength and a list of artifact owners are available.",
    "scores_top": "Top by Points",
    "scores_top_text": function(before_award, top_list) {
        let timer_text = '';
        if (before_award !== '') {
            timer_text = `Less than ${before_award} left until the award distribution.`;
        }
        return `${timer_text}
        List of participants with points greater than 0 (pay attention to the energy percentage: if it is less than 0.01, you will not receive a reward; only 20% is distributed per day according to the recovery rate):
        ${top_list}`;
        },
        "t_age_top": "Top ages of Tamagotchi",
        "t_age_top_text": function(top_list) {
            return `List of participants with Tamagotchi age:
     ${top_list}`;
           },
           "t_power_top": "Top Tamagotchi power",
           "t_power_top_text": function(top_list) {
               return `List of participants by Tamagotchi power:
        ${top_list}`;
              },
     
        
        "is_blocks": "blocks",
        "approximately": "approximately",
        "scores": "Points",
        "of_energy": "of energy",
        "added_viz_scores": "Added Viz points",
"all_scores": "total points",
"viz_scores_adding": function(to, memo) {
    return `Send a reward via the Viz blockchain to get Viz points (x10 is the amount of the reward received). You will not be able to receive a reward at midnight until you use it in games such as betting on the cryptocurrency exchange rate. If you win, you will get real points.
    First of all, to reward you, you need a Viz account in @viz_social_bot with a Viz login. Reward <code>${to}</code> with <code>2</code>% and add the memo <code>${memo}</code>, or choose another method:
    ${awardsLinks(to, 200, memo)}.`;
},

    "artifacts_owners": "Owners of Artifacts and Prizes",
"artifacts_owners_text": "List of artifact owners (prizes, if any)",
"fortune_telling": "Fortune Telling",
"ft_no_work": "I won't be able to tell your fortune until you receive the result of the previous fortune telling!",
"ft_tomorrow": "I only do fortune telling a hundred times a day. Come back tomorrow.",
"ft_text": "Take a golden pen: I will tell your future. Just specify what you want to know, and I will answer: yes or no. Remaining fortune tellings: ",
"ft_no_correct": "You didn't ask a question or the anti-fraud algorithm detected something suspicious... If it's indeed a question, please contact @blind_dev_chat, and the algorithms will be adjusted.",
"ft_message": "Alright. Now choose whether you want to reward me for my work. If you do, the fortune telling may be more accurate! Also, during a regular fortune telling, you will earn 5 points for a successful guess minus the level score, and with a reward of 10, you will earn the level score (see the calculation formula in the help).",
"ft_award": "Reward the fortune teller",
"ft_standart": "Without a reward",
"ft_award_text": function(to, memo) {
return `You have chosen a reward. Thank you. To reward me, you need a Viz account in @viz_social_bot with a Viz login. Reward <code>${to}</code> with <code>2</code>% and a note <code>${memo}</code>, or choose another method: ${awardsLinks(to, 200, memo)}.`;
},
"ft_cancel": "Cancel the fortune telling",
"ft_cancel_text": "You canceled the fortune telling through a reward - what a pity...",
"ft_type_text": "Tell me, what do you want me to tell your fortune about?",
0: [
`Making any long-term predictions here doesn't make sense. The situation is so unpredictable that any small detail can turn it around by 180 degrees. Try to be prepared for any outcome.`,
`With this question comes negative energy. Perhaps you yourself do not want it to happen or related topics evoke a lot of negative emotions in you. Or maybe this path lies through conflicts and difficulties.`,
`Now is not a favorable time to fulfill such desires, and achieving it will be very difficult. The stars advise you to wait and gather strength.`,
`The outcome is unlikely. Even if you devote all your efforts to it, circumstances will take you out of your comfort zone and provoke emotional outbursts. Leave this matter or learn not to take failures to heart.`,
`Your desire is unlikely to come true, but the efforts you put into achieving it will make you wiser, more prudent, and more focused. This will undoubtedly benefit you.`,
`You should not expect something extraordinary. Some details relative to your desire will certainly bring you pleasure, but you may encounter difficulties in other aspects. Pay special attention to assessing all the risk elements in this matter.`,
],
1: [
`The future holds exceptionally positive circumstances for you. Everything will work out so perfectly that you can't even imagine. However, there may be obstacles and doubts along the way to your desired outcome.`,
`The energy of the universe in this matter strives for harmony and stability. Therefore, even if there are no visible prerequisites for it, everything will work out for the best.`,
`Now is a very favorable period for positive circumstances. The universe does not prepare any obstacles for you. Such periods are also great for resolving misunderstandings and contradictions. So if you have something like that in mind, take advantage of the opportunity.`,
`The future harmoniously shapes events around you. Luck smiles upon you, and everything goes well. If you really want a successful resolution to this matter, then so it shall be.`,
`The universe is favorable to you, and people trust you. In their eyes, you have become a reliable, mature person. You are capable of many things in life, and this is undoubtedly an attractive aspect for a favorable turn of events.`,
`This is definitely possible. Moreover, this future is quite positive for you, as it brings tranquility and stability. Additionally, it will add new colors to what interests and pleases you.`
],
"more": "As an honest fortune teller, I have used",
"block_hash": "Block Hash",
"text_hash": "Text Hash",
"number_types": "Number: 0 (no) or 1 (yes)",
"generated_number": "Generated Number",
"and_hash": "and its hash",
"award_ft_author": `Did you like the fortune teller's answer? Reward the author of the response texts using Viz in the following ways:
${awardsLinks('optimisticdigit', 200, 'За тексты ответов гадалки в viz_mg_bot.')}.`,

"random_numbers": "Guess the Number",
"rn_text": `Enter a three-digit number from 100 to 999.
If you guess one of the three digits, you will receive 1 point at level 0, 2 out of 3 - 2 points, 3 out of 3 - 3 points. Once a day, everyone will receive a reward according to the number of points.
With an increase in the difficulty level, which depends on the number of points, you will receive fewer points.
The level increases with each multiple of 100 (100 - level 1, 200 - level 2, 300 - level 3, and so on).
The final score is obtained by subtracting the level score from the total score (see the formula in the explanation in the help).
At the same time, each number is compared in parts. For example, if you enter 294 and the bot indicates 428, the comparison will be as follows: 4 - you don't have it, 2 - you have it (it is removed, leaving 48), 8 - you don't have it, so you get 1 point.
Example 2: Your number is 521, and the bot's number is 121: 5 - no, 2 - yes (it is removed, leaving 11), 1 - yes (it is removed, leaving 1). In this case, you get 2 out of 3 points.
To end the game, press "Back" or "Home".`, "rn_gameing_text": function(n, un, b, scores) { return `The number is ${n}. Your number: ${un}. Points: +${b}, total for the day: ${scores}`;
},
"not_number": "Not a number or extra characters entered",
"rn_finish" : "Game Over",
"rn_error": "Error. You probably entered a non-three-digit number",
"my_viz_login": "Specify Viz login",
"viz_login_text": `Enter your Viz login. You can find it at https://viz.plus, https://viz.dpos.space. Register at @viz_social_bot or here: https://start.viz.plus. For questions about Viz, contact @viz_support`,
"account_added": "Account added.",
"not_account": "No such account or connection error with Viz.",
"crypto_bids": "Crypto rate bid",
"crypto_bids_active": "Bidding is complete. Wait for the next round, which starts approximately every 10 minutes.",
"new_bids_round": "Bidding round is complete. A new one has started. Please wait for the selection of winners and losers to finish, and then enter again.",
"yes_crypto_bid": "You have already placed a bid or you have 0 points.",
"crypto_bids_text": function(scores, btc_price, datetime, totalProfitCoefficients) {
return `Enter the amount of points up to ${scores} that you are willing to bet on the movement of the BTC rate.
If you win, you will receive your points + the points of the losers according to your share.
If everyone wins, the winnings will be added depending on the bet: the more you bet, the lower the coefficient (minimum - +5% to the bet). For example, if you bet up to 100 points, you will get an increase of 1.5 times, from 100 to 200 a little less, etc... But it is important that the above is without taking into account the reduction of charges due to the level in the bot.

Profitability coefficients:
For growth: ${totalProfitCoefficients[">"]}.
For decline: ${totalProfitCoefficients["<"]}.
<b>Check the time until rewards are sent to the top by points, because if there is less than 30 minutes left, there is a risk of resetting the bids as they do not carry over to the next day.</b>
BTC rate at ${datetime}: ${btc_price} $ (fixed at the beginning of the round).
`; },
"crypto_bids_direction": "Choose the direction where the BTC rate will go: higher or lower than the current level",
"cb_more": "Higher",
"cb_less": "Lower",
"crypto_bids_ok": "Bid accepted. Wait for the results.",
"crypto_bids_failed": "An error occurred while entering the data",
"crypto_bids_winn": function(amount, bid_scores, result_scores) {
    return `You've won!
Points won: ${amount    }
Winning amount: ${result_scores}`;
},
"crypto_bids_lost": "You lost by losing your points.",
"crypto_bids_data": function(old_price, now_price, direction, bid_amount) {
    if (direction === '>') {
        direction = 'больше';
    } else {
        direction = 'Меньше или равно';
    }
    return `
    Bet: ${bid_amount}

BTC rate:
The beginning of the round - ${old_price} $,
End of round - ${now_price} $,
Direction: ${direction},

The source of the rate: coincap.io`;
},
"not_scores_award": function(scores, all_scores) {
let share = (scores / all_scores) * 100;
let energy_percent = 20 * (share / 100);
return `Unfortunately, you will not receive a reward because you have not accumulated enough points to qualify: the energy percentage is less than 0.01%. You have points: ${scores}, Total: ${all_scores}, Share: ${share}, Calculating the energy percentage: 20 * (${share} / 100) = ${energy_percent}.`;
},
"yes_scores_award": `Hooray! You have accumulated the required number of points to receive the award! Congratulations! You can see them either in the social capital of the linked account (if you have done so) or in @viz_social_bot. The delivery will occur after sending messages to the participants.`,
"bk_game": "Bulls and Cows",
"bk_text": `1. The bot will generate a number. The number of characters depends on the level:
Level 1 - 3 characters, Level 2 - 4 characters, Level 3 - 5 characters;
2. You have to guess the correct number in several attempts (the fewer moves you make, the more points you earn).
3. You will be given hints in the form of:
•
Bulls: the number of digits that are in their correct positions,
•
Cows: the number of digits that are present in the number but are not in their correct positions.
The digits in the number do not repeat.
Maximum points:
+10 points in Level 1 (excluding the bot level),
+25 points in Level 2,
and +50 points in Level 3.
To learn how the reduction of awarded points depends on the level, refer to the help section.
Choose the difficulty level.`, "bk_level": "Level ", "bk_no_level": "You have selected an incorrect level. Press the corresponding button.", "bk_game_text": function(level, steps) { let text = ''; if (steps !== '') { text = `Your steps:
${steps}`; } let number = 3; if (level === 2) number = 4; if (level === 3) number = 5; return `Difficulty level: ${level} (number with ${number} characters).
${text}`; }, "bulls": "Bulls", "cows": "Cows", "bk_step": "step", "bk_number": "Number", "bk_error": function(n) { return `Error: you entered either a non-number or a number that does not consist of ${n} digits.`; }, "bk_gameing_text": function(n, sn, b, scores) { return `You found all the bulls in ${sn} steps! Congratulations!
Number: ${n}.
${b} points awarded, total: ${scores} points.`;
},
"reset_game": "Reset Game",
"reset_text": "Are you sure you want to permanently erase all your steps in the current game session?",
"reset_yes": function(bk_level) {
return `Game session of Level ${bk_level} has been reset.`;
},
"reset_no": `Reset canceled. Go to the "Games" section to continue playing.`,
"tamagotchi": "Tamagotchi",
"from": "from",
"tamagotchi_params": {
health: "Health",
satiety: "Satiety",
happiness: "Happiness",
energy: "Energy",
cleanliness: "Cleanliness",
age: "Age",
power: "power",
xp: "Experience",
inventory: "Inventory"
},
"tamagotchi_stats": function(tamagotchi, action_changes) {
if (tamagotchi && Object.keys(tamagotchi).length === 0) return `Unfortunately, you don't have a tamagotchi yet... Create one by entering a name!`;
let exclude_params = ["name", "lastAgeUpdate", "sleap_time", "sleepEnergy", "message_id"];
let data = `<a href="https://telegra.ph/The-game-Tamogochi-in-viz-mg-bot-04-28">About the game</a>.
Your tamagotchi named ${tamagotchi.name}`; for (let key in tamagotchi) { if (exclude_params.indexOf(key) > -1) continue; let action_change = ''; if (typeof action_changes !== 'undefined' && typeof action_changes[key] !== 'undefined') action_change = `(${action_changes[key]})`; data += `${this.tamagotchi_params[key]}: ${tamagotchi[key]}${action_change}`; } data +=`
Choose an action...`;
return data;
},
tamagotchi_sleeping: function(tamagotchi) {
const sleepTime = new Date(tamagotchi.sleap_time);
const now = new Date();
const sleepDuration = (now.getTime() - sleepTime.getTime()) / (1000 * 60); // in minutes
const remainingSleep = Math.max(100 - sleepDuration, 0); // remaining sleep time in minutes

return `Tamagotchi fell asleep at ${sleepTime.toLocaleTimeString()} and will sleep for another ${remainingSleep.toFixed(1)} minutes.
Currently at ${tamagotchi.energy}% energy.
After reaching 100% energy, it will wake up, and you can play with it again.`;
},
"t_game": "Play",
"t_feed": "Feed",
"t_heal": "Heal",
"t_wash": "Wash",
"t_sleep": "Sleep",

"t_shop": "Shop",
"t_shop_text": `Product - cost: description
Energetic_100, Energetic_50, Energetic_20 - 100, 50 or 20 points: restores Tamagotchi energy by 100%, 50% or 20%, but not more than 100%. Activation 1 time, after which the product is removed from the inventory, but you can buy several.
elixir_100, elixir_50, elixir_20 - 100, 50 or 20 points: restores Tamagotchi health by 100%, 50% or 20%, but not more than 100%. Activation 1 time, after which the product is removed from the inventory, but you can buy several.`,
"energetic": "Energetic",
"elixir": "Elixir",
"t_shop_buy": "Your Tamagotchi's inventory now includes",
"not_tamagotchi": "You don't have a Tamagotchi.",
"not_in_inv": "The item is not in your inventory.",
"buy_no_scores": "Insufficient points to make a purchase.",
"product_applied": "applied.",
"inventory": "Inventory",
"not_inventory": "There are no items in the inventory.",
"inventory_select": "Select what you want to spend from the inventory.",
"product_not_found": "Product not found.",
"t_shop_elements": ["Energetic_100", "Energetic_50", "Energetic_20", "elixir_100", "elixir_50", "elixir_20"],
"t_shop_prices": [100, 50, 20, 100, 50, 20],

"t_workout": "Training",
"t_workout_text": "An opponent with equal characteristics was generated for your Tamagotchi. Total: 5 mutual blows...",
"t_workout_experience": "Experience",

"t_ring": "Ring",
"t_ring_with_params": "Ring with parameters:",
"t_ring_scores": "Specify the bet in points.",
"t_ring_no_scores": "There are not enough points for the bet. Cancel the action and try again.",
"t_ring_auto_on": "On auto mode",
"t_ring_auto_off": "Off auto mode",
"t_ring_auto_true": "Automatic ring participation mode is enabled",
"t_ring_auto_false": "Automatic ring participation mode is disabled.",
"t_ring_text": `Select an active ring or create a new one.
<b>Warning: pay attention to the power of the opponent (the health spent for 1 successful hit depends on it)</b>.
The probability of a successful strike or successful defense depends on the energy, satiety, strength and experience of your tamagotchi.

Data structure in buttons:
Power Number_balls Health Experience Amount_points`,
"blow": "blow",
"blows": "blows",
"create_ring": "🆕",
"t_ring_created": "The ring is created!",
"t_ring_active": "The ring is active: gathered 2 participants. Choose another one.",
"t_ring_no_power": "The power of your tamagotchi differs by more than 2 units from the power of the ring creator or exceeds the power of the ring creator.",
"t_ring_small_health": "Your Tamagotchi has health <= 10. Come back later when there's more of it.",
"t_ring_sleep": "Tamagotchi is sleeping. You can't join the rings.",
"t_ring_joined": "You have joined the ring.",
"t_ring_you": "You",
"t_ring_opponent": "Opponent",
"t_ring_creator": "You are the creator of this ring. You can delete it. <b>Important: clicking on the button activates an irreversible operation.</b>",
"t_ring_hit": "Hit",
"t_ring_no_hit": "You can't hit: it's your opponent's turn",
"t_ring_failure": "You couldn't hit the opponent: he defended himself.",
"t_ring_hit_ok": "You successfully hit the opponent, and reduced his health on ",
"t_ring_critical_strike": "Critical strike! Your tamagotchi inflicted significant damage to the enemy, reducing health by ",
"t_ring_opponent_crytical_hit": "A critical hit against your Tamagotchi passed, reducing his health by ",
"your_health": "The health of your Tamagotchi",
"opponent_health": "The health of the opponent's tamagotchi",
"t_ring_opponent_no_hit": "The opponent could not strike hit your tamagotchi!",
"t_ring_opponent_yes_hit": "The opponent hit your tamagotchi, reducing health by",
"t_ring_winner": "Congratulations! Your Tamagotchi has won in the ring! Points awarded +",
"t_ring_not_winner": "Your Tamagotchi unfortunately lost. Try your hand in other rounds: maybe then you will come across a less experienced opponent.",
"t_ring_delete": "Remove the ring",
"t_ring_deleted": "The ring is removed ...",
"t_ring_returned": "Bets are refunded.",
"t_ring_forgotten": "Forgotten",
"t_ring_forgotten_text": `Select the ring you forgot. Forgotten rings - rings where opponents are waiting for your strike. Tapping automatically activates the kick.
Data structure in buttons:
Power number_strikes Experience Amount_points`,

"tamagotchi_action": "action",
"tamagotchi_not_wants": "Tamagotchi doesn't want to",
"tm_with_actions": {
"t_game": "play",
"t_feed": "eat",
"t_heal": "heal",
"t_wash": "wash",
"t_sleep": "sleep",
},
"tm_ok_actions": {
"t_game": "played",
"t_feed": "ate",
"t_heal": "healed",
"t_wash": "washed",
"t_sleep": "is sleeping",
},
"tamagotchi_ok": "Tamagotchi is happy that",
"tamagotchi_set_name": "A tamagotchi named",
"tamagotchi_died": "Unfortunately, your tamagotchi has died... Create a new one...",

"yes": "Yes",
"no": "No",

"back": "Back",
"cancel": "Cancel",
"to_game": "Go to Game",
"partners": "Bot Partners",
"partners_text": `1. @viz_dice_bot and @viz_quiz_bot from @viz_cx;
2. @viz_social_bot.`,
"check_subscribes": "Check Subscription",
"checking_subscribes": "To use the bot, you need to subscribe to the @blind_dev channel. Once you have done that, click the subscription check button.",

"buy_viz": "buy VIZ",
"no_buy_viz": "First add the Viz login to the bot.",
"small_buy_viz": "The price is less than the minimum in $ ",
"buy_viz_text": "Specify the amount in $ that you are ready to buy VIZ",
"buy_viz_select": "Выберите способ оплаты. Ссылки на оплату также даны:",
"bought_viz": "You bought",
"buy_viz_to": "on account",

"news": "News",
"help": "Help",
"help_text": `To get started, simply select one of the menu items.
If you don't see the buttons, enter /start or click on "Show Bot Keyboard".
If you have any questions or issues, contact @dpos_space or @denis_skripnik.
About levels:
They are designed to increase competitiveness in games and foster competition among players.
Formula:
score = Math.min(Math.max(0, Math.floor(score * Math.pow(0.95, level) * 100) / 100), maxScore);
In simple terms, to calculate the number of points you will earn at the second level with a maximum score of 50 and awarded points of 35, you need to multiply the awarded points (35) by 0.95 raised to the power of 2 (resulting in 31.58).
Then round the result to two decimal places and make sure it does not exceed the maximum score (50).
<a href="https://telegra.ph/The-game-Tamogochi-in-viz-mg-bot-04-28">About Tamagotchi</a>
P.S. Ideas for new games posted in the chat that turn out to be valuable will be rewarded.`
}