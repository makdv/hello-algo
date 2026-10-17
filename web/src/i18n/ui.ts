import type { Locale } from './locale';

/** Interface text for the players, the Explore workbench, step figures and the School view. */
export interface UiText {
  watch: string;
  predict: string;
  explore: string;
  playerMode: string;
  codeLanguage: string;
  predictNext: string;
  showMe: string;
  correct: string;
  notQuite: string;
  score: string;
  prevStep: string;
  nextStep: string;
  play: string;
  pause: string;
  restart: string;
  step: string;
  stepAria: (n: number) => string;
  visualizerAria: (title: string) => string;
  backToBook: string;
  exploreMode: string;
  run: string;
  presets: { random: string; sorted: string; reversed: string; fewUnique: string };
  cells: string;
  bars: string;
  drawing: string;
  speed: string;
  steps: string;
  inputError: (max: number) => string;
  stats: Record<string, string>;
  kinds: Record<string, string>;
  loading: string;
  // School view
  school: {
    badge: string;
    stars: (n: number) => string;
    nightSky: string;
    sunnyDay: string;
    grownUp: string;
    level: (n: number) => string;
    algoSays: string;
    next: string;
    playAgain: string;
    goBack: string;
    guessToggle: string;
    rule: string;
    round: (k: number, n: number) => string;
    peek: string;
    hidePeek: string;
    small: string;
    big: string;
    whoosh: string;
    yes: string;
    goodTry: string;
    hubTitle: string;
    hubIntro: string;
    start: string;
    levels: string;
  };
}

const en: UiText = {
  watch: 'Watch',
  predict: 'Predict',
  explore: 'Explore',
  playerMode: 'Player mode',
  codeLanguage: 'Code language',
  predictNext: 'Predict the next step',
  showMe: 'Show me',
  correct: 'Correct.',
  notQuite: 'Not quite.',
  score: 'score',
  prevStep: 'Previous step',
  nextStep: 'Next step',
  play: 'Play',
  pause: 'Pause',
  restart: 'Restart',
  step: 'Step',
  stepAria: (n) => `Go to step ${n}`,
  visualizerAria: (t) => `${t} visualizer. Use the arrow keys to step.`,
  backToBook: 'Back to the book',
  exploreMode: 'explore mode',
  run: 'Run',
  presets: { random: 'Random', sorted: 'Sorted', reversed: 'Reversed', fewUnique: 'Few unique' },
  cells: 'Cells',
  bars: 'Bars',
  drawing: 'Drawing',
  speed: 'Speed',
  steps: 'Steps',
  inputError: (max) => `Enter 2 to ${max} whole numbers from 0 to 99, separated by commas.`,
  stats: { comparisons: 'comparisons', swaps: 'swaps', moves: 'moves', sorted: 'in place', checks: 'checks', found: 'found at' },
  kinds: {
    init: 'start', pass: 'pass', cmp: 'compare', swp: 'swap', fixed: 'fixed', end: 'done', min: 'new min', pick: 'pick',
    shift: 'shift', place: 'insert', partition: 'partition', pivot: 'pivot', split: 'split', take: 'take', merged: 'merged',
    mid: 'middle', found: 'found', missing: 'not found',
  },
  loading: 'Loading the visualizer…',
  school: {
    badge: 'school',
    stars: (n) => `Stars: ${n}`,
    nightSky: 'Night sky',
    sunnyDay: 'Sunny day',
    grownUp: 'Grown-up view',
    level: (n) => `Level ${n}`,
    algoSays: 'Algo says',
    next: 'Next!',
    playAgain: 'Play again',
    goBack: 'Go back',
    guessToggle: 'Let me guess each step',
    rule: 'The rule',
    round: (k, n) => `Round ${k} of ${n}`,
    peek: 'Peek at the real code',
    hidePeek: 'Hide the code',
    small: 'small',
    big: 'big',
    whoosh: 'Whoosh!',
    yes: 'Yes! You earned a star.',
    goodTry: 'Good try!',
    hubTitle: 'Algorithm school',
    hubIntro: 'Meet the bubbles and Algo the robot. Every level is a new way to put things in order or to find them.',
    start: 'Start',
    levels: 'Levels',
  },
};

