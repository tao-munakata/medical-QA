import './styles.css';

const STORAGE_KEY = 'nyanta-medical-v06-draft';

const questions = [
  {
    id: 'name',
    label: '氏名',
    type: 'text',
    required: true,
    hint: '診療時に確認できるお名前を入力してください。'
  },
  {
    id: 'age',
    label: '年齢',
    type: 'number',
    required: true,
    suffix: '歳',
    inputMode: 'numeric',
    min: 0,
    max: 120,
    presets: ['0', '1', '2', '3', '4', '5', '10', '20', '30', '40', '50', '60', '70', '80', '90']
  },
  {
    id: 'sex',
    label: '性別',
    type: 'radio',
    required: false,
    options: ['女性', '男性', '回答しない']
  },
  {
    id: 'visit-purpose',
    label: '今日はどんなことで相談したいですか？',
    type: 'checkbox',
    required: true,
    options: ['発熱', 'せき・のど', '腹痛', '頭痛', 'けが', '薬の相談', 'その他']
  },
  {
    id: 'onset',
    label: '症状はいつからありますか？',
    type: 'radio',
    required: true,
    options: ['今日から', '昨日から', '2〜3日前から', '1週間以上前から', '覚えていない']
  },
  {
    id: 'symptom-detail',
    label: '症状を具体的に教えてください',
    type: 'textarea',
    required: true,
    hint: 'いつから、どのくらい、何をすると悪くなるかを書いてください。'
  },
  {
    id: 'severity',
    label: 'つらさはどのくらいですか？',
    type: 'radio',
    required: true,
    options: ['軽い', 'ふつう', '強い', 'とても強い']
  },
  {
    id: 'temperature',
    label: '体温',
    type: 'number',
    required: false,
    suffix: '度',
    inputMode: 'decimal',
    min: 34,
    max: 43,
    presets: ['36.0', '36.5', '37.0', '37.5', '38.0', '38.5', '39.0', '39.5', '40.0']
  },
  {
    id: 'fever-duration',
    label: '発熱がある場合、どのくらい続いていますか？',
    type: 'radio',
    required: false,
    options: ['ない', '半日以内', '1日', '2〜3日', '4日以上']
  },
  {
    id: 'cough',
    label: 'せきはありますか？',
    type: 'radio',
    required: true,
    options: ['ない', '少しある', '強い', '息苦しい']
  },
  {
    id: 'sore-throat',
    label: 'のどの痛みはありますか？',
    type: 'radio',
    required: true,
    options: ['ない', '少しある', '強い', '飲み込みにくい']
  },
  {
    id: 'breathing',
    label: '息苦しさや胸の痛みはありますか？',
    type: 'radio',
    required: true,
    options: ['ない', '少しある', '強い', '今すぐ相談したい']
  },
  {
    id: 'digestive',
    label: '吐き気・下痢・腹痛はありますか？',
    type: 'checkbox',
    required: false,
    options: ['吐き気', '嘔吐', '下痢', '腹痛', '食欲がない', 'ない']
  },
  {
    id: 'injury',
    label: 'けがや痛みがある場所はありますか？',
    type: 'checkbox',
    required: false,
    options: ['頭', '首・肩', '胸', 'お腹', '腰', '手足', 'ない']
  },
  {
    id: 'pregnancy',
    label: '妊娠中または妊娠の可能性はありますか？',
    type: 'radio',
    required: false,
    options: ['ない', 'ある', '可能性がある', '回答しない']
  },
  {
    id: 'medical-history',
    label: '治療中の病気はありますか？',
    type: 'checkbox',
    required: false,
    options: ['高血圧', '糖尿病', '喘息', '心臓病', '腎臓病', 'その他', 'ない']
  },
  {
    id: 'hospitalized',
    label: '最近、入院や手術をしましたか？',
    type: 'radio',
    required: false,
    options: ['していない', '1か月以内にした', '半年以内にした', '覚えていない']
  },
  {
    id: 'infection-contact',
    label: '周囲に感染症の方はいますか？',
    type: 'radio',
    required: true,
    options: ['いない', 'いる', 'わからない']
  },
  {
    id: 'allergy',
    label: '薬や食べ物のアレルギーはありますか？',
    type: 'radio',
    required: true,
    options: ['ない', 'ある', 'わからない']
  },
  {
    id: 'medicine',
    label: '現在飲んでいる薬はありますか？',
    type: 'radioText',
    required: true,
    options: ['ない', 'ある']
  },
  {
    id: 'medicine-detail',
    label: '薬の名前や量がわかれば入力してください',
    type: 'textarea',
    required: false
  },
  {
    id: 'pharmacy',
    label: '薬局やお薬手帳で確認できますか？',
    type: 'radio',
    required: false,
    options: ['確認できる', '確認できない', 'わからない']
  },
  {
    id: 'visit-time',
    label: '診療を希望する時間帯',
    type: 'radio',
    required: true,
    options: ['できるだけ早く', '午前', '午後', '夕方以降', '相談して決めたい']
  },
  {
    id: 'doctor-note',
    label: '医師に必ず伝えたいこと',
    type: 'textarea',
    required: false,
    hint: '不安なこと、聞きたいこと、配慮してほしいことを書けます。'
  },
  {
    id: 'privacy',
    label: '個人情報の取り扱いと医師への共有に同意します',
    type: 'consent',
    required: true
  }
];

