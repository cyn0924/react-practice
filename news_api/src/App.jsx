//react에서 필요한 Hook을 불러옵니다.
//useState는 뉴스 목록, 카테고리, 검색, 페이지 번호처럼
//화면에서 변경되는 데이터를 상태로 저장할 때 사용합니다.
//useEffet는 컴포넌트가 처음 실행되거나 특정 값이 변경되었을 때
//뉴스 API를 자동으로 호출하기 위해 사용합니다.
//useCallback은 fetchNews 함수를 기억하여 불필요하게 다시 만드는 것을 줄이고
//useEffet의 의존성으로 안전하게 사용할 수 있도록 도와줍니다.
import { useCallback, useEffect, useState } from "react";

//className과 App.css에 작성된 클래스이 이름이 서로 연결됩니다.
import "./App.css";

//GNew 사이트에서 발급받은 API키를 입력하는 상수입니다.
//따옴표 안에 발급받은 API 키를 입력해야 실제 뉴스 데이터를 요청할 수 있습니다.
const API_KEY = "";

//GNews API 요청에 공통으로 사용하는 기본 주소입니다.
//뒤에 /top-headlines 또는 /search를 붙여 필요한 API 주소를 완성합니다.
const BASE_URL = "https://gnews.io/api/v4";

//화면에 표시할 뉴스 카테고리 목록을 배열로 저장합니다.
//이 배열을 map으로 반복하여 카테고리 버튼을 만듭니다.
const CATEGORIES = [

  //전체 주요 뉴스
  "general",

  //세계뉴스
  "world",

  //국내뉴스
  "nation",

  //경제와 비즈니스
  "business",

  //기술 관련 뉴스
  "technology",

  //연예, 오락 관련 뉴스
  "entertainment",

  //스포츠
  "sports",

  //과학
  "science",

  //건강
  "health",
];


