//React 라이브러리와 상태관리를 위한 useState Hook을 불러옵니다.
//useState는 입력값, 저장된 비밀번호, 안내 메시지, 에러 메시지처럼 바뀌는 데이터를 저장할 때 사용합니다.
import React, { useState } from "react";

//ClassName으로 연결한 스타일은 App.css 파일에 작성되어 있어야 화면에 적용됩니다.
import "./App.css";

//비밀번호 변경 기능 전체를 담당하는 App 컴포넌트를 선언합니다.
function App() {

  //비밀번호 변경 폼의 입력값을 객체 형태로 저장하는 상태입니다.
  //currentPassword는 현재 비밀번호 입력값,
  //newPassword는 새 비밀번호 입력값,
  //confirmPassword는 새 비밀번호 확인 입력값입니다.
  const [passwordData, setPasswordData] = useState({

    //현재 비밀번호 입력창의 초기값은 빈 문자열입니다.
    currentPassword: "",

    //새 비밀번호 입력창의 초기값은 빈 문자열입니다.
    newPassword: "",

    //비밀번호 확인 입력창의 초기값은 빈 문자열입니다.
    confirmPassword: "",
  });

  //실제 저장되어 있는 현재 비밀번호를 상태로 관리합니다.
  //예제에서는 서버 대신 상태값으로만 비밀번호를 저장하고 변경합니다.
  const [savedPassword, setSavedPassword] = useState("1234");

  //화면에 보여줄 성공 안내 메시지를 저장하는 상태입니다.
  //예를 들어 "변경 완료" 같은 문구를 저장합니다.
  const [message, setMessage] = useState("");

  //각 입력 항목별 에러메시지를 저장하는 상태입니다.
  //현재 비밀번호, 새 비밀번호, 비밀번호 확인 각각의 오류 문구를 따로 관리합니다.
  const [errors, setErrors] = useState({

    //현재 비밀번호 관련 에러 메시지 초기값입니다.
    currentPassword: "",

    //새 비밀번호 관련 에러 메시지 초기값입니다.
    newPassword: "",

    //비밀번호 확인 관련 에러 메시지 초기값입니다.
    confirmPassword: "",
  });

  //입력창 값이 바뀔 때 실행되는 함수입니다.
  // 하나의 함수로 세 개의 input 값을 모두 처리합니다.
  const handleChange = (e) => {

    //이벤트가 발생한 input 요소의 name 속성과 value 속성 값을 꺼냅니다.
    const { name, value } = e.target;


    setPasswordData((prevData) => ({

      //기존 passwordData객체를 복사한뒤
      ...prevData, 

      //현재 변경된 input 의 name에 해당하는 값만 새 value로 바꿉니다.
      [name]: value,
    }));

    
    setErrors((prevErrors) => ({

      //에러메시지도 복사한뒤
      ...prevErrors,

      //에러메시지를 초기화를 해줍니다.
      [name]: "",
    }));

    //메시지 초기화
    setMessage("");
  };

  const resetForm = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  //입력값 유효성을 검사하는 함수입니다.
  //모든 항목이 올바르게 입력 되었는지 확인한 뒤 true 또는 false로 반환합니다.
  const validate = () => {

    //새 에러 객체를 만듭니다.
    //검사할 때마다 이전 에러를 지우고 새 결과를 넣기 위해 사용합니다.
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    //전체 유효성 검사 통과 여부를 저장하는 변수입니다.
    //하나라도 조건에 맞지 않으면 false로 바뀝니다.
    let isValid = true;

    //새 비밀번호 입력값이 비어 있는지 검사합니다.
    if (passwordData.currentPassword.trim() === "") {

      //새 비밀번호가 비어 있으면 에러 메시지를 저장합니다.
      newErrors.currentPassword = "현재 비밀번호를 입력하세요.";

      //유효성 검사 실패로 표시합니다.
      isValid = false;

      //저장된 비밀번호와 현재 비밀번호가 일치하지 않는지 보고
    } else if (passwordData.currentPassword !== savedPassword) {

      //일치하지 않는다면 아래 메시지를 화면에 출력합니다.
      newErrors.currentPassword = "현재 비밀번호가 일치하지 않습니다.";

      //유효성 검사 실패로 false로 변경합니다.
      isValid = false;
    }


    //새 비밀번호 입력값이 비어 있는지 검사합니다.
    if (passwordData.newPassword.trim() === "") {

      // 비어있으면 아래 메시지를 표시합니다.
      newErrors.newPassword = "새 비밀번호를 입력하세요.";

      //비어 있으므로 유효성 검사 실패로 false로 변경합니다.
      isValid = false;

      //비밀번호가 4글자 이상인지 비교하고 만약 4글자가 안된다면
    } else if (passwordData.newPassword.length < 4) {

      //아래 메시지를 화면에 표시합니다.
      newErrors.newPassword = "새 비밀번호를 4자 이상 입력하세요.";

      //비밀번호가 4글자가 안되므로 실패하여 false로 변경합니다.
      isValid = false;

      //4글자 이상이라면 새로운 비밀번호가 저장된 비밀번호와 같은지 비교하고
    } else if (passwordData.newPassword === savedPassword) {

      //새로운 메시지와 기존 비밀번호가 같다는 표시로 아래 메시지를 화면에 표시합니다.
      newErrors.newPassword = "기존 비밀번호와 동일합니다.";

      //기존 비밀번호와 새로운 비밀번호가 같아 실패이므로 false로 저장합니다.
      isValid = false;
    }


    //비밀번호 확인 입력값의 앞뒤 공백을 제거한뒤 비어있는 검사합니다. 
    if (passwordData.confirmPassword.trim() === "") {

      //비밀번호 확인을 입력하지 않았을 때 표시할 에러 메시지 입니다.
      newErrors.confirmPassword = "비밀번호 확인을 입력하세요.";

      //유효성 검사 실패 상태로 변경합니다.
      isValid = false;

      //빈문자열과 같지 않다는 것은 입력했다는 것이고 새 비밀번호와 같은지 검사합니다.
    } else if (

      //새 비밀번호와 비밀번호 확인 값이 서로 다르면 true가 됩니다.
      passwordData.newPassword !== passwordData.confirmPassword
    ) {

      //두 비밀번호가 일치하지 않을 때 표시할 에러 메시지입니다.
      newErrors.confirmPassword = "새 비밀번호와 일치하지 않습니다.";

      //유효성 검사 실패 상태로 변경합니다.
      isValid = false;
    }

    //위에서 검사한 모든 에러메시지를 errors 상태에 저장합니다.
    //errors 상태가 변경되면 입력창 아래에 에러 문구가 표시됩니다.
    setErrors(newErrors);

    //최종 유효성 검사 결과를 반환합니다.
    //모든 조건을 통과하면 true, 하나라도 실패하면 false가 반환됩니다.
    return isValid;
  };

  //사용자가 변경 버튼을 눌러 폼을 제출했을 때 실행되는 함수입니다.
  const handleSubmit = (e) => {

    //form을 제출하면 페이지가 새로고침되는 브라우저의 기본동작을 막습니다.
    e.preventDefault();

    //validate 함수를 실행하여 모든 입력값을 검사합니다.
    //validate 결과가 false라면 !false는 true가 되어 if문이 실행됩니다.
    if (!validate()) {

      //이전에 표시된 성공 메시지가 있다면 빈문자열로 지웁니다.
      setMessage("");

      //함수를 종료합니다.
      return;
    }

    //모든 유효성 검사를 통과하면
    //새 비밀번호를 현재 저장된 비밀번호로 변경합니다.
    setSavedPassword(passwordData.newPassword);

    //비밀번호 변경이 성공했다는 안내 메시지를 저장합니다.
    setMessage("비밀번호 변경 완료");

    //비밀번호 변경 후 모든 입력창과 에러 메시지를 비워서 초기화합니다.
    resetForm();
  };

  //App 컴포넌트가 화면에 보여줄 JSX를 반환합니다.
  return (

    //비밀번호 변경 화면 전체를 감싸는 가장 바깥쪽 영역입니다.
    <div className="container">

      {/* //비밀번호 변경 페이지의 제목입니다. */}
      <h1 className="title">비밀번호 변경</h1>

      {/* //비밀번호 입력 폼과 현재 비밀번호 정보를 감싸는 카드 영역입니다. */}
      <div className="card">

        {/* //폼을 제출하면 handleSubmit 함수가 실행됩니다. */}
        <form onSubmit={handleSubmit}>

          {/* //현재 비밀번호를 입력하는 input 요소입니다. */}
          <input

            //입력한 글자가 화면에 그대로 보이지 않도록 password 타입을 사용합니다.
            type="password"

            //handleChange 함수가 어떤 입력값인지 구분할 때 사용하는 이름입니다.
            name="currentPassword"

            //input에 표시되는 값을 passwordData.currentPassword 상태와 연결합니다.
            value={passwordData.currentPassword}

            //입력값이 바뀔 때마다 handleChange 함수를 실행합니다.
            onChange={handleChange}

            //입력값이 없을 때 입력창 안에 보여줄 안내 문구입니다.
            placeholder="현재 비밀번호"
          />

          {/* //현재 비밀번호 에러 메시지가 있을 대만 p요소를 화면에 표시합니다. */}
          {errors.currentPassword && (

            //erros.currentPassword에 저장된 에러 문구를 출력합니다.
            <p className="error">{errors.currentPassword}</p>
          )}

          {/* //새로 사용할 비밀번호를 입력하는 input 요소입니다. */}
          <input
            type="password"
            name="newPassword"

            //input 값을 passowordData.newPassword 상태와 연결합니다.
            value={passwordData.newPassword}

            //사용자가 입력할 때마다 handleChange 함수를 실행합니다.
            onChange={handleChange}
            placeholder="새 비밀번호"
          />

          {/* //새 비밀번호에 에러가 발생한다면 p요소 안에 있는 에러 메시지가 표시됩니다. */}
          {errors.newPassword && (
            <p className="error">{errors.newPassword}</p>
          )}

          
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호 확인"
          />

          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          {/* //이 버튼을 누르면 form이 제출되고 handleSubmit 함수가 실행됩니다. */}
          <button type="submit">변경</button>
        </form>

          {/* //현재 savedPassword 상태에 저장된 비밀번호를 보여주는 영역입니다. */}
          {/* //학습용 예제이므로 비밀번호를 화면에 표시하지만 실제 서비스에서는 표시한 안됩니다. */}
        <div className="infoBox">
          현재 비밀번호: {savedPassword}
        </div>
      </div>

      {/* //메시지 값이 빈 문자열이 아닐 때만 성공 메시지를 화면에 표시합니다. */}
      {message && <p className="success">{message}</p>}
    </div>
  );
}

export default App;