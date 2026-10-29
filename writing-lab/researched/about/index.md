---
layout: default
title: kyjin 소개와 기술 포트폴리오
description: "AI 모델의 작업 비용, 에이전트의 상태 관리와 결과 검증을 분석하는 kyjin의 기술 블로그. rlp-desk 공개 구현과 설계 문서를 다룬다."
permalink: /writing-lab/researched/about/
canonical_url: https://ai-dev-methodologies.github.io/about/
noindex: true
sitemap: false
---

<p class="meta">문체 비교 B · <a href="/writing-lab/existing/about/">다른 버전 읽기</a> · <a href="/writing-lab/">비교 목록</a> · <a href="/about/">기본 페이지</a></p>

<p class="eyebrow">KYJIN / ENGINEERING NOTES</p>
<h1>AI 에이전트의<br>실행 구조와 검증</h1>

이 블로그는 모델의 답변을 업무 결과로 받아들이기 전 무엇을 확인해야 하는지 기록한다. 비용을 비교할 때는 재시도와 수정 시간을 포함하고, 긴 작업은 다음 실행이 읽을 상태로 남긴다.

공개 구현 사례인 [rlp-desk](https://github.com/ai-dev-methodologies/rlp-desk)는 Claude와 Codex를 새 실행 문맥에서 호출하고 작업과 검수를 분리한다. 구조와 근거는 [구현 설명](/blog/how-rlp-desk-implements-fresh-context/)에서 볼 수 있다.

## 분석 주제와 공개 결과물

| 주제 | 글 | 다루는 내용 |
|---|---|---|
| 모델 선택과 비용 | [Terra와 Sol 비교](/writing-lab/researched/gpt-61-terra-sol-cost/) | API 단가, 재시도, 사람의 수정 비용 |
| 업무 성공 판정 | [모델 평가 기준](/writing-lab/researched/deepseek-model-evaluation/) | 입력 조건과 합격 기준을 분리한 환불 예시 |
| 작업 상태 관리 | [기록과 인수인계](/writing-lab/researched/agent-memory-handoff/) | 목표, 변경 범위, 확인 결과의 전달 |
| 에이전트 실행 구조 | [rlp-desk 구현 설명](/blog/how-rlp-desk-implements-fresh-context/) | 새 실행 문맥, 역할 분리, 단계별 검증 |

## 글의 기준

가상 사례, 확인한 사양, 공개 코드, 직접 실행 결과를 섞지 않는다. 가격과 같이 변하는 정보에는 확인일을 적고, 구현의 근거는 링크로 남긴다.

## 문서와 프로필

- [주제별 기술 문서](/learn/)
- [전체 글과 시리즈](/blog/)
- [GitHub 공개 저장소](https://github.com/ai-dev-methodologies)
- [LinkedIn 프로필](https://www.linkedin.com/in/kwangyong-jin-037168372/)
