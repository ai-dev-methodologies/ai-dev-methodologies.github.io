---
layout: post
content_id: MED-BLG-CTXENG-001
title: "AI에게 전부 기억시키기보다, 다음 일을 시작할 근거를 남긴다"
description: "AI 에이전트의 기억과 인수인계를 회의록에 비유해 설명한다. Ilyas 시리즈를 읽고 정리한 작업 기록, 맥락 전달, 검증의 설계 기준이다."
permalink: /blog/agent-memory-handoff/
author: kyjin
categories: [context]
tags: [AI, 학습, 기억과-맥락]
series: "학습에서 판단으로"
series_order: 3
level: 입문
date: 2026-10-29 15:00:00 +0900
last_modified_at: 2026-10-29 15:00:00 +0900
image: /assets/img/memory-handoff.png
---

같은 일을 다음 날 이어가는데 앞의 결정을 다시 설명해야 한다면 답답하다. AI와 일할 때도 비슷하다. 이 문제를 읽으며 나는 ‘더 긴 대화’보다 **다음 작업이 무엇을 근거로 시작하는가**에 관심을 두게 됐다.

Ilyas Ibrahim Mohamed의 에이전트 조율 시리즈는 여러 AI를 늘리는 것만으로 협업이 되지 않았던 사례에서 출발한다. 나는 이를 사람의 회의록과 인수인계 문제에 빗대어 이해했다. 아래 흐름과 예시는 그 자료를 읽고 정리한 내 해석이다.

## 기억과 기록은 다르다

회의에 참여한 사람이 내용을 기억하는 것과, 다음 담당자가 결정 이유를 찾아볼 수 있는 것은 다르다. AI의 대화창도 비슷하다. 긴 대화가 남아 있어도 중요한 결정과 실패 기록을 쉽게 구분할 수 있다는 보장은 없다.

여기서 ‘맥락’은 지금 일을 하는 데 필요한 배경이다. 에이전트는 도구를 사용해 일을 수행하는 AI를 뜻한다. 둘 다 모든 과거 기록을 가져야 한다고 생각하면 자료를 읽는 일부터 커진다.

<figure class="diagram-card"><img src="/assets/img/memory-handoff.png" width="1200" height="630" alt="결정과 결과를 기록하고 필요한 맥락만 다음 담당자에게 전달한 뒤 결과를 확인하는 흐름"><figcaption>자체 정리한 인수인계 원리. 기록 보관과 필요한 맥락 전달은 서로 다른 역할이다.</figcaption></figure>

## 담당자가 바뀌어도 이어갈 수 있는 메모

예를 들어 ‘로그인 화면을 고쳐 달라’는 일을 넘긴다고 해 보자. 대화 전체 대신 다음 네 항목을 먼저 적으면 무엇을 해야 하는지 더 분명해진다. 실제 프로젝트의 측정 결과가 아니라 설명용 예시다.

| 항목 | 적어 둘 내용 |
|---|---|
| 목표 | 잘못된 비밀번호에 안내를 표시한다 |
| 바꾸지 않을 것 | 로그인 방식과 비밀번호 규칙 |
| 이미 확인한 것 | 현재는 안내 없이 화면만 멈춘다 |
| 끝났다는 근거 | 틀린 값·맞는 값으로 각각 확인한다 |

기록을 많이 남기는 것보다, 다음 판단에 필요한 기록이 무엇인지 고르는 편이 중요하다고 본다.

## 시리즈에서 가져온 네 가지 관점

1. **조율:** 첫 글은 에이전트 수보다 산출물 연결과 맥락 전달을 다룬다. [첫 글](https://medium.com/@ilyas.ibrahim/how-i-made-claude-code-agents-coordinate-100-and-solved-context-amnesia-5938890ea825)
2. **인수인계:** 두 번째 글은 기록 찾기, 필요한 내용 전달, 순서 제어, 결과 확인을 연결한다. [두 번째 글](https://medium.com/@ilyas.ibrahim/the-4-step-protocol-that-fixes-claude-codes-context-amnesia-c3937385561c)
3. **검토와 미룬 판단:** 세 번째 글은 변경에 맞는 검토와 기술 부채 기록으로 관심을 넓힌다. 기술 부채는 지금 해결하지 않기로 한 문제와 그 대가다. [세 번째 글](https://medium.com/@ilyas.ibrahim/how-to-build-production-grade-systems-with-claude-code-87f73dd311b9)
4. **역할의 연속성:** 관련 후속 글은 역할과 실행 이력을 잇는 구조를 제안한다. 이를 모델 자체가 세션 사이에서 기억을 갖는다는 뜻으로 읽지는 않는다. 공식 4편으로 확정된 글도 아니다. [관련 후속 글](https://medium.com/@ilyas.ibrahim/how-i-built-claude-code-agents-with-persistent-identity-and-memory-for-solo-builders-4e3af0cb866b)

## 파일이 있다는 것만으로는 부족하다

보고서 파일이 생겼다고 내용이 맞는 것은 아니다. 잘못된 결론도 파일로 저장할 수 있다. 내가 이 방식에 붙이고 싶은 조건은 ‘무엇을 남길까’와 함께 ‘어떤 내용을 확인해야 통과일까’를 정하는 것이다.

저자가 제시한 시간·효율 개선은 저자의 경험이다. 내가 같은 효과를 재현했다고 주장하지 않는다. 기록과 검토 자체도 비용이 들기 때문에 모든 작은 작업에 큰 절차를 붙일 필요는 없다.

내가 가져갈 원칙은 네 가지다. 다음 담당자가 목표를 찾을 수 있게 한다. 이미 실패한 일을 구분한다. 필요한 배경을 골라 준다. 마지막에는 결과 내용을 확인한다. 사람과 AI 어느 쪽이 다음 일을 맡아도 유용한 인수인계 기준이라고 본다.

읽고 확인하기: 과거 대화를 모두 복사하는 것과, 결정 이유를 남기는 것은 어떻게 다를까?

구현 사례가 궁금하다면 [fresh context를 rlp-desk는 어떻게 구현하나](/blog/how-rlp-desk-implements-fresh-context/)로 이어 읽을 수 있다. [공개 rlp-desk 저장소](https://github.com/ai-dev-methodologies/rlp-desk)에서 구현을 볼 수 있다.
