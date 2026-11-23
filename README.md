# 우리반 알림장

교사는 알림을 게시·수정·삭제하고 중요한 글을 상단에 고정할 수 있습니다. 학생과 학부모는 로그인 없이 글을 열람하고, 공지·준비물·숙제·일정으로 분류하거나 검색할 수 있습니다. 게시 날짜는 한국 시간으로 표시됩니다.

## 로컬에서 실행

저장소 루트에서 아래 명령을 실행하고 [알림장](http://localhost:8000)을 엽니다.

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory docs
```

초기 상태는 체험 모드입니다. **교사 로그인 → 체험 시작**을 누르면 글을 작성해 볼 수 있습니다. 체험 글은 해당 브라우저에 저장됩니다. 학급 표시는 `docs/config.js`의 `className`에서 변경할 수 있습니다.

## 실제 학급에서 사용

1. Supabase 프로젝트를 만들고 SQL Editor에서 [스키마](supabase/schema.sql)를 한 번 실행합니다.
2. Supabase의 **Authentication → Users**에서 이메일과 비밀번호로 교사 계정을 만들고 사용자 UID를 복사합니다. 자동 이메일 확인을 선택하면 생성한 계정으로 바로 로그인할 수 있습니다.
3. SQL Editor에서 아래 값을 교사 UID로 바꿔 실행합니다. 교사마다 한 번씩 실행합니다.

   ```sql
   insert into public.class_teachers (user_id)
   values ('여기에-교사-UID');
   ```

4. [설정 파일](docs/config.js)에 프로젝트 URL과 `sb_publishable_…` 공개 키를 넣습니다. 이 파일은 사이트 방문자가 읽을 수 있으므로 비밀 키나 교사 비밀번호는 Supabase에서 관리합니다. [Supabase API 키 문서](https://supabase.com/docs/guides/getting-started/api-keys)
5. 연결 후에는 교사가 게시한 글이 Supabase에 저장되고, 학생과 학부모는 각자의 기기에서 페이지를 열거나 새로고침해 확인할 수 있습니다. 게시물은 인터넷에 공개되므로 학급 전체에 공유할 수 있는 내용만 게시합니다. 데이터베이스가 등록된 교사의 작성 권한을 확인합니다. [Supabase 행 수준 보안 문서](https://supabase.com/docs/guides/database/postgres/row-level-security)

## GitHub Pages 배포

1. 파일을 GitHub 저장소의 `main` 브랜치에 올립니다.
2. **Settings → Pages**에서 **Deploy from a branch**를 선택하고 브랜치는 `main`, 폴더는 `/docs`를 선택해 저장합니다.
3. Pages 화면에 표시되는 주소를 열어 교사 계정으로 로그인합니다. 다른 브라우저에서 로그아웃 상태로 같은 주소를 열면 열람 화면을 확인할 수 있습니다.

빌드나 패키지 설치 없이 배포할 수 있습니다. [GitHub Pages 게시 소스 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
