---
layout: post
title: "fresh context를 rlp-desk는 어떻게 구현하나"
description: "rlp-desk의 brainstorm, init, run 흐름과 Agent(), codex exec, tmux pane trigger를 통해 fresh context가 실제로 어떻게 구현되는지 설명한다."
permalink: /blog/how-rlp-desk-implements-fresh-context/
tags:
  - ralph-loop
  - rlp-desk
  - fresh-context
  - claude-code
  - codex
  - verification
  - workflow
---

`fresh context가 중요하다`는 말만으로는 잘 안 와닿는다. 내가 만든 [`rlp-desk`](https://github.com/ai-dev-methodologies/rlp-desk)를 실제로 어떻게 쓰는지, 그리고 그 안에서 fresh context가 어떤 식으로 만들어지는지부터 보여주는 편이 훨씬 낫다.

## 왜 이 글을 먼저 봐야 하나

AI agent를 실무에 붙여 본 사람이라면 비슷한 순간을 한 번쯤 겪는다. 처음에는 그럴듯하게 잘 가다가, 세션이 길어질수록 방향이 흐려지고, 어느 순간엔 뭔가 많이 한 것 같은데도 믿기 어려운 결과만 남는다. 내가 `rlp-desk`를 만든 이유도 바로 그 지점을 더 직접적으로 다뤄보고 싶어서였다.

이 글은 `rlp-desk`의 기능 목록을 소개하려는 글이 아니다. 오히려 왜 `fresh context`가 중요해졌는지, 그리고 그 개념을 실제 실행 구조로 내리면 어떤 모습이 되는지를 빠르게 보여주는 허브 글에 가깝다. Ralph Loop를 처음 접했든, 외부 링크를 통해 바로 들어왔든, 이 글 하나로 문제의식과 구현 구조를 같이 잡을 수 있게 하려는 의도가 있다.

## Start here

<section class="resource-block start-block">
  <p class="feature-label">Start here</p>
  <div class="resource-grid">
    <div class="resource-card primary-card">
      <p class="resource-title">GitHub</p>
      <p><a href="https://github.com/ai-dev-methodologies/rlp-desk">ai-dev-methodologies/rlp-desk</a></p>
    </div>
    <div class="resource-card install-card">
      <p class="resource-title">Install</p>
      <pre class="install-snippet"><code>npm install -g @ai-dev-methodologies/rlp-desk</code></pre>
    </div>
  </div>
</section>
## 이 글에서 먼저 잡아둘 것

이 글은 단순 사용기보다, 내가 왜 `rlp-desk`를 만들었고 어떤 철학을 실제 구조로 내렸는지부터 설명하려는 글이다.

- [Ralph Loop 원론](https://ghuntley.com/ralph/)과 [aihero.dev의 Getting Started with Ralph](https://www.aihero.dev/getting-started-with-ralph), [Tips for AI Coding with Ralph Wiggum](https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum)에서 fresh context와 파일 기반 상태 유지의 감각을 가져왔다
- [OpenAI의 Codex long-horizon tasks 글](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex/)에서 장기 작업을 문서와 아티팩트로 굴리는 방식을 적극 반영했다
- 그 결과 `PRD`, `test spec`, `memory`, `iter-signal`, `verify-verdict` 같은 파일 이름과 역할이 굳어졌다

즉 `rlp-desk`는 Ralph를 막연히 흉내 낸 게 아니라, Ralph의 인사이트와 Codex의 파일 기반 운영 감각을 합쳐 만든 실행 도구다.

## 먼저 사용 장면부터 보자

내가 `rlp-desk`를 설명할 때 가장 먼저 보여주고 싶은 장면은 아래 세 줄이다.

```bash
/rlp-desk brainstorm "Python calculator module with pytest tests"
/rlp-desk init calc-loop "Python calculator with tests"
/rlp-desk run calc-loop --verify-mode per-us
```

역할은 이렇게 나뉜다.

| 단계 | 하는 일 | 왜 필요한가 |
|---|---|---|
| `brainstorm` | slug, objective, user stories, verify mode, engine, consensus 같은 실행 계약을 정한다 | 루프를 어떤 규칙으로 돌릴지 먼저 합의해야 해서 |
| `init` | `.claude/ralph-desk/` scaffold를 만든다 | 반복 실행이 참조할 파일 기반 상태 공간을 만들기 위해 |
| `run` | leader가 worker와 verifier를 반복 호출한다 | 실제 execution loop가 시작되는 지점이라서 |

여기서 `brainstorm`은 범용 제품 인터뷰 도구가 아니다. 내가 보는 역할은 `rlp-desk` 루프를 어떤 계약으로 실행할지 정리하는 단계에 더 가깝다. 더 넓은 PRD 정리나 요구사항 인터뷰는 `deep-interview`, `ralplan`, 그리고 [`oh-my-claudecode`](https://github.com/Yeachan-Heo/oh-my-claudecode) 같은 상위 orchestration layer가 더 잘한다. `rlp-desk`는 그 결과를 실행 루프로 옮기는 쪽이다.

## `init`이 만드는 건 단순한 폴더가 아니다

`/rlp-desk init`을 돌리면 프로젝트 안에 아래 구조가 생긴다.

```text
.claude/ralph-desk/
├── prompts/
│   ├── <slug>.worker.prompt.md
│   └── <slug>.verifier.prompt.md
├── context/
│   └── <slug>-latest.md
├── memos/
│   ├── <slug>-memory.md
│   ├── <slug>-done-claim.json
│   ├── <slug>-iter-signal.json
│   └── <slug>-verify-verdict.json
├── plans/
│   ├── prd-<slug>.md
│   └── test-spec-<slug>.md
└── logs/<slug>/
```

이 구조에서 중요한 건 `파일시스템이 메모리`라는 점이다.

- `plans/prd-*.md`
  - 이번 루프가 지켜야 할 계약
- `plans/test-spec-*.md`
  - verifier가 실제로 실행할 검증 기준
- `context/*-latest.md`
  - 다음 worker가 읽을 현재 frontier
- `memos/*-memory.md`
  - 다음 iteration contract
- `memos/*-iter-signal.json`
  - worker가 이번 iteration 결과를 leader에게 알리는 구조화된 신호
- `memos/*-verify-verdict.json`
  - verifier가 남기는 구조화된 판정

즉 `rlp-desk`의 메모리는 대화창 안에 쌓이지 않는다. 다음 worker는 이전 대화를 상속받지 않고, 이 파일들을 다시 읽고 시작한다. 내가 `fresh context`라고 말할 때 실제로 가리키는 건 이 구조다.

## fresh context는 어떻게 만들어지나

핵심은 단순하다. `새로운 프로세스`를 띄운다.

### Agent mode

기본 모드에서는 현재 세션이 leader가 되고, worker와 verifier는 `Agent()`로 각각 새 subprocess에서 실행된다.

```python
Agent(
  subagent_type="executor",
  model="sonnet",
  prompt=full_prompt_text,
  mode="bypassPermissions"
)
```

이 구조에서 중요한 점은 세 가지다.

- `Agent()`를 한 번 호출할 때마다 새 컨텍스트가 열린다
- leader는 호출이 끝난 뒤 파일시스템만 다시 읽으면 된다
- polling이나 tmux 없이도 iteration을 계속 이어갈 수 있다

즉 이번 worker는 이전 대화를 기억하지 않는다. 기억해야 할 것은 prompt에 넣고, 오래 남겨야 할 것은 파일에 남긴다. 긴 대화가 부풀면서 품질이 흐려지는 문제를 줄이려면 이 분리가 꽤 중요하다.

### Codex path

Codex는 `Agent()`가 아니라 subprocess로 호출한다. 현재 로컬 구현과 문서 기준으로는 `codex exec`가 핵심이다.

```bash
codex exec "$(cat $prompt_file)" \
  -m $VERIFIER_CODEX_MODEL \
  -c model_reasoning_effort="$VERIFIER_CODEX_REASONING" \
  --dangerously-bypass-approvals-and-sandbox
```

핵심은 Claude 쪽과 같다.

- Codex도 매번 새 CLI subprocess로 실행된다
- 이전 iteration의 채팅 히스토리를 끌고 가지 않는다
- 다음 iteration이 필요하면 파일에서 다시 읽고 다시 실행한다

그래서 fresh context의 본질은 특정 모델이 아니라, `매 호출을 새 프로세스로 만든다`는 구현 방식에 있다.

## 왜 이름이 `rlp-desk`인가

이름을 `ralph-desk`가 아니라 `rlp-desk`로 줄인 것도 의도가 있다. Ralph를 숨기려는 게 아니었다. 일부 `oh-my-*` 계열 환경에서는 Ralph 키워드가 다른 명령 흐름과 부딪힐 수 있었고, 그 후킹을 줄이고 싶었다. 의미는 유지하되 명령어 공간에서는 더 안전한 이름을 택한 셈이다.

## tmux 모드에서는 이 구조가 더 잘 보인다

`/rlp-desk run <slug> --mode tmux`로 돌리면 구조가 훨씬 눈에 잘 들어온다.

```text
[tmux session: rlp-desk-<slug>-<timestamp>]
+-------------------------------------+
| Leader pane (shell loop)            |
| - writes prompts to files           |
| - polls iter-signal.json via jq     |
| - writes sentinels                  |
+------------------+------------------+
| Worker pane      | Verifier pane    |
| claude/codex run | claude/codex run |
+------------------+------------------+
```

여기서는 leader가 LLM이 아니라 `run_ralph_desk.zsh`다. 이 스크립트는 비교적 기계적으로 움직인다.

1. prompt 파일을 쓴다
2. worker pane이나 verifier pane에 짧은 trigger를 보낸다
3. `iter-signal.json`, `verify-verdict.json`을 `jq`로 polling한다
4. 결과에 따라 다음 iteration contract를 만든다

즉 tmux 모드에서도 핵심은 같다. pane 자체가 fresh context인 게 아니라, 각 pane 안에서 `claude -p`나 `codex exec` 같은 non-interactive 실행을 매번 다시 띄운다는 데 의미가 있다.

## 왜 worker와 verifier를 분리했나

내가 `rlp-desk`를 만들 때 가장 강하게 잡은 전제 중 하나는 `worker claim ≠ complete`였다.

worker는 작업을 끝냈다고 주장할 수 있다. 하지만 그건 어디까지나 claim이다. 그래서 verifier는 별도 fresh context에서 다시 출발한다.

- PRD를 다시 읽고
- test spec을 다시 읽고
- changed files를 확인하고
- build, test, lint 같은 검증 명령을 새로 실행한 뒤
- `verify-verdict.json`에 판정을 남긴다

이 분리가 중요한 이유는 단순하다. agent는 방금 자신이 한 일에 유리한 이야기를 만들기 쉽다. 검증은 그 서사와 떨어져 있어야 한다.

## 내가 더 크게 보려는 건 workflow다

여기서 내가 요즘 더 크게 보고 있는 건 단순 구현이 아니라 workflow 구성이다. 기업은 업무에 AI agent를 붙이고 싶어 하지만, 막상 어떤 기능을 만들 때 어디서 시작해야 할지 막연한 경우가 많다. 그래서 내가 제안하고 싶은 건 `rlp-desk`로 비정형 작업을 빠르게 돌려 보고, 그 결과물의 방향을 정규화해서 업무 workflow로 만들어 가는 방식이다.

이때 중요한 기준이 있다. Claude 쪽에서 말하는 feedback loop처럼, `run -> validate -> fix -> repeat`가 실제로 구조 안에 들어가 있어야 한다는 점이다. agent는 10개를 시키면 7개만 제대로 하고, 나머지 3개는 대충 끝내거나 가짜 확신을 주려는 습관이 있다. 내가 `rlp-desk`에서 worker, verifier, per-US verify, self-verification을 자꾸 강조하는 이유도 그걸 제어하려는 쪽에 더 가깝다.

여기에 하나가 더 붙는다. workflow가 반복 구조를 만든다면, test/verification planning은 완료 경계를 만든다. agent가 대충 만든 구현을 “거의 됐다”는 말로 밀어붙이지 못하게 하고, 어떤 기능이 어떤 기준까지 충족되어야 pass인지 명확히 적는 쪽이다. 내가 다음 시리즈에서 더 오래 붙잡고 싶은 문제도 결국 여기다. `rlp-desk`는 실행 구조를 제공하고, 그 위에서 workflow methodology와 verification planning methodology가 합쳐져야 실무에서 더 믿을 수 있는 자동화가 나온다.

## per-US verify와 self-verification이 왜 실무적으로 중요할까

최근 로컬 `rlp-desk` 코드와 테스트 문서를 보면, 이 구조는 한 단계 더 구체화돼 있다.

- `--verify-mode per-us`
  - user story 하나가 끝날 때마다 바로 검증
- `--verify-consensus`
  - claude verifier와 codex verifier를 둘 다 돌려서 둘 다 통과해야 pass
- `tests/self-verification-methodology.md`
  - `[PLAN] / [EXEC] / [VALIDATE]` 로그로 루프 자체를 다시 검증

이게 중요한 이유는 “마지막에 한 번만 확인”하는 방식이 생각보다 자주 무너지기 때문이다. per-US verify는 중간 경계를 더 자주 만든다. self-verification은 `내가 의도한 흐름이 실제로 그렇게 돌았는지`까지 다시 확인한다. consensus verify는 검증마저 한 엔진에만 의존하지 않겠다는 선택이다.

아직 다듬을 부분은 남아 있다. 그래도 방향은 분명하다. 좋은 입력을 한 번 달리게 하는 데서 끝나는 게 아니라, 반복마다 경계를 세우고, 판정을 구조화하고, 검증 자체도 다시 검증하려는 쪽으로 가고 있다.

## 내가 `rlp-desk`를 만든 이유도 여기 있다

내가 이걸 만든 이유는 “에이전트에게 오래 말하면 언젠가 다 잘되겠지”라는 기대가 계속 깨졌기 때문이다. 실제로는 그 반대에 가까웠다. 세션이 길어질수록 컨텍스트가 자산이 아니라 부채가 되는 경우가 많았다. 그래서 내가 원한 건 더 긴 대화가 아니라, 더 짧고 독립적인 반복이었다.

그 관점에서 보면 `rlp-desk`는 만능 툴이 아니다. 오히려 한 가지 원칙을 끝까지 밀어붙인 실행 도구에 가깝다.

- 상태는 파일에 남긴다
- worker는 새 컨텍스트에서 시작한다
- verifier도 새 컨텍스트에서 시작한다
- leader는 그 사이를 오케스트레이션만 한다

이 단순한 원칙을 실제로 돌아가게 만드는 것이 `rlp-desk`의 실무적인 핵심이다.

## 정리

`fresh context가 중요하다`는 말은 철학으로만 들리면 힘이 약하다. 하지만 `rlp-desk`를 실제로 보면, 이 말이 꽤 구체적인 구현으로 내려와 있다.

- `brainstorm`은 루프 계약을 정리한다
- `init`은 파일시스템 메모리를 만든다
- `run`은 worker와 verifier를 새 프로세스로 반복 호출한다
- tmux 모드에서는 그 반복이 pane과 JSON signal 수준으로 드러난다
- Codex 지원, per-US verify, consensus verify, self-verification은 이 구조를 더 단단하게 만드는 확장이다

그래서 이 글에서 하고 싶은 말은 단순하다.

> `rlp-desk`는 fresh context라는 개념을 실제 실행 구조로 바꿔놓은 도구다.

이 글 다음에는 현재 준비된 `rlp-desk` 설명 글 두 편이 더 있다.

1. `왜 rlp-desk인가 / fresh context가 실제로 무엇을 바꾸는가`
2. `rlp-desk를 planning tool이 아니라 execution/verification tool로 정확히 이해하기`

이 두 글까지 읽으면 `rlp-desk`를 만든 이유, 그리고 이 도구를 어디까지로 봐야 하는지가 더 분명해진다.

그 다음 시리즈에서는 두 가지를 더 명시적으로 다루려고 한다.

1. `rlp-desk`로 비정형 자동화 실험을 빠르게 만들고, 경험이 쌓이면 팀의 반복 가능한 workflow로 정형화하는 방법론
2. AI agent가 가짜 확신이나 우회 구현으로 빠지지 못하게 하는 `test/verification planning methodology`

좋은 PRD와 breakdown은 점점 더 잘 만들어진다. 반면 목적에 맞는 검증 계획과 테스트 경계를 세우는 일은 아직 훨씬 덜 정리돼 있다. 내가 다음에 더 오래 붙잡고 싶은 문제도 바로 그 부분이다.

## References

<section class="resource-block reference-block">
  <div class="resource-grid single-column">
    <div class="resource-card reference-card">
      <p class="resource-title">References</p>
      <ul class="reference-list">
        <li><a href="https://developers.openai.com/blog/run-long-horizon-tasks-with-codex/">OpenAI, Run long-horizon tasks with Codex</a></li>
        <li><a href="https://www.aihero.dev/getting-started-with-ralph">Getting Started with Ralph</a></li>
        <li><a href="https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum">Tips for AI Coding with Ralph Wiggum</a></li>
        <li><a href="https://github.com/Yeachan-Heo/oh-my-claudecode"><code>oh-my-claudecode</code></a></li>
        <li><a href="https://github.com/ai-dev-methodologies/rlp-desk"><code>rlp-desk</code> repository</a></li>
      </ul>
    </div>
  </div>
</section>
