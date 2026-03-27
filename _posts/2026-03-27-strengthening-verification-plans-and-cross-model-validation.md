---
layout: post
title: "rlp-desk 실무편 4: 검증계획을 강화하니, 교차모델(Claude, Codex) 검증의 가치가 더 분명해졌다"
description: "검증계획을 더 명확하게 세우고 Claude와 Codex를 교차 검증 경로에 올리자, rlp-desk는 더 많은 사각지대를 줄이고 더 견고한 결과를 만들기 시작했다."
permalink: /blog/strengthening-verification-plans-and-cross-model-validation/
series: "rlp-desk"
series_slug: "rlp-desk"
series_order: 6
featured_series: true
tags:
  - ralph-loop
  - rlp-desk
  - fresh-context
  - verification
  - consensus
  - claude
  - codex
  - self-verification
  - workflow
---

## 이 글의 핵심

이 글은 아래 두 관점으로 읽으면 된다.

1. **검증계획을 강화한 구조의 장점**
   - AI가 코드를 빨리 만드는 것과, 사람이 뒤에서 끝없이 규칙을 다시 말하지 않아도 되는 것은 다른 문제다.
   - 검증계획을 더 명확하게 세우면, 반복 지시를 줄이고 결과를 더 믿을 수 있게 된다.

2. **교차 모델의 효용성**
   - 좋은 단일 모델은 분명 더 많은 구현을 해낸다.
   - 하지만 서로 다른 모델을 같은 검증계획 위에 올리면, 단일 모델이 못 보는 사각지대까지 더 많이 커버할 수 있다.

즉 이번 글의 메시지는 단순하다.  
`더 좋은 모델`도 중요하지만, 실제로 더 큰 차이를 만드는 건 `더 강한 검증계획`과 `서로 다른 모델의 교차 검증 구조`라는 점이다.

AI에게 기능 구현을 맡길 때 진짜 시간이 새는 순간은 구현이 느릴 때가 아니다. 코드는 빨리 나오는데, 사람이 뒤에서 계속 규칙을 다시 말하게 될 때다.

`이 케이스도 봐야지.`
`그건 허용이고, 이건 금지야.`
`경계값 빠졌어.`
`아직 이걸 완료라고 보긴 어려워.`

겉으로 보면 AI가 빠르게 코드를 만든 것 같다. 그런데 실제로는 사람이 뒤에서 규칙을 계속 덧붙이고 있는 셈이다. 내가 보기엔 agent loop를 실무에 붙일 때 가장 큰 낭비 중 하나가 바로 여기서 생긴다.

이번 글은 그 낭비를 줄이는 얘기다. 더 정확히는, `rlp-desk`에서 `검증계획`을 보강하기 전과 후에 무엇이 달라졌는지 보는 글이다.

이 글은 `Ralph Loop` 입문 글은 아니다. `Ralph Loop`와 `fresh context`의 기본 구조는 이미 이해했고, 이제 이런 질문이 남은 사람들에게 더 가깝다.

- loop는 알겠는데, 결과를 얼마나 믿어야 하지?
- 왜 AI에게 비슷한 보정 지시를 계속 반복하게 되지?
- 모델이 더 좋아졌는데 왜 마지막은 여전히 사람이 계속 잡아줘야 하지?

핵심 주장은 단순하다.

**문제는 loop를 더 오래 돌리느냐가 아니라, 처음부터 검증계획을 얼마나 명확하게 세우느냐에 더 가깝다.**

`Ralph Loop` 자체가 아직 낯설다면 먼저 이 글을 보는 편이 낫다.

