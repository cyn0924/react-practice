//React에서 필요한 Hook을 불러옵니다.
//useState : 화면에서 변경되는 값을 상태로 저장하고 관리할 때 사용합니다.
//useEfffect : 특정 상태가 변경되었을 대 추가 작업을 실행할때 사용합니다.
//             여기서는 notes가 변경될 때 localStorage에 저장하기 위해 사용합니다.
//useMemo: 특정 계산 결과를 저장해 두었다가 관련된 값이 변경될 때만 다시 계산합니다.
//여기서는 검색 결과인 filteredNotes를 계산하는데 사용합니다.
import { useEffect, useMemo, useState } from "react";

//App 컴포넌트에 적용할 CSS 파일을 불러옵니다.
//JSX에 작성된 className과 App.css 의 선택자가 연결됩니다.
import "./App.css";

//로그인 토큰을 localStorage에 저장할 때 사용할 키 이름입니다.
//localStorage는 데이터를 키와 값의 형태로 저장하기 때문에
//어떤 이름으로 값을 저장하고 불러올지 미리 정해두어야 합니다.
const TOKEN_KEY = "memo_login_token";

//로그인한 사용자 정보를 저장할 때 사용할 localStorge 키입니다.
const USER_KEY = "memo_login_user";

//작성한 메모 목록을 저장할 때 localStorage키 입니다.
const NOTES_KEY = "memo_notes";

