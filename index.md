---
layout: default
title: ai-dev-methodologies
description: "AI 모델 비용, 에이전트 상태 관리와 검증을 다루는 기술 블로그. 설계 비교와 rlp-desk 공개 구현을 설명한다."
---

<section class="hero">
  <p class="eyebrow">AI DEVELOPMENT METHODOLOGIES</p>
  <h1>AI 에이전트 설계와<br><span class="accent">검증</span></h1>
  <p class="hero-copy">모델 비용, 작업 상태 관리, 결과 검증을 다룬다. 설계 대안을 비교하고 rlp-desk의 공개 코드로 실행 구조를 설명한다.</p>
  <div class="hero-actions"><a class="btn-primary" href="/learn/">주제별 문서 보기</a><a class="btn-secondary" href="/about/">소개와 공개 구현</a></div>
</section>

<section class="feature-grid">
  <article class="feature-card"><p class="feature-label">실행 방식</p><h2>Ralph Loop</h2><p>작업마다 새 실행 문맥을 만들고, 파일에 남긴 목표와 진행 상태를 읽어 다음 작업을 수행하는 방식.</p></article>
  <article class="feature-card"><p class="feature-label">공개 구현</p><h2>rlp-desk</h2><p>Claude와 Codex를 비대화형으로 호출하고, 작업 수행과 검수를 분리하는 도구. 사용자 스토리별 검증을 지원한다.</p></article>
  <article class="feature-card"><p class="feature-label">설계 주제</p><h2>작업 흐름과 결과 검증</h2><p>자동화 작업을 단계로 나누고, 각 단계의 입력 조건과 합격 기준을 정하는 방법.</p></article>
</section>

<section class="group-section"><p class="eyebrow">LATEST NOTES</p><h2>최근 기술 문서</h2><ul class="post-list">{% for post in site.posts limit:3 %}<li><article class="post-card"><p class="meta">{{ post.date | date: "%Y-%m-%d" }}</p><a class="post-card-title" href="{{ post.url | relative_url }}">{{ post.title }}</a><p>{{ post.description }}</p></article></li>{% endfor %}</ul><a href="/learn/">주제별로 더 읽기 →</a></section>

<p><a href="/writing-lab/">두 가지 문체로 같은 글 비교하기</a></p>