const initialDraft = readDraft();
let state = {
  currentIndex: 0,
  answers: initialDraft.answers ?? {},
  touched: {},
  savedAt: initialDraft.savedAt ?? null,
  reviewing: false,
  returnToReview: false,
  submitted: false
};

const app = document.querySelector('#app');

function readDraft() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function saveDraft() {
  state.savedAt = new Date().toISOString();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ answers: state.answers, savedAt: state.savedAt })
  );
  updateSaveState();
}

function setAnswer(id, value, options = {}) {
  state.answers[id] = value;
  state.touched[id] = true;
  saveDraft();
  if (options.render !== false) {
    render();
  }
}

function updateSaveState() {
  const saveState = document.querySelector('.save-state');
  if (!saveState) return;
  saveState.textContent = state.savedAt
    ? `自動保存済み ${formatSavedAt(state.savedAt)}`
    : '入力すると自動保存されます';
}

function validateQuestion(question) {
  if (shouldSkipQuestion(question)) return '';
  const value = state.answers[question.id];
  if (question.required) {
    if (question.type === 'checkbox' && (!Array.isArray(value) || value.length === 0)) {
      return '1つ以上選んでください。';
    }
    if (question.type === 'consent' && value !== true) {
      return '同意が必要です。';
    }
    if (value === undefined || value === null || value === '') {
      return `${question.label}を入力してください。`;
    }
  }
  if (question.type === 'number' && value !== undefined && value !== '') {
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) return `${question.label}は数字で入力してください。`;
    if (question.min !== undefined && numberValue < question.min) {
      return `${question.label}は${question.min}以上で入力してください。`;
    }
    if (question.max !== undefined && numberValue > question.max) {
      return `${question.label}は${question.max}以下で入力してください。`;
    }
  }
  return '';
}

function currentQuestion() {
  return questions[state.currentIndex];
}

function shouldSkipQuestion(question) {
  return question.id === 'medicine-detail' && state.answers.medicine === 'ない';
}

function nextQuestionIndex(fromIndex) {
  let index = Math.min(fromIndex + 1, questions.length - 1);
  while (index < questions.length - 1 && shouldSkipQuestion(questions[index])) {
    index += 1;
  }
  return index;
}

function previousQuestionIndex(fromIndex) {
  let index = Math.max(fromIndex - 1, 0);
  while (index > 0 && shouldSkipQuestion(questions[index])) {
    index -= 1;
  }
  return index;
}

function visibleQuestions() {
  return questions.filter((question) => !shouldSkipQuestion(question));
}

