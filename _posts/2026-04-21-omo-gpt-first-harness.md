---
layout: post
title: "oh-my-opencode를 여러 세션으로 돌릴수록, GPT 중심 구성이 유리해지는 이유"
description: "oh-my-opencode의 에이전트/카테고리 배치를 GPT 중심으로 재구성해서 토큰 효율을 3배 높이고 병렬 세션 3~5개를 운영하는 방법"
permalink: /blog/omo-gpt-first-harness/
series: "oh-my-opencode"
series_slug: "oh-my-opencode"
series_order: 1
tags:
  - oh-my-opencode
  - omo
  - gpt
  - claude
  - gemini
  - opencode
  - ai-coding
  - multi-model
  - token-efficiency
  - agentic-coding
---

> 이 글은 oh-my-opencode(OMO)를 이미 쓰고 있는 사람을 위한 글이다. 에이전트 구조나 opencode 기본 사용법은 따로 설명하지 않는다.

**TL;DR**: OMO 에이전트와 카테고리 배치를 GPT 중심으로 바꿨다. planning chain 메인 축, execution 에이전트, 범용 카테고리를 GPT로 옮기고, 교차검증(momus)과 고수준 자문(oracle)만 Claude에 남겼다. 시각/글쓰기는 Gemini. 같은 토큰 예산으로 약 3배 더 많은 작업을 돌릴 수 있고, 병렬 세션 3~5개가 현실적으로 가능하다.

---

## Claude vs GPT: 체감 차이

| 항목 | `opencode` (Claude 우선) | `oc-gpt` (GPT 우선) |
|---|---|---|
| 토큰 효율 | 병렬 세션에서 한도에 빨리 닿는다 | 같은 예산으로 **3배 이상** 작업 가능 |
| 병렬 운영 | 2~3 세션이면 부담이 온다 | **3~5 세션**이 현실적 |
| 운영 비율 | — | GPT 중심 : Claude 중심 = **3 : 1** |
| 지시 이행 | 맥락 파악이 유연하다 | 살짝 덜 유연하지만, 지시를 끝까지 따른다 |

`gpt-5.4 (high)`가 Opus보다 약간 덜 유연하긴 하다. 그래도 같은 토큰 예산에서 처리할 수 있는 작업량이 확실히 많고, 세션을 여러 개 돌릴 때 차이가 크다. 아래는 이 구성이 어떻게 가능한지, 어떤 슬롯을 바꾸고 어떤 슬롯은 남겨야 하는지를 정리한 내용이다.

---

## 1. 문제: Opus 메인 축의 토큰 병목

OMO planning은 5개 에이전트가 체인으로 돌아간다.

```
sisyphus (진입) → metis (사전 분석) → prometheus (계획 작성) → momus (계획 검토) → oracle (자문)
```

어떤 모델을 어디에 넣느냐에 따라 토큰 비용과 세션 수명이 달라진다.

### Planning Chain 비교

| 구분 | `sisyphus` | `metis` | `prometheus` | `momus` | `oracle` |
|---|---|---|---|---|---|
| 호출 시점 | `sisyphus`로 요청할 때 | planning 필요 시 선행 분석 | `prometheus`로 직접 요청할 때, 또는 planning 진입 시 | plan 생성 후 | 추가 판단 필요 시 |
| 역할 | Ultraworker (오케스트레이션 + 직접 실행) | Plan Consultant (사전 분석) | Plan Builder (계획 작성, 읽기 전용) | 계획 검토 / 품질 검토 (cross-check) | 컨설턴트 (고수준 자문) |
| 축 해석 | 시작점 | 메인 계획 축 | 메인 계획 축 | 검토 축 | 자문 축 |
| OMO 공식 1순위 | Opus 4.6 `[max]` | Opus 4.6 `[max]` | Opus 4.6 `[max]` | GPT-5.4 `[xhigh]` | GPT-5.4 `[high]` |
| `opencode` 기본 | Opus 4.6 `[max]` | Opus 4.6 `[max]` | Opus 4.6 `[max]` | GPT-5.4 `[xhigh]` | GPT-5.4 `[high]` |
| GPT 우선 배치 | GPT-5.4 `[high]` | GPT-5.4 `[high]` | GPT-5.4 `[high]` | Opus 4.6 `[max]` | Opus 4.6 `[max]` |

**교차검증 원리**: 메인 축(sisyphus/metis/prometheus)과 검토/자문 축(momus/oracle)에는 항상 다른 모델 계열을 넣는다. 같은 모델이 만들고 같은 모델이 검토하면 blind spot이 겹친다. 기본이든 GPT 우선이든 이 원칙은 똑같다.