//뉴스 목록, 검색, 카테고리, 페이지 이동, 상세 보기 기능을
//전체적으로 관리하는 App 컴포넌트를 선언합니다.
function App() {

  //API에서 불러온 뉴스 기사 목록을 배열 형태로 저장합니다.
  //articels는 현재 뉴스 목록이고, setArticles는 목록을 변경하는 함수입니다.
  //처음에 가져온 기사가 없으므로 빈 배열로 시작합니다.
  const [articles, setArticles] = useState([]);

  //현재 선택된 뉴스 카테고리를 저장합니다.
  //처음 화면에서는 일반 뉴스를 보여주기 위해 "general"로 시작합니다.
  const [category, setCategory] = useState("general");

  //실제 API 검색에 사용할 검색어를 저장합니다.
  //검색 버튼을 눌렀을 때 inputValue의 내용이 search에 저장됩니다.
  const [search, setSearch] = useState("");

  //검색 입력창에서 사용자가 현재 입력하고 있는 값을 저장합니다.
  //입력 중인 값과 실제 검색에 사용하는 값을 분리하여 관리합니다.
  const [inputValue, setInputValue] = useState("");

  //현재 보고 있는 뉴스 페이지 번호를 저장합니다.
  //처음에는 첫 번째 페이지를 보여주므로 1로 시작합니다.
  const [page, setPage] = useState(1);

  //사용자가 뉴스 목록에서 선택한 기사 정보를 저장합니다.
  //아직 선택한 기사가 없으므로 null로 시작합니다.
  const [selectedArticle, setSelectedArticle] = useState(null);

  //뉴스 데이터를 불러오는 중인지 저장하는 상태입니다.
  //true이면 불러오는 중이고 false이면 요청이 끝난 상태입니다.
  const [loading, setLoading] = useState(false);

  //뉴스 요청 과정에서 발생한 오류 메시지를 저장합니다.
  //오류가 없을 때는 빈 문자열을 저장합니다.
  const [error, setError] = useState("");

  //리액트에서 asyns는 시간이 걸리는 작업을 기다리기 위해 함수 앞에 붙이는 키워드입니다.
  //보통 API 호출, 서버 데이터 가져오기, 로그인 처리 같은 작업에 많이 사용합니다.
  //GNews API에서 뉴스 데이터를 가져오는 비동기 함수입니다.
  //비동기 함수는 시간이 오래 걸리는 작업이 끝날 때까지 프로그램 전체를 멈추지 않고, 
  //다른 작업을 계속할 수 있게 하는 함수입니다.
  //서버에 데이터 요청
  //응답이 올 때까지 기다림
  //그 동안 다른 코드나 화면은 계속 동작
  //응답이 오면 결과 처리
  //useCallback으로 감싸 category, page, search가 변경될 때만
  //새로운 fetchNews 함수를 만들도록 설정합니다
  const fetchNews = useCallback(async () => {

    //API 주소 뒤에 추가할 요청 조건들을 URLSearchParams 객체로 만듭니다.
    //URLSearchParams를 사용하면 lang=ko&country=kr 같은 주소를 쉽게 만들 수 있습니다.
    const params = new URLSearchParams({

      //한국어
      lang: "ko",

      //국가 대한민국
      country: "kr",

      //한 번의 요청에서 가져올 뉴스 개수를 최대 10개로 설정
      max: "10",

      //페이지 번호는 숫자로 되어 있기 때문에 문자열로 바꾸기 위해 String 사용해서 변환합니다.
      page: String(page),

      //GNews에서 발급받은 API키를 요청 정보에 추가합니다.
      apikey: API_KEY,
    });

    //기본 API 주소를 주요 뉴스 조회 주소로 설정합니다.
    //검색어가 없을 때는 이 주소를 이용해 카테고리별 뉴스를 가져옵니다.
    let endpoint = `${BASE_URL}/top-headlines`;

    //search에서 앞뒤 공백을 제거한 결과가 비어 있지 않은지 검사합니다.
    //검색어가 있다면 카테고리 조회 대신 검색 API를 사용합니다.
    if (search.trim()) {

      //API 주소를 뉴스 검색 주소로 변경합니다.
      endpoint = `${BASE_URL}/search`;

      //q는 GNews API에서 검색어를 전달할 때 사용하는 매개변수입니다.
      //검색어(query)를 서버에 전달하기 위한 매개 변수 이름입니다.
      params.set("q", search.trim());
    } else {

      //검색어가 없다면 현재 선택된 카테고리를 요청 정보에 추가합니다.
      params.set("category", category);
    }

    //try를 사용하는 이유는 오류가 발생할 가능성이 있는 코드를 안전하게 실행하기 위해서입니다.
    //try를 쉽게 말하면 일단 이 코드를 실행해보고 오류가 발생하면 catch에서 처리하자라는 뜻입니다.
    //   try{
    //   정상적으로 실행할 코드    
    //   }catch(error){
    //   오류가 발생했을 때 실행할 코드
    //   }finally{
    //   성공하든 실패하든 마지막에 실행할 코드
  //      }
    try {

      //뉴스 요청을 시작했으므로 로딩 상태를 true로 변경합니다.
      setLoading(true);

      //새로운 요청을 시작하기 전에 그 이전에 있던 오류 메시지를 지웁니다.
      setError("");

      //뉴스 목록이 변경될 예정이므로 이전에 선택한 기사를 해제합니다.
      setSelectedArticle(null);

      //fetch의 기능은 서버에 데이터를 요청 하는 함수입니다.
      //await은 비동기 작업의 결과가 올 때까지 기다리는 역할입니다.
      //fetch가 서버에 요청을 보내고 바로 결과가 나오지 않기 때문에 await으로 응답을 기다립니다.
      //완성된 API 주소로 네트워크 요청을 보냅니다.
      //{params.toString()은 요청 조건들을 URL에서 사용할 문자열로 변환합니다.
      //await는 서버의 응답이 도착할 때가지 기다립니다.
      //서버에 요청을 보내고
      //서버의 응답이 올 때가지 기다린다음
      //그 응답 결과를 response에 저장합니다.
      const response = await fetch(
        `${endpoint}?${params.toString()}`
      );

      //response.ok는 API 요청이 정상적으로 성공했는지 알려주는 값입니다.
      //404, 500 등의 오류 응답이면 false가 됩니다.
      if (!response.ok) {

        //throw는 서버 응답이 정상이 아니라면 오류를 발생시키고 catch로 이동합니다.
        throw new Error("뉴스 데이터를 불러오지 못했습니다.");
      }

      //서버에서 받은 응답을 자바 스크립트에서 사용할 수 있는 데이터 형태로 변환하는 코드입니다.
      //reponse = 서버에서 받은 응답 전체
      //response.json()=응답 내용을 JSON 형식으로 읽기
      //await = 변환이 끝날때까지 기다리기
      //data = 변환된 결과를 저장하는 변수
      const data = await response.json();

      //정상적인 뉴스 API 응답이라면 articles는 뉴스 객체 배열이여야 합니다.
      //data.articles가 실제 배열인지 검사합니다.
      if (!Array.isArray(data.articles)) {

        //예상한 형태의 데이터가 아니면 오류를 발생시킵니다.
        throw new Error("올바른 뉴스 응답이 아닙니다.");
      }


      //API에서 받은 뉴스 배열을 articles 상태에 저장합니다.
      //상태가 변경되면 React가 화면을 다시 그려 뉴스 목록을 표시합니다.
      setArticles(data.articles);
    } catch (err) {

      //try 안에서 오류가 발생하면 catch 영역이 실행됩니다.
      //err에는 발생한 오류 정보가 전달됩니다.
      //뉴스를 불러오지 못했으므로 목록을 빈 배열로 초기화합니다.
      setArticles([]);

      //에러가 생겼을 때 화면에 어떤 오류 문장을 보여줄지 정하는 코드입니다.
      //err가 진짜 자바스크립트 오류 객체인지 확인합니다.
      //진짜 오류 객체라면 그 안에 들어 있는 실제 오류 내용을 가져옵니다.
      //진짜 오류 메시지가 있으면 그 메시지를 보여주고 없으면 기본 오류 메시지를 보여주는 코드입니다.      
      setError(
        err instanceof Error
          ? err.message
          : "요청 중 오류가 발생했습니다."
      );
      //finally는 성공 여부와 관계없이 항상 마지막에 실행됩니다.
      //뉴스 요청이 끝났으므로 로딩 상태를 false로 변경합니다.
    } finally {
      setLoading(false);
    }
  }, [category, page, search]);

  //컴포넌트가 처음 실행되거나 fetchNews 함수가 변경될 때 실행됩니다.
  useEffect(() => {

    //처음 화면이 열리면 뉴스 데이터를 자동으로 불러옵니다.
    fetchNews();
  }, [fetchNews]);

  //검색 폼을 제출했을 때 실행되는 함수입니다.
  const handleSearchSubmit = (event) => {

    //form 제출시 발생하는 브라우저 새로고침을 막습니다.
    event.preventDefault();

    //새로운 검색은 첫 번째 페이지부터 보여줍니다.
    setPage(1);

    //입력창의 앞뒤 공백을 제거하여 실제 검새기어로 저장합니다.
    //search 값이 변경되면 useEffect가 다시 실행되어 API를 호출합니다.
    setSearch(inputValue.trim());
  };

  //사용자가 카테고리 버튼을 클릭했을 때 실행되는 함수입니다.
  //nextCategory에는 클릭한 카테고리 이름이 저장됩니다.
  const handleCategoryChange = (nextCategory) => {

    //선택한 카테고리를 category 상태에 저장합니다.
    setCategory(nextCategory);

    //카테고리를 선택했으므로 기존 검색어를 지웁니다.
    setSearch("");

    //검색 입력창에 남아 있는 글자도 지웁니다.
    setInputValue("");

    //새로운 카테고리는 첫 페이지부터 보여줍니다.
    setPage(1);
  };

  //이전 페이지 버튼을 눌렀을 때 실행되는 함수입니다.
  const goPrevPage = () => {

    //함수형 상태 업데이트를 사용하여 현재 페이지를 전달받습니다.
    setPage((currentPage) =>

      //현재 페이지에서 1을 빼되 1보다 작아지지 않도록 합니다.
      //Math.max(1,값)은 최소값을 1로 유지합니다.
      Math.max(1, currentPage - 1)
    );
  };

  //다음 페이지 버튼을 눌렀을 때 실행되는 함수입니다.
  const goNextPage = () => {

    //현재 뉴스 목록에 기사가 있을 때만 다음 페이지로 이동합니다.
    if (articles.length > 0) {

      //현재 페이지 번호에 1을 더합니다.
      setPage((currentPage) => currentPage + 1);
    }
  };

  //App 컴포넌트가 화면에 표시할 JSX를 반환합니다.
  return (

    //뉴스 앱 전체를 감싸는 가장 바깥쪽 컨테이너입니다.
    <div className="container">

      {/* //제목 */}
      <h1 className="title">뉴스 API 앱</h1>

      {/* //검색창과 검색 버튼, 새로고침 버튼을 감싸는 form 입니다. */}
      <form

        //form이 제출 될때 handleSearchSubmit 가 실행됩니다.
        onSubmit={handleSearchSubmit}
        className="searchWrap"
      >

        <input
          type="text"
          placeholder="뉴스 검색어를 입력하세요"
          value={inputValue}

          //사용자가 입력할 때마다 inputValue 상태를 변경합니다.
          // onChange=입력창의 내용이 바뀔 때 실행됩니다.
          // event = 사용자가 입력한 정보를 가지고 있는 객체입니다.
          //event.target = 지금 입력하고 있는 <input> 태그를 뜻합니다.
          //event.target.value=입력창 안에 현재 들어 있는 글자를 뜻합니다.
          //setInputValue=입력한 글자를 inputValue 상태에 저장합니다.
          onChange={(event) =>
            setInputValue(event.target.value)
          }
          className="searchInput"
        />

        <button
          type="submit"
          className="searchButton"
        >
          검색
        </button>

        <button
          type="button"
          //클릭하면 fetchNews 함수가 실행됩니다.
          onClick={fetchNews}
          className="refreshButton"
        >
          새로고침
        </button>
      </form>

      {/* //버튼들을 감싸는 영역 */}
      <div className="categoryWrap">

        {/* //CATEGORIES.map : map()은 배열에 들어 있는 값을 하나씩 꺼내서 반복 작업할 때 사용합니다. */}
        {CATEGORIES.map((item) => (
          <button
            type="button"
            
            //React가 각각의 버튼을 구분하도록 item을 key로 사용합니다.
            key={item}

            //클릭하면 handleCategoryChange함수가 실행되고
            //선택한 카테고리를 함수에 전달합니다.
            onClick={() =>
              handleCategoryChange(item)
            }

            //모든 버튼에는 categoryButton 클래스를 적용합니다.
            //현재 카테고리이고 검색 중이 아니면 active 클래스도 추가합니다.
            className={`categoryButton ${
              category === item && !search
                ? "active"
                : ""
            }`}
          >

            {/* //현재 카테고리 이름을 버튼 안에 표시합니다. */}
            {item}
          </button>
        ))}
      </div>

        {/* //현재 검색 조건과 페이지 번호를 보여주는 정보영역입니다. */}
      <div className="infoBar">

        {/* //검색 중이면 검색어를, 검색하지 않으면 카테고리를 표시합니다. */}
        <span className="infoText">
          {search
            ? `검색 - "${search}"`
            : `카테고리 - ${category}`}
        </span>

        {/* //현재 페이지 번호를 표시합니다. */}
        <span className="infoText">
          페이지: {page}
        </span>
      </div>

      {/* //loading이 true일 때만 로딩 안내 화면을 표시합니다. */}
      {loading && (
        <div className="statusBox">
          뉴스 데이터를 불러오는 중입니다...
        </div>
      )}

      {/* //error가 있고 loading이 false일 때 오류 메시지를 표시합니다. */}
      {error && !loading && (
        <div className="errorBox">

          {/* //error상태에 저장된 오류 문구를 출력합니다. */}
          {error}
        </div>
      )}

      {/* //로딩 중이 아니고 오류도 없으며 기사 배열이 비어 있을 때 표시합니다. */}
      {!loading &&
        !error &&
        articles.length === 0 && (
          <div className="statusBox">
            표시할 뉴스가 없습니다.
          </div>
        )}

      {/* //뉴스목록 패널과 뉴스 상세 패널을 나란히 배치하는 영역입니다. */}
      <div className="layout">
        <section className="panel">
          <h2 className="sectionTitle">
            뉴스 목록
          </h2>

          {/* //뉴스 카드들이 반복해서 표시되는 영역입니다. */}
          <div className="cardList">

            {/* //articles 배열의 각 기사를 뉴스 카드로 만들어 표시합니다. */}
            {articles.map((article, index) => (
              <article

                //기사 URL과 배열 순서를 조합하여 고유한 key를 만듭니다.
                key={`${article.url}-${index}`}
                className="newsCard"

                //카드를 클릭하면 선택한 기사를 setSelectedArticle에 저장합니다.
                onClick={() =>
                  setSelectedArticle(article)
                }
              >
                {/* //기사 이미지가 있는지 확인합니다. */}
                {article.image ? (

                  //이미지가 있다면 이미지 요소를 화면에 표시합니다.
                  <img

                    //기사 이미지 주소를 src 속성에 넣습니다.
                    src={article.image}

                    // 이미지가 보이지 않을 때 대신 표시할 기사 제목입니다.
                    alt={article.title}
                    className="thumbnail"
                  />
                ) : (

                  //이미지가 없으면 이미지 없음 문구를 보여줍니다.
                  <div className="noImage">
                    이미지 없음
                  </div>
                )}

                {/* //기사 출처, 날짜, 제목, 설명을 담는 영역입니다. */}
                <div className="cardContent">

                  {/* //출처와 날짜를 한줄로 표시하는 영역입니다. */}
                  <div className="sourceRow">

                    {/* //기사를 제공한 언론사 이름을 표시합니다. */}
                    <span className="sourceName">

                      {/* //source가 존재할 때만 name을 읽고, 출처가 없으면 기본 문구를 표시합니다. */}
                      {article.source?.name ||
                        "출처 없음"}
                    </span>

                    {/* //뉴스가 발행된 날짜와 시간을 표시합니다. */}
                    <span className="dateText">

                      {/* //publishedAt 값이 있을 때만 날짜를 변환합니다. */}
                      {article.publishedAt
                        ? new Date(

                          //API 에서 받은 날짜 문자열을 Date 객체로 변환합니다.
                            article.publishedAt

                            //한국 지역 형식의 날짜와 시간 문자열로 표시합니다.
                          ).toLocaleString("ko-KR")
                        : ""}
                    </span>
                  </div>

                          {/* //기사 제목 */}
                  <h3 className="cardTitle">
                    {article.title}
                  </h3>

                          {/* //기사 설명 */}
                  <p className="cardDesc">
                    {article.description ||
                      "설명이 없는 기사입니다."}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* //이전 페이지와 다음 페이지 버튼을 감싸는 영역 */}
          <div className="pagination">
            <button
              type="button"
              onClick={goPrevPage}

              //현재 페이지가 1이면 이전 페이지가 없으므로 비활성화입니다.
              disabled={page === 1}
              className="pageButton"
            >
              이전
            </button>

            <button
              type="button"
              onClick={goNextPage}

              //뉴스가 하나도 없으면 다음 페이지로 이동할 수 없으므로 비활성화합니다.
              disabled={articles.length === 0}
              className="pageButton"
            >
              다음
            </button>
          </div>
        </section>

            {/* //선택한 뉴스의 상세 내용을 보여주는 오른쪽 섹션입니다. */}
        <section className="panel">
          <h2 className="sectionTitle">
            뉴스 상세
          </h2>

            {/* //selectedArticle 값이 있는지 확인하여 조건부 렌더링합니다. */}
          {selectedArticle ? (

            //기사를 선택했다면 상세 정보카드를 표시합니다.
            <div className="detailCard">

              {/* //상세 기사에 이미지가 있는지 검사합니다. */}
              {selectedArticle.image ? (

                //이미지가 있으면 큰 상세 이미지를 표시합니다.
                <img

                  //선택한 기사 이미지 주소를 전달합니다.
                  src={selectedArticle.image}

                  //이미지 대체 텍스트로 기사 제목을 사용합니다.
                  alt={selectedArticle.title}
                  className="detailImage"
                />
              ) : (

                //이미지가 없으면 이미지 없음이라는 안내문구를 표시합니다.
                <div className="detailNoImage">
                  이미지 없음
                </div>
              )}

              {/* //기사 출처와 발행 날짜를 표시하는 영역입니다. */}
              <div className="detailMeta">

                {/* //기사 출처 이름을 표시합니다. */}
                <span>

                  {/* //출처 이름이 없으면 출처 없음으로 표시합니다. */}
                  {selectedArticle.source?.name ||
                    "출처 없음"}
                </span>

                {/* //기사 발행 날짜를 표시합니다. */}
                <span>

                  {/* //날짜 정보가 있을 때만 한국 형식으로 변환합니다. */}
                  {selectedArticle.publishedAt
                    ? new Date(
                        selectedArticle.publishedAt
                      ).toLocaleString("ko-KR")
                    : ""}
                </span>
              </div>

              {/* //선택한 기사의 제목을 표시합니다. */}
              <h2 className="detailTitle">
                {selectedArticle.title}
              </h2>

                {/* //선택한 기사의 요약 설명을 표시합니다. */}
              <p className="detailDescription">

                {/* //설명이 없다면 기본 안내 문구를 표시합니다. */}
                {selectedArticle.description ||
                  "요약 정보가 없습니다."}
              </p>

                  {/* //선택한 기사의 본문 미리보기 내용을 표시합니다. */}
              <p className="detailContent">

                {/* //본문이 없다면 기본 안내 문구를 표시합니다. */}
                {selectedArticle.content ||
                  "본문 미리보기가 없습니다."}
              </p>

              {/* //실제 뉴스 원문 페이지로 이동하는 링크입니다. */}
              <a

                  //선택한 기사의 원문 주소를 링크 주소로 사용합니다.
                href={selectedArticle.url}

                //새탭에서 원문을 엽니다.
                target="_blank"

                //새 탭을 열때 보안상 현재 페이지 정보를 전달하지 않습니다.
                rel="noreferrer"
                className="linkButton"
              >
                원문 보기
              </a>
            </div>
          ) : (

            //아직 기사를 선택하지 않았다면 안내 문구를 표시합니다.
            <div className="statusBox">
              왼쪽에서 기사를 선택하면 상세 내용이
              표시됩니다.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;