function goNext() {
  const question = currentQuestion();
  state.touched[question.id] = true;
  const error = validateQuestion(question);
  if (error) {
    render();
    requestAnimationFrame(() => {
      document.querySelector(`#field-${question.id}`)?.scrollIntoView({ block: 'center' });
      document.querySelector(`[name="${question.id}"], #${question.id}`)?.focus();
    });
    return;
  }
  if (state.returnToReview) {
    state.returnToReview = false;
    state.reviewing = true;
    render();
    return;
  }
  state.currentIndex = nextQuestionIndex(state.currentIndex);
  state.reviewing = false;
  render();
}

function goBack() {
  state.returnToReview = false;
  state.reviewing = false;
  state.currentIndex = previousQuestionIndex(state.currentIndex);
  render();
}

function reviewAnswers() {
  const errors = visibleQuestions().map((question) => [question, validateQuestion(question)]);
  const firstError = errors.find(([, error]) => error);
  state.touched = Object.fromEntries(visibleQuestions().map((question) => [question.id, true]));
  if (firstError) {
    state.currentIndex = questions.indexOf(firstError[0]);
    state.reviewing = false;
    render();
    return;
  }
  state.reviewing = true;
  render();
}

function submit() {
  state.submitted = true;
  state.reviewing = false;
  state.returnToReview = false;
  localStorage.removeItem(STORAGE_KEY);
  render();
}

function progressPercent() {
  return Math.round(((state.currentIndex + 1) / questions.length) * 100);
}

function render() {
  if (state.submitted) {
    app.innerHTML = `
      <main class="shell" tabindex="-1">
        <section class="complete" aria-labelledby="complete-title">
          <p class="eyebrow">nyanta-medical 問診票 v0.6</p>
          <h1 id="complete-title">送信前の確認が完了しました</h1>
          <p>回答内容を医師に共有できます。CSV保存や確認画面に進む前に、内容をもう一度見直せます。</p>
          <button class="primary-button" type="button" id="restart">新しく入力する</button>
        </section>
      </main>
    `;
    document.querySelector('#restart').addEventListener('click', () => {
      state = { currentIndex: 0, answers: {}, touched: {}, savedAt: null, reviewing: false, returnToReview: false, submitted: false };
      render();
    });
    return;
  }

  if (state.reviewing) {
    app.innerHTML = `
      <main class="shell">
        <header class="page-header">
          <div>
            <p class="eyebrow">nyanta-medical 問診票 v0.6</p>
            <h1>回答内容の確認</h1>
          </div>
        </header>

        <section class="review-panel" aria-labelledby="review-title">
          <h2 id="review-title">送信前に内容を確認してください</h2>
          <dl class="answer-list">
            ${visibleQuestions().map((question) => `
              <div class="answer-item">
                <dt>${question.label}</dt>
                <dd>${answerText(question)}</dd>
                <button class="link-button" type="button" data-edit-index="${questions.indexOf(question)}">修正</button>
              </div>
            `).join('')}
          </dl>
          <div class="actions">
            <button class="secondary-button" type="button" id="review-back">入力に戻る</button>
            <button class="primary-button" type="button" id="final-submit">完了する</button>
          </div>
        </section>
      </main>
    `;
    document.querySelector('#review-back').addEventListener('click', () => {
      state.reviewing = false;
      render();
    });
    document.querySelector('#final-submit').addEventListener('click', submit);
    document.querySelectorAll('[data-edit-index]').forEach((button) => {
      button.addEventListener('click', () => {
        state.currentIndex = Number(button.dataset.editIndex);
        state.reviewing = false;
        state.returnToReview = true;
        render();
      });
    });
    return;
  }

  const question = currentQuestion();
  const error = state.touched[question.id] ? validateQuestion(question) : '';
  const remaining = questions.length - state.currentIndex;
  app.innerHTML = `
    <main class="shell">
      <header class="page-header">
        <div>
          <p class="eyebrow">nyanta-medical 問診票 v0.6</p>
          <h1>おうち診療の問診票</h1>
        </div>
        <a class="edit-link" href="https://manualine.tech/nyanta/medical/edit">質問を変える</a>
      </header>

      <section class="status" aria-label="入力状況">
        <div class="progress-row">
          <span>あと${remaining}問</span>
          <span>${state.currentIndex + 1} / ${questions.length}</span>
        </div>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="width: ${progressPercent()}%"></div>
        </div>
        <p class="save-state" aria-live="polite">${state.savedAt ? `自動保存済み ${formatSavedAt(state.savedAt)}` : '入力すると自動保存されます'}</p>
      </section>

      <form class="question-form" novalidate>
        ${renderField(question, error)}
        <div class="actions">
          <button class="secondary-button" type="button" id="back" ${state.currentIndex === 0 ? 'disabled' : ''}>戻る</button>
          ${
            state.currentIndex === questions.length - 1
              ? `<button class="primary-button" type="button" id="submit">${state.returnToReview ? '確認に戻る' : '確認する'}</button>`
              : `<button class="primary-button" type="button" id="next">${state.returnToReview ? '確認に戻る' : '次へ'}</button>`
          }
        </div>
      </form>
    </main>
  `;

  bindField(question);
  document.querySelector('#back').addEventListener('click', goBack);
  document.querySelector('#next')?.addEventListener('click', goNext);
  document.querySelector('#submit')?.addEventListener('click', reviewAnswers);
}