//메모 애플리케이션의 전체 화면과 기능을 담당하는
//App 함수형 컴포넌트를 선언하고 외부로 내보냅니다.
export default function App() {

  //로그인 입력창에 입력한 이메일과 비밀번호를
  //하나의 객체 형태로 관리하는 상태입니다.
  //loginForm은 현재 입력값을 가지고 있고,
  //setLoginForm은 입력값을 변경할 때 사용하는 함수입니다.
  const [loginForm, setLoginForm] = useState({

    //email은 입력하기 전이므로 빈문자열로 초기화합니다.
    email: "",

    //password는 입력하기 전이므로 빈문자열로 초기화합니다.
    password: "",
  });

  //사용자의 로그인 토큰을 관리하는 상태입니다.
  //useState에 함수를 전달하면 App컴포넌트가 처음 실행될 때만
  //localStorage에서 값을 읽어오게 됩니다.
  const [token, setToken] = useState(

    //lcoalStorage에 저장된 토큰이 있으면 그 값을 사용하고
    //저장된 토큰이 없으면 빈 문자열을 초기값으로 사용합니다.
    () => localStorage.getItem(TOKEN_KEY) || ""
  );

  //현재 로그인한 사용자의 정보를 관리하는 상태입니다.
  const [user, setUser] = useState(() => {

    //localStorage에 저장된 사용자 정보를 가져옵니다.
    //localStorage에는 객체를 직접 저장할 수 없기 때문에
    //JSON 문자열 형태로 저장된 값을 가져오게 됩니다.
    const savedUser = localStorage.getItem(USER_KEY);
  
    try {
      //저장된 사용자 정보가 있으면 JSON.parse를 사용해
      //JSON 문자열을 다시 자바스크립트 객체로 변환합니다.
      //저장된 정보가 없으면 NULL을 반환합니다.
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      //저장된 문자열이 올바른 JSON 형식이 아니어서
      //변환 과정에서 오류가 발생하면 null을 반환합니다.
      return null;
    }
  });

  //로그인 성공, 로그인 실패, 메모 추가 및 삭제 결과처럼
  //사용자에게 보여줄 안내 메시지를 관리하는 상태입니다.
  const [message, setMessage] = useState("");

  //사용자가 작성한 전체 메모 목록을 배열로 관리하는 상태입니다.
  const [notes, setNotes] = useState(() => {

    //localStorage에 저장된 메모 목록을 가져옵니다.
    const savedNotes = localStorage.getItem(NOTES_KEY);

    try {
      //저장된 메모가 있으면 JSON 문자열을 배열로 변환합니다.
      //저장된 메모가 없으면 빈 배열을 반환하여
      //메모가 하나도 없는 상태로 시작합니다.
      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch {

      //저장된 메모 데이터를 JSON 으로 변환하지 못하면
      //오류가 발생하지 않도록 빈 배열을 반환합니다.
      return [];
    }
  });

  //메모 제목 입력창의 값을 관리하는 상태입니다.
  const [title, setTitle] = useState("");

  //메모 내용 입력창의 값을 관리하는 상태입니다.
  const [content, setContent] = useState("");

  //메모 검색창에 입력한 검색어를 관리하는 상태입니다.
  const [search, setSearch] = useState("");

  //현재 수정하고 있는 메모의 id를 관리하는 상태입니다.
  //null이면 새로운 메모를 작성하는 상태이고,
  //id가 들어있으면 해당 id를 가진 메모를 수정하는 상태입니다.
  const [editId, setEditId] = useState(null);

  //token이 존재하는지 확인하여 로그인 상태를 만듭니다.
  //Boolean 값을 true 또는 false 로 변환합니다.
  //token이 빈 문자열이면 false, 토큰이 있으면 true가 됩니다.
  const isLoggedIn = Boolean(token);

  // notes상태가 변경될 때마 실행되는 Effect입니다.
  useEffect(() => {
    //notes 배열은 객체를 포함하고 있기 때문에 
    //JSON.stringify를 이용하여 JSON 문자열로 변환합니다.
    //변환된 문자열을 localStorage에 저장하면
    //페이지를 새로고침해도 메모가 유지됩니다.
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  //의존성 배열에 notes를 넣었기 때문에 notes 상태가 변경될 때만 이 함수가 실행됩니다.
  //검색어에 맞는 메모만 필터링한 결과를 계산합니다.
  //useMemo를 사용하면 notes또는 search가 변경될 때만
  //검색 결과를 다시 계산할 수 있습니다.
  const filteredNotes = useMemo(() => {

    //검색어의 앞뒤 공백을 제거합니다.
    //영어 검색시 대소문자 차이 없이 검색할 수 있도록
    //모든 문자를 소문자로 변환합니다.
    const keyword = search.trim().toLowerCase();

    //검색어가 비어 있다면 필터링하지 않고
    //전체 메모 목록을 그대로 반환합니다.
    if (!keyword) {
      return notes;
    }

    //filter를 사용해 검색어가 포함된 메모만 남깁니다.
    return notes.filter(
      (음표) =>

        //메모 제목을 소문자로 바꾼 다음
        //검색어가 포함되어 있는지 검사합니다.
        note.title.toLowerCase().includes(keyword) ||

        //제목에 검색어가 없으면 메모 내용에도
        //검색어가 포함되어 있는지 검사합니다.
        note.content.toLowerCase().includes(keyword)
    );
  }, [notes, search]);

  //notes 또는 sarch가 변경될 때 검색 결과를 다시 계산합니다.
  //로그인 input의 값이 변경될 때 실행되는 함수입니다.
  //이메일과 비밀번호 입력창이 같은 함수를 함께 사용합니다. 
  const handleLoginChange = (e) => {

    //이벤트가 발생한 input의 name과 value를 가져옵니다.
    //name은 email 또는 password이고,
    //value는 사용자가 실제로 입력한 값입니다.
    const { name, value } = e.target;

    //이전 로그인 폼 상태를 기반으로 새로운 상태를 만듭니다.
    setLoginForm((prev) => ({

      //기존 email과 password 값을 먼저 복사한 후
      ...prev,

      //계산된 속성 이름을 사용하여 현재 입력한 항목만 변경합니다.
      //name이 email이면 email 값이 변경되고
      //name이 password이면 password의 값이 변경됩니다.
      [name]: value,
    }));

    //사용자가 입력을 다시 시작하면
    //이전에 표시되던 로그인 결과 메시지를 지웁니다.
    setMessage("");
  };

  //로그인 폼을 제출했을 때 실행되는 함수입니다.
  const handleLogin = (e) => {

    //form 제출시 브라우저가 새로고침되는 기본 동작을 막습니다.
    e.preventDefault();

    //이메일 앞뒤에 입력된 불필요한 공백을 제거합니다.
    const email = loginForm.email.trim();

    //비밀번호 앞뒤에 입력된 불필요한 공백을 제거합니다.
    const password = loginForm.password.trim();

    //이메일 또는 비밀번호 중 하나라도 비어 있는지 검사합니다.
    if (!email || !password) {

      //입력값이 비어 있으면 사용자에게 안내 메시지를 보여줍니다.
      setMessage("이메일과 비밀번호를 입력하세요.");

      //이후 로그인 검사가 실행되지 않도록 함수를 종료합니다.
      return;
    }

    //입력한 계정이 테스트 계정과 일치하는지 검사합니다.
    //실제 서비스에서는 서버에 로그인 요청을 보내야 하지만,
    //현제 예제에서는 미리 정한 계정과 직접 비교합니다.
    if (email === "test@test.com" && password === "1234") {

      //로그인 성공을 나타내는 테스트용 토큰을 만듭니다.
      const loginToken = "sample-token";

      //로그인한 사용자 정보를 객체로 만듭니다.
      const loginUser = {

        //화면에 표시할 테스트 사용자 이름입니다.
        name: "테스트유저",

        //사용자가 입력한 이메일을 사용자 정보에 저장합니다.
        email: email,
      };

      //페이지를 새로고침해도 로그인 상태가 유지되도록
      //로그인 토큰을 localStorage에 저장합니다.
      localStorage.setItem(TOKEN_KEY, loginToken);
      
      //사용자 객체는 localStorage 에 직접 저장 할 수 없으므로
      //JSON 문자열로 변환한 다음 저장합니다.
      localStorage.setItem(USER_KEY, JSON.stringify(loginUser));


      //React의 token 상태도 로그인 토큰으로 변경합니다.
      //token이 생기면 isLoggedIn이 true가 되어
      //로그인 화면 대신 메모 화면이 나타납니다.
      setToken(loginToken);

      //로그인한 사용자 정보를 상태에 저장합니다.
      setUser(loginUser);

      //로그인이 완료되었으므로 이메일과 비밀번호 입력창을 비웁니다.
      setLoginForm({
        email: "",
        password: "",
      });

      //로그인 성공 안내 메시지를 저장합니다.
      setMessage("로그인 성공");

      //로그인 성공 이후 아래의 실패 코드가 실행되지 않도록 함수를 여기서 종료합니다.
      return;
    }

    //테스트 계정과 일치하지 않으면 로그인 실패 메시지를 저장합니다.
    setMessage("로그인 실패");
  };

  // 로그아웃 버튼을 클릭했을 때 실행되는 함수입니다.
  const handleLogout = () => {

    //localStorage 에 저장된 로그인 토큰을 삭제합니다.
    localStorage.removeItem(TOKEN_KEY);

    //localStorage 에 저장된 사용자 정보도 삭제합니다.
    localStorage.removeItem(USER_KEY);

    //React에서 관리하는 토큰 상태를 빈 문자열로 변경합니다.
    //token이 빈 문자열이 되면 isLoggedIn이 false가 됩니다.
    setToken("");

    //로그인한 사용자 정보를 제거합니다.
    setUser(null);

    //로그아웃 안내 메시지를 저장합니다.
    setMessage("로그아웃");

    //작성 또는 수정 중이던 메모 입력값을 초기화합니다.
    resetForm();
  };

  // 메모 입력창과 수정 상태를 초기화하는 함수입니다.
  const resetForm = () => {

    //메모 제목 입력창을 비웁니다.
    setTitle("");

    //메모 내용 입력창도 비웁니다.
    setContent("");

    //수정중인 메모 id를 제거합니다.
    //editId가 null이 되면 새 메모 작성 상태로 돌아값니다.
    setEditId(null);
  };

  // 메모 추가 또는 수정을 처리하는 함수입니다.
  const handleSubmit = (e) => {

    //form 제출로 인해 페이지가 새로고침 되는 것을 막습니다.
    e.preventDefault();

    //제목의 앞뒤 공백을 제거합니다
    const trimmedTitle = title.trim();

    //내용의 앞뒤 공백을 제거합니다
    const trimmedContent = content.trim();

    //제목 또는 내용 중 하나라도 비어있는지 검사합니다.
    if (!trimmedTitle || !trimmedContent) {

      //입력값이 비어 있으면 사용자에게 안내 메시지를 보여줍니다.
      setMessage("제목과 내용을 입력하세요.");

      //메모 추가 또는 수정 작업을 실행하지 않고 함수를 종료합니다.
      return;
    }


    //메모의 작성 또는 수정시간을 저장합니다.
    //toLocaleString은 사용자의 지역 형식에 맞는
    //날짜와 시간 문자열을 만들어줍니다.
    const currentTime = new Date().toLocaleString();

    // editId가 null이 아니면 기존 메모를 수정하는 상태입니다.
    if (editId !== null) {

      //이전 메모 목록을 기반으로 새로운 메모 배열을 만듭니다.
      setNotes((prevNotes) =>
        //map은 배열의 각 메모를 확인한 다음
      //수정된 내요을 포함하는 새로운 배열을 반환합니다.
        prevNotes.map((음표) => {

          //현재 확인 중인 메모의 id가 수정 대상 id와 같은지 검사합니다.
          if (note.id === editId) {

            //수정 대상인 경우 새로운 메모 객체를 반환합니다.
            return {

              //id와 작성 시간등 기존 메모 정보를 복사합니다.
              ...note,

              //기존 제목을 새롭게 입력한 제목으로 변경합니다.
              title: trimmedTitle,

              //기존 내용을 새롭게 입력한 내용으로 변경합니다.
              content: trimmedContent,

              //메모가 수정된 시간을 현재 시간으로 변경합니다.
              updatedAt: currentTime,
            };
          }

          //수정 대상이 아닌 메모는 변경하지 않고 그대로 반환합니다.
          return note;
        })
      );

      //메모 수정 완료 메시지를 저장합니다.
      setMessage("메모가 수정되었습니다.");
    }

    // editId가 없으면 새 메모 추가
    else {

      //eidtId가 null이면 새 메모를 추가합니다.
      //새롭게 추가할 메모 객체를 만듭니다.
      const newNote = {

        //현재 시간을 숫자로 반환하여 메모의 고유 id로 사용합니다.
        id: Date.now(),

        //공백을 제거한 제목을 저장합니다.
        title: trimmedTitle,

        //공백을 제거한 내용을 저장합니다.
        content: trimmedContent,

        //메모가 처음 작성된 시간을 저장합니다.
        createdAt: currentTime,

        //메모의 최근 수정 시간을 저장합니다.
        //새 메모이므로 작성시간과 수정 시간이 같습니다.
        updatedAt: currentTime,
      };


      //새 메모를 기존 배열의 가장 앞에 추가합니다.
      //새로 작성한 메모가 목록의 위쪽에 표시됩니다.
      setNotes((prevNotes) => [newNote, ...prevNotes]);

      //메모 추가 완료 메시지를 저장합니다.
      setMessage("메모가 추가되었습니다.");
    }

    // 추가 또는 수정 후 입력창 초기화
    //메모 추가 또는 수정이 긑나면 입력창을 초기화합니다.
    resetForm();
  };

  // 메모 카드의 수정 버튼을 클릭했을 때 실행되는 함수입니다.
  //매개 변수 note에는 사용자가 선택한 메모 객체가 전달됩니다.
  const handleEdit = (음표) => {
    // 선택한 메모의 제목을 제목 입력창에 넣습니다.
    setTitle(note.title);

      // 선택한 메모의 내용을 내용 입력창에 넣습니다.
    setContent(note.content);

    //선택한 메모의 id를 수정 대상 id로 저장합니다.
    setEditId(note.id);

    //사용자에게 수정 방법을 안내하는 메시지를 저장합니다.
    setMessage("메모 내용을 수정한 후 '메모 수정' 버튼을 눌러주세요.");

    //메모 입력창을 쉽게 확인할 수 있도록
    //브라우저 화면을 페이지의 가장 위쪽으로 이동시킵니다.
    window.scrollTo({

      //세로 스크롤 위치를 0으로 맨위를 설정합니다.
      top: 0,

      //갑자기 이동하지 않고 부드럽게 이동하도록 설정합니다.
      behavior: "smooth",
    });
  };

  // 메모 수정 취소 버튼을 클릭했을때 실행되는 함수입니다.
  const handleCancelEdit = () => {

    //입력창과 수정 상태를 초기화합니다.
    resetForm();

    //수정 취소 안내 메시지를 저장합니다.
    setMessage("메모 수정을 취소했습니다.");
  };

  // 메모 삭제버튼을 클릭했을 때 실행되는 함수입니다.
  //매개변수 id에는 삭제할 메모의 id가 전달됩니다.
  const handleDelete = (id) => {

    //confirm창을 보여주어 정말 삭제할 것인지 확인합니다.
    //확인을 누르면 true가 저장되고,
    //취소를 누르면 false가 저장됩니다.
    const isDelete = window.confirm("메모를 삭제하시겠습니까?");

    //사용자가 취소를 선택하면 삭제하지 않고 함수를 종료합니다.
    if (!isDelete) {
      return;
    }

    //filter를 사용해 삭제할 id와 다른 메모만 남깁니다.
    //결과적으로 전달 받은 id를 가진 메모가 배열에서 제거됩니다.
    setNotes((prevNotes) =>
      prevNotes.filter((음표) => note.id !== id)
    );

    // 수정 중인 메모를 삭제한 경우 입력창 초기화
    if (editId === id) {

      //삭제한 메모의 내용이 입력창에 남지 않도록 초기화합니다.
      resetForm();
    }

    //메모 삭제 완료 메시지를 저장합니다.
    setMessage("메모가 삭제되었습니다.");
  };

  //App 컴포넌트가 화면에 보여줄 JSX를 반환합니다.
  return (

    //애플리케이션 전체를 감싸는 최상위 영역입니다.
    <div className="container">

      //메인 제목
      <h1 className="mainTitle">메모 앱</h1>

      //삼항 연산자를 사용하여 로그인 상태에 따라 서로 다른 화면을 보여줍니다.
      //isLoggedIn이 false이면 로그인 화면을 보여주고, true이면 메모 관리 화면을 보여줍니다.
      {!isLoggedIn ? (

        //로그인하지 않을 상태에서 보여주는 카드 영역입니다.
        <div className="card">

          //로그인 입력 폼입니다.
          //사용자가 로그인 버튼을 누르면 handleLogin함수가 실행됩니다.
          <form onSubmit={handleLogin}>

            <input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              placeholder="이메일"
            />

            <input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              placeholder="비밀번호"
            />

            <button type="submit">
              로그인
            </button>

          </form>

          <div className="loginInfo">

            <p>테스트 계정</p>

            <p>
              test@test.com / 1234
            </p>

          </div>

        </div>
      ) : (
        //로그인한 상태에서 보여주는 메모 관리 영역입니다.
        <div className="grid">

          //사용자 정보와 메모입력폼이 들어가는 왼쪽 영역입니다.
          <div className="left">

            <div className="userInfo">

              //사용자 정보가 존재 할 때 이름을 출력합니다.
              //user가 null이어도 오류가 발생하지 않게 합니다.
              <p>{user?.name}</p>

              //로그인한 사용자의 이메일을 출력합니다.
              <p>{user?.email}</p>


              <button
                type="button"
                onClick={handleLogout}
              >
                로그아웃
              </button>

            </div>


            //메모를 새로 추가하거나 기존 메모를 수정하는 폼입니다. 
            //폼을 제출하면 handleSubmit 함수가 실행됩니다.
            <form onSubmit={handleSubmit}>

              //폼제목
              <h2>

                //editId가 있으면 메모 수정 문구를 표시하고,
                //editId가 null이면 새 메모 작성 문구를 표시합니다.
                {editId !== null
                  ? "메모 수정"
                  : "새 메모 작성"}
              </h2>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="제목"
              />

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="내용"
              />

              <button type="submit">
                //수정중이면 "메모수정"을 표시하고, 새메모 작성중이면 "메모 추가"를 표시합니다.
                {editId !== null
                  ? "메모 수정"
                  : "메모 추가"}

              </button>

              //editId가 null이 아닐 때만 수정 취소 버튼을 표시합니다.
              //따라서 새 메모 작성 상태에서는 이 버튼이 보이지 않습니다.
              {editId !== null && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                >
                  수정 취소
                </button>
              )}

            </form>

          </div>

          //검색창과 메모 목록이 들어가는 오른쪽 영역입니다.
          <div className="right">

            //작성된 메모를 검색하는 입력창입니다.
            <input
              value={search}

              //입력값이 변경될 때 search 상태를 변경합니다.
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="메모 검색"
            />

            <p>
              전체 메모 {filteredNotes.length}개
            </p>

            //검색 결과가 비어 있는지 확인합니다.
            //결과가 없으면 빈 목록메시지를 보여주고,
            //결과가 있으면 메모 카드 목록을 보여줍니다.
            {filteredNotes.length === 0 ? (

              //표시할 메모가 없을 때 보여주는 안내 영역입니다.
              <div className="empty">
                등록된 메모가 없습니다.
              </div>
            ) : (

              //filteredNotes 배열을 순회하면서 메모 카드를 만듭니다.
              filteredNotes.map((음표) => (

                //각각의 메모를 표시하는 카드입니다.
                <div

                  //React가 각 메모를 구분 할 수 있도록 고유한 id를 지정합니다.
                  key={note.id}
                  className="note"
                >


                  //메모 제목
                  <h3>
                    {note.title}
                  </h3>

                  //메모 내용
                  <p>
                    {note.content}
                  </p>

                //마지막으로 수정된 시간
                  <small>
                    수정: {note.updatedAt}
                  </small>

                  <div className="buttonGroup">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(음표)
                      }
                    >
                      수정
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(note.id)
                      }
                    >
                      삭제
                    </button>

                  </div>

                </div>
              ))
            )}

          </div>

        </div>
      )}

      //message에 문자열이 들어 있을 때만 안내 메시지를 표시합니다.
      //message가 빈 문자열이면 이 p요소는 화면에 나타나지 않습니다.
      {message && (
        <p className="message">
          {message}
        </p>
      )}

    </div>
  );
}