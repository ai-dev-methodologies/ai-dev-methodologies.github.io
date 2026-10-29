---
layout: default
title: kyjin 소개와 기술 포트폴리오
description: "AI 모델의 작업 비용, 에이전트의 상태 관리와 결과 검증을 분석하는 kyjin의 기술 블로그. rlp-desk 공개 구현과 설계 문서를 다룬다."
permalink: /writing-lab/existing/about/
canonical_url: https://ai-dev-methodologies.github.io/about/
noindex: true
sitemap: false
---

<p class="meta">문체 비교 A · <a href="/writing-lab/researched/about/">다른 버전 읽기</a> · <a href="/writing-lab/">비교 목록</a> · <a href="/about/">기본 페이지</a></p>

<p class="eyebrow">KYJIN / ENGINEERING NOTES</p>
<h1>AI 에이전트의<br>실행 구조와 검증</h1>

이 블로그에서는 AI 모델의 비용, 긴 작업을 이어가는 상태 관리, 결과의 합격 여부를 확인하는 방법을 다룬다. 모델이 답을 만드는 과정과 그 답을 업무에 사용할 수 있다고 판정하는 과정을 구분한다.

주요 구현 사례는 [rlp-desk](https://github.com/ai-dev-methodologies/rlp-desk)다. Claude와 Codex를 새 실행 문맥에서 호출하고, 작업을 수행하는 역할과 결과를 검수하는 역할을 분리하는 구조를 [코드와 함께 설명한다](/blog/how-rlp-desk-implements-fresh-context/).

## 분석 주제와 공개 결과물

| 주제 | 글 | 다루는 내용 |
|---|---|---|
| 모델 선택과 비용 | [Terra와 Sol 비교](/writing-lab/existing/gpt-61-terra-sol-cost/) | API 단가, 재시도, 사람의 수정 비용 |
| 업무 성공 판정 | [모델 평가 기준](/writing-lab/existing/deepseek-model-evaluation/) | 입력 조건과 합격 기준을 분리한 환불 예시 |
| 작업 상태 관리 | [기록과 인수인계](/writing-lab/existing/agent-memory-handoff/) | 목표, 변경 범위, 확인 결과의 전달 |
| 에이전트 실행 구조 | [rlp-desk 구현 설명](/blog/how-rlp-desk-implements-fresh-context/) | 새 실행 문맥, 역할 분리, 단계별 검증 |

## 글의 기준

가격처럼 바뀌는 수치에는 확인일을 적고, 가상 예시와 직접 실행한 결과를 구분한다. 구현을 설명할 때는 공개 코드에 연결한다.

## 문서와 프로필

- [주제별 기술 문서](/learn/)
- [전체 글과 시리즈](/blog/)
- [GitHub 공개 저장소](https://github.com/ai-dev-methodologies)
- [LinkedIn 프로필](https://www.linkedin.com/in/kwangyong-jin-037168372/)
