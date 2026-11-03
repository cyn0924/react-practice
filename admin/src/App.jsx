//React 라이브러리와 상태 관리를 위한 useState Hook을 불러옵니다.
//useState는 현재 페이지, 로그인 폼 값, 사용자 정보, 메시지처럼 바뀌는 데이터를 저장할 때 사용합니다.
import React, { useState } from "react";

//현재 컴포넌트에서 사용할 CSS파일을 불러옵니다.
//className으로 연결한 스타일은 App.css 파일에 작성되어 있어야 화면에 적용됩니다.
import "./App.css";

//로그인한 사용자만 접근할 수 있는 보호 라우트 컴포넌트입니다.
//isLoggedIn은 현재 로그인 여부를 의미하고,
//children은 이 컴포넌트 안에 감싸서 전달한 실제 페이지 내용입니다.
function PrivateRoute({ isLoggedIn, children }) {

  //로그인 하지 않은 상태라면 children을 보여주지 않고 접근 불가 안내 화면을 반환합니다.
  if (!isLoggedIn) {
    return (
      //접근 차단 메시지를 감싸는 박스입니다.
      <div className="blockBox">

        //접근이 불가능하다는 제목을 보여줍니다.
        <h2 className="blockTitle">접근 불가</h2>

        //로그인 해야 접근할 수 있다는 설명 문구를 보여줍니다.
        <p className="blockText">로그인 필요</p>
      </div>
    );
  }

  //로그인한 상태라면 children으로 전달된 실제 페이지 컴포넌트를 그대로 보여줍니다.
  return children;
}

//관리자만 접근할 수 있는 전용 라우트 컴포넌트입니다.
//isLooggedIn은 로그인 여부
//user는 현재 로그인한 사용자 객체,
//children은 실제 관리자 페이지 내용을 의미합니다.
function AdminRoute({ isLoggedIn, user, children }) {

  //로그인하지 않은 상태라면 관리자 여부를 검사할 필요 없이 바로 접근을 차단합니다.
  if (!isLoggedIn) {

    //접근 차단 메시지를 감싸서 
    return (
      <div className="blockBox">

        //접근 불가 제목을 보여줍니다.
        <h2 className="blockTitle">접근 불가</h2>

        //로그인 필요하다라는 문자로 메시지를 보여줍니다.
        <p className="blockText">로그인 필요</p>
      </div>
    );
  }


  //로그인은 했지만 user 객체의 role 값이 admin 이 아니라면
  //관리자 권한이 없는 일반 사용자라고 판단합니다.
  if (user?.role !== "admin") {
    return (

      //권한 부족 메시지를 감싸는 박스입니다.
      <div className="blockBox">

        //권한이 없다는 제목을 보여줍니다.
        <h2 className="blockTitle">권한 없음</h2>

        //관리자만 접근 가능하다는 안내 문구를 보여줍니다.
        <p className="blockText">관리자만 가능</p>
      </div>
    );
  }

  //로그인도 되어 있고 관리자 권한도 있다면
  //children으로 전달된 관리자 페이지를 그대로 보여줍니다.
  return children;
}

//누구나 볼 수 있는 홈페이지 컴포넌트입니다.
function HomePage() {
  return (

    //홈페이지 내용을 감싸는 박스입니다.
    <div className="pageBox">

      //홈페이지의 제목 홈이라고 표시하고
      <h2>홈</h2>

      //공개 페이지라는 안내 메시지를 문자로 표시합니다.
      <p>공개 페이지</p>
    </div>
  );
}

//로그인한 사용자의 정보를 보여주는 마이페이지 컴포넌트입니다.
//user props로 전달받은 사용자 객체의 정보를 화면에 출력합니다.
function MyPage({ user }) {
  return (

    //마이페이지 내용을 감싸는 박스입니다.
    <div className="pageBox">

      //페이지 제목입니다.
      <h2>마이페이지</h2>

      //로그인한 사용자의 이름을 출력합니다.
      <p>{user.name}</p>

      //로그인한 사용자의 이메일을 출력합니다.
      <p>{user.email}</p>

      //로그인한 사용자의 사용자 권한(role)을 출력합니다.
      <p>{user.role}</p>
    </div>
  );
}

