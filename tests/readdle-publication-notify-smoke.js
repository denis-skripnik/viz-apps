const assert = require('assert');

function oldCondition(data) {
  return Boolean(data.t && data.t === 'p' && !data.d.r && !data.d.s && data.d.d);
}

function fixedCondition(data) {
  return Boolean(data.t && data.t === 'p' && !data.d.r && !data.d.s && (data.d.m || data.d.d));
}

function fixedBuildPublicationText(login, bn, data, lng) {
  let text = '';
  if (fixedCondition(data)) {
    let publicationBody = data.d.m || data.d.d;
    publicationBody = publicationBody.replace(/<\/?[^>]+(>|$)/g, '');
    text = `<a href="https://readdle.me/#viz://@${login}/${bn}/publication/">${lng.type_publication}</a> ${lng.from} ${login}.\n${lng.publication_title}: ${data.d.t}\n\n${lng.announcement}:\n${publicationBody.slice(0, 3000)}`;
  }
  return text;
}

const lng = {
  type_publication: 'Publication',
  from: 'from',
  publication_title: 'Title',
  announcement: 'Announcement'
};

const currentVoicePublication = {
  t: 'p',
  d: {
    t: 'Как сделать авторизацию аккаунтов VIZ безопаснее и можно ли прийти к входу через Web2-сервисы',
    m: '## Зачем вообще об этом думать\n\nТело публикации из Voice protocol.'
  }
};

assert.strictEqual(oldCondition(currentVoicePublication), false);
assert.strictEqual(fixedCondition(currentVoicePublication), true);
const fixedText = fixedBuildPublicationText('social.denis-skripnik', 81974432, currentVoicePublication, lng);
assert.ok(fixedText.length > 0);
assert.ok(fixedText.includes('/81974432/publication/'));
assert.ok(fixedText.includes(currentVoicePublication.d.t));
assert.ok(fixedText.includes('## Зачем вообще'));
assert.ok(fixedText.length <= 4096);

const legacyAnnouncementPublication = {
  t: 'p',
  d: { t: 'Old style title', d: 'Old style announcement' }
};
assert.strictEqual(fixedCondition(legacyAnnouncementPublication), true);
assert.ok(fixedBuildPublicationText('author', 1, legacyAnnouncementPublication, lng).includes('Old style announcement'));

console.log('readdle_publication_notify_smoke_ok');
