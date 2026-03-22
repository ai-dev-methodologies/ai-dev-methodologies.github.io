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
---

`rlp-desk`를 단순히 Ralph 구현물 정도로만 보면 이 프로젝트의 절반밖에 못 본다. 내가 더 중요하게 보는 건, 이 도구가 모델 성능 향상을 execution/verification 구조로 어떻게 흡수하려고 하느냐는 점이다.

<figure class="diagram-card">
  <img src="/assets/img/rdesk-advanced.svg" alt="rlp-desk의 Codex, per-US verify, consensus, self-verification 확장 경로를 보여주는 다이어그램">
  <figcaption>핵심은 planning 기능을 늘리는 게 아니라 execution/verification loop를 더 믿을 수 있게 만드는 방향이다.</figcaption>
</figure>

## 지금 보이는 확장

- Codex worker / verifier 지원
- per-US verify
- consensus verify
- self-verification

이건 기능 나열이 아니다. `좋은 입력이 들어왔을 때, 그걸 얼마나 더 믿을 수 있게 돌릴 것인가`에 대한 답에 가깝다.

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
