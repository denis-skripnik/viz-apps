function awardsLinks(to, energy, memo) {
    let viz_social_bot_params = Buffer.from(to + '|' + Math.ceil(energy) + '|0|' + memo, 'utf8').toString('base64');
    let links = `<a href="'https://t.me/viz_social_bot?start=1${viz_social_bot_params}">Viz social bot</a>, <a href="https://my.viz.plus/assets/award">my.viz.plus</a>, <a href="https://dpos.space/viz/awards/link/${to}/0/${memo}/${energy}">dpos.space</a>, <a href="https://viz.cx/award?receiver={to}&energy={energy}&memo=${memo}">viz.cx</a>, <a href="https://testflight.apple.com/join/G1VtJ0NA">IOS приложение</a>, <a href="https://play.google.com/store/apps/details?id=my.viz">Android приложение</a>.
`;
    return links;
}

module.exports = {
    "start": "Start",
    "home": "Home",
    "home_message": "Hello! This is @viz_mg_bot: a bot with Viz mini-games! Select it in the menu.",
    "lang": "Choose a language",
    "selected_language": "You have chosen the language: Russian.",
    "fortune_telling": "Fortune telling",
    "ft_text": "Gild the pen: I will tell your future. Just specify what you want to know, and I will answer: it will be or it won't be, yes or no.",
    "ft_message": "OK. Now choose whether you want to reward me for my work. If you do this, fortune-telling may be more accurate!",
    "ft_award": "Reward the fortune-teller",
    "ft_standart": "No reward",
    "ft_award_text": function(to, memo) {
    return `You chose the reward. Thank you.
    To begin with, I want to say that for the award you need a Viz account or the presence of Viz in @viz_social_bot.
    Click on one of the award links:
    ${awardsLinks(to, 2, memo)}.`;
    },
    "ft_type_text": "Tell me what you want me to tell fortunes?",
    "yes": [
        `The future holds for you an exceptionally positive set of circumstances. Everything will turn out so perfectly that you can't even imagine.
        However, obstacles and doubts may appear on the way to the desired.`,
        'The energy of the universe in this matter strives for harmony and stability. So, even if there are no visible prerequisites for this, everything will work out in the best way.',
        `Now is a very favorable period for a positive combination of circumstances. The universe does not prepare any obstacles for you.
        Such periods are also great for resolving misunderstandings and contradictions. And, if you have something like this in mind, then take advantage of the opportunity.`,
        'The future quite harmoniously puts events around you. Luck smiles on you and everything turns out. If you really want a successful resolution of this issue, then so be it.',
        `The universe is well disposed towards you and people trust you. In their eyes, the image of a reliable, mature person was formed. You are capable of a lot in life, and this is undoubtedly an exceptionally attractive moment for a favorable combination of circumstances.`,
        `It's definitely possible. Moreover, this future is very positive for you, because it brings calmness and stability. At the same time, it will add new colors to what is interesting and pleasant for you.`
        ],
        "no": [
        `It doesn't make sense to make any long-term forecasts here. The situation is so unpredictable that any little thing can turn it 180 degrees.
        Try to be prepared for any outcome.`,
        `Along with this question comes negative energy. Perhaps you yourself don't want this to happen, or related topics cause you a lot of negative emotions. Or maybe this path lies through conflicts and difficulties.`,
        `Now is an unfavorable time for the realization of such desires and it will be very difficult to achieve this.
        The stars advise you to wait and gain strength.`,
        'The outcome is unlikely. Even if you give it your all, circumstances will take you out of your comfort zone and provoke outbursts of emotional distress. Leave it alone or learn not to take failure to heart.',
        `The desired is unlikely to happen, but the efforts that you will spend on the implementation of your plans will make you wiser, more reasonable, more focused. This will certainly contribute to the disclosure of your personality. And all this, of course, will benefit you.`,
        `You shouldn't expect something extremely extraordinary. Some little things about what you want will certainly give you pleasure, but otherwise you may have difficulties. Especially carefully calculate all the elements of risk in this matter.`,
        ],
    "more": "inasmuch as I am an honest fortune-teller, saying that was used in divination",
    "block_hash": "the hash of the block",
    "text_hash": "Hash of the text",
    "number_types": "Number: 0 (no) or 1 (to be",
    "generated_number": "Dropped out",
    "and_hash": "and its hash",
    
    "back": "back",
    "cancel": "Cancel",
    "news": "News",
    "help": "Help",
    "help_text": `To start, just select one of the menu items.
    If the buttons are not visible, enter /start or click on "Show the bot keyboard".
    If you have any questions or problems, write to the chat @dpos_space or the personal @denis_skripnik
    P. S. Ideas of new games published in the chat that will be worthwhile will be rewarded.`
    }