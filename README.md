# 단체 식당 검색 v5

이번 버전은 좌표 계산을 제거했습니다.

## 방식
- 각 식당은 특정 기준 장소에 `location_id`로 연결됩니다.
- 각 식당은 `distance_km` 값을 직접 가집니다.
- 사용자가 장소와 반경을 선택하면:
  1. 해당 장소의 식당만 선택
  2. `distance_km <= 선택 반경` 조건으로 필터
  3. 가까운 거리순으로 정렬

## 현재 데이터
- 수원역: 10곳
- SK하이닉스 이천 본사: 20곳
- 총 30곳

## 앞으로 장소 추가 방법
1. `locations.json`에 새 장소 추가
2. `restaurants.json`에 해당 장소 식당 추가
3. 각 식당의 `location_id`를 새 장소 id로 설정
4. 각 식당의 `distance_km`를 직접 입력

코드 수정 없이 데이터 파일만 추가/수정하면 됩니다.

## Render
기존 환경변수 그대로:
- SITE_PASSWORD
- SESSION_SECRET

Build Command: npm install
Start Command: npm start
