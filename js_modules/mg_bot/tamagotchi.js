const helpers = require(process.cwd() + "/js_modules/helpers");

module.exports = {
    getActions: function (tamagotchi) {
        const actions = [];
        if (tamagotchi.sleap_time > 0) return actions;
        if (tamagotchi.energy <= 20) {
          actions.push("t_sleap"); // Тамагочи устал, нужно спать
        }
        if (tamagotchi.energy === 0) return actions;
        if (tamagotchi.satiety <= 99) {
          actions.push("t_feed"); // Тамагочи голоден, нужно кормить
        }
        if (tamagotchi.cleanliness <= 50) {
          actions.push("t_wash"); // Тамагочи грязен, нужно мыть
        }
        if (tamagotchi.happiness <= 50) {
          actions.push("t_game"); // Тамагочи грустит, нужно играть
        }
        if (tamagotchi.health < 100) {
          actions.push("t_heal"); // Тамагочи болен, нужно лечить
        }

        return actions;
      },

      
      updateTamagotchi: async function (tamagotchi) {
        const newTamagotchi = { ...tamagotchi };
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset() * 60 * 1000;
const localNow = new Date(now.getTime() - timezoneOffset);
        if (newTamagotchi.energy < 100 && newTamagotchi.sleap_time > 0) {
          const currentTime = now.getTime(); // Время, когда сделан запрос
          const timeDifferenceMinutes = Math.floor((currentTime - newTamagotchi.sleap_time) / (1000 * 60)); // Разница в минутах между текущим временем и временем, когда тамагочи ушел спать
          const energyIncreasePercentage = Math.min(timeDifferenceMinutes, 100); // Ограничиваем до 100%, чтобы не превышать максимальное значение энергии
          
          // Прибавление процента энергии
          const energyIncrease = Math.ceil((100 - newTamagotchi.sleepEnergy) * energyIncreasePercentage / 100); // Округляем вверх, чтобы избежать проблем с округлением
          newTamagotchi.energy = Math.min(newTamagotchi.sleepEnergy + energyIncrease, 100); // Прибавляем процент энергии, но не превышаем максимальное значение
}
          if (newTamagotchi.energy === 100 && newTamagotchi.sleap_time > 0) {
            newTamagotchi.sleap_time = 0;
            delete newTamagotchi.sleepEnergy;
          }

          const midnight = new Date();
          midnight.setHours(0, 0, 0, 0);
          const lastMidnightTimestamp = midnight.getTime();
          if (!newTamagotchi.lastAgeUpdate || newTamagotchi.lastAgeUpdate < lastMidnightTimestamp) {
  const dayDiff = Math.floor((lastMidnightTimestamp - newTamagotchi.lastAgeUpdate) / (24 * 60 * 60 * 1000));

  if (dayDiff > 0) {
    newTamagotchi.age -= dayDiff;
    if (newTamagotchi.age < 0) {
      newTamagotchi.age = 0;
    }
  }

  newTamagotchi.age++;
  newTamagotchi.lastAgeUpdate = now.getTime();
}

newTamagotchi.satiety -= await helpers.getRandomInRange(1, 10);
        newTamagotchi.happiness += await helpers.getRandomInRange(-20, 1);
        newTamagotchi.health -= await helpers.getRandomInRange(0, 2);
        newTamagotchi.cleanliness -= await helpers.getRandomInRange(0, 5);
      
        if (newTamagotchi.satiety > 100) {
          newTamagotchi.satiety = 100;
        }
        if (newTamagotchi.happiness < 0) {
          newTamagotchi.happiness = 0;
        }
        if (newTamagotchi.health < 0) {
          newTamagotchi.health = 0;
        }
        if (newTamagotchi.cleanliness > 100) {
          newTamagotchi.cleanliness = 100;
        }
      
        if (newTamagotchi.age >= 15) {
          newTamagotchi.health -= await helpers.getRandomInRange(1, 3);
        }
      
        if (newTamagotchi.cleanliness >= 90 && newTamagotchi.happiness >= 90) {
          newTamagotchi.health += await helpers.getRandomInRange(1, 2);
        }

        if (newTamagotchi.health > 100) {
          newTamagotchi.health = 100;
        }
        
        return newTamagotchi;
      },
      
      performAction: function (action, tamagotchi, level) {
        if (tamagotchi.health <= 0) {
          return false; // Тамагочи мертв, ничего нельзя сделать
        }
        const changes = {};
        let params = tamagotchi;
      
        switch (action) {
          case 't_game':
            if (params.energy >= 10 && params.satiety >= 10) {
              const cleanlinessDecrease = Math.min(params.cleanliness, 5); // проверяем, что мы не уменьшаем чистоту больше, чем на 5
              params.cleanliness = Math.max(params.cleanliness - cleanlinessDecrease, 0);
              changes.cleanliness = `-${cleanlinessDecrease}`;
              const happinessIncrease = Math.min(100 - params.happiness, 10);
              changes.happiness = `+${happinessIncrease}`;
              params.happiness += happinessIncrease;
              const energyDecrease = Math.min(params.energy, 5);
              params.energy = Math.max(params.energy - energyDecrease, 0);
              changes.energy = `-${energyDecrease}`;
            } else {
              return {};
            }
            break;
            case 't_feed':
              if (params.satiety <= 99) {
                const satietyIncrease = Math.min(100 - params.satiety, 10); // проверяем, что мы не уменьшаем голод больше, чем на 10
                changes.satiety = `+${satietyIncrease}`;
                params.satiety += satietyIncrease;
                const happinessIncrease = Math.min(100 - params.happiness, 5);
                params.happiness += happinessIncrease;
                changes.happiness = `+${happinessIncrease}`;
                const cleanlinessDecrease = Math.min(params.cleanliness, 5); // проверяем, что мы не уменьшаем чистоту больше, чем на 5
                params.cleanliness = Math.max(params.cleanliness - cleanlinessDecrease, 0);
                changes.cleanliness = `-${cleanlinessDecrease}`;
                const energyDecrease = Math.min(params.energy, 5);
                params.energy = Math.max(params.energy - energyDecrease, 0);
                changes.energy = `-${energyDecrease}`;
              } else {
                return {};
              }
              break;
          case 't_heal':
            if (params.health < 100) {
              const healthIncrease = Math.min(100 - params.health, 10); // проверяем, что мы не увеличиваем здоровье больше, чем на 10
              changes.health = `+${healthIncrease}`;
              params.health = Math.min(params.health + healthIncrease, 100);
              const energyDecrease = Math.min(params.energy, 5);
              params.energy = Math.max(params.energy - energyDecrease, 0);
              changes.energy = `-${energyDecrease}`;
            } else {
              return {};
            }
            break;
          case 't_wash':
            if (params.cleanliness <= 90) {
              const cleanlinessIncrease = Math.min(100 - params.cleanliness, 10); // проверяем, что мы не увеличиваем чистоту больше, чем на 10
              changes.cleanliness = `+${cleanlinessIncrease}`;
              params.cleanliness += cleanlinessIncrease;
              const happinessIncrease = Math.min(100 - params.happiness, 5);
              changes.happiness = `+${happinessIncrease}`;
              params.happiness += happinessIncrease;
              const energyDecrease = Math.min(params.energy, 5);
              params.energy = Math.max(params.energy - energyDecrease, 0);
              changes.energy = `-${energyDecrease}`;
            } else {
              return {};
            }
            break;
          case 't_sleap':
            if (params.energy < 100) {
              params.sleepEnergy = params.energy; // Сохраняем текущее значение энергии тамагочи перед сном
              params.sleap_time = new Date().getTime();
            } else {
              return {};
            }
            break;
          default:
            return {};
        }

        let positiveChanges = Object.values(changes).filter(val => parseInt(val) > 0); // выбираем только положительные изменения
        let max_score = ((positiveChanges.reduce((sum, val) => sum + parseInt(val), 0) + params.age) / 10); // добавляем баллы за возраст и положительные изменения
        let score = Math.round((positiveChanges.reduce((sum, val) => sum + parseInt(val), 0) + params.age) / 10); // вычисляем баллы
               const plus_score = Math.min(Math.max(0, Math.floor(score* Math.pow(0.95, level) * 100) / 100), max_score);
        return { changes, params, plus_score };
      },

      performAttack: function (t1, t2) {
        if (t1.health <= 0) {
          return { target: t2, status: 0, damage: 0 };
        }
      
        if (!t1.power || typeof t1.power ==='undefined') t1.power = 0;
      
        // Рассчитываем силу атаки и силу защиты
        const attackStrength = t1.energy / 100 + t1.satiety / 100 + t1.power / 100;
        const defenseStrength = t2.energy / 100 + t2.satiety / 100 + t2.power / 100;
      
        // Рассчитываем вероятность успешного нанесения удара после защиты
        let successProbability;
        if (attackStrength === defenseStrength) {
          successProbability = 0.5;
        } else {
          successProbability = 0.5 + 0.25 * (attackStrength / defenseStrength);
        }
      
        // Генерируем случайное число от 0 до 1 для атаки и вероятности критического удара
        const randomValue = Math.random();
        const criticalChance = 0.1; // 10% вероятности критического удара
      
        // Проверяем, успешно ли удар от t1 к t2
        let status = 1;
        if (randomValue <= successProbability) {
if(t1.power === 0) t1.power = 1;

          const maxDamage = 20; // Максимальное значение урона
          const powerMultiplier = maxDamage / 20; // Множитель, определяющий урон от силы
      
          // Рассчитываем урон в зависимости от силы t1, но не более maxDamage
          let damage = Math.min(maxDamage, Math.floor(t1.power * powerMultiplier));

          // Проверяем, произошел ли критический удар
          if (Math.random() <= criticalChance) {
            // Увеличиваем урон в 1.5 раза при критическом ударе
            damage = Math.floor(damage * 1.5);
            status = 2;
          }
      
          // Уменьшаем здоровье t2 на значение урона
          const changedHealth = Math.max(t2.health - damage, 10);
          const minusHealth = t2.health - changedHealth;
          t2.health = changedHealth;
      
          return { target: t2, status, damage: minusHealth };
        }
      
        return { target: t2, status: 0, damage: 0 };
      }

};