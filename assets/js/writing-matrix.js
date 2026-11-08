(() => {
  "use strict";
  const topic = document.getElementById("matrix-topic");
  const left = document.getElementById("matrix-left");
  const right = document.getElementById("matrix-right");
  if (!topic || !left || !right) return;
  const labels = {
    t0: "T0 · Terra · 추가 스킬 없음", t1: "T1 · Terra · 기존 스킬",
    t2: "T2 · Terra · 기존 + 추가 편집", s0: "S0 · Sol · 추가 스킬 없음",
    s1: "S1 · Sol · 기존 스킬", s2: "S2 · Sol · 기존 + 추가 편집"
  };
  for (const select of [left, right]) {
    for (const [value, label] of Object.entries(labels)) {
      const option = document.createElement("option");
      option.value = value; option.textContent = label; select.append(option);
    }
  }
  const params = new URLSearchParams(location.search);
  if ([...topic.options].some(option => option.value === params.get("topic"))) topic.value = params.get("topic");
  left.value = Object.hasOwn(labels, params.get("left")) ? params.get("left") : "t0";
  right.value = Object.hasOwn(labels, params.get("right")) ? params.get("right") : "s0";
  function update() {
    for (const [side, select] of [["left", left], ["right", right]]) {
      const url = `/writing-lab/matrix/${select.value}/${topic.value}/`;
      document.getElementById(`${side}-heading`).textContent = labels[select.value];
      document.getElementById(`${side}-link`).href = url;
      const frame = document.getElementById(`${side}-frame`);
      frame.title = `${topic.selectedOptions[0].textContent} — ${labels[select.value]}`;
      frame.src = url;
    }
    document.getElementById("matrix-columns").hidden = false;
    document.getElementById("matrix-status").textContent = left.value === right.value
      ? "같은 조합을 선택했습니다. 다른 조합을 선택하면 차이를 비교할 수 있습니다."
      : `${labels[left.value]}와 ${labels[right.value]}를 비교합니다.`;
    const query = new URLSearchParams({topic: topic.value, left: left.value, right: right.value});
    history.replaceState(null, "", `${location.pathname}?${query}`);
  }
  [topic, left, right].forEach(select => select.addEventListener("change", update));
  update();
})();
