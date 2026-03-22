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

Ralph Loop를 처음 보면 대부분 비슷한 함정에 빠진다. 개념은 흥미로운데, 막상 무엇을 먼저 봐야 할지 모르고 바로 구현이나 프롬프트 흉내로 뛰어든다. 그러면 금방 밈처럼 소비된다. 이 글은 그걸 막기 위한 학습 가이드다.

<figure class="diagram-card">
  <img src="/assets/img/ralph-learning-path.svg" alt="Ralph Loop 학습 경로 다이어그램">
  <figcaption>개념, fresh context, filesystem memory, verification, implementation proof를 순서대로 이해해야 Ralph Loop를 밈이 아니라 운영 방식으로 읽을 수 있다.</figcaption>
</figure>

## 먼저 결론부터

내가 권하는 학습 순서는 이렇다.

1. **개념**: Ralph Loop가 왜 나왔는지 이해한다  
2. **fresh context**: 왜 긴 세션이 망가지고, 무엇을 기억하지 않게 해야 하는지 본다  
3. **filesystem memory**: 상태를 어디에 남겨야 하는지 이해한다  
4. **verification**: 완료 주장과 판정을 어떻게 분리할지 본다  
5. **implementation proof**: 그다음에야 `rlp-desk` 같은 구현 자산을 읽는다

이 순서를 건너뛰면 “반복하면 된다” 정도로만 남고, 제대로 붙잡으면 실제 운영 철학으로 이어진다.

## 1단계: Ralph Loop가 왜 나왔는지부터 이해하기

첫 단계에서 해야 할 일은 단순하다. **이게 성능을 더 끌어내는 프롬프트 팁이 아니라, 긴 세션이 무너지는 문제에 대한 구조적 대응이라는 점**을 이해해야 한다.

여기서 체크할 질문:

- 왜 긴 세션은 자주 망가지는가?
- 망각보다 오염이 더 큰 문제라는 말이 무슨 뜻인가?
- “더 많은 맥락”이 항상 좋은 게 아니라는 말이 왜 나오는가?

이 질문에 답이 안 서면 뒤 단계는 전부 불안해진다.

## 2단계: `fresh context`를 정확히 이해하기

Ralph Loop의 핵심은 반복이 아니다. **fresh context**다. 즉, 이전 대화를 그대로 길게 끌고 가지 않고, 다음 반복이 새로 시작하게 만드는 구조가 중요하다.

이 단계에서 꼭 이해해야 하는 것:

- fresh context는 “새 탭 열기” 정도의 습관이 아니다
- 이전 실수, 임시 판단, 잡음을 그대로 들고 가지 않게 하는 운영 원칙이다
- 질문은 “무엇을 더 기억하게 할까?”보다 “무엇을 기억하지 않게 할까?”로 바뀌어야 한다

실제로 여기서 막히는 사람이 많다. loop만 보고 fresh context를 놓치면 Ralph Loop는 금세 평범한 반복처럼 보인다.

## 3단계: 상태를 파일에 남기는 방식을 이해하기

fresh context를 쓰겠다고 하면 곧바로 나오는 질문이 있다.

> 그럼 이전 반복의 상태는 어디에 남기지?

답은 파일이다.

여기서 봐야 할 아티팩트 예시는:

- PRD
- test spec
- task / user story list
- progress log
- context summary
- verification logs
- 필요하면 git commit history

즉 모델이 이전 대화를 “기억”하는 게 아니라, 다음 반복이 파일을 다시 읽고 상태를 “재구성”한다. 이 관점을 못 잡으면 fresh context는 금방 공허해진다.

## 4단계: verification을 따로 봐야 한다

많은 사람이 여기서 멈춘다. loop, fresh context, file-based state까지만 이해하고 끝낸다. 그런데 실전에서 더 위험한 건 에이전트가 틀리는 것 자체가 아니라, **틀렸는데도 “다 됐다”고 말하는 것**이다.

그래서 학습 단계에서부터 아래를 같이 봐야 한다.