### 토큰 부담이 큰 슬롯

기본 배치에서 메인 축 3개가 전부 Opus `[max]`다. 응답당 토큰 소비가 크고, 병렬 세션을 돌리면 구독 한도에 금방 걸려서 rate limit이 온다.

| 슬롯 | 역할 | 토큰 부담이 큰 이유 |
|---|---|---|
| `sisyphus` | Ultraworker (오케스트레이션 + 직접 실행) | 코드 read/write/edit를 직접 하면서 sub-agent에 위임도 한다. 토큰을 가장 많이 쓴다. |
| `prometheus` | Plan Builder (읽기 전용) | 코드는 못 건드리지만, 계획을 여러 번 고치면서 reasoning 토큰이 쌓인다. |
| `metis` | Plan Consultant (사전 분석) | 1회성이라 상대적으로 적지만, Opus `[max]`로 돌리면 누적된다. |

sisyphus를 GPT로 옮기면 두 가지가 동시에 줄어든다: (a) sisyphus가 직접 쓰는 토큰, (b) sisyphus가 위임하는 sub-agent들의 모델 비용. 검토/자문 축이 왜 Claude로 가는지는 3장에서 다룬다.

---

## 2. 해법: GPT가 메인 축, Claude는 검토/자문/경량만

GPT 우선 배치는 메인 축과 검토/자문 축의 모델을 뒤바꾸고, execution과 category도 GPT 중심으로 재배치한다.

### Execution Chain

| Agent | 역할 | OMO 공식 1순위 | `opencode` 기본 | `oc-gpt` 우선 |
|---|---|---|---|---|
| `hephaestus` | 코드 생성 / 빌드 (GPT 특화) | GPT-5.4 `[medium]` | GPT-5.4 `[medium]` | GPT-5.4 `[medium]` |
| `explore` | 탐색 / 파일 검색 (경량) | grok-code-fast-1 | Haiku 4.5 | GPT-5.4-mini |
| `librarian` | 문서 조회 (경량) | minimax-m2.7 | Haiku 4.5 | Haiku 4.5 |
| `atlas` | 구조 분석 (범용) | Sonnet 4.6 | Sonnet 4.6 | GPT-5.4 `[medium]` |
| `sisyphus-junior` | 경량 오케스트레이션 (범용) | Sonnet 4.6 | Sonnet 4.6 | GPT-5.4 `[medium]` |
| `multimodal-looker` | 멀티모달 분석 (GPT 특화) | — | GPT-5.4 `[medium]` | GPT-5.4 `[medium]` |

OMO 공식은 grok, minimax 등 다양한 모델을 쓰지만, 이 글에서는 Claude/GPT/Gemini 3개 계열만 다룬다.

### Category

| Category | 역할 | OMO 공식 1순위 | `opencode` 기본 | `oc-gpt` 우선 |
|---|---|---|---|---|
| `ultrabrain` | 최고 난이도 (GPT 특화) | GPT-5.4 `[xhigh]` | GPT-5.4 `[xhigh]` | GPT-5.4 `[xhigh]` |
| `deep` | 중급 난이도 (GPT 특화) | GPT-5.4 `[medium]` | GPT-5.4 `[medium]` | GPT-5.4 `[medium]` |
| `visual-engineering` | 시각 작업 (Gemini 특화) | Gemini 3.1 Pro `[high]` | Gemini 3.1 Pro `[high]` | Gemini 3.1 Pro `[high]` |
| `artistry` | 디자인 작업 (Gemini 특화) | Gemini 3.1 Pro `[high]` | Gemini 3.1 Pro `[high]` | Gemini 3.1 Pro `[high]` |
| `quick` | 경량 작업 (경량) | GPT-5.4-mini | Haiku 4.5 | GPT-5.4-mini |
| `unspecified-low` | 범용 중급 (범용) | Sonnet 4.6 | Sonnet 4.6 | GPT-5.4 `[medium]` |
| `unspecified-high` | 범용 고급 (범용) | Opus 4.6 `[max]` | Opus 4.6 `[max]` | GPT-5.4 `[high]` |
| `writing` | 글쓰기 (Gemini 특화) | Gemini 3-flash | Gemini 3-flash | Gemini 3-flash |

### 모델별 역할