const zh: UiText = {
  watch: '观看',
  predict: '预测',
  explore: '探索',
  playerMode: '播放模式',
  codeLanguage: '代码语言',
  predictNext: '预测下一步',
  showMe: '直接看答案',
  correct: '正确。',
  notQuite: '不太对。',
  score: '得分',
  prevStep: '上一步',
  nextStep: '下一步',
  play: '播放',
  pause: '暂停',
  restart: '重新开始',
  step: '步骤',
  stepAria: (n) => `跳到第 ${n} 步`,
  visualizerAria: (t) => `${t} 可视化。使用方向键逐步查看。`,
  backToBook: '返回正文',
  exploreMode: '探索模式',
  run: '运行',
  presets: { random: '随机', sorted: '已排序', reversed: '逆序', fewUnique: '少量不同值' },
  cells: '格子',
  bars: '柱状',
  drawing: '显示方式',
  speed: '速度',
  steps: '步骤',
  inputError: (max) => `请输入 2 到 ${max} 个 0–99 之间的整数，用逗号分隔。`,
  stats: { comparisons: '比较次数', swaps: '交换次数', moves: '移动次数', sorted: '已就位', checks: '检查次数', found: '找到位置' },
  kinds: {
    init: '开始', pass: '一轮', cmp: '比较', swp: '交换', fixed: '就位', end: '完成', min: '新最小值', pick: '取出',
    shift: '后移', place: '插入', partition: '划分', pivot: '基准数', split: '划分', take: '取出', merged: '已合并',
    mid: '中点', found: '找到', missing: '未找到',
  },
  loading: '正在加载可视化…',
  school: {
    badge: '学堂',
    stars: (n) => `星星：${n}`,
    nightSky: '夜空',
    sunnyDay: '晴天',
    grownUp: '大人模式',
    level: (n) => `第 ${n} 关`,
    algoSays: 'Algo 说',
    next: '下一步！',
    playAgain: '再玩一次',
    goBack: '后退',
    guessToggle: '让我猜每一步',
    rule: '规则',
    round: (k, n) => `第 ${k} 轮，共 ${n} 轮`,
    peek: '偷看真正的代码',
    hidePeek: '隐藏代码',
    small: '小',
    big: '大',
    whoosh: '嗖！',
    yes: '答对了！你得到一颗星。',
    goodTry: '差一点！',
    hubTitle: '算法学堂',
    hubIntro: '认识泡泡们和机器人 Algo。每一关都是整理或寻找东西的新方法。',
    start: '开始',
    levels: '关卡',
  },
};

const zhHant: UiText = {
  ...zh,
  watch: '觀看',
  predict: '預測',
  explore: '探索',
  playerMode: '播放模式',
  codeLanguage: '程式語言',
  predictNext: '預測下一步',
  showMe: '直接看答案',
  correct: '正確。',
  notQuite: '不太對。',
  score: '得分',
  prevStep: '上一步',
  nextStep: '下一步',
  play: '播放',
  pause: '暫停',
  restart: '重新開始',
  step: '步驟',
  stepAria: (n) => `跳到第 ${n} 步`,
  visualizerAria: (t) => `${t} 視覺化。使用方向鍵逐步查看。`,
  backToBook: '返回正文',
  exploreMode: '探索模式',
  run: '執行',
  presets: { random: '隨機', sorted: '已排序', reversed: '逆序', fewUnique: '少量不同值' },
  cells: '格子',
  bars: '柱狀',
  drawing: '顯示方式',
  speed: '速度',
  steps: '步驟',
  inputError: (max) => `請輸入 2 到 ${max} 個 0–99 之間的整數，用逗號分隔。`,
  stats: { comparisons: '比較次數', swaps: '交換次數', moves: '移動次數', sorted: '已就位', checks: '檢查次數', found: '找到位置' },
  kinds: {
    init: '開始', pass: '一輪', cmp: '比較', swp: '交換', fixed: '就位', end: '完成', min: '新最小值', pick: '取出',
    shift: '後移', place: '插入', partition: '劃分', pivot: '基準數', split: '劃分', take: '取出', merged: '已合併',
    mid: '中點', found: '找到', missing: '未找到',
  },
  loading: '正在載入視覺化…',
  school: {
    badge: '學堂',
    stars: (n) => `星星：${n}`,
    nightSky: '夜空',
    sunnyDay: '晴天',
    grownUp: '大人模式',
    level: (n) => `第 ${n} 關`,
    algoSays: 'Algo 說',
    next: '下一步！',
    playAgain: '再玩一次',
    goBack: '後退',
    guessToggle: '讓我猜每一步',
    rule: '規則',
    round: (k, n) => `第 ${k} 輪，共 ${n} 輪`,
    peek: '偷看真正的程式碼',
    hidePeek: '隱藏程式碼',
    small: '小',
    big: '大',
    whoosh: '咻！',
    yes: '答對了！你得到一顆星。',
    goodTry: '差一點！',
    hubTitle: '演算法學堂',
    hubIntro: '認識泡泡們和機器人 Algo。每一關都是整理或尋找東西的新方法。',
    start: '開始',
    levels: '關卡',
  },
};

