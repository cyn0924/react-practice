// React에서 컴포넌트를 만들기 위해 React와 필요한 Hook을 불러옵니다.
// useState는 열려있는 메뉴와 선택된 메뉴 정보를 저장합니다.
// useEffect는 화면 바깥을 클릭했는지 감지하는 이벤트를 등록할 때 사용합니다.
// useRef는 드롭다운 전체 영역을 참조하여 바깥 클릭 여부를 확인할 때 사용합니다.
import React, { useEffect, useRef, useState } from "react";
import "./App.css";

// 여러 곳에서 재사용할 수 있는 드롭다운 컴포넌트입니다.
// title은 버튼 제목, items는 메뉴 목록
// isOpen은 메뉴 열림 여부, onToggle은 열고 닫는 함수
// onSelect는 메뉴를 선택했을 때 실행할 함수입니다.
function Dropdown({ title, items, isOpen, onToggle, onSelect}) {

  // JSX 반환
  return (

    // 하나의 드롭다운 영역을 감싸는 컨테이너입니다.
    <div className="dropdown">

      {/* 드롭다운을 열거나 닫는 버튼입니다. */}
      {/* 버튼을 클릭하면 부모에서 전달받은 onToggle 함수를 실행합니다. */}
      <button onClick={onToggle} className="dropdownButton">
        
        {/* 버튼에 표시할 드롭다운 제목입니다. */}
        <span>{title}</span>

        {/* 메뉴가 열려 있으면 ▲, 닫혀 있으면 ▼를 표시합니다. */}
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* isOpen이 true일 때만 메뉴 목록을 화면에 표시합니다. */}
      {isOpen && (

        // 드롭다운 메뉴 항목들을 감싸는 영역입니다.
        <div className="menu">

          {/* items 배열의 각 항목을 버튼으로 변환합니다. */}
          {items.map((item) => (

            // React가 각 메뉴 항목을 구분할 수 있도록 id를 key로 사용합니다.
            // 메뉴 항목을 클릭하면 선택한 item 객체를 부모 함수에 전달합니다.
            <button key={item.id} onClick={() => onSelect(item)} className="menuItem">

              {/* 메뉴 항목의 label 값을 버튼 안에 표시합니다. */}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 드롭다운 메뉴 시스템 전체를 담당하는 App 컴포넌트입니다.
function App() {

  // 현재 열려 있는 메뉴 이름을 저장합니다.
  // profile, notification, category 또는 null 값이 들어갑니다.
  const [openMenu, setOpenMenu] = useState(null);

  // 사용자가 선택한 메뉴의 결과 문구를 저장합니다.
  const [selectedText, setSelectedText] = useState( "선택된 메뉴가 없습니다." );

  // 드롭다운 전체 영역을 참조하기 위한 ref입니다.
  // 바깥 영역을 클릭했는지 확인할 때 사용합니다.
  const wrapperRef = useRef(null);

  // 프로필 메뉴에 표시할 항목 목록입니다.
  const profileMenu = [
    { id: 1, label: "내 프로필"},
    { id: 2, label: "계정 생성"},
    { id: 3, label: "로그아웃"},
  ];

  // 알림 메뉴에 표시할 항목 목록
  const notificationMenu = [
    { id: 1, label: "새 메시지 3개"},
    { id: 2, label: "댓글 알림 5개"},
    { id: 3, label: "업데이트 안내"},
  ];

  // 카테고리 메뉴에 표시할 항목 목록입니다.
  const categoryMenu = [
    { id: 1, label: "프론트엔드"},
    { id: 2, label: "백엔드"},
    { id: 3, label: "디자인"},
    { id: 4, label: "프로젝트"},
  ];

  // 특정 드롭다운 메뉴를 열거나 닫는 함수입니다.
  const toggleMenu = (menuName) => {

    // 현재 열려있는 메뉴와 클릭한 메뉴가 같으면 닫습니다
    // 다른 메뉴를 클릭하면 기존 메뉴 대신 새 메뉴를 엽니다.
    setOpenMenu((prev) => prev === menuName ? null : menuName);
  };

  // 드롭다운 메뉴 항목을 선택했을 때 실행되는 함수입니다.
  const handleSelect = (item) => {

    // 선택한 항목의 label을 결과 문구에 표시합니다.
    setSelectedText(`선택된 메뉴: ${item.label}`);

    // 메뉴 항목을 선택한 후 드롭다운을 닫습니다.
    setOpenMenu(null);
  };

  // 드롭다운 바깥 영역을 클릭했을 때 메뉴를 닫기 위한 effect입니다.
  useEffect(() => {

    // 문서 전체에서 마우스 클릭 이벤트가 발생할 때 실행할 함수입니다.
    const handleClickOutside = (e) => {

    // wrapperRef.current가 존재하고, 클릭한 대상이 드롭다운 전체 영역 안에 포함되지 않았는지 확인합니다.
    if ( wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      
      // 드롭다운 바깥을 클릭했다면 메뉴를 닫습니다.
      setOpenMenu(null);
      }
    };

    // 문서 전체에 mousedown 이벤트를 등록합니다.
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트가 화면에서 사라질 때 이벤트를 제거합니다.
    // 이벤트를 제거하지 않으면 이벤트가 중복 등록될 수 있습니다.
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // App 컴포넌트가 화면에 표시할 jsx를 반환합니다.
  return (

    // 드롭다운 페이지 전체를 감싸는 최상위 컨테이너입니다.
    <div className="container">
      <h1 className="title">드롭다운 메뉴 시스템</h1>
      <p className="description">여러 개의 드롭다운 메뉴를 재사용 구조로 만든 예제입니다.</p>

      {/* 여러 드롭다운 메뉴를 감싸는 영역입니다. */}
      <div

        // 이 영역 전체를 wrapperRef와 연결합니다.
        ref={wrapperRef}
        className="menuWrap"
      >

        {/* 프로필 메뉴를 재사용 컴포넌트로 표시합니다. */}
        <Dropdown
          title="프로필 메뉴"

          // 프로필 메뉴 항목 배열을 전달합니다.
          items={profileMenu}

          // openMenu값이 profile일 때만 이 메뉴를 엽니다.
          isOpen={openMenu === "profile"}

          // 프로필 메뉴 버튼을 클릭하면 profile 메뉴를 열거나 닫습니다.
          onToggle={() => toggleMenu("profile")}

          // 메뉴 항목 선택시 handleSelect 함수를 실행합니다.
          onSelect={handleSelect}
        />

        {/*알림메뉴를 재사용 컴포넌트로 표시합니다. */}
        <Dropdown
          title="알림 메뉴"

          // 알림 메뉴 항목 배열을 전달합니다.
          items={notificationMenu}

          // openMenu 값이 notification 일때만 이 메뉴를 엽니다.
          isOpen={openMenu === "notification"}

          // 알림 메뉴 버튼을 클릭하면 열거나 닫습니다.
          onToggle={() => toggleMenu("notification")}

          // 메뉴 항목 선택시 공통 선택 함수를 실행합니다.
          onSelect={handleSelect}
        />

        {/* 카테고리 메뉴를 재사용 컴포넌트로 표시합니다. */}
        <Dropdown
          title="카테고리 메뉴"

          // 카테고리 메뉴 항목 배열을 전달합니다.
          items={categoryMenu}

          // openMenu 값이 category일 때만 이 메뉴를 엽니다.
          isOpen={openMenu === "category"}

          // 카테고리 메뉴 버튼을 클릭하면 열거나 닫습니다.
          onToggle={() => toggleMenu("category")}

          // 메뉴 항목 선택시 공통 선택 함수를 실행합니다.
          onSelect={handleSelect}
        />
      </div>

      {/* 사용자가 선택한 메뉴 결과를 보여주는 영역입니다. */}
      <div className="resultBox">

        {/* selectedText 상태에 저장된 선택 결과를 출력합니다. */}
        <p className="resultBox">{selectedText}</p>
      </div>
    </div>
  );
}

export default App;