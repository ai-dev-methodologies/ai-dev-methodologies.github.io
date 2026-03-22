---
layout: post
title: "rlp-desk 심화: Codex, consensus verify, 그리고 다음 단계"
description: "rlp-desk에 들어간 Codex 지원, per-US verify, consensus verify, self-verification의 의미와 다음 시리즈 방향을 정리한다."
permalink: /blog/rlp-desk-codex-consensus-and-whats-next/
series: "rlp-desk"
series_slug: "rlp-desk"
series_order: 5
featured_series: true
tags:
  - rlp-desk
  - codex
  - consensus
  - self-verification
  - workflow
  - verification
---

`rlp-desk`를 단순히 Ralph 구현물 정도로만 보면 이 프로젝트의 절반밖에 못 본다. 내가 더 중요하게 보는 건, 이 도구가 모델 성능 향상을 execution/verification 구조로 어떻게 흡수하려고 하느냐는 점이다.

<figure class="diagram-card">
  <img src="/assets/img/rdesk-advanced.svg" alt="rlp-desk의 Codex, per-US verify, consensus, self-verification 확장 경로를 보여주는 다이어그램">
  <figcaption>핵심은 planning 기능을 늘리는 게 아니라 execution/verification loop를 더 믿을 수 있게 만드는 방향이다.</figcaption>
</figure>

## 이 글에서 보고 싶은 것

이 글은 “최근에 기능이 뭐가 더 붙었나?”를 나열하려는 글이 아니다. 더 중요한 질문은 이거다.

> `rlp-desk`가 왜 단순 loop runner에서 더 믿을 수 있는 execution/verification tool 쪽으로 움직이고 있는가?

그 질문을 기준으로 봐야 Codex 지원, per-US verify, consensus, self-verification이 각각 무슨 의미인지 보인다.

## 첫 번째 변화: Codex support

Codex 지원이 의미 있는 이유는 단순히 모델 선택지가 늘었다는 데 있지 않다.

- worker를 Codex로 돌릴 수 있고
- verifier를 Codex로 돌릴 수도 있고
- consensus verify에서도 Codex를 한 축으로 쓸 수 있다

이 말은 결국, 좋은 입력이 들어왔을 때 어떤 엔진이 execution과 verification을 더 잘 맡는지 loop 안에서 직접 비교해볼 수 있다는 뜻이다. 즉 `rlp-desk`는 특정 모델 전용 툴이라기보다, 모델 발전을 실행 구조 안에 흡수하는 인터페이스 쪽으로도 가고 있다.

## 두 번째 변화: per-US verify

`--verify-mode per-us`는 작은 옵션처럼 보여도 의미가 꽤 크다.

예전에는 “다 만들고 마지막에 한 번 확인”하는 흐름이 자연스러웠다. 그런데 long-running loop에서는 이 방식이 자주 무너진다. 중간에 틀어져도 끝까지 가버리고, 마지막에 한꺼번에 터지기 때문이다.

per-US verify는 그 경계를 더 자주 만든다.

- user story 하나를 끝낸다
- 바로 그 story만 검증한다
- 통과하면 다음 story로 간다
- 마지막에는 `ALL` verify로 전체를 다시 확인한다

이건 속도보다 통제력을 선택하는 구조다. 내 기준에선, long-running AI work일수록 이 선택이 더 중요해진다.

## 세 번째 변화: consensus verify

`--verify-consensus`는 검증 자체도 한 엔진에만 맡기지 않겠다는 선택이다.

- claude verifier가 한 번 보고
- codex verifier가 한 번 더 보고
- 둘 다 pass여야 최종 통과

비용은 더 든다. 하지만 worker claim을 verifier 하나에만 맡기는 것도 결국 단일 판단이다. consensus verify는 그 단일 판단을 조금 더 단단하게 만들려는 시도다.

완전히 매끄럽다고 말하긴 아직 이르다. 그래도 방향은 분명하다. “돌아간다”에서 끝나는 게 아니라, “더 믿을 수 있게 돌릴 수 있는가”로 검증 수준을 높이려는 쪽이다.

