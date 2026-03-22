---
layout: post
title: "Ralph Loop란 무엇인가"
description: "긴 세션이 왜 망가지고, Ralph Loop가 왜 반복보다 fresh context를 핵심으로 보는지 설명한다."
permalink: /blog/what-is-ralph-loop/
tags:
  - ralph-loop
  - fresh-context
  - ai-coding
  - workflow
---

`Ralph Loop`가 자꾸 언급되는 이유는 단순히 반복을 많이 돌리기 때문이 아니다. 내가 붙잡은 핵심은 언제나 `fresh context`였다. 긴 세션을 더 오래 끌고 가는 대신, 매 반복을 의도적으로 새로 시작하게 만드는 관점이 여기 있다.

<figure class="diagram-card">
  <img src="/assets/img/ralph-loop-core.svg" alt="긴 대화 세션과 Ralph Loop의 차이를 보여주는 다이어그램">
  <figcaption>긴 대화를 더 오래 유지하는 대신, 상태를 파일에 남기고 새 컨텍스트로 다시 시작하는 것이 Ralph Loop의 핵심이다.</figcaption>
</figure>

## 왜 이 개념이 중요할까

AI 코딩을 오래 시켜본 사람은 금방 비슷한 벽을 만난다. 처음엔 잘 되다가, 세션이 길어질수록 맥락이 흐려지고 실패한 시도들이 쌓인다. 그러면 모델은 “많이 알고 있는 상태”가 아니라 “잡음을 너무 많이 안고 있는 상태”가 된다.

Ralph Loop는 여기서 관점을 바꾼다.

- 기억은 대화창이 아니라 파일에 남긴다
- 다음 반복은 그 파일을 다시 읽고 시작한다
- 핵심은 반복 횟수가 아니라 `fresh context`다

즉 모델을 더 오래 붙잡아 두는 기술이 아니라, 오염되지 않게 계속 일하게 하는 운영 방식에 가깝다.

## 이 글에서 잡아둘 핵심

- 긴 세션은 종종 망각보다 오염이 더 큰 문제다
- Ralph Loop는 그 오염을 끊는 운영 방식이다
- 핵심은 `fresh context`, `filesystem memory`, `verification`의 결합이다

<section class="series-card">
  <p class="resource-title">Series navigation</p>
  <ol class="series-list">
    <li><strong>지금 글:</strong> Ralph Loop란 무엇인가</li>
    <li><a href="/blog/how-to-learn-ralph-loop/">Ralph Loop 학습 가이드</a></li>
    <li><a href="/blog/how-rlp-desk-implements-fresh-context/">fresh context를 rlp-desk는 어떻게 구현하나</a></li>
    <li><a href="/blog/why-rlp-desk-and-fresh-context/">왜 rlp-desk인가 / fresh context의 장점</a></li>
    <li><a href="/blog/rlp-desk-codex-consensus-and-whats-next/">rlp-desk 심화: Codex, consensus verify, 그리고 다음 단계</a></li>
  </ol>
</section>
