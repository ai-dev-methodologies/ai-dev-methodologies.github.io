---
layout: default
title: ai-dev-methodologies
description: "AI 모델 비용, 에이전트 상태 관리와 검증을 다루는 기술 블로그. 설계 비교와 rlp-desk 공개 구현을 설명한다."
permalink: /writing-lab/existing/
canonical_url: https://ai-dev-methodologies.github.io/
noindex: true
sitemap: false
---

<p class="meta">문체 비교 A · <a href="/writing-lab/researched/">다른 버전 읽기</a> · <a href="/writing-lab/">비교 목록</a> · <a href="/">기본 페이지</a></p>

<section class="hero">
  <p class="eyebrow">AI DEVELOPMENT METHODOLOGIES</p>
  <h1>AI 에이전트 설계와<br><span class="accent">검증</span></h1>
  <p class="hero-copy">모델 비용, 작업 상태 관리, 결과 검증을 다룬다. 설계 대안을 비교하고 rlp-desk의 공개 코드로 실행 구조를 설명한다.</p>
  <div class="hero-actions"><a class="btn-primary" href="/learn/">주제별 문서 보기</a><a class="btn-secondary" href="/writing-lab/existing/about/">소개와 공개 구현</a></div>
</section>

<section class="feature-grid">
  <article class="feature-card"><p class="feature-label">실행 방식</p><h2>Ralph Loop</h2><p>작업마다 새 실행 문맥을 만들고, 파일에 남긴 목표와 진행 상태를 읽어 다음 작업을 수행하는 방식.</p></article>
  <article class="feature-card"><p class="feature-label">공개 구현</p><h2>rlp-desk</h2><p>Claude와 Codex를 비대화형으로 호출하고, 작업 수행과 검수를 분리하는 도구. 사용자 스토리별 검증을 지원한다.</p></article>
  <article class="feature-card"><p class="feature-label">설계 주제</p><h2>작업 흐름과 결과 검증</h2><p>자동화 작업을 단계로 나누고, 각 단계의 입력 조건과 합격 기준을 정하는 방법.</p></article>
</section>

<section class="group-section"><h2>같은 버전으로 읽기</h2><ul><li><a href="/writing-lab/existing/gpt-61-terra-sol-cost/">Terra와 Sol 비용 비교</a></li><li><a href="/writing-lab/existing/deepseek-model-evaluation/">모델의 업무 성공 판정</a></li><li><a href="/writing-lab/existing/agent-memory-handoff/">작업 기록과 인수인계</a></li></ul></section>