## 네 번째 변화: self-verification

내가 최근 구조에서 특히 중요하게 보는 건 self-verification이다.

`tests/self-verification-methodology.md`를 보면, `rlp-desk`는 기능을 추가하고 끝내는 식으로 움직이지 않는다. `[PLAN] / [EXEC] / [VALIDATE]` 로그를 남기고, 루프 자체가 의도대로 돌았는지 다시 검증하려고 한다.

이건 꽤 중요한 차이다.

- 계획한 흐름이 실제로 그렇게 실행됐는지
- per-US verify가 실제로 빠짐없이 돌았는지
- consensus가 의도한 시점에만 실행됐는지
- fix loop가 몇 번 돌았는지

즉 이건 기능 검증을 넘어 **운영 구조 검증**으로 올라간다.

## planning tool이 아니라는 점은 더 분명해진다

이 시점에서 다시 강조해야 할 건, 이런 확장이 들어왔다고 해서 `rlp-desk`가 planning tool이 되는 건 아니라는 점이다.

좋은 PRD와 초기 breakdown은 여전히 상위 planning layer가 더 잘한다.

- `deep-interview`
- `ralplan`
- `oh-my-claudecode` 같은 broader orchestration layer

이런 도구와 강한 모델은 이미 요구사항 정리와 task 분해에서 꽤 강하다.

반면 `rlp-desk`는 그 아래에서 움직인다.

- 이미 정리된 계약을 받아
- worker와 verifier를 돌리고
- pass/fail에 따라 다시 루프를 만들고
- 그 구조 자체도 검증한다

즉 `rlp-desk`의 확장은 planning 확장이 아니라 execution/verification 확장으로 읽는 편이 맞다.

## 왜 이 방향이 중요한가

모델이 좋아질수록 사람의 역할이 사라지는 게 아니라 이동한다고 생각한다.

- 구현 코드의 세부를 직접 쓰는 시간은 줄 수 있다
- 좋은 PRD를 만드는 시간도 줄 수 있다
- breakdown도 점점 더 잘해질 수 있다

그런데 오히려 더 중요해지는 건:

- 무엇을 통과로 볼 것인가
- 어떤 검증 경계를 둘 것인가
- 어떤 테스트를 두면 agent가 우회하지 못하는가

즉, 모델 성능 향상을 실제 생산성 향상으로 바꾸는 데 필요한 건 결국 검증 가능한 운영 구조다. `rlp-desk` 최근 확장이 흥미로운 이유도 여기에 있다.

## 그다음은 무엇인가

여기서 다음 시리즈로 넘어간다.

1. `rlp-desk`로 비정형 자동화 실험을 빠르게 만들고, 경험이 쌓이면 팀의 반복 가능한 workflow로 정형화하는 방법론
2. AI agent가 가짜 확신이나 우회 구현으로 빠지지 못하게 하는 `test/verification planning methodology`

즉 `rlp-desk`는 실행 구조를 제공하고, 그 위에서 workflow methodology와 verification planning methodology가 더해져야 실무적으로 더 믿을 수 있는 자동화가 완성된다.

<section class="series-card">
  <p class="resource-title">Series navigation</p>
  <ol class="series-list">
    <li><a href="/blog/what-is-ralph-loop/">Ralph Loop란 무엇인가</a></li>
    <li><a href="/blog/how-to-learn-ralph-loop/">Ralph Loop 학습 가이드</a></li>
    <li><a href="/blog/how-rlp-desk-implements-fresh-context/">fresh context를 rlp-desk는 어떻게 구현하나</a></li>
    <li><a href="/blog/why-rlp-desk-and-fresh-context/">왜 rlp-desk인가 / fresh context의 장점</a></li>
    <li><strong>지금 글:</strong> rlp-desk 심화: Codex, consensus verify, 그리고 다음 단계</li>
  </ol>
</section>
