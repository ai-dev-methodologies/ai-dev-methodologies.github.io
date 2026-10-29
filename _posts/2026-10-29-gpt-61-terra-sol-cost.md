---
layout: post
content_id: MED-BLG-AGCOD-003
title: "GPT-6.1 Terra, 이제 Sol 대신 쓸 이유가 생겼다"
description: "GPT-6.1 Terra와 Sol의 가격 차이를 쉬운 예시로 비교한다. 토큰 단가와 실제 작업 비용의 차이, 모델을 바꿔도 되는 업무의 기준을 정리했다."
permalink: /blog/gpt-61-terra-sol-cost/
author: kyjin
categories: [models]
tags: [AI, 학습, 모델-선택과-비용]
series: "학습에서 판단으로"
series_order: 1
level: 입문
date: 2026-10-29 15:00:00 +0900
last_modified_at: 2026-10-29 15:00:00 +0900
image: /assets/img/terra-cost.png
---

예전에는 Terra를 쓸 이유가 잘 보이지 않았다. Sol과 비용이 비슷한데, 결과를 한 번 더 확인해야 한다면 절약이라고 부르기 어려웠다. GPT-6.1 Terra의 가격표를 보고 이 판단을 다시 살펴봤다.

내가 바꾼 판단은 이렇다. **이제 단가 차이는 분명하다. 다만 모델을 바꿀지는 결과 하나를 완성하는 데 든 비용으로 결정해야 한다.**

## 먼저, 토큰은 무엇인가

토큰은 AI가 글을 읽고 쓰는 양을 세는 단위다. 글자 수와 정확히 같지는 않다. API는 모델을 프로그램에서 호출하는 방식이고, 입력과 출력에 각각 요금이 붙는다. 자주 쓰는 입력을 재사용하면 캐시 가격이 적용될 수 있다.

월 구독료와 이 표의 API 요금은 다른 체계다. 아래는 2026-10-29 확인한 Standard API의 100만 토큰당 가격이다.

| 모델 | 입력 | 캐시 입력 | 출력 |
|---|---:|---:|---:|
| GPT-5.6 Terra | $2 | $0.20 | $12 |
| GPT-6 Sol | $2 | $0.20 | $10 |
| GPT-6.1 Sol | $2 | $0.10 | $10 |
| **GPT-6.1 Terra** | **$1** | **$0.05** | **$5** |

근거: [5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra), [6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol), [6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol), [6.1 Terra](https://developers.openai.com/api/docs/models/gpt-6.1-terra).

기존 Terra와 6/6.1 Sol은 입력 가격이 같았고, Terra의 출력은 오히려 비쌌다. 새 Terra는 현재 Sol의 절반이다. **같은 세대끼리 비교했는지부터 봐야 하는 이유**다. 5.6 Sol과 5.6 Terra 사이에도 원래 가격 차이는 있었다.

<figure class="diagram-card"><img src="/assets/img/terra-cost.png" width="1200" height="630" alt="입력 10만과 출력 1만 토큰을 가정하면 기존 Terra 0.32달러, 6.1 Sol 0.30달러, 새 Terra 0.15달러"><figcaption>직접 계산한 예시. 토큰 수가 같고, 캐시·도구·긴 요청 가산·재시도가 없다고 가정했다.</figcaption></figure>

## 절반 가격인데 왜 바로 바꾸지 않을까

번역 초안을 맡겼다고 생각해 보자. Sol은 한 번에 끝냈지만 Terra는 두 번 고치고 사람이 다시 다듬었다면, 첫 호출 가격만 비교해서는 답을 얻을 수 없다.

나는 다음 표를 함께 보려고 한다. 아래는 비교 방법에 대한 내 제안이며, 직접 측정한 결과표는 아니다.

| 확인할 것 | 쉬운 질문 |
|---|---|
| 첫 결과의 품질 | 바로 써도 되는가? |
| 재시도 | 몇 번 다시 시켰는가? |
| 사람의 수정 | 내가 고친 시간은 얼마인가? |
| 전체 사용량 | 실패한 시도의 비용도 넣었는가? |

‘Opus보다 약 9배 저렴’이라는 문구도 같은 주의가 필요하다. OpenAI가 제시한 수치는 특정 컴퓨터 조작 평가에서의 작업당 비용 비교다. Sol과의 가격 차이나 모든 개발 업무의 절감률로 읽으면 안 된다. [공식 발표](https://openai.com/index/introducing-gpt-6-1-terra/)

## 내가 나누려는 업무의 경계

문서 초안, 자료 비교, 작게 고립된 수정은 Terra를 비교할 좋은 후보라고 본다. 반대로 요구사항 자체가 모호하거나, 여러 파일의 관계를 이해해야 하거나, 실패 뒤 복구가 어려운 일은 Sol을 유지할 이유가 있다. 이것은 내 선택 기준이지 Terra의 모든 능력을 입증한 실험 결과가 아니다.

추론 강도와 실행 모드도 맞춰야 한다. Terra Fast는 Standard의 두 배 요금이어서 Sol Standard와 기본 단가가 같아진다. Codex 추가 크레딧 요율도 포함 구독 한도를 정확히 두 배로 늘려 준다는 뜻은 아니다. [모드별 가격 조건](https://developers.openai.com/api/docs/models/gpt-6.1-terra), [Codex 사용량 안내](https://learn.chatgpt.com/docs/pricing)

내가 가격표에서 얻은 변화는 ‘모두 Terra로 바꾸자’가 아니다. **기존에는 애매했던 비교 후보가 이제는 분명해졌다**는 것이다. 다음에는 같은 자료를 주고, 같은 합격 기준으로 두 모델의 결과를 비교하면 된다.

## 읽고 나서 확인할 질문

입력 가격이 절반인 모델이 두 번 실패했다면 여전히 저렴할까? 이 질문에 답하려면 호출 가격 외에 무엇을 기록해야 할까?

이 글은 공식 자료에 근거한 독립 분석이다. 별도의 모델 비교 실험은 하지 않았다. 참고 대상으로 받은 [Medium 글](https://generativeai.pub/openai-claims-gpt-6-1-terra-is-9x-cheaper-than-opus-5-5-i-tested-the-trade-off-6aa6db33bbaa)의 본문은 확인하지 못했으므로 그 저자의 실험을 근거로 삼지 않았다.

다음 읽기: [DeepSeek 글에서 가져온 모델 평가 기준](/blog/deepseek-model-evaluation/) · [주제별 학습 서재](/learn/).