| 모델 계열 | 담당 슬롯 (GPT 우선 기준) | 역할 |
|---|---|---|
| **GPT** | sisyphus, metis, prometheus, hephaestus, explore, atlas, sisyphus-junior, multimodal-looker, ultrabrain, deep, quick, unspecified-low, unspecified-high | 메인 축 + execution + 범용 카테고리 |
| **Claude** | momus (cross-check), oracle (고수준 자문), librarian | 교차검증 + 자문 + 문서 조회 |
| **Gemini** | visual-engineering, artistry, writing | 시각/디자인/글쓰기 특화 |

---

## 3. GPT 우선에서 Claude를 쓰는 경우

GPT 우선 배치에서도 Claude가 남는 슬롯이 3개 있다.

| 슬롯 | 왜 Claude에 남기나 |
|---|---|
| `momus` (cross-check) | 메인 축이 GPT니까, 검토는 다른 계열이 해야 blind spot을 잡을 수 있다. |
| `oracle` (고수준 자문) | 단순 검토가 아니라 판단이 필요한 자리다. GPT로 바꾸면 메인 축과 같은 모델이라 자문 의미가 줄어든다. |
| `librarian` (문서 조회) | Haiku 4.5면 충분한 경량 슬롯이다. GPT로 바꿀 이유가 없다. |

Claude는 "만드는 일"에서 빠지고, "보는 일"과 "찾는 일"에만 남는다. 이 3개를 빼면 교차검증이 약해지니까 남겨두는 게 맞다.

---

## 4. 현황 / 공식 가이드 / 운영 해석

세 가지를 섞으면 헷갈린다. 나눠서 읽어야 한다.

**현황**: 내 로컬 기본 `opencode`는 Claude 우선 배치(Claude Code 중심)이고, `oc-gpt`는 GPT 우선 별도 레인이다.

**공식 가이드**: OMO 공식 기본값에서도 GPT 슬롯이 늘었지만, 메인 축(sisyphus/prometheus/metis)은 여전히 Opus `[max]`다. OMO는 단일 모델이 아니라 역할별 멀티모델 배치를 전제로 설계됐다.

**운영 해석**:

| 모델 | 배치 원칙 |
|---|---|
| GPT | planning/execution 메인 축. 토큰 효율이 좋다. |
| Claude | cross-check/고수준 자문. 비싸지만 교차검증에 필수. |
| Gemini | 시각, 문서, 글쓰기 등 특화 슬롯. |

---

## 5. 운영 결과

### 체감치

- `gpt-5.4 (high)`가 Opus보다 살짝 덜 유연하긴 하다. 그래도 지시를 끝까지 따르고, 한도에 덜 빨리 걸린다.
- 같은 토큰 예산에서 GPT 중심이 Opus 중심보다 **약 3배** 더 많은 작업을 처리한다.
- 자연스럽게 GPT 중심 : Opus 중심 = **3 : 1** 비율로 쓰게 된다.
- 평소 **3~5개 세션**을 병렬로 돌리는데, 이 규모에서 차이가 확실하다.

| 항목 | `opencode` 기본 | `oc-gpt` 우선 |
|---|---|---|
| 토큰 체감 | 병렬 세션에서 한도에 빨리 닿는다 | 같은 예산으로 3배 이상 작업 가능 |
| 병렬 운영 | 2~3 세션이면 부담이 온다 | 3~5 세션이 현실적 |

### 구독 구성