function renderField(question, error) {
  const describedBy = [
    question.hint ? `${question.id}-hint` : '',
    error ? `${question.id}-error` : ''
  ].filter(Boolean).join(' ');
  const invalid = error ? 'true' : 'false';

  if (question.type === 'textarea') {
    return `
      <div class="field" id="field-${question.id}">
        <label class="field-label" for="${question.id}">${requiredMark(question)}${question.label}</label>
        ${renderHint(question)}
        <textarea id="${question.id}" name="${question.id}" rows="7" aria-invalid="${invalid}" aria-describedby="${describedBy}">${state.answers[question.id] ?? ''}</textarea>
        ${renderError(question, error)}
      </div>
    `;
  }

  if (question.type === 'text') {
    return `
      <div class="field" id="field-${question.id}">
        <label class="field-label" for="${question.id}">${requiredMark(question)}${question.label}</label>
        ${renderHint(question)}
        <input id="${question.id}" name="${question.id}" type="text" value="${state.answers[question.id] ?? ''}" aria-invalid="${invalid}" aria-describedby="${describedBy}" autocomplete="off" />
        ${renderError(question, error)}
      </div>
    `;
  }

  if (question.type === 'number') {
    const numberValue = state.answers[question.id] ?? '';
    return `
      <div class="field" id="field-${question.id}">
        <label class="field-label" for="${question.id}">${requiredMark(question)}${question.label}</label>
        ${question.presets ? `
          <label class="sub-label" for="${question.id}-preset">候補から選ぶ</label>
          <select id="${question.id}-preset" class="number-preset" aria-label="${question.label}を候補から選ぶ">
            <option value="">選択してください</option>
            ${question.presets.map((preset) => `
              <option value="${preset}" ${String(numberValue) === preset ? 'selected' : ''}>${preset}${question.suffix}</option>
            `).join('')}
          </select>
          <label class="sub-label" for="${question.id}">数字で入力する</label>
        ` : ''}
        <div class="input-with-suffix">
          <input id="${question.id}" name="${question.id}" type="number" inputmode="${question.inputMode}" min="${question.min}" max="${question.max}" value="${numberValue}" aria-invalid="${invalid}" aria-describedby="${describedBy}" />
          <span aria-hidden="true">${question.suffix}</span>
        </div>
        ${renderError(question, error)}
      </div>
    `;
  }

  if (question.type === 'checkbox') {
    const selected = state.answers[question.id] ?? [];
    return `
      <fieldset class="field" id="field-${question.id}" aria-describedby="${describedBy}">
        <legend class="field-label">${requiredMark(question)}${question.label}</legend>
        <div class="choice-grid">
          ${question.options.map((option) => `
            <label class="choice">
              <input type="checkbox" name="${question.id}" value="${option}" ${selected.includes(option) ? 'checked' : ''} aria-invalid="${invalid}" />
              <span>${option}</span>
            </label>
          `).join('')}
        </div>
        ${renderError(question, error)}
      </fieldset>
    `;
  }

  if (question.type === 'radio' || question.type === 'radioText') {
    const value = state.answers[question.id] ?? '';
    return `
      <fieldset class="field" id="field-${question.id}" aria-describedby="${describedBy}">
        <legend class="field-label">${requiredMark(question)}${question.label}</legend>
        <div class="choice-grid">
          ${question.options.map((option) => `
            <label class="choice">
              <input type="radio" name="${question.id}" value="${option}" ${value === option ? 'checked' : ''} aria-invalid="${invalid}" />
              <span>${option}</span>
            </label>
          `).join('')}
        </div>
        ${question.type === 'radioText' && value === 'ある' ? `
          <label class="sub-label" for="${question.id}-detail">薬の名前</label>
          <input id="${question.id}-detail" name="${question.id}-detail" value="${state.answers[`${question.id}-detail`] ?? ''}" />
        ` : ''}
        ${renderError(question, error)}
      </fieldset>
    `;
  }

  return `
    <div class="field consent" id="field-${question.id}">
      <label class="choice">
        <input id="${question.id}" type="checkbox" name="${question.id}" ${state.answers[question.id] ? 'checked' : ''} aria-invalid="${invalid}" aria-describedby="${describedBy}" />
        <span>${requiredMark(question)}${question.label}</span>
      </label>
      <p class="hint">回答は診療目的で利用し、送信前に確認できます。</p>
      ${renderError(question, error)}
    </div>
  `;
}

