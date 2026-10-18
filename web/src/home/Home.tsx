import { AlgoPlayer } from '../components/AlgoPlayer';
import { bubbleSort } from '../algorithms/bubbleSort';
import './home.css';

type Locale = 'en' | 'zh' | 'zh-hant' | 'ja' | 'ru';

interface Chapter {
  no: number;
  title: string;
  href: string;
  sections: number;
}

interface Strings {
  eyebrow: string;
  title: string;
  lead: string;
  start: string;
  tryPlayer: string;
  school: string;
  contents: string;
  contentsNote: string;
  sections: (n: number) => string;
  languages: string;
}

const STRINGS: Record<Locale, Strings> = {
  en: {
    eyebrow: '// open-source DSA textbook',
    title: 'Data structures and algorithms, one step at a time.',
    lead: 'Interactive illustrations you can pause, rewind and feed your own input, next to ready-to-run code in many programming languages.',
    start: 'Start reading',
    tryPlayer: 'Try the interactive player',
    school: 'School view for kids',
    contents: 'Contents',
    contentsNote: 'chapters 0–16',
    sections: (n) => `${n} sections`,
    languages: 'Code languages',
  },
  zh: {
    eyebrow: '// 开源数据结构与算法教程',
    title: '数据结构与算法，一步一步看懂。',
    lead: '可以暂停、回放、输入自己数据的交互式图解，配合多种编程语言的可运行代码。',
    start: '开始阅读',
    tryPlayer: '试试交互式演示',
    school: '儿童学堂',
    contents: '目录',
    contentsNote: '第 0–16 章',
    sections: (n) => `${n} 节`,
    languages: '代码语言',
  },
  'zh-hant': {
    eyebrow: '// 開源資料結構與演算法教程',
    title: '資料結構與演算法，一步一步看懂。',
    lead: '可以暫停、回放、輸入自己資料的互動式圖解，搭配多種程式語言的可執行程式碼。',
    start: '開始閱讀',
    tryPlayer: '試試互動式演示',
    school: '兒童學堂',
    contents: '目錄',
    contentsNote: '第 0–16 章',
    sections: (n) => `${n} 節`,
    languages: '程式語言',
  },
  ja: {
    eyebrow: '// オープンソースのデータ構造とアルゴリズム入門',
    title: 'データ構造とアルゴリズムを、一歩ずつ。',
    lead: '一時停止・巻き戻し・自分の入力で試せるインタラクティブな図解と、多くのプログラミング言語ですぐ動くコード。',
    start: '読み始める',
    tryPlayer: 'インタラクティブなデモ',
    school: 'こども向けスクール',
    contents: '目次',
    contentsNote: '第 0–16 章',
    sections: (n) => `${n} 節`,
    languages: 'コードの言語',
  },
  ru: {
    eyebrow: '// открытый учебник по структурам данных и алгоритмам',
    title: 'Структуры данных и алгоритмы — шаг за шагом.',
    lead: 'Интерактивные иллюстрации, которые можно поставить на паузу, перемотать и запустить на своих данных, рядом с готовым к запуску кодом на многих языках.',
    start: 'Начать чтение',
    tryPlayer: 'Интерактивная демонстрация',
    school: 'Школа для детей',
    contents: 'Содержание',
    contentsNote: 'главы 0–16',
    sections: (n) => `${n} разд.`,
    languages: 'Языки кода',
  },
};

const LANGUAGES = ['Python', 'C++', 'Java', 'C#', 'Go', 'Swift', 'JS', 'TS', 'Dart', 'Rust', 'C', 'Kotlin', 'Ruby', 'Zig'];

export function Home({ locale = 'en', startHref, chapters }: { locale?: Locale; startHref: string; chapters: Chapter[] }) {
  const t = STRINGS[locale] ?? STRINGS.en;
  const prefix = locale === 'en' ? '' : `/${locale}`;
  // The English code tree has no Zig sources.
  const languages = locale === 'en' ? LANGUAGES.filter((l) => l !== 'Zig') : LANGUAGES;
  return (
    <div className="ha-home">
      <section className="ha-home__hero">
        <div className="ha-home__intro">
          <p className="ha-home__eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="ha-home__lead">{t.lead}</p>
          <div className="ha-home__cta">
            <a className="ha-home__button ha-home__button--primary" href={startHref}>
              {t.start}
            </a>
            <a className="ha-home__button" href={`${prefix}/chapter_sorting/bubble_sort`}>
              {t.tryPlayer}
            </a>
            <a className="ha-home__button" href={`${prefix}/school/`}>
              {t.school}
            </a>
          </div>
          <ul className="ha-home__langs" aria-label={t.languages}>
            {languages.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
        <div className="ha-home__demo">
          <AlgoPlayer spec={bubbleSort} initialStep={6} />
        </div>
      </section>

      <section className="ha-home__contents" aria-labelledby="ha-contents-title">
        <div className="ha-home__contents-head">
          <h2 id="ha-contents-title">{t.contents}</h2>
          <span>{t.contentsNote}</span>
        </div>
        <ol className="ha-home__chapters">
          {chapters.map((c) => (
            <li key={c.no}>
              <a href={c.href} className="ha-home__chapter is-live">
                <span className="ha-home__no">{c.no}</span>
                <span className="ha-home__title">{c.title}</span>
                <span className="ha-home__tag">{c.sections ? t.sections(c.sections) : ''}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
