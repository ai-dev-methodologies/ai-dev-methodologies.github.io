---
layout: post
title: "Ralph Loop 학습 가이드"
description: "Ralph Loop를 무엇부터 읽고, 무엇을 점검하고, 무엇을 직접 따라 해봐야 하는지 단계별로 정리한다."
permalink: /blog/how-to-learn-ralph-loop/
series: "Ralph Loop"
series_slug: "ralph-loop"
series_order: 2
featured_series: true
tags:
  - ralph-loop
  - fresh-context
  - filesystem-memory
  - verification
  - learning
---

Ralph Loop를 처음 보면 대부분 같은 함정에 빠진다. 개념은 흥미로운데, 막상 무엇을 먼저 봐야 할지 모르고 바로 구현이나 프롬프트 흉내로 뛰어든다. 그러면 금방 밈처럼 소비된다. 이 글은 그걸 막기 위한 학습 가이드다.

<figure class="diagram-card">
  <img src="/assets/img/ralph-learning-path.svg" alt="Ralph Loop 학습 경로 다이어그램">
  <figcaption>개념, fresh context, filesystem memory, verification, implementation proof를 순서대로 이해해야 Ralph Loop를 운영 방식으로 읽을 수 있다.</figcaption>
</figure>

## 먼저 결론부터

내가 권하는 학습 순서는 이렇다.

1. **개념**: Ralph Loop가 왜 나왔는지 이해한다  
2. **fresh context**: 왜 긴 세션이 망가지고, 무엇을 기억하지 않게 해야 하는지 본다  
3. **filesystem memory**: 상태를 어디에 남겨야 하는지 이해한다  
4. **verification**: 완료 주장과 판정을 어떻게 분리할지 본다  
5. **implementation proof**: 그다음에야 `rlp-desk` 같은 구현 자산을 읽는다

이 순서를 건너뛰면 “반복하면 된다” 정도로만 남고, 제대로 붙잡으면 실제 운영 철학으로 이어진다.

## 1단계: 개념부터 붙잡기

첫 단계에서 해야 할 일은 단순하다. **이게 성능을 더 끌어내는 프롬프트 팁이 아니라, 긴 세션이 무너지는 문제에 대한 구조적 대응이라는 점**을 이해해야 한다.

체크할 질문:
- 왜 긴 세션은 자주 망가지는가?
- 망각보다 오염이 더 큰 문제라는 말이 무슨 뜻인가?
- 왜 “더 많은 맥락”이 항상 좋은 게 아닌가?

실습:
- 최근 실패한 AI coding session 하나를 떠올린다
- 어디서부터 맥락이 흐려졌는지 적어본다

## 2단계: `fresh context`를 정확히 이해하기

Ralph Loop의 핵심은 반복이 아니다. **fresh context**다.

이 단계에서 이해해야 할 것:
- fresh context는 단순히 새 채팅창을 여는 습관이 아니다
- 이전 실패와 잡음을 그대로 들고 가지 않겠다는 운영 원칙이다
- 질문은 “무엇을 더 기억하게 할까?”보다 “무엇을 기억하지 않게 할까?”로 바뀌어야 한다

실습:
- 같은 태스크를 긴 세션으로 계속 밀어본다
- 같은 태스크를 요약 파일 하나만 두고 다시 시작해본다
- 둘의 차이를 기록한다

## 3단계: 파일시스템 메모리를 이해하기

fresh context를 쓰겠다고 하면 바로 이런 질문이 나온다.

> 그럼 이전 상태는 어디에 남기지?

답은 파일이다.

여기서 봐야 할 아티팩트:
- PRD
- task list / user stories
- memory
- context summary
- verification logs

이 단계에서 중요한 건, 모델이 이전 대화를 기억해서 이어가는 게 아니라 다음 반복이 파일을 다시 읽고 상태를 **재구성**한다는 점이다.

### 최소 샘플 파일 구조

아래는 아주 작은 `greeter` 기능을 예로 든, **재구성한 샘플**이다.

#### `prd-greeter.md`

