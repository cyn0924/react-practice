//React 라이브러리와 상태 관리를 위한 useState Hook을 불러옵니다.
//usestate는 입력값, 로그인 상태, 사용자 정보처럼 변경되는 데이터를 관리합니다.
import React, { useState } from "react";

//현재 App 컴포넌트에 적용할 CSS파일을 불러옵니다.
//JSX에 작성한 className과 App.css의 클래스 선택자가 연결됩니다.
import "./App.css";

//로그인과 로그아웃 기능을 담당하는 App 함수형 컴포넌트를 만듭니다.
function App() {

  //이메일과 비밀번호 입력값을 하나의 객체로 관리합니다.
  //form은 현재 입력값을 가지고 있는 객체입니다.
  //setForm은 from 상태를 변경하는 함수입니다.
  const [form, setForm] = useState({
    
    //이메일 입력창의 초기값입니다.
    //처음에는 입력된 이메일이 없으므로 빈 문자열로 설정합니다.
    email: "",

    //비밀번호 입력창의 초기값입니다.
    //처음에는 비밀번호가 없으므로 빈 문자열로 설정합니다.
    password: "",
  });

  //현재 사용자가 로그인했는지 관리하는 상태입니다
  //false는 로그아웃상태를 의미합니다.
  //true는 로그인 상태를 의미합니다.
  //초기값은 로그아웃 상태입니다.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //로그인한 사용자의 정보를 관리하는 상태입니다.
  //로그인하기 전에는 사용자 정보가 없으므로 null로 시작합니다.
  const [user, setUser] = useState(null);

  //로그인 성공, 로그인 실패, 로그아웃 등의 안내문구를 관리합니다.
  //처음에는 표시할 메시지가 없으므로 빈 문자열로 시작합니다.
  const [message, setMessage] = useState("");

  //로그인 확인할 때 사용할 테스트용 사용자 정보입니다.
  //실제 서비스에서는 서버와 데이터베이스에서 사용자 정보를 확인합니다.
  const demoUser = {

    //테스트용 이메일입니다.
    email: "admin@test.com",
    
    //테스트용 비밀번호입니다.
    password: "1234",

    //로그인 성공 후 화면에 표시할 사용자 이름입니다.
    name: "김지애",
  };

  //이메일 또는 비밀번호 입력값이 변경될 때 실행되는 함수입니다.
  //e 에서는 input에서 발생한 이벤트 정보가 전달됩니다.
  const handleChange = (e) => {

    //e.target은 현재 입력 이벤트가 발생한 input요소입니다.
    //name에는 input 의 name 속성값이 들어가게 됩니다.
    //value에는 사용자가 입력한 현재 값이 들어갑니다.
    const { name, value } = e.target;

    //기존 form 객체를 복사한 다음 변경된 입력값만 바꿉니다.
    setForm({

      //스프레드 문법으로 기존 email과 password 값을 복사합니다.
      ...form,

      //[name]은 변수의 값을 객체 속성명으로 사용하는 문법입니다.
      //name이 "email"이면 form.email을 변경합니다.
      //name이 "password"이면 form.password를 변경합니다.
      [name]: value,
    });
  };

  //이메일과 패스워드를 초기화 할 수 있는 함수입니다.
  const resetForm = () => {

    //form 상태의 email과 password를 모두 빈 문자열로 변경합니다.
    setForm({

      //이메일 입력창을 비웁니다.
      email: "",
      //비밀번호 입력창을 비웁니다.
      password: "",
    });
  };

  //사용자가 로그인 폼을 제출했을 때 실행되는 함수입니다.
  //e에는 form 제출 이벤트에 대한 정보가 전달됩니다.
  const handleLogin = (e) => {

    //form을 제출하면 브라우저가 새로고침되는 기본 동작을 막습니다.
    //새로고침되면 React의 상태가 초기화되므로 이를 막기 위해 합니다.
    e.preventDefault();

    //이메일 입력값의 앞뒤 공백을 제거합니다.
    //공백을 제거한 결과를 email 변수에 저장합니다.
    const email = form.email.trim();

    //비밀번호 입력값의 앞뒤 공백을 제거합니다.
    //공백을 제거한 결과를 password 변수에 저장합니다.
    const password = form.password.trim();


    //이메일이나 비밀번호 중 하나라도 비어 있는지 확인합니다.
    //||는 여러 조건 중 하나라도 참인지 확인하는 or 연산자입니다.
    if (email === "" || password === "") {

      //입력값이 부족하면 안내 메시지를 상태에 저장합니다.
      setMessage("이메일과 비밀번호를 입력하세요.");

      //아래의 로그인 확인 코드를 실행하지 않고 함수를 종료합니다.
      return;
    }

    //사용자가 입력한 이메일과 비밀번호가 테스트 계정과 같은지 확인합니다.
    //&&는 두 조건이 모두 참인지 확인하는 AND 연산자 입니다.
    if (email === demoUser.email && password === demoUser.password) {

      //이메일과 비밀번호가 모두 일치하면 로그인 상태로 변경합니다.
      setIsLoggedIn(true);

      //로그인한 사용자의 이름과 이메일을 user 상태에 저장합니다.
      setUser({

        //테스트 계정의 사용자 이름을 저장한 후
        name: demoUser.name,

        //테스트 계정의 이메일을 저장합니다.
        email: demoUser.email,
      });

      //로그인에 성공했다는 메시지를 저장합니다.
      setMessage("로그인 성공");

      //로그인 성공 후 이메일과 비밀번호 입력창을 초기화합니다.
      resetForm();
    } else {

      //이메일 또는 비밀번호가 일치하지 않으면 로그아웃 상태로 설정합니다.
      setIsLoggedIn(false);

      //잘못된 사용자 정보가 남지 않도록  user 상태를 초기화합니다.
      setUser(null);

      //로그인에 실패했다는 메시지를 표시합니다.
      setMessage("로그인 실패");
    }
  };

  //사용자가 로그아웃 버튼을 클릭했을 때 실행되는 함수입니다.
  const handleLogout = () => {

    //로그인 상태를 false로 변경하여 로그아웃 화면으로 돌아갑니다.
    setIsLoggedIn(false);

    //저장되어 있던 사용자 정보를 초기화합니다.
    setUser(null);

    //로그아웃되었다는 메시지를 저장합니다.
    setMessage("로그아웃");
  };

  //App 컴포넌트가 브라우저 화면에 표시할 JSX구조를 반환합니다.
  return (

    //로그인 앱 전체를 감싸는 최상위 영역입니다.
    <div className="container">

      <h1 className="title">로그인</h1>

      {/* !isLoggedIn을 사용하여 로그인 상태가 아닌지 확인합니다. */}
      {/* false이면 true로 바꿔주고, true는 false로 바꿔줍니다. */}
      {/* 로그인이면 로그아웃을 로그아웃일때에는 로그인 상태로 바꿀수 있습니다. */}
      {!isLoggedIn ? (

        //로그아웃 상태에서 로그인 폼을 표시하는 카드입니다.
        <div className="card">

          {/*이메일과 비밀번호를 입력받는 form 요소입니다. */}
          {/* handleLogin함수를 연결했기 때문에 */}
          {/* 로그인 버튼을 클릭하거나 입력창에서 엔터키를 누르면  */}
          {/* handleLogin함수가 실행됩니다. */}
          <form onSubmit={handleLogin}>
            <input
              name="email"

              //input의 값을 form.email에 연결합니다.
              value={form.email}

              //입력값이 변경될 때 handleChange 함수를 실행합니다.
              onChange={handleChange}
              placeholder="이메일"
            />

            <input
              type="password"
              name="password"

              //input의 값을 form.password에 연결합니다.
              value={form.password}

              //입력값이 변경될 때 handleChange 함수를 실행합니다
              onChange={handleChange}
              placeholder="비밀번호"
            />

            {/* 로그인 폼을 제출하는 버튼입니다. */}
            {/* type="submit"으로 설정했기 때문에 버튼을 클릭하면 */}
            {/* form의 onSubmit에 연결된 handleLogin함수가 실행됩니다. */}
            <button type="submit">로그인</button>
          </form>

          {/* 실습에서 사용할 테스트 게정을 화면에 표시합니다. */}
          <div className="info">admin@test.com / 1234</div>
        </div>
      ) : (
        
        //로그인 상태에서 사용자 정보를 표시하는 카드입니다.
        <div className="card">

          {/* user가 존재할때 로그인한 사용자의 이름을 표시합니다. */}
          <p>{user.name}</p>
          {/* 로그인한 사용자의 이메일도 표시합니다. */}
          <p>{user.email}</p>
          {/* 사용자가 로그아웃할 수 있도록 로그아웃 버튼을 만들고 */}
          {/* 버튼을 누르면 handleLogout함수가 실행되어 로그아웃을 시켜줍니다. */}
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      )}

      {/* 로그인 성공, 로그인 실패 도는 로그아웃 메시지를 표시합니다. */}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;