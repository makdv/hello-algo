import type { Locale } from '../i18n/locale';

/** Interface text of School lessons (story, try, quiz) in every locale. */
export interface LessonText {
  story: string;
  tryIt: string;
  quiz: string;
  back: string;
  next: string;
  letsTry: string;
  toQuiz: string;
  finish: string;
  right: string;
  notQuite: string;
  questionOf: (k: number, n: number) => string;
  slideOf: (k: number, n: number) => string;
  done: string;
  score: (k: number, n: number) => string;
  nextLesson: string;
  backToMap: string;
  map: string;
  unit: (n: number) => string;
  lesson: (n: number) => string;
  progress: (k: number, n: number) => string;
  hubIntro: string;
  completed: string;
  storyAgain: string;
}

const en: LessonText = {
  story: 'Story',
  tryIt: 'Try it',
  quiz: 'Quiz',
  back: 'Back',
  next: 'Next',
  letsTry: "Let's try it!",
  toQuiz: 'On to the quiz!',
  finish: 'Finish',
  right: 'Yes! You earned a star.',
  notQuite: 'Not quite.',
  questionOf: (k, n) => `Question ${k} of ${n}`,
  slideOf: (k, n) => `${k} / ${n}`,
  done: 'Lesson complete!',
  score: (k, n) => `You got ${k} of ${n} right.`,
  nextLesson: 'Next lesson',
  backToMap: 'Back to the map',
  map: 'Map',
  unit: (n) => `Unit ${n}`,
  lesson: (n) => `Lesson ${n}`,
  progress: (k, n) => `${k} of ${n} lessons done`,
  hubIntro: 'Hi, I am Algo! Each lesson has a story, a game and a quiz. Start anywhere, but the order below is a good path.',
  completed: 'done',
  storyAgain: 'Story again',
};

const zh: LessonText = {
  story: '故事',
  tryIt: '动手试试',
  quiz: '小测验',
  back: '上一页',
  next: '下一页',
  letsTry: '来试试吧！',
  toQuiz: '去做小测验！',
  finish: '完成',
  right: '答对了！获得一颗星。',
  notQuite: '不太对哦。',
  questionOf: (k, n) => `第 ${k} 题，共 ${n} 题`,
  slideOf: (k, n) => `${k} / ${n}`,
  done: '本课完成！',
  score: (k, n) => `你答对了 ${n} 题中的 ${k} 题。`,
  nextLesson: '下一课',
  backToMap: '回到地图',
  map: '地图',
  unit: (n) => `第 ${n} 单元`,
  lesson: (n) => `第 ${n} 课`,
  progress: (k, n) => `已完成 ${k} / ${n} 课`,
  hubIntro: '你好，我是 Algo！每一课都有故事、游戏和小测验。可以从任何一课开始，不过按下面的顺序学最好。',
  completed: '已完成',
  storyAgain: '再看一遍故事',
};

const zhHant: LessonText = {
  story: '故事',
  tryIt: '動手試試',
  quiz: '小測驗',
  back: '上一頁',
  next: '下一頁',
  letsTry: '來試試吧！',
  toQuiz: '去做小測驗！',
  finish: '完成',
  right: '答對了！獲得一顆星。',
  notQuite: '不太對喔。',
  questionOf: (k, n) => `第 ${k} 題，共 ${n} 題`,
  slideOf: (k, n) => `${k} / ${n}`,
  done: '本課完成！',
  score: (k, n) => `你答對了 ${n} 題中的 ${k} 題。`,
  nextLesson: '下一課',
  backToMap: '回到地圖',
  map: '地圖',
  unit: (n) => `第 ${n} 單元`,
  lesson: (n) => `第 ${n} 課`,
  progress: (k, n) => `已完成 ${k} / ${n} 課`,
  hubIntro: '你好，我是 Algo！每一課都有故事、遊戲和小測驗。可以從任何一課開始，不過按下面的順序學最好。',
  completed: '已完成',
  storyAgain: '再看一遍故事',
};

const ja: LessonText = {
  story: 'おはなし',
  tryIt: 'やってみよう',
  quiz: 'クイズ',
  back: 'もどる',
  next: 'つぎへ',
  letsTry: 'やってみよう！',
  toQuiz: 'クイズへ！',
  finish: 'おわり',
  right: 'せいかい！星をゲット。',
  notQuite: 'ちょっとちがうよ。',
  questionOf: (k, n) => `${n} 問中 ${k} 問目`,
  slideOf: (k, n) => `${k} / ${n}`,
  done: 'レッスンクリア！',
  score: (k, n) => `${n} 問中 ${k} 問せいかい。`,
  nextLesson: 'つぎのレッスン',
  backToMap: '地図にもどる',
  map: '地図',
  unit: (n) => `ユニット ${n}`,
  lesson: (n) => `レッスン ${n}`,
  progress: (k, n) => `${n} レッスン中 ${k} クリア`,
  hubIntro: 'こんにちは、Algo だよ！どのレッスンにも、おはなし・ゲーム・クイズがあるよ。どこから始めてもいいけど、下の順番がおすすめ。',
  completed: 'クリア',
  storyAgain: 'もう一度おはなし',
};

const ru: LessonText = {
  story: 'История',
  tryIt: 'Попробуй',
  quiz: 'Викторина',
  back: 'Назад',
  next: 'Дальше',
  letsTry: 'Давай попробуем!',
  toQuiz: 'К викторине!',
  finish: 'Готово',
  right: 'Да! Звезда твоя.',
  notQuite: 'Не совсем.',
  questionOf: (k, n) => `Вопрос ${k} из ${n}`,
  slideOf: (k, n) => `${k} / ${n}`,
  done: 'Урок пройден!',
  score: (k, n) => `Верных ответов: ${k} из ${n}.`,
  nextLesson: 'Следующий урок',
  backToMap: 'К карте',
  map: 'Карта',
  unit: (n) => `Раздел ${n}`,
  lesson: (n) => `Урок ${n}`,
  progress: (k, n) => `Пройдено уроков: ${k} из ${n}`,
  hubIntro: 'Привет, я Algo! В каждом уроке есть история, игра и викторина. Начинать можно с любого, но лучше идти по порядку.',
  completed: 'пройден',
  storyAgain: 'История ещё раз',
};

const TEXT: Record<Locale, LessonText> = { en, zh, 'zh-hant': zhHant, ja, ru };

export const lessonText = (locale: Locale) => TEXT[locale];
