module.exports.help = () => {
    return `Привет, я бот, который наблюдает за валидаторами. 
    
/watchall - Включает/выключает сообщения обо всех валидаторах, включено если список валидаторов пуст
/list - список выбранных валидаторов.

Введите имя аккаунта валидатора с плюсом впереди (например, +login), что бы отслеживать активность адресно;
Введите с минусом, чтоб удалить (например, -login).
`;
}

module.exports.watchall_switch = (chat) => {
    if(chat.watchall) {
        return `Слежу за всеми валидаторами`;
    } else  {
        return `Слежу только за выбранными валидаторами`;
    }
}

module.exports.get_text_blocks = (missed) => {
    if(missed > 20) {
        missed = missed % 10;
    }

    if(missed == 1 ) {
        return "блок";
    } else if(missed >= 2 && missed <= 4) {
        return "блока";
    } else {
        return "блоков";
    }
}