- [fresh context를 rlp-desk는 어떻게 구현하나](https://ai-dev-methodologies.github.io/blog/how-rlp-desk-implements-fresh-context/)

이 글은 그 다음 단계다. `loop`를 돌리는 법이 아니라, **그 loop가 어떤 기준으로 통과와 실패를 가를지**를 어떻게 더 선명하게 만들었는지 본다.

## 1. 아주 작은 예시로 먼저 보자

예시는 일부러 작고 이해하기 쉬운 걸 골랐다. 회의실 예약 시간을 검사하는 함수다.

- 기존 예약이 `09:00~10:00`일 때
- 새 예약 `10:00~11:00`은 허용
- 새 예약 `09:30~10:30`은 거절
- 새 예약 `09:00~10:00`도 거절
- 새 예약 `10:00~10:00`도 거절

겉으로 보면 단순하다. 그래서 AI도 꽤 빨리 "돌아가는 것 같은 코드"를 낸다. 문제는 여기서부터다. 실제로 구현을 맡기면 금방 이런 지시가 붙는다.

```text
겹치면 안 돼.
아, 딱 맞닿는 건 허용이야.
완전히 포함하는 경우도 막아야지.
start==end는 에러야.
음수 시간도 막아야 해.
기존 목록이 정렬 안 돼 있으면 결과는 정렬해줘.
테스트도 더 추가해.
```

핵심은 AI가 멍청해서가 아니다. 처음부터 무엇을 통과로 볼지, 어떤 경계값을 꼭 확인해야 할지 충분히 적지 않았기 때문이다. 이게 약한 검증계획의 전형적인 모습이다. 시작은 빨라 보이지만, 중간부터는 사람이 규칙을 계속 보충하게 된다.

## 2. 검증계획 보강 전과 후를 가장 짧게 요약하면

### 검증계획 보강 전

- PRD는 있다
- test spec도 있다
- Worker와 Verifier도 분리돼 있다
- 그런데 경계 조건, reject 조건, 수치 목표가 충분히 촘촘하지 않다
- 그래서 loop를 다시 돌릴 때마다 사람이 방향을 반복해서 보정하게 된다

### 검증계획 보강 후

- 무엇을 구현 완료라고 볼지 더 잘게 쪼갠다
- 어떤 입력이 정상이고 어떤 입력이 실패여야 하는지 미리 적는다
- 테스트를 "있다/없다"가 아니라 "충분한가"로 본다
- Verifier가 무엇을 확인해야 하는지 더 구체적으로 남긴다
- 결과뿐 아니라 과정도 artifact로 남긴다

즉 차이는 "테스트 몇 개 더 썼다"가 아니다. **애초에 AI가 풀어야 할 문제를 더 명확한 경기로 바꿨다**는 데 있다.

## 3. 여기서 말하는 검증계획은 무엇인가

이번 글에서 `검증계획`은 막연한 좋은 말이 아니다. 쉬운 말로 하면, **무엇을 성공으로 볼지, 무엇을 실패로 볼지, 어떤 경계 조건을 반드시 통과해야 하는지를 미리 적어 두는 것**이다.

참고로 아래에서 말하는 `AC`는 `acceptance criteria`, 즉 완료 기준이다.

| 항목 | 뜻 | 회의실 예약 예시 |
| --- | --- | --- |
| Given/When/Then | 어떤 상황에서, 무엇을 하면, 결과가 어떻게 나와야 하는지 적는다 | `09:00~10:00` 예약이 있을 때 `10:00~11:00` 추가는 허용 |
| Boundary Cases | 경계값에서 어떻게 동작해야 하는지 적는다 | `10:00~10:00`은 거절 |
| Verification Context | 이번 변경이 어떤 동작을 바꾸는지 적는다 | 예약 추가, 겹침 거절, 잘못된 범위 거절 |
| Verification Layers | 어느 레벨까지 확인할지 나눈다 | 단위 테스트, 실제 입력/출력 확인 |
| Traceability Matrix | 어떤 요구사항을 어떤 테스트가 검증하는지 연결한다 | "partial overlap 거절" ↔ 해당 테스트 함수 |
| Code Quality Gates | 코드 품질 기준을 적는다 | 너무 긴 함수 금지, 중복 제한 |
| Reproducibility Gate | 다시 실행해도 같은 방식으로 검증 가능한지 본다 | 실행 명령, 의존성, 환경 조건 명확화 |
| execution_steps | Worker가 뭘 했는지 순서대로 남긴다 | 테스트 작성 → 실패 확인 → 구현 → 다시 확인 |
| reasoning | Verifier가 왜 통과/실패로 봤는지 남긴다 | L3까지 확인했고 skipped test가 없었다고 남김 |
| IL-1~IL-5 | 절대 어기면 안 되는 규칙이다 | 증거 없는 완료 주장 금지, TODO 남은 layer 금지 등 |

이 용어들은 문서를 그럴듯하게 보이게 하려고 붙인 이름이 아니다. 각각이 "나중에 사람이 반복해서 말하게 되는 지시"를 앞단으로 당겨오는 역할을 한다.

## 4. 작은 예시에서도 문서가 실제로 달라진다

### 보강 전 PRD 느낌

```text
US-001: 예약 추가
- 예약이 겹치지 않으면 추가된다

US-002: 겹침 거절
- 겹치면 거절한다
```

### 보강 후 PRD 느낌

```text
US-001: 겹치지 않는 예약은 추가된다
- Given: 기존 예약이 [(09:00, 10:00)]일 때
- When: 새 예약 (10:00, 11:00)을 추가하면
- Then: adjacency는 허용된다

US-002: 겹치는 예약은 거절된다
- Given: 기존 예약이 [(09:00, 10:00)]일 때
- When: 새 예약 (09:30, 10:30)을 추가하면
- Then: 부분 겹침이므로 거절된다

Boundary Cases:
- exact overlap
- containing overlap
- start == end
- 음수 시간
```

보강 전에는 "무슨 뜻인지 알 것 같은 문장"이었다면, 보강 후에는 "어떤 입력에서 어떤 결과가 나와야 하는지"가 훨씬 분명해진다.

### 보강 전 test-spec 느낌

```text
Build
Test
Lint

Criteria -> Verification Mapping
```

### 보강 후 test-spec 느낌

```text
Verification Context
L1 / L2 / L3 / L4
Traceability Matrix
Code Quality Gates
Reproducibility Gate
```

길이보다 더 중요한 건 질문 자체가 달라졌다는 점이다.

- 테스트가 있나?
- 이 요구사항을 어떤 테스트가 검증하나?
- 어느 layer까지 확인하나?
- 다시 돌려도 같은 방식으로 검증 가능한가?

즉 **검증계획 보강 전후의 차이는 문서 형식 차이보다 질문의 질 차이**에 더 가깝다.

## 5. 같은 예시를 직접 돌려보면 결과도 달라진다

같은 회의실 예약 과제를 `검증계획 보강 전 / 후` 양쪽에 직접 돌려보면 이렇다.

| 비교 항목 | 보강 전 | 보강 후 |
| --- | --- | --- |
| user stories | 2 | 3 |
| AC 수 | 4 | 7 |
| tests | 4 | 21 |
| skipped tests | 확인 안 됨 | 0 |
| done-claim 구조 | summary/evidence 중심 | `claims` + `execution_steps` |
| verdict 구조 | compact verdict | `reasoning`, `layer_status`, `test_quality` 포함 |
| wall-clock time | 약 7분 | 약 17분 24초 |

보강 후가 단순히 "더 느렸다"가 아니라는 점이 중요하다. 실제로 더 넓은 문제 공간을 다뤘다.

- 보강 전은 adjacency, partial overlap, exact overlap 정도까지만 사실상 다뤘다
- 보강 후는 여기에 정렬, containing overlap, invalid range까지 포함했다

즉 같은 loop를 더 오래 돌린 게 아니라, **더 많은 경계와 더 많은 판정 기준을 실제로 구현하고 검증했다**고 보는 게 맞다.

## 6. runtime artifact가 달라졌다는 건 꽤 큰 차이다

### 보강 전

`done-claim.json`
- 어떤 story를 끝냈는가
- build/test/lint는 통과했는가
- acceptance criteria는 충족했는가

`verify-verdict.json`
- 모든 acceptance criteria 통과 여부
- 간단한 evidence

### 보강 후

`done-claim.json`
- 무엇을 충족했는가
- 어떤 step으로 확인했는가
- 어떤 command를 돌렸는가
- 어떤 AC를 어떤 evidence로 확인했는가

`verify-verdict.json`
- reasoning
- layer_status
- test_quality

즉 보강 후에는 결과만 남는 게 아니라 **과정과 판정 근거까지 남는다**. Verifier가 왜 통과시켰는지, 어떤 layer를 봤는지, 테스트 충분성을 어떻게 판단했는지까지 남기기 시작했다는 뜻이다.

## 7. 이제 이 프레임을 rlp-desk 자체 개선으로 옮겨 보자

현재 공개된 [`rlp-desk`](https://github.com/ai-dev-methodologies/rlp-desk) 최신 버전은 `0.4.0`이다. 이번 글에서 보는 `v0.4`는 단순한 버전 표기가 아니라, 실제로 `0.3.6`에서 드러난 다음 병목을 어떻게 보강했는지 보여주는 사례다.

여기서 먼저 분리해야 할 게 있다.

- 상위 planning layer:
  - PRD를 더 잘 깎고
  - 목표와 범위를 더 명확히 하고
  - 계획 자체를 여러 번 두드려 보는 역할
- `rlp-desk`:
  - 그렇게 다듬어진 계획을 execution loop와 verification 구조로 옮기는 역할

즉 PRD 초안을 잘 만드는 일 자체는 `rlp-desk`의 시각이라기보다, `oh-my-claudecode` 같은 상위 planning 도구를 잘 활용하는 쪽에 가깝다. 실제로 이번에도 PRD 초안은 `deep-interview`로 먼저 좁힌 뒤에 다듬었다.

planning layer에서 우리가 실제로 쓴 조합은 거의 이 형태였다.

```text
/ralplan {{OBJECTIVE}}
{{SCOPE}}
Run codex cross-validation after consensus. Repeat revise -> consensus -> codex until 0 issues.
If source documents are insufficient, identify gaps before proceeding.
```

여기서 사용한 도구는:

- 요구사항을 먼저 좁히는 [deep-interview](https://github.com/Yeachan-Heo/oh-my-claudecode/blob/main/skills/deep-interview/SKILL.md)
- 계획 합의를 만드는 [ralplan](https://github.com/Yeachan-Heo/oh-my-claudecode/blob/main/skills/ralplan/SKILL.md)
- Codex 검토 요청을 보내는 [ask](https://github.com/Yeachan-Heo/oh-my-claudecode/blob/main/skills/ask/SKILL.md)

그리고 이건 "한 번 검토했다" 수준이 아니었다. 실제로 round가 있었다.

| Round | Codex 이슈 | 상태 |
| --- | ---: | --- |
| 1차 | 12개 | → Planner 수정 |
| 2차 | 6개 | → 사용자 논의 후 수정 |
| 3차 | 6개 | → 사용자 논의 후 수정 |
| 4차 | 3개 | → 직접 수정 (문서 정합성) |
| 현재 | 0개 예상 | 3개 모두 plan 내부 참조 불일치였고 수정 완료 |

즉 planning layer에서도 이미 **합의 -> 교차 검증 -> 수정 -> 다시 합의**가 반복되고 있었다.

## 8. 블루프린트는 무엇을 하려는 문서인가

`v0.4` 블루프린트는 "다음 버전에서 기능을 더 붙이자" 수준의 문서가 아니다. 더 정확히는, **써 보면서 드러난 다음 병목을 정의하고, 어떤 방향으로 보강할지 정리한 문서**다.

블루프린트의 중심 도식은 이렇다.

```text
[Unstructured]                    [Structured]
brainstorm → run → verify          Workflow (skill + command composition)
  → re-brainstorm → run → verify   Feedback loop enforcement
  → run → verify                    Reproducible process
```

이 도식이 의미하는 건 단순하다.  
한 번 잘 돌리는 것보다, **실행 -> 검증 -> 다시 계획 -> 다시 실행**이 점증적으로 더 나아지는 구조를 만들겠다는 뜻이다.

## 9. 0.4.0에서 실제로 보강된 것은 무엇인가

이제 말만 하지 말고, `0.4.0`에서 실제로 무엇을 보강했는지 보자. 큰 줄기는 네 가지다.

| 축 | 실제 보강 내용 | 의미 |
| --- | --- | --- |
| Debug | 4-category 로그 체계 | 실행이 왜 그렇게 흘렀는지 나중에 설명할 수 있게 함 |
| Consensus Stability | 임계값, timeout, 라운드 캡 정리 | cross-engine 검증을 실제로 굴릴 수 있게 함 |
| Campaign Report | 실행 종료 후 결과를 한 문서로 남김 | 실행 -> 분석 -> 다음 판단의 표면을 만듦 |
| Self-Verification Redesign | 재실행과 파일 lifecycle, audit category 정리 | 실패를 다음 실행 입력으로 되먹이는 구조를 만듦 |

여기에 하나가 더 있다.

- `Completed Stories` loader 같은 운영 버그도 같이 보강했다

즉 `0.4.0`은 "기능 몇 개를 더 붙인 버전"이라기보다, **실행 구조 자체를 더 신뢰할 수 있게 만든 버전**에 가깝다.

## 10. 이걸 실제로 rlp-desk가 자기 자신에게 적용했다

여기서부터가 중요하다. 위에서 말한 변화가 단순히 문서에만 있었던 게 아니다. `v04-full`이라는 캠페인으로 실제로 `rlp-desk`를 `rlp-desk`에 적용했다.

이 캠페인에서 준비된 산출물은 다음과 같았다.

- `prd-v04-full.md`
- `test-spec-v04-full.md`
- `worker/verifier prompt`
- `memory`
- `status`
- `debug.log`
- `campaign-report.md`
- `cost-log.jsonl`

즉 이건 "다음 버전에서 이렇게 하자" 수준이 아니라, **실제로 계획을 scaffold와 runtime artifact까지 내려서 돌려 본 사례**다.

최종 결과는 이렇다.

- 상태: `COMPLETE`
- 총 iterations: `4 / 50`
- 소요 시간: 약 `52분`
- 테스트: `159/159 PASS`
- verified_us: `US-001 ~ US-005`
- final consensus: `claude=pass`, `codex=pass`

중간에 한 번 막혔고, 그 실패를 수정하고, 다시 검증한 뒤 최종 통과했다. 이 점이 중요하다. 처음부터 매끈하게 성공한 데모가 아니라, **실패를 통과하는 구조까지 실제로 작동했다**는 뜻이기 때문이다.

## 11. self-verification은 정확히 무엇이 적용됐다고 봐야 하나

여기서는 용어를 나눠 보는 게 맞다.

### 좁은 의미의 self-verification

- `--with-self-verification` 플래그를 켰을 때 생성되는 전용 후속 분석 리포트

### 넓은 의미의 자가검증 구조

- `done-claim`
- `memory`
- `verify-verdict`
- `debug.log`
- `campaign-report`
- `cost-log`

이들이 함께 움직이며 자기 실행을 점검하는 구조

이번 대표 run에서 전용 `self-verification report`는 완전히 보이지 않는다. 실제 `campaign-report.md`에도 `SV Summary`는 `N/A`로 남아 있다. 이건 분명히 적어야 한다.

그렇다고 self-verification이 없었다는 뜻은 아니다. 오히려 더 중요한 건, **자가검증 구조가 실제로 작은 결함을 드러냈다**는 점이다.

예를 들어 이 캠페인에서는 다음 같은 문제가 실제로 드러났다.

- `local path=`가 zsh PATH special array를 가리는 문제
- 빈 디렉터리에서 `(N)` glob qualifier가 없어 set -e로 죽는 문제
- `(( DELETED_COUNT++ ))`가 falsy exit를 일으키는 문제
- `Completed Stories` 초기화 누락
- `SCOPE LOCK`과 memory contract 충돌
- consensus merged verdict에 issues가 비어 있던 문제
- tmux 경로에서 `--with-self-verification` 플래그 전달 누락

이건 아주 좋은 증거다.  
자가검증 구조가 있다는 말의 의미는, 예쁜 보고서를 하나 더 만든다는 게 아니라 **작고 귀찮은 운영 버그까지 밖으로 끌어내는 구조가 생겼다**는 쪽에 가깝기 때문이다.

## 12. 왜 이게 중요한가

여기서 내가 정말 말하고 싶은 건 세 가지다.

### 1. agent loop의 진짜 병목은 생성이 아니라 판정이다

코드를 만들어 내는 것 자체는 이제 예전만큼 드문 일이 아니다. 더 어려운 건:

- 어디까지를 완료로 볼지
- 어떤 실패를 반드시 잡아야 하는지
- agent의 가짜 확신을 어떻게 막을지

이번 `v04-full`은 바로 그 지점을 건드렸다. 실패를 그냥 "안 됨"으로 넘기지 않고, fix-contract와 verify-verdict로 붙잡았다.

### 2. 좋은 모델을 더 좋은 방향으로 쓰는 법을 보여준다

좋은 모델이 있으면 보통 더 긴 답변, 더 많은 코드, 더 빠른 구현 쪽으로 쓰기 쉽다. 내가 여기서 말하고 싶은 건 반대다.

모델 성능의 향상은:

- 더 촘촘한 검증계획
- 더 명확한 완료 기준
- 더 강한 교차 검증

에 쓰여야 한다.

특히 이번 사례는 `consensus`가 왜 중요한지 보여준다. 이건 추상적인 주장보다, 실제로 돌려 본 결과에서 더 잘 드러난다.

이번 `v0.4.x` 과정에서 보인 패턴은 이렇다.

- Claude verifier pass rate는 거의 `100%`에 가까웠다
- 반대로 Codex verifier는 실제 runtime bug, timeout 누락, TDD 미증거 같은 문제를 더 자주 잡아냈다
- Claude만으로 봤다면 production에 반영됐을 가능성이 있는 버그도 있었다

이건 우연이라기보다 구조에 가까운 문제처럼 보인다.

| 구분 | Claude verifier | Codex verifier |
| --- | --- | --- |
| 모델 관계 | Worker와 같은 Claude 계열 | 완전히 다른 계열 모델 |
| 강점 | 맥락 이해, 의도 해석 | 다른 관점의 교차 검증 |
| 위험 | 같은 blind spot 공유 가능성 | 더 보수적 판정, 비용 증가 |
| 이번 사례 | pass가 매우 많았음 | 작은 runtime bug와 미증거를 더 자주 지적 |

즉 `consensus`는 단순한 중복 검증이 아니다. 더 강한 단일 verifier 하나를 붙이는 것과는 다른 효과가 있다. **서로 다른 판정 습관을 가진 모델을 같은 계획 위에 올리면, 단일 에이전트 모델이 절대 못 보거나 그냥 넘어갈 부분까지 더 많이 커버할 수 있다.**

그래서 내가 여기서 강조하고 싶은 건 "더 강한 단일 모델"만의 문제가 아니다.

- 좋은 단일 모델은 분명 더 많은 구현을 해낸다
- 하지만 서로 다른 모델의 조합은 단일 모델의 사각지대를 줄인다

즉 모델 성능 향상은 두 층으로 봐야 한다.

- 한 모델 자체가 더 똑똑해지는 것
- 그리고 서로 다른 모델을 명확한 검증계획 안에서 협력시키는 것

내가 보기엔 실제 실무에서 더 큰 차이를 만드는 건 종종 후자다.

### 3. 자랑할 건 성공한 데모보다 실패를 다루는 구조다

보통은 성공 사례만 자랑하고 싶어진다. 그런데 내가 더 보여주고 싶은 건 반대다.

- 실패를 더 빨리 드러내고
- 어디서 틀렸는지 남기고
- 다시 돌릴 근거를 만들고
- 결국 구조적으로 수렴하게 만드는 방식

이번 run에서 `done-claim` 형식 자체가 다시 검증 대상이 된 건 좋은 사례다. 보통은 "코드가 맞으면 됐다"에서 끝난다. 그런데 여기서는 **완료를 주장하는 형식 자체도 검증 대상**이 됐다.

## 13. 그렇다면 so what?

결국 하고 싶은 말은 이거다.

자가검증 구조가 있다는 건:

- 사람이 뒤에서 끝없이 규칙을 다시 말하는 대신
- 어떤 실패가 났는지 구조적으로 남기고
- 그 실패를 다시 계획과 실행에 반영하고
- 다시 검증해서 수렴하게 만든다는 뜻이다

즉 내가 자랑하고 싶은 건 "self-verification 기능이 있다"는 사실이 아니다.  
**agent를 그냥 계속 돌리는 게 아니라, 틀릴 때 어떻게 틀리는지 드러내고, 그 실패를 다시 구조로 되먹이는 방식**이 있다는 점이다.

## 14. 그래서 지금의 강화는 어떻게 보는 게 맞을까

내가 보기엔 이렇게 정리하는 게 가장 정확하다.

- 초기 `rlp-desk`는 일반적인 AI 모델이 세우는 보통 수준의 검증계획을 전제로, loop를 안정적으로 돌리는 문제를 해결했다
- 그 구조는 여전히 유효하다
- 다만 실제로 더 복잡한 작업을 반복시키다 보니, 다음 병목은 loop가 아니라 검증계획의 밀도와 명확성이라는 게 드러났다
- 그래서 `0.4.0`은 loop를 더 오래 돌리는 대신, 검증계획을 더 앞단으로 끌어오고 더 정량적으로 만들었다

즉 이건 "예전 버전이 잘못됐다"는 얘기가 아니라, **실제 사용을 통해 다음 병목을 발견했고, 그 병목을 다시 구현으로 밀어 넣었다**는 얘기다.

## 15. 내가 앞으로 더 보려는 방향

이 글을 쓰면서 더 분명해진 건, planning layer와 execution layer를 따로 보면 안 된다는 점이다.

- 위에서는 `deep-interview`, `ralplan`, Codex cross-validation으로 계획을 보강하고
- 아래에서는 `rlp-desk`가 그 계획을 흐리지 못하게 실행과 검증을 묶는다

둘 중 하나만 강해도 부족하다.

그래서 내가 앞으로 더 밀고 싶은 방향은 단순한 tool demo가 아니다.

- 더 좋은 PRD를 만드는 방법
- 더 좋은 검증계획을 세우는 방법
- 그 계획을 loop가 흐리지 못하게 만드는 실행 구조

다음 단계도 같은 방향이다. 남은 작은 이슈들을 다시 `ralplan + codex` 분석 검토 루프로 다루는 이유도 여기 있다. 정밀한 구현일수록 구현 능력보다 **정확한 판정과 높은 해상도의 분석**이 더 중요해지기 때문이다.

## Appendix A. v0.4 블루프린트 핵심 도식

아래 도식은 `v0.4` 블루프린트에서 핵심 흐름을 보여주는 부분이다. 본문에서는 해석 위주로 설명했지만, 전체 맥락을 한 번에 보려면 이 그림을 같이 보는 편이 좋다.

### A-1. Vision

```text
[Unstructured]                    [Structured]
brainstorm → run → verify          Workflow (skill + command composition)
  → re-brainstorm → run → verify   Feedback loop enforcement
  → run → verify                    Reproducible process
  → final result            ──▶     (P3: determined after P0-P2 iteration)
```

### A-2. Re-execution Cycle

```text
brainstorm("auth-refactor")
  → init → run → self-verification-v1 + campaign-report-v1 + debug-v1
                              │
              user: "not satisfied, re-run"
                              │
                              ▼
re-brainstorm("auth-refactor")
  │
  ├─ PRD: single file, updated in place if needed (no versioning)
  ├─ SV report: renamed to self-verification-v1.md (preserved)
  ├─ Campaign report: renamed to campaign-report-v1.md (preserved)
  ├─ Debug log: renamed to debug-v1.log (preserved)
  ├─ Everything else: deleted (test-spec, prompts, context, memos, logs)
  └─ Re-brainstorm: informed by self-verification-v1
                              │
                              ▼
  → init → run → self-verification-v2 + campaign-report-v2 + debug-v2
                              │
                              ...
```

### A-3. Feature Relationship

이 도식에서 중요한 건 기능 목록이 아니라 **되먹임 구조**다.

- `run`이 실행을 만든다
- `--debug`는 그 실행이 실제로 어떤 규칙과 옵션 아래서 움직였는지 남긴다
- `--with-self-verification`은 그 실행 결과를 다시 평가 가능한 형태로 만든다
- `campaign-report`는 한 번의 run을 끝낸 뒤, 받아들일지 다시 돌릴지 판단하는 표면이 된다

즉 이 구조는 "한 번 돌리고 끝"이 아니다.  
반복 수행 중에 남은 로그와 판정 근거, 자가검증 결과를 다시 다음 계획에 넣고, 필요하면 `re-brainstorm -> re-execute`로 이어지는 방식이다.

내가 보기엔 여기서 핵심은 두 가지다.

1. **로그는 단순 기록이 아니라 다음 판단의 입력이다**
   - debug.log가 남아야 "왜 이렇게 됐는지"를 다시 읽을 수 있다
   - verifier verdict와 fix-contract가 남아야 어디를 고쳐야 하는지 말할 수 있다

2. **자가검증은 보고서를 예쁘게 만드는 기능이 아니라, 다음 loop를 더 낫게 만드는 기능이다**
   - 한 번의 run에서 드러난 부족함을 다음 run의 계획과 검증기준으로 다시 밀어 넣는다
   - 그래서 이 구조는 점점 더 견고해지는 방향으로 작동한다

```text
┌──────────────────────────────────────────────────────────────┐
│                     rlp-desk execution                       │
│                                                              │
│  brainstorm → init → run ──┐                                 │
│                             │                                │
│              ┌──────────────┼──────────────────┐             │
│              │              │                  │             │
│           --debug    --with-self-verification   │             │
│           (execution  (quality evaluation)      │             │
│            trace)           │                   │             │
│              │              ▼                   │             │
│              │     self-verification report     │             │
│              │              │                   │             │
│              ▼              ▼                   │             │
│         debug.log   Post-Run Report (mandatory) │             │
│         (versioned)  + campaign-report.md        │             │
│              │       (versioned)                 │             │
│              │         │                        │             │
│              │    [SV enabled?]                  │             │
│              │      │         │                  │             │
│              │     Yes        No                 │             │
│              │      │         │                  │             │
│              │      ▼         ▼                  │             │
│              │  "Re-brainstorm?"  End            │             │
│              │    │         │                    │             │
│              │   Yes        No                   │             │
│              │    │         │                    │             │
│              │    ▼         ▼                    │             │
│              │  Re-execute  Accept               │             │
│              │  (vN+1)     result                │             │
│              │    │         │                    │             │
│              │    │    ┌────┘                    │             │
│              │    ▼    ▼                         │             │
│              │  Workflow Generation (P3)         │             │
│              │  (deferred — after P0-P2)         │             │
│              │                                   │             │
│              └── Bug report (external users)     │             │
└──────────────────────────────────────────────────────────────┘
```
