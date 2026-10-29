---
layout: default
title: ai-dev-methodologies
description: "AI 모델 비용, 에이전트 상태 관리와 검증을 다루는 기술 블로그. 설계 비교와 rlp-desk 공개 구현을 설명한다."
permalink: /writing-lab/researched/
canonical_url: https://ai-dev-methodologies.github.io/
noindex: true
sitemap: false
---

<p class="meta">문체 비교 B · <a href="/writing-lab/existing/">다른 버전 읽기</a> · <a href="/writing-lab/">비교 목록</a> · <a href="/">기본 페이지</a></p>

<section class="hero">
  <p class="eyebrow">AI DEVELOPMENT METHODOLOGIES</p>
  <h1>AI 에이전트의<br><span class="accent">실행과 검증</span></h1>
  <p class="hero-copy">작업당 비용과 실패 조건을 비교하고, 다음 실행에 전달할 상태와 결과의 합격 기준을 정한다. rlp-desk의 공개 코드로 실행과 검수 구조를 설명한다.</p>
  <div class="hero-actions"><a class="btn-primary" href="/learn/">주제별 문서 보기</a><a class="btn-secondary" href="/writing-lab/researched/about/">소개와 공개 구현</a></div>
</section>

<section class="feature-grid">
  <article class="feature-card"><p class="feature-label">실행 방식</p><h2>Ralph Loop</h2><p>새 실행 문맥이 목표와 진행 상태를 파일에서 읽고 다음 단계를 시작하도록 구성한다.</p></article>
  <article class="feature-card"><p class="feature-label">공개 구현</p><h2>rlp-desk</h2><p>Claude와 Codex의 비대화형 실행을 분리하고, 작업 결과를 별도 역할이 검수하도록 돕는 도구.</p></article>
  <article class="feature-card"><p class="feature-label">설계 기준</p><h2>작업 흐름과 결과 검증</h2><p>입력 조건, 변경 범위, 합격 기준을 먼저 정해 자동화 결과를 확인한다.</p></article>
</section>

<section class="group-section"><h2>같은 버전으로 읽기</h2><ul><li><a href="/writing-lab/researched/gpt-61-terra-sol-cost/">Terra와 Sol 비용 비교</a></li><li><a href="/writing-lab/researched/deepseek-model-evaluation/">모델의 업무 성공 판정</a></li><li><a href="/writing-lab/researched/agent-memory-handoff/">작업 기록과 인수인계</a></li></ul></section>
