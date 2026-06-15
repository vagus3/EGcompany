export const adminTestStorageEvent = "eg-new-admin-test-change";
export const adminTestRequiredKey = "eg-new-admin-test-required";
export const adminTestPassedKey = "eg-new-admin-test-passed";

export const adminTestQuestions = [
  {
    num: "01",
    question:
      "발신자를 확인할 수 없는 메일이라도, 긴급 요청이 있으면 즉시 첨부파일을 실행해도 된다.",
    question_en:
      "Even if the sender cannot be verified, you may immediately open attachments if the request is urgent.",
    options: [
      { text: "O (예)", text_en: "O (Yes)", value: false },
      { text: "X (아니오)", text_en: "X (No)", value: true },
    ],
  },
  {
    num: "02",
    question: "시스템 로그에 본인의 이름이나 개인 정보가 노출되면 관리자에게 즉시 보고해야 한다.",
    question_en:
      "If your name or personal information is exposed in system logs, you must report it to the administrator immediately.",
    options: [
      { text: "O (예)", text_en: "O (Yes)", value: true },
      { text: "X (아니오)", text_en: "X (No)", value: false },
    ],
  },
  {
    num: "03",
    question:
      "CCTV 화면에서 비정상적인 움직임이 보이면 해당 구역 접근을 중지하고 보안팀에 보고한다.",
    question_en:
      "If abnormal movement is detected on CCTV footage, stop accessing the area and report it to the security team.",
    options: [
      { text: "O (예)", text_en: "O (Yes)", value: true },
      { text: "X (아니오)", text_en: "X (No)", value: false },
    ],
  },
  {
    num: "04",
    question: "업무 중 누군가 보고 있다는 감각과 따가운 감각이 동반되면 즉시 연구팀을 호출한다.",
    question_en:
      "If during work you experience the sensation of being watched accompanied by a burning sensation, immediately call the research team.",
    options: [
      { text: "O (예)", text_en: "O (Yes)", value: true },
      { text: "X (아니오)", text_en: "X (No)", value: false },
    ],
  },
  {
    num: "05",
    question: "관리자 권한은 테스트 통과 후에만 제한 구역 접근에 사용할 수 있다.",
    question_en:
      "Administrator privileges can only be used to access restricted areas after passing the test.",
    options: [
      { text: "O (예)", text_en: "O (Yes)", value: true },
      { text: "X (아니오)", text_en: "X (No)", value: false },
    ],
  },
] as const;
