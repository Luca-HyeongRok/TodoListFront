# TodoListFront

누구나 쉽게 할 수 있는 TodoList를 만들고 싶었습니다. 사용자가 날짜별로 할 일을 추가할 수 있고 수정 및 삭제가 가능한 일정 관리 웹 애플리케이션 입니다.

브랜치에 버전으로 관리해서 계속해서 수정해 나가는 중입니다.

주요 페이지 Home.jsx 할 일 목록을 표시하는 메인페이지 useReducer와 useContext를 활용해 상태관리를 했습니다.

주요 컴포넌트 및 설명 -Header.jsx 날짜 선택 / 이동 로그아웃 기능 -Editor.jsx 할 일 추가 GetDataModal.jsx(모달 팝업)과 함께 사용 -List.jsx 현재 날짜 또는 검색된 할 일 목록을 보여주는 리스트 TodoItem.jsx(개별 할 일 아이템)과 함께 사용됨 -TodoItem.jsx 개별 할 일 아이템을 표시하는 컴포넌트 체크박스(완료 여부), 수정 버튼, 삭제 버튼 포함

## ver1 - 기본적인 구성
### 1. 기본 기능(CRUD)

- 로그인 / 로그아웃
- 할 일 추가 / 삭제 /  수정

### 2. 달력 이동 기능

- 달력 이동시, 시작과 종료 날짜에 맞는 할 일 목록 불러오기

### 3. 정렬 및 표시 기능

- 중요도(빨강,초록,회색) 기준 정렬
- 체크 표시 여부에 따라 오늘의 할 일 개수 표시

### 4. 검색 기능

- 검색 창에 내용을 입력하면 해당 할 일 조회 가능

## ver2 - 리팩토링(API,CSS)
