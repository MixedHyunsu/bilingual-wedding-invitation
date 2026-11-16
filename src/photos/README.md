# 사진 넣는 곳

이 폴더에 사진 파일을 넣고 `invitation.conf` 의 `PHOTO_*` 값에 파일 이름을 적습니다.
`build.sh` 가 이 폴더의 파일을 `dist/photos/` 로 옮깁니다.

```ini
PHOTO_MAIN="cover.jpg"          # 표지 사진
PHOTO_MAIN_FRAME="auto"         # photo(사진 비율 그대로) | arch(아치로 자름) | auto(가로면 photo, 세로면 arch)
PHOTO_BLESS="bless.jpg"         # 하단 전체폭 사진 (비우면 자리째 빠집니다)
PHOTO_GALLERY="g01.jpg,g02.jpg,g03.jpg,g04.jpg,g05.jpg,g06.jpg,g07.jpg,g08.jpg,g09.jpg"
PHOTO_OG_MAIN="og.jpg"          # 공유 미리보기 (비우면 PHOTO_MAIN)
```

함께 들어 있는 `demo-*.jpg` 는 사진이 아니라 도형으로 그린 자리 표시입니다.
두 분의 사진으로 바꿔 주세요. 값을 비워 두면 빈 자리로 나오고 화면은 깨지지 않습니다.

## 알아 두실 것

- **이 폴더의 사진은 commit되지 않습니다.** `.gitignore` 가 `demo-*.jpg` 와 이 README만 추적합니다.
  사진을 백업하려면 따로 보관해 주세요.
- **gallery는 3x3 pagination이라 9장이 한 page입니다.** 9의 배수로 넣으면 마지막 page가 비지 않습니다.
- **표지 사진 틀.** 테두리까지 보여야 하는 포토부스 컷 같은 사진은 `PHOTO_MAIN_FRAME="photo"` 로 두면 자르지 않고 그대로 보여 줍니다.
- **용량.** 휴대폰에서 열리므로 장당 긴 변 1600px 안팎, 수백 KB 정도로 줄여 두면 빨리 뜹니다.
