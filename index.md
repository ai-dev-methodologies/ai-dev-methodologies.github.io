---
layout: default
title: ai-dev-methodologies
description: AI 모델 선택, 검증, 기억과 맥락을 쉬운 예시로 배우고 공개 구현으로 잇는 kyjin의 학습 포트폴리오.
---

<section class="hero">
  <p class="eyebrow">AI DEVELOPMENT METHODOLOGIES</p>
  <h1>AI를 읽고, 비교하고,<br><span class="accent">내 기준으로.</span></h1>
  <p class="hero-copy">
    모델의 가격부터 AI가 일을 끝냈다는 근거까지. 학습한 내용을 쉬운 예시로 풀고, 내 판단과 공개 구현으로 연결한다.
  </p>
  <div class="hero-actions">
    <a class="btn-primary" href="/learn/">학습 서재에서 시작하기</a>
    <a class="btn-secondary" href="/about/">소개와 포트폴리오</a>
  </div>
</section>

<section class="feature-grid">
  <article class="feature-card">
    <p class="feature-label">Concept</p>
    <h2>Ralph Loop</h2>
    <p>긴 대화를 오래 끌고 가는 대신, fresh context와 파일 기반 상태로 장기 작업을 운영하는 관점.</p>
  </article>
  <article class="feature-card">
    <p class="feature-label">Proof Asset</p>
    <h2>rlp-desk</h2>
    <p>Claude/Codex non-interactive 실행, worker/verifier 분리, per-US verify를 실제 코드로 구현한 도구.</p>
  </article>
  <article class="feature-card">
    <p class="feature-label">Next Focus</p>
    <h2>Workflow + Verification</h2>
    <p>비정형 자동화 실험을 workflow로 정형화하고, agent의 가짜 확신을 막는 검증 계획을 설계하는 방향.</p>
  </article>
</section>

<section class="group-section"><p class="eyebrow">LATEST NOTES</p><h2>최근에 정리한 판단</h2><ul class="post-list">{% for post in site.posts limit:3 %}<li><article class="post-card"><p class="meta">{{ post.date | date: "%Y-%m-%d" }}</p><a class="post-card-title" href="{{ post.url | relative_url }}">{{ post.title }}</a><p>{{ post.description }}</p></article></li>{% endfor %}</ul><a href="/learn/">주제별로 더 읽기 →</a></section>