```md
# PRD: greeter

## Objective
이름을 받아 인사 문자열을 돌려주는 작은 함수 구현

## User Stories
### US-001
- 입력: name
- 출력: "Hello, <name>!"
- Acceptance Criteria
  - 빈 문자열은 허용하지 않는다
  - 문자열 반환
```

#### `memory-greeter.md`

```md
# greeter memory

## Current State
- no implementation yet

## Next Iteration Contract
- implement US-001 only

## Done means
- greeting function exists
- tests for normal input pass
```

#### `verify-greeter.md`

```md
# verification

- run unit tests
- confirm empty string handling
- confirm output format matches PRD
```

이 수준의 샘플이라도 있으면, “파일에 남긴다”는 말이 훨씬 현실적으로 보이기 시작한다.

## 4단계: verification을 분리해서 보기

여기서 많이 놓친다. loop와 persistence까지만 보고, 검증은 나중 문제라고 생각한다. 그런데 실전에서 더 위험한 건 에이전트가 틀리는 것보다 **틀렸는데도 “다 됐다”고 말하는 것**이다.

이 단계에선 아래를 같이 봐야 한다.
- bounded task
- acceptance criteria
- machine-verifiable checks
- worker claim과 verifier judgment의 분리

실습:
- 작은 기능 하나를 고른다
- “완료”를 문장으로만 쓰지 말고
- 반드시 통과해야 할 테스트/명령 3개로 적는다

## 5단계: 이제 구현 proof를 읽는다

이제야 `rlp-desk`를 보는 게 맞다.

왜 마지막이냐면, 구현을 먼저 보면 도구의 모양에 끌리고 개념을 놓치기 쉽기 때문이다. 반대로 앞의 네 단계를 먼저 잡고 나면 `rlp-desk`는 아래 질문에 답하는 proof asset으로 보인다.

- fresh context를 실제로 어떻게 구현했는가?
- 어떤 파일 구조로 상태를 유지하는가?
- worker / verifier는 어떻게 나뉘는가?
- verification은 어느 경계에서 들어오는가?

즉 `rlp-desk`는 “먼저 볼 도구”라기보다 “앞에서 이해한 개념이 실제로 어떻게 내려오는지를 보여주는 자산”으로 읽는 게 더 강하다.

## 학습할 때 흔한 실수

### 구현부터 보는 것
도구의 모양만 남고 개념을 놓친다.

### task를 너무 크게 잡는 것
loop가 철학이 아니라 비용이 된다.

### verification 없이 돌리는 것
결과가 아니라 기분만 남는다.

### file-based state를 빼먹는 것
fresh context 전략이 공허해진다.

### “반복하면 된다” 수준으로 축소하는 것
핵심은 반복이 아니라 fresh context + verification 구조다.

## 다음 글에서 볼 것

다음 글에서는 [fresh context를 rlp-desk는 어떻게 구현하나](/blog/how-rlp-desk-implements-fresh-context/)로 넘어가서,
- `brainstorm -> init -> run`
- file contract
- worker / verifier separation
- per-US verify / self-verification
를 실제 구현 흐름으로 본다.

<section class="series-card">
  <p class="resource-title">Series navigation</p>
  <ol class="series-list">
    <li><a href="/blog/what-is-ralph-loop/">Ralph Loop란 무엇인가</a></li>
    <li><strong>지금 글:</strong> Ralph Loop 학습 가이드</li>
    <li><a href="/blog/how-rlp-desk-implements-fresh-context/">fresh context를 rlp-desk는 어떻게 구현하나</a></li>
    <li><a href="/blog/why-rlp-desk-and-fresh-context/">왜 rlp-desk인가 / fresh context의 장점</a></li>
    <li><a href="/blog/rlp-desk-codex-consensus-and-whats-next/">rlp-desk 심화: Codex, consensus verify, 그리고 다음 단계</a></li>
    <li><a href="/blog/strengthening-verification-plans-and-cross-model-validation/">검증계획을 강화하니, 교차모델 검증의 가치가 더 분명해졌다</a></li>
  </ol>
</section>
