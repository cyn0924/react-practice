// React 라이브러리와 상태 관리를 위한 useState Hook을 불러옵니다.
// React는 jsx문법을 해석하고 컴포넌트를 구성하기 위해 필요합니다.
// useState는 입력값과 태그 목록처럼 계속 바뀌는 데이터를 저장할 때 사용합니다.
import React, { useState } from "react";

// 현재 컴포넌트에 적용할 CSS 파일을 불러옵니다.
// className으로 지정한 스타일들은 App.css에 작성되어 있어야 화면에 반영됩니다.
import "./App.css";

// 태그 추가/삭제 기능 전체를 담당하는 App 컴포넌트를 선언합니다.
function App() {

  // 입력창에 현제 입력 중인 태그 문자열을 저장하는 상태입니다.
  // input은 현재 값이고, setInput은 이 값을 변경하는 함수입니다.
  const [input, setInput] = useState("");

  // 현재 등록된 태그 목록을 배열 형태로 저장하는 상태입니다.
  // 초기값으로 React, Javascript, CSS 세 개의 태그가 들어 있습니다.
  const [tags, setTags] = useState(["React", "JavaScript", "CSS"]);

  // 새로운 태그를 목록에 추가하는 함수를 선언합니다.
  const addTag = () => {

    // 입력값의 앞뒤 공백을 제거한 결과를 newTag변수에 저장합니다.
    // 사용자가 공백을 포함해 입력해도 실제 태그 값은 깔끔하게 저장되도록 합니다.
    const newTag = input.trim();


    // 공백 제거 후에도 빈 문자열이면 태그를 추가하지 못하게 막습니다.
    if (newTag === "") {

      // 사용자에게 태그를 입력하라는 경고창을 띄웁니다.
      alert("태그를 입력하세요.");

      // 함수 실행을 여기서 종료합니다.
      return;
    }

    // 이미 같은 이름의 태그가 배열안에 존재하는지 확인합니다.
    if (tags.includes(newTag)) {
      
      // 중복 태그는 추가하지 않도록 경고창을 띄웁니다.
      alert("이미 존재하는 태그입니다.");

      // 함수 실행을 종료합니다.
      return;
    }

    // 기존 tags배열 뒤에 새 태그를 추가한 새 배열로 상태를 갱신합니다.
    setTags([...tags, newTag]);

    // 태그를 추가한 뒤 입력창을 비워 다음 태그를 바로 입력 할 수 있게 합니다.
    setInput("");
  };

  // 특정 태그를 삭제하는 함수를 선언합니다.
  const deleteTag = (tagToDelete) => {

    // tags 배열에서 삭제하려는 태그와 일치하지 않는 태그만 남겨서
    // 새로운 배열을 만들고 상태를 갱신합니다.
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  // 입력창에서 키를 눌렀을 때 실행되는 함수를 선언합니다.
  const handleKeyDown = (e) => {

    // 사용자가 Enter 키를 누르면 addTag함수를 실행합니다.
    // 이렇게 하면 버튼을 클릭하지 않아도 태그를 추가할 수 있습니다.
    if (e.key === "Enter") {

      // 엔터키를 누르면 addTag함수가 실행됩니다.
      addTag();
    }
  };

  // 화면에 렌더링할 JSX구조를 반환합니다.
  return (

    // 전체 태그 기능 화면을 감싸는 최상위 컨테이너입니다.
    <div className="container">
    
    {/* 제목 */}
      <h1 className="title">태그 추가 / 삭제</h1>

      {/* 입력창과 추가 버튼을 묶는 영역입니다. */}
      <div className="inputWrap">
        <input
        
          // 텍스트 입력 타입
          type="text"

          // 입력창이 비어 있을 때 사용자에게 보여줄 안내문구입니다.
          placeholder="태그 입력"

          // input 상태값을 input 요소와 연결한 제어 컴포넌트입니다.
          value={input}

          // 사용자가 입력해서 변경될때마다 input 상태를 최신값으로 갱신합니다.
          onChange={(e) => setInput(e.target.value)}

          // 입력창에서 키를 누르면 handleKeyDown 함수가 실행됩니다.
          onKeyDown={handleKeyDown}
          className="input"
        />

        {/* 클릭하면 addTag함수가 실행되어 새 태그가 추가되는 버튼입니다. */}
        <button onClick={addTag} className="addButton">
          추가
        </button>
      </div>

      {/* 태그 목록 전체를 감싸는 영역입니다. */}
      <div className="tagBox">

        {/* 태그가 하나도 없을 때와 있을 때를 조건부로 나누어 렌더링합니다. */}
        {tags.length === 0 ? (

          // 태그가 없으면 안내 문구를 보여줍니다.
          <p className="emptyText">등록된 태그 없음</p>
        ) : (

          // 태그가 있으면 tags 배열을 map으로 순회하며 하나씩 출력합니다.
          tags.map((tag) => (

            // 각 태그를 감싸는 개별 박스입니다.
            // Key에는 태그 문자열 자체를 사용합니다.
            <div key={tag} className="tagItem">

              {/* 실제 태그 이름 앞에 #기호와 함께 화면에 표시합니다. */}
              <span className="tagText">#{tag}</span>

              {/*  */}
              <button
                onClick={() => deleteTag(tag)}
                className="deleteButton"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;