| 구독 구성 | 특징 |
|---|---|
| Claude $100~200 + Codex $200 | 풀 스펙. Opus safety net + GPT 메인 축을 최대로 쓸 수 있다. |
| Claude $100~200 + Codex $20 x N (multi-auth) | [opencode-multi-auth](https://github.com/guard22/opencode-multi-auth-codex)로 $20 Codex 구독 여러 개를 묶어서 rotation한다. 사용량에 맞춰 계정 수를 조절한다. Claude는 최소 $100. |

Gemini는 별도 구독이 아니다. 무료로 쓸 수 있고, rate limit이 부족하면 $20 유료로 올리면 된다.

GPT 우선으로 쓰되, Claude 우선(`opencode`)도 섞어 쓴다. 중요한 작업은 `opencode`에서, 나머지는 `oc-gpt` 레인에서 병렬로 돌리는 방식이다.

### 레인 선택 가이드

| 상황 | 추천 레인 | 이유 |
|---|---|---|
| 보수적 운영, 중요한 작업 | `opencode` | Claude 우선 기본선. Opus가 메인 축. |
| GPT 중심 병렬 운영 | `oc-gpt` | GPT 메인 축 + Claude 교차검증. 토큰 효율이 좋다. |

---

## 6. Trade-offs

GPT 중심이 항상 낫지는 않다.

| 항목 | 내용 |
|---|---|
| **Opus가 나은 경우** | 복잡한 아키텍처 판단, 모호한 요구사항 해석, 긴 컨텍스트 일관성. 이런 작업에서는 Opus `[max]`가 GPT `[high]`보다 낫다. |
| **교차검증 약화 리스크** | Claude 교차검증 슬롯(momus/oracle)을 GPT로 바꾸면 메인 축과 같은 모델이라 blind spot을 못 잡는다. 교차검증을 유지하려면 Claude를 남겨야 한다. |
| **GPT의 한계** | `gpt-5.4 (high)`는 가끔 지시를 글자 그대로 따라가서 의도를 놓친다. Opus가 맥락 파악에서 더 유연하다. |
| **프리셋 관리 부담** | 레인이 늘면 `oh-my-openagent.json` 관리가 복잡해진다. |

GPT 중심으로 가되, 중요한 작업은 `opencode`(Claude 기본선)로 돌린다.

---

## 7. 설정 분리: opencode와 oc-gpt

opencode는 설정 디렉토리 단위로 파일을 로딩한다. 디렉토리를 바꾸면 모델 매핑이 통째로 바뀐다.

| 명령 | 모델 배치 | 설정 디렉토리 | 모델 매핑 파일 |
|---|---|---|---|
| `opencode` | Claude 우선 | `~/.config/opencode/` | `oh-my-openagent.json` (Claude 우선 배치) |
| `oc-gpt` | GPT 우선 | `~/.config/opencode-gpt-heavy/` | `oh-my-openagent.json` (GPT 우선 배치) |

### 디렉토리 구조

```
~/.config/
  opencode/                        # opencode (Claude 우선)
    opencode.json                  # 공통 설정 (API key, provider, 인증 정보)
    oh-my-openagent.json           # 모델 매핑 (Claude 우선 배치)
  opencode-gpt-heavy/              # oc-gpt (GPT 우선)
    opencode.json → ~/.config/opencode/opencode.json  # 공통 설정은 링크로 관리
    oh-my-openagent.json           # 모델 매핑 (GPT 우선 배치)
```

공통 설정(`opencode.json`)은 opencode 디렉토리에 하나만 두고, oc-gpt에서는 링크로 관리한다. 모델 매핑(`oh-my-openagent.json`)만 디렉토리별로 다르다.

### 실행 방식

둘 다 `.zshrc`에서 shell function으로 래핑되어 있다. 실제 바이너리는 `~/.opencode/bin/opencode`이고, `~/.local/bin/opencode`가 wrapper로 감싼다.

```bash
# .zshrc (간략화)

# opencode: 기본 디렉토리(~/.config/opencode/) 사용. Claude 우선.
opencode() {
  "$HOME/.local/bin/opencode" "$@"
}

# oc-gpt: 설정 디렉토리를 opencode-gpt-heavy로 바꿔서 실행. GPT 우선.
oc-gpt() {
  OPENCODE_CONFIG_DIR="~/.config/opencode-gpt-heavy" \
  opencode "$@"
}
```

---

## 8. 정리

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              opencode(기본)     oc-gpt 우선
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Planning (교차 검증 구조)

  [메인 축]
  sisyphus     Opus [max]       GPT-5.4 [high]
  metis        Opus [max]       GPT-5.4 [high]
  prometheus   Opus [max]       GPT-5.4 [high]

  [검토/자문 축]
  momus        GPT-5.4 [xhigh] Opus [max]
  oracle       GPT-5.4 [high]  Opus [max]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Execution (역할 특화 배치)

  hephaestus   GPT-5.4 [med]   GPT-5.4 [med]
  explore      Haiku 4.5        GPT-5.4-mini
  librarian    Haiku 4.5        Haiku 4.5
  atlas        Sonnet 4.6       GPT-5.4 [med]
  sisy-junior  Sonnet 4.6       GPT-5.4 [med]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

모델 우열이 아니라 baseline / experiment / safety layer를 어떻게 나누느냐가 핵심이다.

---

## Further Reading

- [oh-my-opencode README](https://github.com/code-yeongyu/oh-my-opencode) — OMO 공식 문서
- [opencode-multi-auth](https://github.com/guard22/opencode-multi-auth-codex) — Codex $20 다중 계정 rotation

---

**설정 근거**: 이 글의 모든 모델 배치는 운용 중인 `oh-my-openagent.json` 설정 파일과 OMO 패키지 소스를 근거로 한다.
