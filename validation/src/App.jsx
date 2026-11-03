//React라이브러리와 상태 관리를 위한 useState Hook을 불러옵니다.
//useState는 입력값, 에러 메시지, 성공 메시지 처럼 변하는 데이터를 저장할 때 사용합니다.
import React, { useState } from "react";

//현재 컴포넌트에 적용할 CSS 파일을 불러옵니다.
//className으로 연결된 App.css 파일에 작성되어 있어야 화면에 반영됩니다.
import "./App.css";

//회원가입 기능 전체를 담당하는 App컴포넌트를 선언합니다.
function App() {

  //회원가입 입력 폼의 값을 객체 형태로 저장하는 상태입니다.
  //name은 이름, email은 이메일, password는 비밀번호, confirmPassword는 비밀번호 확인입니다.
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //각 입력 항목별 에러 메시지를 저장하는 상태입니다.
  //유효성 검사 결과에 따라 각 항목에 맞는 에러 문구를 넣습니다.
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //회원가입 성공시 보여줄 안내문구를 저장하는 상태입니다.
  //처음에는 아무 메시지도 없으므로 빈 문자열로 시작합니다.
  const [successMessage, setSuccessMessage] = useState("");


  //사용자가 input에 값을 입력할 때마다 실행되는 함수입니다.
  //하나의 함수로 이름, 이메일, 비밀번호, 비밀번호 확인 입력창을 모두 처리합니다.
  const handleChange = (e) => {

    //이벤트가 발생한 input 요소의 name속성과 value 값을 꺼냅니다.
    const { name, value } = e.target;

    //기존 form 객체를 스프레드 문법으로 복사한 뒤
    //현재 변경된 input의 name에 해당하는 값만 새 value로 바꿉니다.
    setForm((prevForm) => ({
      //기존 이름, 이메일, 비밀번호 값을 새로운 객체에 복사합니다.
      ...prevForm,
      //[name]은 변수의 값을 객체의 속성명으로 사용하는 문법입니다.
      //name이 "email"이면 email 값만 변경합니다.
      //name이 "password"이면 password 값만 변경합니다.
      [name]: value,
    }));

    //사용자가 다시 입력하면 해당 입력창의 기존 오류 메시지를 지웁니다.
    setErrors((prevErrors) => ({

      //다른 입력 항목의 오류 메시지는 그대로 유지합니다.
      ...prevErrors,

      //현재 입력하고 있는 항목의 오류 메시지만 빈 문자열로 변경합니다.
      [name]: "",
    }));

    //사용자가 입력값을 변경하면 이전 회원가입 성공 메시지를 지웁니다.
    setSuccessMessage("");
  };

  //회원가입 폼의 모든 입력값이 올바른지 검사하는 함수입니다.
  const validate = () => {

    //유효성 검사를 실행할 때 사용할 새로운 오류 메시지 객체입니다.
    //검사 전에는 모든 오류 메시지를 빈 문자열로 설정합니다.
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    //전체 입력값이 올바른지를 저장하는 변수입니다.
    //처음에는 문제가 없다고 가정하고 true로 시작합니다.
    let isValid = true;

    //이름 입력값의 앞뒤 공백을 제거한 결과가 빈 문자열인지 확인합니다.
    if (form.name.trim() === "") {

      //이름이 비어있다면 이름 오류 메시지를 저장합니다.
      newErrors.name = "이름을 입력하세요.";

      //입력값이 올바르지 않을때 false로 변경합니다.
      isValid = false;
    }

    //이름 입력값의 앞뒤 공백을 제거한 결과가 빈 문자열인지 확인합니다.
    if (form.email.trim() === "") {

      //이름이 비어있다면 이름 오류 메시지를 저장합니다.
      newErrors.email = "이메일을 입력하세요.";

      //입력값이 올바르지 않으므로 false를 저장합니다.
      isValid = false;

      //이메일이 입력되어 있다면 이메일 형식이 올바른지 확인합니다.
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {

      //정규표현식에 맞지 않으면 이메일 형식 오류 메시지를 저장합니다.
      newErrors.email = "이메일 형식이 올바르지 않습니다.";

      //이메일 형식이 잘못되었으므로 false로 변경합니다.
      isValid = false;
    }

    //비밀번호 입력값의 앞뒤 공백을 제거한 결과가 빈 문자열인지 확인합니다.
    if (form.password.trim() === "") {

      //비밀번호가 비어 있다면 오류 메시지를 저장합니다.
      newErrors.password = "비밀번호를 입력하세요.";

      //입력값이 올바르지 않으므로 false로 변경합니다.
      isValid = false;

      //비밀번호가 입력되어 있지만 길이가 4자보다 짧은지 확인합니다.
    } else if (form.password.length < 4) {

      //비밀번호 길이가 짧다면 오류 메시지를 저장합니다.
      newErrors.password = "비밀번호를 4자 이상 입력하세요.";

      //입력값이 올바르지 않으므로 false로 변경합니다.
      isValid = false;
    }

    //비밀번호 확인 입력값이 비어 있는지 확인합니다.
    if (form.confirmPassword.trim() === "") {

      //비밀번호 확인이 비어 있다면 오류 메시지를 저장합니다.
      newErrors.confirmPassword = "비밀번호 확인이 필요합니다.";

      //입력값이 올바르지 않으므로 false로 변경합니다.
      isValid = false;
     
      //비미리번호와 비밀번호 확인 값이 서로 같은지 확인합니다.
    } else if (form.password !== form.confirmPassword) {

      //두 비밀번호가 다르면 오류 메시지를 저장합니다.
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";

      //입력값이 올바르지 않으므로 false로 변경합니다.
      isValid = false;
    }

    //유효성 검사에서 만든 오류 메시지들을 errors 상태에 저장합니다
    //상태가 변경되면 각 입력창 아래에 오류 메시지가 표시됩니다.
    setErrors(newErrors);

    //모든 입력값이 올바른지 나타내는 true 또는 false를 반환합니다.
    return isValid;
  };

  //회원가입 입력 폼과 오류 메시지를 초기화하는 함수입니다.
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    //모든 오류 메시지를 빈 문자열로 초기화합니다.
    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  //회원가입 폼을 제출할 때 실행되는 함수입니다.
  const handleSubmit = (e) => {

    //form을 제출하면 브라우저가 새로고침되는 기본 동작을 막습니다.
    //새로고침되면 React 상태가 초기화되므로 e.preventDefault()가 필요합니다.
    e.preventDefault();

    //validate()함수를 실행하여 모든 입력값을 검사합니다.
    //validate() 의 반환값이 false이면 회원가입 처리를 중단합니다.
    if (!validate()) {

      //유효성 검사에 실패하면 기존 성공 메시지를 지웁니다.
      setSuccessMessage("");

      //아래 회원가입 성공 코드를 실행하지 않고 함수를 종료합니다.
      return;
    }

    //모든 입력값이 올바르면 회원가입 성공 메시지를 저장합니다.
    setSuccessMessage("회원가입이 완료되었습니다.");

    //회원가입이 완료되면 모든 입력창과 오류 메시지를 초기화합니다.
    resetForm();
  };

  //App 컴포넌트가 브라우저에 표시할 JSX구조를 표시합니다.
  return (

    //회원가입 페이지 전체를 감싸는 최상위 영역입니다.
    <div className="container">
      <h1 className="title">회원가입</h1>

      //회원가입 버튼을 누르면 handleSubmit 함수를 실행합니다.
      //noValidate 브라우저의 기본 유효성 검사를 사용하지 않고 React에서 작성한 validate 함수로 직접 검사합니다.
      <form onSubmit={handleSubmit} className="card" noValidate>
        <input
          type="text"
          name="name"

          //input의 값을 form.name 상태와 연결합니다.
          value={form.name}

          //입력값을 변경할 때 handlechange함수를 실행합니다.
          onChange={handleChange}
          placeholder="이름"
        />

        //errors.name에 오류 메시지가 있을 때만 p요소를 표시합니다.
        //오류 메시지가 빈 문자열이면 화면에 아무것도 표시하지 않습니다.
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="이메일"
        />

        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="비밀번호"
        />

        {errors.password && (
          <p className="error">{errors.password}</p>
        )}

        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="비밀번호 확인"
        />

        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}

        <button type="submit">회원가입</button>
      </form>

      //successMessage에 메시지가 있을 때만 성공 문구를 표시합니다.
      //빈문자열이면 false판단을 해서 p요소를 표시하지 않습니다.
      {successMessage && (
        <p className="success">{successMessage}</p>
      )}
    </div>
  );
}

export default App;