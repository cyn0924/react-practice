// React에서 컴포넌트를 만들고 상태를 관리하기 위해 useState Hook을 불러옵니다.
import React, { useState } from "react";

// 현재 App 컴포넌트에 적용할 CSS파일을 불러옵니다.
import "./App.css";

// App이라는 이름의 함수형 컴포넌트를 만듭니다.
function App() {

  // 북마크 입력 폼의 값을 저장하는 상태입니다.
  // form 안에는 사이트명 title과 주소 url이 들어 있습니다.
  // form 에는 현재 입력값이 저장됩니다.
  // setForm은 form 상태를 변경하는 함수입니다.
  const [form, setForm] = useState({

    // 사이트명 입력창의 초기값입니다.
    title: "",

    // URL 입력창의 초기값입니다.
    url: "",
  });

  // 저장된 북마크 목록을 배열형태로 관리하는 상태입니다.
  // bookmarks는 현재 북마크 목록이 저장됩니다.
  // setBookmarks는 북마크 목록을 변경하는 함수입니다.
  const [bookmarks, setBookmarks] = useState([

    // 첫번째 기본 북마크 객체입니다.
    {
      
      // 북마크를 구분하기 위한 고유 번호입니다.
      id: 1,

      // 화면에 표시할 사이트 이름입니다.
      title: "React 공식 문서",

      // 링크를 클릭했을 때 이동할 사이트 주소입니다.
      url: "https://react.dev",
    },
    {
      id: 2,
      title: "MDN Web Docs",
      url: "https://developer.mozilla.org",
    },
  ]);

  // 사이트명 또는 URL이 입력값이 변경될 때 실행되는 함수입니다.
  // e에는 input에서 발생한 이벤트 정보가 전달됩니다.
  const changeForm = (e) => {
    const { name, value } = e.target;

    // 기존 form 객체를 복사하여 새로운 객체를 만듭니다.
    setForm({

      // 스프레드 문법으로 기존 title과 url을 복사한다.
      ...form,

      // [name]은 변수의 값을 객체의 속성명으로 사용하는 문법입니다.
      // name이 "title"이면 form.title을 변경합니다.
      // name이 "url"이면 form.url을 변경합니다.
      [name]: value,
    });
  };

  // 사이트명과 URL 입력창을 초기 상태로 되돌리는 함수입니다.
  const resetForm = () => {

    // title과 url을 모두 빈 문자열로 변경합니다.
    setForm({
      title: "",
      url: "",
    });
  };

  // 새로운 북마크를 목록에 추가하는 함수입니다.
  const addBookmark = () => {

    // 사이트명 앞뒤에 있는 불필요한 공백을 제거합니다.
    const title = form.title.trim();

    // url 앞뒤에 있는 불필요한 공백을 제거합니다.
    const url = form.url.trim();


    // 사이트명이나 url 중 하나라도 비어 있는지 확인합니다.
    // || 는 두 조건 중 하나라도 참인지 확인하는 or 연산자입니다.
    if (title === "" || url === "") {

      // 둘 중 하나의 값이라도 입력이 되지 않았다면 경고창을 띄운다.
      alert("사이트명과 URL을 모두 입력하세요.");

      // 그리고 ddBookmark 함수를 종료한다.
      return;
    }

    // 입력한 url과 같은 url이 이미 저장되어 있는지 검사합니다.
    // some()은 조건을 만족하는 요소가 하나라도 있으면 true를 반환합니다.
    const isDuplicate = bookmarks.some(

      // 현재 북마크의 url과 사용자가 입력한 url을 비교합니다.
      (bookmark) => bookmark.url === url
    );

    // isDuplicate가 true이면 같은 url이 이미 저장되어 있다는 뜻입니다.
    if (isDuplicate) {

      // 중복된 북마크라는 경고창을 표시합니다.
      alert("이미 저장된 북마크입니다.");
      
      // 중복 북마크를 저장하지 않고 함수를 종료합니다.
      return;
    }

    // 입력한 사이트명과 url로 새로운 북마크 객체를 만듭니다.
    const newBookmark = {

      // Date.now()는 현재 시간을 밀리초 단위의 숫자로 반환합니다.
      // 북마크마다 서로 다른 고유 id를 만들기 위해 사용합니다.
      id: Date.now(),

      // 앞뒤 공백을 제거한 사이트명을 저장합니다.
      // 속성명과 변수명이 같습니다.
      title,

      // 앞뒤 공백을 제거한 url을 저장합니다.
      // 속성명과 변수명이 같으므로 url: url 대신 url로 작성합니다.
      url,
    };


    // 새로운 북마크를 기존 북마크 배열의 맨 앞에 추가합니다.
    // 따라서 최근에 저장한 북마크가 목록의 위쪽에 표시됩니다.
    setBookmarks([newBookmark, ...bookmarks]);

    // 북마크 저장이 끝나면 입력창을 초기화합니다.
    resetForm();
  };

  // 선택한 북마크를 삭제하는 함수입니다.
  // id에는 삭제 버튼을 누른 북마크의 고유 번호가 전달됩니다.
  const deleteBookmark = (id) => {

    // 북마크를 정말 삭제할 것인지 사용자에게 확인합니다.
    // 확인을 누르면 true 또는 취소를 누르면 false 가 반환됩니다.
    const isDelete = window.confirm(
      "이 북마크를 삭제하시겠습니까?"
    );

    // 사용자가 취소를 눌렀다면 삭제하지 않고 함수를 종료합니다.
    if (!isDelete) return;

    // filter()로 삭제할 id와 다른 북마크만 남깁니다.
    // 기존 배열을 직접 수정하지 않고 새로운 배열을 남깁니다.
    setBookmarks(

      // 현재 북마크의 id와 삭제할 id가 다르면 배열에 남깁니다.
      bookmarks.filter((bookmark) => bookmark.id !== id)
    );
  };

  // 사이트명 또는 url 입력창에서 키를 눌렀을 때 실행되는 함수입니다.
  const handleKeyDown = (e) => {

    // 사용자가 누른 키가 엔터키인지 확인합니다.
    if (e.key === "Enter") {
      
      // 엔터키를 눌렀다면 북마크 저장함수를 실행합니다.
      addBookmark();
    }
  };

  // App 컴포넌트가 화면에 표시할 JSX 구조를 반환합니다.
  return (
    <div className="container">
      <h1 className="title">북마크 저장 / 삭제 기능</h1>

      <div className="form-box">
        <div className="input-group">
          <label className="label">사이트명</label>

          <input
            type="text"
            name="title"

            // value는 input을 form.title 상태와 연결합니다.
            value={form.title}

            // 입력값이 변경될 때 changeForm 함수가 실행됩니다.
            onChange={changeForm}

            // 엔터키를 누를 때마다 handleKeyDown 함수가 실행됩니다.
            onKeyDown={handleKeyDown}
            placeholder="예: React 공식 문서"
            className="input"
          />
        </div>

        <div className="input-group">
          <label className="label">URL</label>

          <input
            type="text"
            name="url"

            // form.url을 연결하여 제어 컴포넌트를 사용합니다.
            value={form.url}
            onChange={changeForm}
            onKeyDown={handleKeyDown}
            placeholder="예: https://react.dev"
            className="input"
          />
        </div>

        <button

        // 클릭을 했을때 addBookmark 함수가 실행돼서 북마크를 저장할 수 있다.
          onClick={addBookmark}
          className="add-button"
        >
          북마크 저장
        </button>
      </div>

      <div className="count-text">

        {/* bookmarks에 기수를 length 메서드가 세줍니다. */}
        전체 북마크 {bookmarks.length}개
      </div>

      <div className="list-wrap">

        {/* 북마크 개수가 0개이면? */}
        {bookmarks.length === 0 ? (

          // true이면 참이면 진실이면
          <div className="empty-box">
            저장된 북마크가 없습니다.
          </div>
        ) : (
          // false면 거짓이면
          bookmarks.map((bookmark, index) => (
            <div

            // React가 각 북마크를 구분할 수 있도록 고유 id를 지정합니다.
              key={bookmark.id}
              className="card"
            >
              <div className="left-area">
                <div className="number">

                  {/* index는 0부터 시작하고 id는 1부터 시작하기 때문에 index+1 해서 1을 만들어줍니다. */}
                  {index + 1}
                </div>

                {/* 정보 영역 */}
                <div className="info-box">
                  <div className="site-title">
                    {bookmark.title}
                  </div>

                  <a
                    href={bookmark.url}

                    // 새 탭에서 엽니다.
                    target="_blank"

                    // 새 탭 링크의 보안을 보완합니다.
                    rel="noreferrer"
                    className="link"
                  >
                    {bookmark.url}
                  </a>
                </div>
              </div>

              {/* 현재 북마크를 삭제하는 버튼입니다. */}
              {/* 화살표 함수로 감싸야 화면 렌더링 시 바로 실행되지 않고 */}
              {/* 버튼을 클릭했을 때만 deleteBookmark 함수가 실행됩니다. */}
              <button
                onClick={() =>
                  deleteBookmark(bookmark.id)
                }
                className="delete-button"
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;