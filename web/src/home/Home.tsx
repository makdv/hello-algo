import { AlgoPlayer } from '../components/AlgoPlayer';
import { bubbleSort } from '../algorithms/bubbleSort';
import './home.css';

const CHAPTERS: [no: number, title: string, tag: string, href?: string][] = [
  [1, 'Encounter with algorithms', 'intro'],
  [2, 'Complexity analysis', 'big-O'],
  [3, 'Data structures', 'overview'],
  [4, 'Arrays and linked lists', 'array · list'],
  [5, 'Stacks and queues', 'stack · deque'],
  [6, 'Hashing', 'hash map'],
  [7, 'Tree', 'BST · AVL'],
  [8, 'Heap', 'heap · top-k'],
  [9, 'Graph', 'BFS · DFS'],
  [10, 'Searching', 'binary search'],
  [11, 'Sorting', '10 algorithms', '/chapter_sorting/bubble_sort'],
  [12, 'Divide and conquer', 'recursion'],
  [13, 'Backtracking', 'n-queens'],
  [14, 'Dynamic programming', 'dp table'],
  [15, 'Greedy', 'knapsack'],
];

const LANGUAGES = ['Python', 'C++', 'Java', 'C#', 'Go', 'Swift', 'JS', 'TS', 'Dart', 'Rust', 'C', 'Kotlin', 'Ruby', 'Zig'];

export function Home() {
  return (
    <div className="ha-home">
      <section className="ha-home__hero">
        <div className="ha-home__intro">
          <p className="ha-home__eyebrow">// open-source DSA textbook</p>
          <h1>Data structures and algorithms, one step at a time.</h1>
          <p className="ha-home__lead">
            Interactive illustrations you can pause, rewind and feed your own input, next to ready-to-run code in 14
            programming languages.
          </p>
          <div className="ha-home__cta">
            <a className="ha-home__button ha-home__button--primary" href="/chapter_sorting/bubble_sort">
              Start reading
            </a>
            <a className="ha-home__button" href="/school/bubble_sort">
              School view for kids
            </a>
          </div>
          <ul className="ha-home__langs" aria-label="Code languages">
            {LANGUAGES.map((l) => (
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
          <h2 id="ha-contents-title">Contents</h2>
          <span>Sorting is migrated first; other chapters follow.</span>
        </div>
        <ol className="ha-home__chapters">
          {CHAPTERS.map(([no, title, tag, href]) => (
            <li key={no}>
              {href ? (
                <a href={href} className="ha-home__chapter is-live">
                  <span className="ha-home__no">{no}</span>
                  <span className="ha-home__title">{title}</span>
                  <span className="ha-home__tag">{tag}</span>
                </a>
              ) : (
                <span className="ha-home__chapter">
                  <span className="ha-home__no">{no}</span>
                  <span className="ha-home__title">{title}</span>
                  <span className="ha-home__tag">coming soon</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