const ja: UiText = {
  watch: '見る',
  predict: '予想',
  explore: '探索',
  playerMode: '再生モード',
  codeLanguage: 'コードの言語',
  predictNext: '次のステップを予想',
  showMe: '答えを見る',
  correct: '正解。',
  notQuite: '惜しい。',
  score: 'スコア',
  prevStep: '前のステップ',
  nextStep: '次のステップ',
  play: '再生',
  pause: '一時停止',
  restart: '最初から',
  step: 'ステップ',
  stepAria: (n) => `ステップ ${n} へ`,
  visualizerAria: (t) => `${t} の可視化。矢印キーで進めます。`,
  backToBook: '本文に戻る',
  exploreMode: '探索モード',
  run: '実行',
  presets: { random: 'ランダム', sorted: '整列済み', reversed: '逆順', fewUnique: '重複が多い' },
  cells: 'セル',
  bars: '棒',
  drawing: '表示',
  speed: '速度',
  steps: 'ステップ',
  inputError: (max) => `0〜99 の整数を 2〜${max} 個、カンマ区切りで入力してください。`,
  stats: { comparisons: '比較', swaps: '交換', moves: '移動', sorted: '確定', checks: '確認', found: '発見位置' },
  kinds: {
    init: '開始', pass: 'ラウンド', cmp: '比較', swp: '交換', fixed: '確定', end: '完了', min: '最小値更新', pick: '取り出し',
    shift: 'ずらす', place: '挿入', partition: '分割', pivot: 'ピボット', split: '分割', take: '取り出し', merged: 'マージ済み',
    mid: '中央', found: '発見', missing: '見つからない',
  },
  loading: '可視化を読み込み中…',
  school: {
    badge: 'スクール',
    stars: (n) => `スター：${n}`,
    nightSky: '夜空',
    sunnyDay: '晴れ',
    grownUp: '大人向け表示',
    level: (n) => `レベル ${n}`,
    algoSays: 'Algo のひとこと',
    next: '次へ！',
    playAgain: 'もう一度',
    goBack: '戻る',
    guessToggle: '毎回予想する',
    rule: 'ルール',
    round: (k, n) => `ラウンド ${k} / ${n}`,
    peek: '本物のコードをのぞく',
    hidePeek: 'コードを隠す',
    small: '小さい',
    big: '大きい',
    whoosh: 'ビュン！',
    yes: '正解！スターをゲット。',
    goodTry: 'おしい！',
    hubTitle: 'アルゴリズム学校',
    hubIntro: 'バブルたちとロボットの Algo に会いに行こう。レベルごとに、ならべ方や探し方を学べます。',
    start: 'スタート',
    levels: 'レベル',
  },
};

const ru: UiText = {
  watch: 'Смотреть',
  predict: 'Угадать',
  explore: 'Исследовать',
  playerMode: 'Режим плеера',
  codeLanguage: 'Язык кода',
  predictNext: 'Угадайте следующий шаг',
  showMe: 'Показать',
  correct: 'Верно.',
  notQuite: 'Не совсем.',
  score: 'счёт',
  prevStep: 'Предыдущий шаг',
  nextStep: 'Следующий шаг',
  play: 'Воспроизвести',
  pause: 'Пауза',
  restart: 'Сначала',
  step: 'Шаг',
  stepAria: (n) => `Перейти к шагу ${n}`,
  visualizerAria: (t) => `Визуализация: ${t}. Стрелки переключают шаги.`,
  backToBook: 'Назад к книге',
  exploreMode: 'режим исследования',
  run: 'Запустить',
  presets: { random: 'Случайно', sorted: 'Отсортировано', reversed: 'Обратный порядок', fewUnique: 'Мало разных' },
  cells: 'Ячейки',
  bars: 'Столбцы',
  drawing: 'Вид',
  speed: 'Скорость',
  steps: 'Шаги',
  inputError: (max) => `Введите от 2 до ${max} целых чисел от 0 до 99 через запятую.`,
  stats: { comparisons: 'сравнений', swaps: 'обменов', moves: 'сдвигов', sorted: 'на месте', checks: 'проверок', found: 'найдено в' },
  kinds: {
    init: 'старт', pass: 'проход', cmp: 'сравнение', swp: 'обмен', fixed: 'на месте', end: 'готово', min: 'новый минимум', pick: 'берём',
    shift: 'сдвиг', place: 'вставка', partition: 'разбиение', pivot: 'опорный', split: 'деление', take: 'берём', merged: 'слито',
    mid: 'середина', found: 'найдено', missing: 'не найдено',
  },
  loading: 'Загружаем визуализацию…',
  school: {
    badge: 'школа',
    stars: (n) => `Звёзды: ${n}`,
    nightSky: 'Ночное небо',
    sunnyDay: 'Солнечный день',
    grownUp: 'Взрослый режим',
    level: (n) => `Уровень ${n}`,
    algoSays: 'Algo говорит',
    next: 'Дальше!',
    playAgain: 'Ещё раз',
    goBack: 'Назад',
    guessToggle: 'Я хочу угадывать каждый шаг',
    rule: 'Правило',
    round: (k, n) => `Раунд ${k} из ${n}`,
    peek: 'Подсмотреть настоящий код',
    hidePeek: 'Спрятать код',
    small: 'меньше',
    big: 'больше',
    whoosh: 'Вжух!',
    yes: 'Да! Звезда твоя.',
    goodTry: 'Почти!',
    hubTitle: 'Школа алгоритмов',
    hubIntro: 'Познакомься с пузырями и роботом Algo. Каждый уровень — новый способ навести порядок или что-то найти.',
    start: 'Начать',
    levels: 'Уровни',
  },
};

export const UI: Record<Locale, UiText> = { en, zh, 'zh-hant': zhHant, ja, ru };

export const ui = (locale: Locale): UiText => UI[locale] ?? en;
