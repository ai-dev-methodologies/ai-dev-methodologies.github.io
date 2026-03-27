---
layout: post
title: "Ralph Loop란 무엇인가"
description: "긴 세션이 왜 망가지고, Ralph Loop가 왜 반복보다 fresh context를 핵심으로 보는지 실무 관점에서 설명한다."
permalink: /blog/what-is-ralph-loop/
series: "Ralph Loop"
series_slug: "ralph-loop"
series_order: 1
featured_series: true
tags:
  - ralph-loop
  - fresh-context
  - ai-coding
  - workflow
  - verification
---

Ralph Loop를 처음 보면 대개 두 가지 반응이 나온다. “결국 반복 실행하는 bash loop 아닌가?” 혹은 “이걸 켜두면 AI가 밤새 알아서 일하겠네?” 둘 다 반은 맞고 반은 틀리다. 내가 Ralph Loop를 계속 붙잡는 이유는 반복 횟수 때문이 아니라, 긴 세션이 망가지는 문제를 `fresh context`로 풀려는 관점 때문이다.

<figure class="diagram-card">
  <img src="/assets/img/ralph-loop-core.svg" alt="긴 대화 세션과 Ralph Loop의 차이를 보여주는 다이어그램">
  <figcaption>Ralph Loop의 핵심은 상태를 파일에 남기고, 매 반복을 fresh context에서 다시 시작하는 데 있다.</figcaption>
</figure>

## 왜 이 개념이 지금 중요할까

AI 코딩을 조금만 길게 돌려보면 비슷한 문제가 생긴다.

- 앞에서 실패한 시도가 뒤로 갈수록 잡음으로 남는다
- 임시 결정이 나중에는 사실처럼 굳는다
- 모델은 “현재 목표”보다 “지금까지 쌓인 흔적”에 더 끌린다
- 결과는 그럴듯한데 믿기 어려운 상태가 된다

그래서 장기 작업에서 더 중요한 건 모델이 얼마나 똑똑한가만이 아니다. **작업을 어떤 구조로 계속 이어가게 하느냐**가 더 중요해진다. Ralph Loop는 그 구조에 대한 답이다.

## 한 문장 정의

> 대화 맥락을 메모리로 신뢰하지 않고, 상태를 파일에 남긴 뒤, 매 반복을 fresh context에서 다시 시작하는 운영 방식.

여기서 핵심은 세 가지다.

1. `fresh context`
2. `filesystem as memory`
3. `verification`

이 셋이 같이 있어야 Ralph Loop를 그냥 밈이 아니라 실제 운영 방식으로 읽을 수 있다.

## 사람들이 자주 오해하는 것

### 1. 반복이 많을수록 좋다
아니다. 구조 없이 반복하면 비용만 커진다.

### 2. 좋은 모델이면 구조는 덜 중요하다
아니다. 모델이 좋아질수록 잘못된 구조를 더 빠르게 증폭시키기도 한다.

### 3. 한 번에 큰 일을 맡겨도 된다
아니다. 경계 없이 넘기면 loop가 아니라 혼란이 된다.

### 4. 검증은 마지막에 한 번만 해도 된다
아니다. 중간 경계가 없으면 “거의 맞는 상태”가 길게 누적된다.

## 실무에서 이 개념을 볼 때 체크할 것

- 상태를 대화창이 아니라 파일에 남기고 있는가
- 반복 단위가 bounded task 수준으로 작아졌는가
- 다음 반복이 이전 채팅을 그대로 상속받지 않는가
- 완료 주장과 검증이 분리되어 있는가
- 실패했을 때 어디서 다시 시작해야 하는지 경계가 보이는가

이 체크리스트를 통과하지 못하면, 그건 Ralph Loop를 쓴다고 말해도 실제로는 긴 세션을 반복 호출하는 것에 가까울 수 있다.

## 여기서 멈추면 안 되는 이유

이 글은 개념을 붙잡는 글이다. 그런데 개념만 알아서는 소용이 없다. 실제로 어떻게 학습하고 어디를 먼저 봐야 하는지가 따라와야 한다. Ralph Loop는 “좋아 보이는 철학”으로 끝나기 쉬운 주제이기 때문이다.

다음 글에서는:

- 무엇을 먼저 읽어야 하는지
- fresh context를 어떤 순서로 이해해야 하는지
- 어떤 실패 패턴을 먼저 경계해야 하는지
- 왜 구현 proof를 마지막에 봐야 하는지

를 학습 가이드로 정리한다.

<section class="series-card">
  <p class="resource-title">Series navigation</p>
  <ol class="series-list">
    <li><strong>지금 글:</strong> Ralph Loop란 무엇인가</li>
    <li><a href="/blog/how-to-learn-ralph-loop/">Ralph Loop 학습 가이드</a></li>
    <li><a href="/blog/how-rlp-desk-implements-fresh-context/">fresh context를 rlp-desk는 어떻게 구현하나</a></li>
    <li><a href="/blog/why-rlp-desk-and-fresh-context/">왜 rlp-desk인가 / fresh context의 장점</a></li>
    <li><a href="/blog/rlp-desk-codex-consensus-and-whats-next/">rlp-desk 심화: Codex, consensus verify, 그리고 다음 단계</a></li>
    <li><a href="/blog/strengthening-verification-plans-and-cross-model-validation/">검증계획을 강화하니, 교차모델 검증의 가치가 더 분명해졌다</a></li>
  </ol>
</section>
