import { AlgoPlayer } from '../components/AlgoPlayer';
import { bubbleSort } from '../algorithms/bubbleSort';
import './home.css';

const CHAPTERS: [no: number, title: string, tag: string, dir: string][] = [
  [0, 'Preface', 'about this book', 'chapter_preface'],
  [1, 'Encounter with algorithms', 'intro', 'chapter_introduction'],
  [2, 'Complexity analysis', 'big-O', 'chapter_computational_complexity'],
  [3, 'Data structures', 'overview', 'chapter_data_structure'],
  [4, 'Arrays and linked lists', 'array · list', 'chapter_array_and_linkedlist'],
  [5, 'Stacks and queues', 'stack · deque', 'chapter_stack_and_queue'],
  [6, 'Hashing', 'hash map', 'chapter_hashing'],
  [7, 'Tree', 'BST · AVL', 'chapter_tree'],
  [8, 'Heap', 'heap · top-k', 'chapter_heap'],
  [9, 'Graph', 'BFS · DFS', 'chapter_graph'],
  [10, 'Searching', 'binary search', 'chapter_searching'],
  [11, 'Sorting', '10 algorithms', 'chapter_sorting'],
  [12, 'Divide and conquer', 'recursion', 'chapter_divide_and_conquer'],
  [13, 'Backtracking', 'n-queens', 'chapter_backtracking'],
  [14, 'Dynamic programming', 'dp table', 'chapter_dynamic_programming'],
  [15, 'Greedy', 'knapsack', 'chapter_greedy'],
];

const LANGUAGES = ['Python', 'C++', 'Java', 'C#', 'Go', 'Swift', 'JS', 'TS', 'Dart', 'Rust', 'C', 'Kotlin', 'Ruby'];

export function Home() {
  return (
    <div className="ha-home">
      <section className="ha-home__hero">
        <div className="ha-home__intro">
          <p className="ha-home__eyebrow">// open-source DSA textbook</p>
          <h1>Data structures and algorithms, one step at a time.</h1>
          <p className="ha-home__lead">
            Interactive illustrations you can pause, rewind and feed your own input, next to ready-to-run code in 13
            programming languages.
          </p>
          <div className="ha-home__cta">
            <a className="ha-home__button ha-home__button--primary" href="/chapter_hello_algo/">
              Start reading
            </a>
            <a className="ha-home__button" href="/chapter_sorting/bubble_sort">
              Try the interactive player
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
          <span>chapters 0–15 + appendix</span>
        </div>
        <ol className="ha-home__chapters">
          {CHAPTERS.map(([no, title, tag, dir]) => (
            <li key={no}>
              <a href={`/${dir}/`} className="ha-home__chapter is-live">
                <span className="ha-home__no">{no}</span>
                <span className="ha-home__title">{title}</span>
                <span className="ha-home__tag">{tag}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
