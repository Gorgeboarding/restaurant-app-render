# 수원역 단체 식당 검색 - Render 배포용

이 프로젝트는 공용 비밀번호로 로그인한 사용자만 수원역 단체 식당 데이터를 볼 수 있게 만든 1차 버전입니다.

## 폴더 구조

```text
restaurant-app-render/
├─ server.js
├─ package.json
├─ restaurants.json
├─ .env.example
├─ .gitignore
└─ public/
   ├─ login.html
   └─ index.html
```

## 1. GitHub에 올리기

압축을 풀고 이 폴더의 파일들을 새 GitHub 저장소에 업로드합니다.

주의: 실제 `.env` 파일이나 실제 비밀번호를 GitHub에 올리지 마세요.

## 2. Render에서 Web Service 생성

1. Render에 로그인합니다.
2. New → Web Service를 선택합니다.
3. GitHub 저장소를 연결합니다.
4. 아래처럼 설정합니다.

- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`

## 3. Render 환경변수 등록

Render 서비스의 Environment 메뉴에서 다음 두 값을 추가합니다.

- `SITE_PASSWORD`: 사이트에서 사용할 공용 비밀번호
- `SESSION_SECRET`: 길고 임의적인 문자열

예:

```text
SITE_PASSWORD=restaurant2026
SESSION_SECRET=g9Xk2mP8vQ4sL1zR7nC5aT0bW3fH6jY
```

`SESSION_SECRET`은 위 예시를 그대로 쓰기보다 본인만의 긴 임의 문자열로 바꾸는 것이 좋습니다.

## 4. 배포

설정을 저장하면 Render가 자동으로 `npm install` 후 `npm start`를 실행합니다.

배포가 끝나면 Render가 제공하는 주소로 접속합니다.

```text
https://xxxx.onrender.com
```

비밀번호를 입력하면 `/restaurants` 화면으로 이동합니다.

## 5. 식당 데이터 최신화

한 달에 한 번 `restaurants.json`만 새 파일로 교체한 뒤 GitHub에 반영하면 됩니다.
Render가 저장소 변경을 감지해 다시 배포합니다.

현재 데이터 구조:

```json
{
  "name": "청담갈비",
  "representative_menu": "청담수제돼지갈비 / 소생갈비",
  "radius_km": 0.4,
  "cost_per_person": "약 19,000~45,000원",
  "phone": "0507-1422-9064"
}
```

## 참고

- 식당 JSON은 `public` 폴더 밖에 있으므로 URL을 직접 입력해 파일을 내려받는 방식으로 공개되지 않습니다.
- `/api/restaurants`도 로그인 세션이 있는 사용자에게만 응답합니다.
- 로그인 상태는 서명된 쿠키로 최대 7일간 유지됩니다.
- Render 무료 서비스의 휴면/재시작이 발생해도 쿠키 기반 로그인 정보는 서버 메모리에 의존하지 않습니다.
