//React에서 상태를 관리하기 위한 useState Hook을 불러옵니다.
//useState는 도시 이름, 날씨 데이터, 로딩 상태, 오류 메시지처럼
//사용자의 동작에 따라 변경되는 값을 저장할 때 사용합니다.
import { useState } from "react";

//App.css 파일 안의 클래스 이름과 JSX의 className이 연결이 됩니다.
import "./App.css";

//날씨 검색 화면 전체를 담당하는 App 컴포넌트를 선언합니다.
function App() {

  //OpenWeatherMap API 를 사용할 때 필요한 API 키입니다.
  //실제 프로젝트에서는 API키가 외부에 노출되지 않도록 환경변수 사용을 권장합니다.
  const API_KEY = "";

  //검색창에 입력한 도시 이름을 저장하는 상태입니다.
  //city는 현재 입력값이고 setCity는 입력값을 변경하는 함수입니다.
  const [city, setCity] = useState("");

  //API에서 받아온 날씨 데이터를 저장하는 상태입니다.
  //아직 날씨를 검색하지 않았으므로 초기값은 null입니다.
  const [weather, setWeather] = useState(null);

  //날씨 데이터를 불러오는 중인지 관리하는 상태입니다
  //true이면 검색 중이고 false이면 검색이 끝난 상태입니다.
  const [loading, setLoading] = useState(false);

  //API 요청 중 발생한 오류 메시지를 저장하는 상태입니다.
  //오류가 없을 때는 빈 문자열로 시작합니다.
  const [error, setError] = useState("");

  //입력한 도시의 날씨 정보를 API 에서 가져오는 비동기 함수입니다.
  //async는 시간이 걸리는 API 요청을 처리하는 함수 앞에 작성합니다.
  const getWeather = async () => {

    //city.trim()은 도시 이름의 앞뒤 공백을 제거합니다.
    //공백을 제거한 결과가 빈 문자열이면 아무 도시도 입력하지 않은 상태입니다.
    if (!city.trim()) {

      //도시 이름이 입력되어 있지 않으므로 메시지로 기본 메시지를 화면에 표시합니다.
      setError("도시 이름을 입력해주세요.");

      //도시 이름이 없으므로 API 요청ㅇ을 실행하지 않고 함수를 종료합니다.
      return;
    }

    //API 요청 중 오류가 발생할 수 있으므로 TRY 문을 사용합니다.
    try {

      //날씨 검색을 시작했으므로 loading 상태를 true로 변경합니다.
      setLoading(true);

      //새로운 검색을 시작하기 위해 이전 오류 메시지를 지웁니다.
      setError("");

      //새로운 검색 결과가 표시되기 전까지 이전 날씨 데이터를 지웁니다.
      setWeather(null);

      //OpenWeatherMap 날씨 API 요청 주소를 만듭니다.
      //encodeURLComponent는 도시 이름에 한글이나 공백이 포함되어도
      //url에서 안전하게 사용할 수 있도록 변환합니다.
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city.trim()
        //도시 이름의 앞뒤 공백을 제거화여 api에 전달합니다.
      )}&appid=${API_KEY}&units=metric&lang=kr`;

      //fetch 함수로 완성된 url에 서버 요청을 보냅니다.
      //await는 서버에서 응답이 올 때까지 기다립니다.
      const response = await fetch(url);

      //서버에서 받은 응답을 JSON 형태의 JavaScript 객체로 변환합니다.
      //변환된 날씨 데이터는 data 변수에 저장됩니다.
      const data = await response.json();

      //response.ok는 서버 요청이 성공했는지 알려주는 값입니다.
      //요청이 성공하면 true이고, 도시를 찾지 못하거나 api 키가 잘못되면 false 입니다.
      if (!response.ok) {

        //data.message에 서버가 보내준 오류 메시지가 있으면 사용합니다.
        //메시지가 없으면 기본 오류 메시지를 사용합니다.
        throw new Error(
          data.message || "날씨 정보를 불러오지 못했습니다."
        );
      }

      //api에서 받은 날씨 데이터를  weather 상태에 저장합니다.
      //상태가 변경되면 화면에 날씨 결과가 표시됩니다.
      setWeather(data);
    } catch (error) {

      //api 요청 중 오류가 발생하면 catch 영역이 실행됩니다.
      //eroor.message에는 발생한 오류의 설명이 들어 있습니다.
      setError(error.message);
    } finally {

      //finally 는 요청이 성공했는지 실패했는지와 상관없이 항상 실행됩니다.
      //날씨 검색이 끝났으므로 loading 상태를 false로 변경합니다.
      setLoading(false);
    }
  };

  //검색 form을 제출했을 때 실행되는 함수입니다.
  const handleSubmit = (event) => {

    //form 제출시 브라우저가 페이지를 새로고침하는 기본 동작을 막습니다.
    event.preventDefault();

    //도시 날씨를 조회하는 함수를 실행합니다.
    getWeather();
  };

  //App 컴포넌트가 화면에 표시할 JSX를 반환합니다.
  return (

    //날씨 앱 전체 화면을 감싸는 최상위 영역입니다.
    <div className="app">

    {/* //날씨 검색 화면을 감싸는 카드영역입니다. */}
      <div className="weatherCard">

        {/* //제목 */}
        <h1>오늘의 날씨</h1>

        {/* //설명 */}
        <p className="description">
          도시 이름을 입력하면 현재 날씨를 확인할 수 있습니다.
        </p>

        {/* //도시 검색창과 검색 버튼을 감싸는 form입니다. */}
        {/* //form을 제출하면 handleSubmit함수가 실행됩니다. */}
        <form className="searchForm" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="예: Seoul"
            
            //input에 표시되는 값을 city 상태와 연결합니다.
            value={city}

            //사용자가 입력할 때마다 입력값을 city 상태에 저장합니다.
            onChange={(event) => setCity(event.target.value)}
          />

          {/* //form을 제출하는 버튼으로 설정합니다.  */}
          {/* //요청이 끝나면 다시 클릭할 수 있습니다. */}
          <button type="submit" disabled={loading}>

            {/* //loading이 true이면 검색 중 문구를 표시합니다. */}
            {/* //loading이 false이면 검색 이라는 문구를 표시합니다. */}
            {loading ? "검색 중..." : "검색"}
          </button>
        </form>

        {/* //loading이 true일 때만 로딩 안내 문구를 표시합니다. */}
        {loading && (
          <p className="message">
            날씨 정보를 불러오는 중입니다...
          </p>
        )}

        {/* //error에 오류 메시지가 들어 있을 때만 오류 문구를 표시합니다. */}
        {error && (
          <p className="errorMessage">

            {/* //error 상태에 저장된 오류 내용을 화면에 출력합니다. */}
            {error}
          </p>
        )}

        {/* //weather 데이터가 있고 현재 로딩 중이 아닐 때 날씨 결과를 표시합니다. */}
        {weather && !loading && (

          //날씨 결과 전체를 감싸는 영역입니다.
          <div className="weatherResult">

            {/* //도시 이름과 국가 코드를 표시합니다. */}
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>

          {/* //현재 날씨 상태를 나타내는 아이콘 이미지 입니다. */}
            <img
              className="weatherIcon"

              //OpenWeatherMap에서 제공하는 날씨 아이콘 주소입니다.
              //weather.weather[0].icon 값을 사용하여 날씨에 맞는 아이콘을 표시합니다.
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}

              //아이콘이 표시되지 않을 때 날씨 설명을 대체 텍스트로 사용합니다.
              alt={weather.weather[0].description}
            />

          {/* //현재 기온을 섭씨 단위로 표시합니다. */}
            <div className="temperature">

              {/* //Math.round는 소수점이 있는 온도를 정수로 반올림합니다. */}
              {Math.round(weather.main.temp)}℃
            </div>

            {/* //현재 날씨 상태를 글자로 표시합니다. */}
            <p className="weatherDescription">
              {weather.weather[0].description}
            </p>

          {/* //체감온도, 습도, 풍속 등의 상세 정보를 감싸는 영역입니다. */}
            <div className="weatherInfo">

              {/* //체감온도 */}
              <div className="infoBox">
                <span>체감 온도</span>
                <strong>

                  {/* //체감 온도를 반올림하여 섭씨로 표시합니다. */}
                  {Math.round(weather.main.feels_like)}℃
                </strong>
              </div>

            {/* //습도 */}
              <div className="infoBox">
                <span>습도</span>

                {/* //습도 값을 % 단위로 표시합니다. */}
                <strong>
                  {weather.main.humidity}%
                </strong>
              </div>

          {/* //풍속 */}
              <div className="infoBox">
                <span>풍속</span>
                <strong>

                  {/* //초속 미터 단위 */}
                  {weather.wind.speed} m/s
                </strong>
              </div>

          {/* //최저 온도 */}
              <div className="infoBox">
                <span>최저 온도</span>
                <strong>

                  {/* //최저 온도를 반올림하여 섭씨로 표시합니다. */}
                  {Math.round(weather.main.temp_min)}℃
                </strong>
              </div>

              <div className="infoBox">
                <span>최고 온도</span>
                <strong>
                  {Math.round(weather.main.temp_max)}℃
                </strong>
              </div>

              <div className="infoBox">
                <span>기압</span>
                <strong>
                  {/* //기압을 hPa 단위로 표시합니다. */}
                  {weather.main.pressure} hPa
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;