function bindField(question) {
  if (question.type === 'textarea' || question.type === 'number' || question.type === 'text') {
    document.querySelector(`#${question.id}`).addEventListener('input', (event) => {
      setAnswer(question.id, event.target.value, { render: false });
    });
  }

  if (question.type === 'number') {
    document.querySelector(`#${question.id}-preset`)?.addEventListener('change', (event) => {
      const input = document.querySelector(`#${question.id}`);
      input.value = event.target.value;
      setAnswer(question.id, event.target.value, { render: false });
      input.focus();
    });
  }

  if (question.type === 'checkbox') {
    document.querySelectorAll(`[name="${question.id}"]`).forEach((input) => {
      input.addEventListener('change', () => {
        const selected = [...document.querySelectorAll(`[name="${question.id}"]:checked`)].map((item) => item.value);
        setAnswer(question.id, selected);
      });
    });
  }

  if (question.type === 'radio' || question.type === 'radioText') {
    document.querySelectorAll(`[name="${question.id}"]`).forEach((input) => {
      input.addEventListener('change', (event) => setAnswer(question.id, event.target.value));
    });
    document.querySelector(`#${question.id}-detail`)?.addEventListener('input', (event) => {
      setAnswer(`${question.id}-detail`, event.target.value, { render: false });
    });
  }

  if (question.type === 'consent') {
    document.querySelector(`#${question.id}`).addEventListener('change', (event) => {
      setAnswer(question.id, event.target.checked);
    });
  }
}

function renderHint(question) {
  return question.hint ? `<p class="hint" id="${question.id}-hint">${question.hint}</p>` : '';
}

function renderError(question, error) {
  return error ? `<p class="error" id="${question.id}-error" role="alert">${error}</p>` : '';
}

function requiredMark(question) {
  return question.required ? '<span class="required" aria-label="必須">必須</span>' : '';
}

function formatSavedAt(value) {
  return new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(value));
}

function answerText(question) {
  const value = state.answers[question.id];
  if (question.type === 'consent') return value ? '同意済み' : '未同意';
  if (Array.isArray(value)) return value.length ? value.join('、') : '未入力';
  if (value === undefined || value === null || value === '') return '未入力';
  if (question.suffix) return `${value}${question.suffix}`;
  return String(value);
}

render();