- bounded task
- acceptance criteria
- machine-verifiable checks
- worker claim과 verifier judgment의 분리

이 단계가 약하면, 나중에 구현을 봐도 “그럴듯한데 믿기 어렵다”는 느낌만 남는다.

## 5단계: 그다음에야 구현 proof를 읽는다

이제야 `rlp-desk`를 보는 게 맞다.

왜 마지막이냐면, 구현을 먼저 보면 도구의 모양에 끌리고 개념을 놓치기 쉽기 때문이다. 반대로 앞의 네 단계를 먼저 잡고 나면 `rlp-desk`는 다음 질문에 답하는 proof asset으로 보인다.

- fresh context를 실제로 어떻게 구현했는가?
- 어떤 파일 구조로 상태를 유지하는가?
- worker / verifier는 어떻게 나뉘는가?
- verification은 어느 경계에서 들어오는가?

즉 `rlp-desk`는 “먼저 볼 도구”라기보다 “앞에서 이해한 개념이 실제로 어떻게 내려오는지를 보여주는 자산”으로 읽는 게 더 강하다.

## 따라 해볼 실습

이 글을 읽고 끝내면 또 추상적으로 남는다. 그래서 최소한 아래 정도는 직접 해보는 걸 권한다.

### 실습 1: 긴 세션의 문제를 관찰하기
- 같은 작업을 긴 세션으로 계속 밀어본다
- 어디서부터 판단이 흐려지는지 기록한다

### 실습 2: 상태를 파일로 빼보기
- 해야 할 일
- acceptance criteria
- 현재 frontier
- 완료 조건
을 대화창 대신 파일로 정리해본다

### 실습 3: 검증 경계 적어보기
- “무엇이 통과인지”를 문장으로 적는다
- 가능하면 shell command까지 적는다

### 실습 4: 그다음에 `rlp-desk` 보기
- `brainstorm`
- `init`
- `run`
흐름을 보고,
- file contract
- worker/verifier separation
- per-US verify
가 앞에서 본 개념과 어떻게 연결되는지 확인한다

## 학습할 때 흔한 실수

### 1. 구현부터 보는 것
도구의 모양에 끌리면 개념을 놓친다.

### 2. task를 너무 크게 잡는 것
작업이 커질수록 loop는 철학이 아니라 비용이 된다.

### 3. verification 없이 “알아서 잘되겠지”라고 기대하는 것
이건 거의 항상 오래 못 간다.

### 4. file-based state를 빼먹는 것
fresh context와 file-based state는 같이 간다.

### 5. “반복하면 된다” 수준으로 축소하는 것
핵심은 반복이 아니라 fresh context와 verification 구조다.

## 이 글을 읽고 나면 뭘 할 수 있어야 하나

최소한 아래는 말할 수 있어야 한다.

- Ralph Loop는 왜 나왔는가
- 왜 긴 세션보다 fresh context가 중요한가
- 상태를 왜 파일에 남겨야 하는가
- verification이 왜 loop의 일부여야 하는가
- 구현 proof는 왜 마지막에 보는 게 좋은가

여기까지가 잡히면, 다음 글에서 `rlp-desk`의 실제 구현을 볼 준비가 된 것이다.

<section class="series-card">
  <p class="resource-title">Series navigation</p>
  <ol class="series-list">
    <li><a href="/blog/what-is-ralph-loop/">Ralph Loop란 무엇인가</a></li>
    <li><strong>지금 글:</strong> Ralph Loop 학습 가이드</li>
    <li><a href="/blog/how-rlp-desk-implements-fresh-context/">fresh context를 rlp-desk는 어떻게 구현하나</a></li>
    <li><a href="/blog/why-rlp-desk-and-fresh-context/">왜 rlp-desk인가 / fresh context의 장점</a></li>
    <li><a href="/blog/rlp-desk-codex-consensus-and-whats-next/">rlp-desk 심화: Codex, consensus verify, 그리고 다음 단계</a></li>
  </ol>
</section>