//관리자 전용 페이지 컴포넌트입니다.
//관리자만 볼 수 있는 관리 항목들을 ㅇㅖ시로 보여줍니다.
function AdminPage() {
  return (

    //관리자 페이지 전체를 감싸는 박스입니다.
    <div className="pageBox">

      //페이지 제목입니다.
      <h2>관리자 페이지</h2>

      //관리자 기능 카드들을 감싸는 패널영역입니다.
      <div className="adminPanel">

        //사용자 관리 기능 카드
        <div className="adminCard">사용자 관리</div>

        //게시글 관리 기능 카드
        <div className="adminCard">게시글 관리</div>

        //시스템 관리 기능 카드
        <div className="adminCard">시스템 관리</div>
      </div>
    </div>
  );
}

//앱 전체 기능을 담당하는 최상위 App 컴포넌트입니다.
function App() {

  //현재 어떤 페이지를 보여줄지 저장하는 상태입니다.
  //"home"이면 홈페이지가, "mypage"이면 마이페이지가, admin 이면 관리자 페이지가 나옵니다.
  const [currentPage, setCurrentPage] = useState("home");

  //로그인 폼의 입력값을 객체 형태로 저장하는 상태입니다.
  //email은 이메일 입력값, password는 비밀번호 입력값입니다.
  const [form, setForm] = useState({

    //처음에는 입력하기 전이므로 빈문자열로 비어있는 초기값입니다.
    email: "",
    password: "",
  });

  //현재 로그인한 사용자 정보를 저장하는 상태입니다.
  //로그인 전에는 null이고, 로그인 성공 후에는 사용자 객체가 들어갑니다.
  const [user, setUser] = useState(null);

  //화면에 보여줄 안내 메시지를 저장하는 상태입니다.
  //로그인 성공, 로그인 실패, 로그아웃 같은 문구를 담습니다.
  const [message, setMessage] = useState("");

  //로그인 검사용 사용자 목록입니다.
  //실제 프로젝트라면 서버에서 받아오겠지만,
  //여기서는 학습용이므로 배열에 직접 작성해 둔 테스트 계정입니다.
  const users = [

    //관리자 계정 정보입니다.
    {
      email: "admin@test.com",
      password: "1234",
      name: "김지애",
      role: "admin",
    },

    //일반 사용자 계정 정보입니다.
    {
      email: "user@test.com",
      password: "1234",
      name: "홍길동",
      role: "user",
    },
  ];

  //현재 로그인 상태인지 여부를 계산하는 값입니다.
  //user가 null이 아니면 true, null이면 false가 됩니다.
  const isLoggedIn = Boolean(user);

  //이메일 또는 비밀번호 입력값이 바뀔 때 실행되는 함수입니다.
  //하나의 함수로 여러 입력창을 함게 처리하기 위해 name 속성을 사용합니다.
  const handleChange = (e) => {
    //이벤트가 발생한 input 요소의 name과 value 값을 구조분해 할당으로 꺼냅니다.
    const { name, value } = e.target;

    //기존 prevForm으로 form 객체를 스프레드 문법으로 복사한 뒤에
    //현재 변경된 input의 name에 해당하는 값만 새 value로 바꿉니다.
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    //기존 form 메시지를 비워둡니다.
    setMessage("");
  };

  //로그인 폼 제출시 실행되는 함수입니다.
  const handleLogin = (e) => {

    //form의 기본 제출 동작인 페이지 새로고침을 막습니다.
    e.preventDefault();

    //사용자가 실수로 입력한 앞뒤 공백을 trim으로 제거하고
    //email은 변수 email에 password는 변수 password에 저장합니다.
    const email = form.email.trim();
    const password = form.password.trim();

    //이메일이 비어있거나 패스워드가 비어있다면 둘 중에 하나라도 or 연산자를 사용하여
    //둘 중 하나라도 비어있다면 아래 메시지를 표시하고 아래 기능을 실행하지 않고 종료합니다.
    if (!email || !password) {
      setMessage("이메일과 비밀번호를 입력하세요.");
      return;
    }

    //user 배열에서 입력한 이메일과 비밀번호가 모두 (&& : and 연산자) 일치하는 사용자를 찾습니다.
    const foundUser = users.find(
      (item) =>
        item.email === email &&
        item.password === password
    );

    //일치하는 사용자가 없다면 로그인 실패 메시지를 보여주고 종료합니다.
    if (!foundUser) {
      setUser(null);
      setMessage("로그인 실패");
      return;
    }

    //일치하는 사용자를 찾았다면 user 상태에 저장해 로그인 상태로 전환합니다.
    setUser(foundUser);


    //로그인 성공 후 입력창을 비우기 위해 form 상태를 초기화합니다.
    setForm({
      email: "",
      password: "",
    });

    //로그인 성공 메시지를 화면에 표시합니다.
    setMessage("로그인 성공");
  };


  //로그아웃 버튼을 눌렀을 때 로그아웃이 실행되는 함수입니다.
  const handleLogout = () => {

    //현재 로그인한 사용자 정보를 제거합니다.
    setUser(null);

    //로그아웃 후 기본 화면인 홈 페이지로 이동시킵니다.
    setCurrentPage("home");

    //로그아웃 메시지를 화면에 표시합니다.
    setMessage("로그아웃");
  };

  return (

    //전체 앱 화면을 감싸는 최상위 컨테이너입니다.
    <div className="container">

      {/* //앱 상단 제목 */}
      <h1 className="mainTitle">권한 분리</h1>

      {/* //상단 메뉴 바 */}
      {/* //페이지 이동 버튼과 로그인 상태 표시/로그아웃 버튼이 들어갑니다. */}
      <div className="topBar">
        <div>
          <button
            type="button"
            onClick={() => setCurrentPage("home")}
          >
            홈
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage("mypage")}
          >
            마이페이지
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage("admin")}
          >
            관리자
          </button>
        </div>

        {isLoggedIn ? (
          <button type="button" onClick={handleLogout}>
            로그아웃
          </button>
        ) : (
          <span>비로그인</span>
        )}
      </div>

        {/* //로그인 하지 않은 상태일 때만 로그인 폼을 화면에 보여줍니다. */}
      {!isLoggedIn && (
        <div className="loginBox">
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"

              //form 상태의 email의 값을 입력창과 연결합니다.
              value={form.email}

              //입력값이 바뀔때마다 handleChange 함수가 실행됩니다.
              onChange={handleChange}
              placeholder="이메일"
            />

            <input
              type="password"
              name="password"

              //form 상태의 password의 값을 입력창과 연결합니다.
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호"
            />

            <button type="submit">로그인</button>
          </form>

          <div className="accountInfo">
            <p>관리자: admin@test.com / 1234</p>
            <p>일반 사용자: user@test.com / 1234</p>
          </div>
        </div>
      )}

      {/* //실제 페이지 내용이 출력되는 영역입니다. */}
      <div className="pageArea">

        {/* //currentPage가 home이라면 HomePage가 렌더링 됩니다. */}
        {currentPage === "home" && <HomePage />}

        {/* //currentPage가 mypage이면 PrivateRoute로 감산 MyPage를 렌더링합니다. */}
        {/* //로그인하지 않은 경우 PrivateRoute가 접근 불가 화면을 대신 보여줍니다. */}
        {currentPage === "mypage" && (
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <MyPage user={user} />
          </PrivateRoute>
        )}

        {/* //currentPage가 admin이면 AdminPage로 감싼 AdminPage를 렌더링합니다. */}
        {/* //로그인 하지 않았거나 관리자 권한이 아닌 일반 계정으로 로그인하였다면 차단 화면을 보여줍니다. */}
        {currentPage === "admin" && (
          <AdminRoute isLoggedIn={isLoggedIn} user={user}>
            <AdminPage />
          </AdminRoute>
        )}
      </div>

      {/* //message 값이 비어있지 않을 때만 화면 아래에 안내 메시지를 출력합니다. */}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;