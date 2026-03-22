---
layout: post
title: "왜 rlp-desk인가 / fresh context의 장점"
description: "왜 fresh context가 긴 작업에서 중요한지, 그리고 왜 Ralph 개념을 구현 자산인 rlp-desk로 옮겨야 했는지 설명한다."
permalink: /blog/why-rlp-desk-and-fresh-context/
tags:
  - rlp-desk
  - fresh-context
  - proof-asset
  - claude-code
---

`rlp-desk`를 만든 이유는 간단했다. Ralph Loop를 개념으로만 두고 싶지 않았기 때문이다. 내가 원한 건 긴 세션을 더 오래 끌고 가는 기술이 아니라, `fresh context`, `filesystem memory`, `verification`을 실제로 굴러가는 구조로 내려놓는 구현 자산이었다.

<figure class="diagram-card">
  <img src="/assets/img/rdesk-bridge.svg" alt="Ralph Loop에서 rlp-desk로 이어지는 브리지 다이어그램">
  <figcaption>Ralph Loop의 핵심 인사이트를 실제 명령어와 구조로 내려놓은 proof asset이 rlp-desk다.</figcaption>
</figure>

## 왜 굳이 구현까지 갔나

개념만 있으면 오래 못 간다. 특히 AI 코딩 쪽은 더 그렇다. 좋은 문장과 통찰은 금방 소비되지만, 실제로 돌아가는 명령어와 구조는 더 오래 남는다.

그래서 `rlp-desk`는:

- leader / worker / verifier 분리
- 파일 기반 메모리
- fresh context 반복
- 검증 분리

를 실제 명령어와 파일 구조로 보여준다.

## 이름을 `rlp`로 줄인 이유

`ralph-desk` 대신 `rlp-desk`를 택한 것도 의도가 있다. 일부 `oh-my-*` 계열 환경에서 Ralph 키워드 후킹이나 충돌을 피하고 싶었다. 의미는 유지하되 명령어 공간에서는 더 안전한 이름을 택한 셈이다.

<section class="series-card">
  <p class="resource-title">Series navigation</p>
  <ol class="series-list">
    <li><a href="/blog/what-is-ralph-loop/">Ralph Loop란 무엇인가</a></li>
    <li><a href="/blog/how-to-learn-ralph-loop/">Ralph Loop 학습 가이드</a></li>
    <li><a href="/blog/how-rlp-desk-implements-fresh-context/">fresh context를 rlp-desk는 어떻게 구현하나</a></li>
    <li><strong>지금 글:</strong> 왜 rlp-desk인가 / fresh context의 장점</li>
    <li><a href="/blog/rlp-desk-codex-consensus-and-whats-next/">rlp-desk 심화: Codex, consensus verify, 그리고 다음 단계</a></li>
  </ol>
</section>
