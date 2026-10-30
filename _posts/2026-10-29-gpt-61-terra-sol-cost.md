---
layout: post
content_id: MED-BLG-AGCOD-003
title: "GPT-6.1 Terra는 절반 가격인데, 코딩도 더 저렴할까?"
description: "GPT-6.1 Terra와 Sol의 API 요금, 재시도와 수정 비용을 비교한다. 세대별 가격과 실행 모드의 차이, 모델 전환 조건을 정리했다."
permalink: /blog/gpt-61-terra-sol-cost/
author: kyjin
categories: [models]
tags: [AI, 학습, 모델-선택과-비용]
series: "AI 에이전트 설계 노트"
series_order: 1
level: 입문
date: 2026-10-29 15:00:00 +0900
last_modified_at: 2026-10-30 09:45:22 +0900
image: /assets/img/terra-cost.png
---

Terra의 API 단가가 낮아졌다는 사실만으로 코딩 모델을 바꾸기는 어렵다. 판단 단위는 토큰 가격이 아니라 미리 정한 통과 조건을 통과한 작업 하나의 총비용이다. 토큰은 모델이 읽고 쓰는 양, 캐시는 이전 입력을 다시 읽을 때 낮아지는 입력 요금, 하네스는 평가가 작업을 실행하고 채점하는 환경이다.

[Vals의 Mini-SWE-agent Terminal-Bench 4](https://www.vals.ai/benchmarks/terminal-bench-4)(10월 29일 갱신, 10월 30일 확인)에서는 Sol 6.1이 55.05%, 테스트당 $1.72, Terra 6.1이 49.49%, $2.04였다. Terra는 32분 45초로 더 빨랐지만, 점수는 5.56퍼센트포인트 낮고 비용은 18.6% 높다. Opus 5.5는 65.15%, $13.20, 1시간 4분이다. 같은 하네스를 썼더라도 추론 강도와 토큰 구성이 같다고 단정할 수 없으며, 이 결과는 모든 코딩 업무의 결론이 아니다.

| 모델 | Terminal-Bench 4 점수 | 테스트당 비용 | 시간 |
|---|---:|---:|---:|
| Sol 6.1 | 55.05% | $1.72 | 45분 12초 |
| Terra 6.1 | 49.49% | $2.04 | 32분 45초 |
| Opus 5.5 | 65.15% | $13.20 | 1시간 4분 |

## 단가와 작업 비용을 분리한다

2026-10-29 Standard API의 100만 토큰당 가격은 다음과 같다. 이전 5.6 Terra를 6/6.1 Sol과 비교하면 입력 단가가 같고 출력은 Terra가 더 비쌌다. 비용 때문에 굳이 Terra로 옮길 이유가 약했던 셈이다. 새 6.1 Terra는 입력·캐시·출력 단가가 모두 6.1 Sol의 절반이다. 다만 같은 5.6 세대의 Sol과 Terra 사이에는 원래 가격 차이가 있었다.

| 모델 | 입력 | 캐시 입력 | 출력 |
|---|---:|---:|---:|
| [5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra) | $2 | $0.20 | $12 |
| [6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) | $2 | $0.20 | $10 |
| [6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol) | $2 | $0.10 | $10 |
| [6.1 Terra](https://developers.openai.com/api/docs/models/gpt-6.1-terra) | $1 | $0.05 | $5 |

| 가정 | 5.6 Terra | 6.1 Sol | 6.1 Terra |
|---|---:|---:|---:|
| 입력 10만·출력 1만, 캐시 없음 | $0.32 | $0.30 | $0.15 |
| 입력 9만 캐시·1만 신규·출력 1만 | — | $0.129 | $0.0645 |

두 번째 Terra 계산은 `0.09×0.05 + 0.01×1 + 0.01×5`다. 캐시는 이전에 처리한 입력을 재사용해 할인받는 방식이다. 이 계산에서 캐시는 입력 요금만 줄이고 출력 요금은 줄이지 않는다. 같은 토큰 수가 같은 품질을 뜻하지도 않는다.

<figure class="diagram-card"><img src="/assets/img/terra-cost.png" width="1200" height="630" alt="입력 10만과 출력 1만 토큰을 가정하면 기존 Terra 0.32달러, 6.1 Sol 0.30달러, 새 Terra 0.15달러"><figcaption>직접 계산한 예시. 토큰 수가 같고, 캐시·도구·긴 요청 가산·재시도가 없다고 가정했다.</figcaption></figure>

## 스무 작업으로 보는 전환 조건

전환은 알려진 작업 20개에 같은 미리 정한 통과 조건을 적용해 판단할 수 있다. 이는 제안된 실험 설계이지 실행 결과가 아니다. 예를 들어 Terra가 총 $3에 12건을 통과하면 통과 작업당 $0.25다. Sol이 총 $6에 18건을 통과하면 $0.333이다. Terra가 8건만 통과하면 $0.375로 역전된다. 사람 검토 시간은 별도 열로 기록한다. 실패하면 한 번만 재시도하고, 그 뒤에는 더 강한 모델이나 사람 검토로 넘기는 규칙이 맹목적 최대 추론보다 낫다.

## 4배의 가격 차이와 9배의 작업 비용은 다르다

[Anthropic 공식 가격표](https://platform.claude.com/docs/en/about-claude/pricing)의 Opus 5.5 입력·캐시 읽기·출력 단가는 각각 $4·$0.20·$20이다. 새 Terra는 이 세 항목에서 각각 4분의 1이다. 캐시를 새로 쓰는 요금과 도구 비용 등은 별도 조건이므로 모든 청구 항목이 같은 비율이라는 뜻은 아니다.

[OpenAI가 발표한 Agents’ Last Exam](https://openai.com/ko-KR/index/introducing-gpt-6-1-terra/)의 최대 추론 강도 결과에서 ‘Opus보다 약 9배 낮은 비용’은 특정 컴퓨터 사용 평가의 작업당 비용이지 Sol과의 토큰 가격 차이 또는 모든 코딩 절감률이 아니다. OpenAI의 Terminal-Bench 4 평가에서는 5.6 Terra 21.5%에서 6.1 Terra 50.3%로 개선됐지만, 가장 어려운 코딩에는 Sol이나 Astra를 권한다. Terra Fast는 Standard의 두 배 단가라 Sol Standard와 단가가 같아지고, [추가 크레딧 요율](https://learn.chatgpt.com/docs/pricing)만으로 구독에 포함된 사용량이 정확히 두 배라고 계산할 수는 없다. 사람 검토 시간과 지연 시간이 더 중요한 작업이라면 이 비용표와 다른 경로를 선택할 수 있다.

평가 종류도 나눠 봐야 한다. OpenAI는 별도의 Terminal-Bench-Science 0.1에서는 Terra가 Sol보다 높은 점수를 낮은 비용으로 냈다고 발표했다. 어려운 터미널 작업의 평균 결과와 과학 작업의 결과를 합쳐 하나의 순위로 만들면 이 차이를 놓친다.

내 판단은 범위가 명확한 초안·자료 정리·작은 수정에 Terra를 다시 비교 후보로 넣되, 복잡한 코딩의 Sol 기본값은 실제 작업 결과를 모은 뒤 바꾸는 쪽이다. 글쓰기 역시 개선됐다는 발표만으로 한국어 전문 글의 품질이 입증되지는 않는다. 사실 누락과 수정 시간을 함께 비교해야 한다.

다음 읽기: [DeepSeek의 도구 호출과 검증](/blog/deepseek-model-evaluation/) · [학습 서재](/learn/).
