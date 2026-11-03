// React에서 컴포넌트를 만들기 위해 useMEmo, useState Hook을 불러옵니다.
// useState는 검색어, 선택한 필터, 정렬 기준처럼 변경되는 값을 저장합니다.
// useMemo는 상품 목록에서 카테고리와 필터 결과를 계산할 때 사용합니다.
import React, { useMemo, useState } from "react";
import "./App.css";

// 상품 필터 화면
function App() {

  // 상품 목록을 상태로 저장합니다.
  // 이 예제에서는 상품을 직접 작성했기 때문에 setItems는 사용하지 않습니다.
  const [items] = useState([

    // 첫번째 상품 정보
    {

      // 고유번호
      id: 1,
      // 상품이름
      name: "무선 블루투스 이어폰",
      // 상품이 속한 카테고리
      category: "전자기기",
      // 상품 가격
      price: 59000,
      // 상품 평점
      rating: 4.7,
      // 재고가 있으면 true, 없으면 false 입니다.
      stock: true,
    },
    {
      id: 2,
      name: "기계식 키보드",
      category: "전자기기",
      price: 89000,
      rating: 4.8,
      stock: true,
    },
    {
      id: 3,
      name: "스테인리스 텀블러",
      category: "주방용품",
      price: 22000,
      rating: 4.5,
      stock: false,
    },
    {
      id: 4,
      name: "데일리 백팩",
      category: "패션",
      price: 45000,
      rating: 4.3,
      stock: true,
    },
    {
      id: 5,
      name: "러닝화",
      category: "패션",
      price: 99000,
      rating: 4.9,
      stock: true,
    },
    {
      id: 6,
      name: "노트북 파우치",
      category: "잡화",
      price: 27000,
      rating: 4.2,
      stock: false,
    },
    {
      id: 7,
      name: "캔들 세트",
      category: "생활용품",
      price: 32000,
      rating: 4.4,
      stock: true,
    },
    {
      id: 8,
      name: "화이트 머그컵",
      category: "주방용품",
      price: 12000,
      rating: 4.1,
      stock: true,
    },
  ]);

  // 검색창에 입력한 상품명을 저장합니다.
  const [search, setSearch] = useState("");

  // 현재 선택한 카테고리를 저장합니다.
  // 처음에는 모든 카테고리를 보여주도록 전체로 설정합니다.
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // 재고 필터값을 저장합니다.
  // 전체, 재고 있음, 재고 없음 중 하나가 저장됩니다.
  const [stockFilter, setStockFilter] = useState("전체");

  // 상품 정렬 기준을 저장합니다.
  // 처음에는 상품 id 기준으로 최신순 정렬을 사용합니다.
  const [sortType, setSortType] = useState("latest");

  // 상품 목록에서 중복되지 않는 카테고리 목록을 만듭니다.
  // useMemo를 사용하여 items가 변경될 때만 다시 계산합니다.
  const categories = useMemo(
    () => 
      // 전체 옵션을 먼저 넣고, 상품의 category만 뽑아 Set으로 중복을 제거합니다.
      ["전체", ...new Set(items.map((item) => item.category))],

    // items가 변경될 때 카테고리 목록을 다시 계산합니다.
    [items]
  );

  // 검색, 카테고리, 재고, 정렬 조건을 모두 적용한 최종 상품 목록입니다.
  const filteredItems = useMemo(() => {

    // 원본 items 배열을 복사합니다.
    // 원본 배열을 직접 수정하지 않기 위해 spread 문법을 사용합니다.
    let result = [...items];

    // 검색어 앞뒤 공백을 제거하고 소문자로 변환합니다.
    const keyword = search.trim().toLowerCase();

    // 검색어가 있을 때만 상품 이름을 기준으로 필터링 합니다.
    if (keyword) {
      result = result.filter((item) =>

        // 상품 이름을 소문자로 변환한 뒤 검색어가 포함되어 있는지 확인합니다.
        item.name.toLowerCase().includes(keyword)
      );
    }

    // 전체가 아닌 특정 카테고리를 선택했을 때 실행됩니다.
    if (selectedCategory !== "전체") {
      result = result.filter(

        // 선택된 카테고리와 같은 상품만 남깁니다.
        (item) => item.category === selectedCategory
      );
    }

    // 재고 있음 필터를 선택했을 때 실행됩니다.
    if (stockFilter === "재고있음") {
      result = result.filter(
        // stock 값이 true인 상품만 남깁니다.
        (item) => item.stock);

    // 재고 없음 필터를 선택했을 때 실행됩니다.
    } else if (stockFilter === "재고없음") {
      result = result.filter(
        // stock 값이 false인 상품만 남깁니다.
        (item) => !item.stock);
    }

    // 가격이 낮은 상품부터 정렬합니다.
    if (sortType === "priceLow") {
      result.sort((a, b) => a.price - b.price);

    // 가격이 높은 상품부터 정렬합니다.
    } else if (sortType === "priceHigh") {
      result.sort((a, b) => b.price - a.price);
    
    // 평점이 높은 상품부터 정렬합니다.
    } else if (sortType === "ratingHigh") {
      result.sort((a, b) => b.rating - a.rating);

    // 상품이름을 가나다 순으로 정렬합니다.
    } else if (sortType === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name, "ko"));

    // 별도의 정렬 조건이 없ㅇ면 id가 큰 상품부터 정렬합니다.
    // 여기서는 id가 클수록 최신 상품이라고 가정합니다.
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    // 모든 필터와 정렬이 적용된 결과를 반환합니다.
    return result;
  }, [items, search, selectedCategory, stockFilter, sortType]);

  // 검색과 필터와 정렬 조건을 처음 상태로 되돌리는 함수입니다.
  const resetFilters = () => {

    // 검색어를 지웁니다.
    setSearch("");

    // 카테고리를 전체로 되돌립니다.
    setSelectedCategory("전체");

    // 재고 필터를 전체로 되돌립니다.
    setStockFilter("전체");

    // 정렬 기준을 최신순으로 되돌립니다.
    setSortType("latest");
  };

  // 상품 가격을 한국식 천 단위 표시로 변환하는 함수입니다.
  const formatPrice = (price) => price.toLocaleString("ko-KR");


// React 상품 검색·필터·정렬 프로젝트 전체 실행 흐름
 // =====================================================
 // 1. 상품 8개의 기본 데이터를 준비합니다.
 // 2. 검색어, 카테고리, 재고, 정렬 상태를 설정합니다.
 // 3. 상품 데이터에서 카테고리 목록을 자동 생성합니다.
 // 4. 사용자가 검색어를 입력하면 상품을 검색합니다.
 // 5. 카테고리를 선택하면 해당 상품만 필터링합니다.
 // 6. 재고 상태를 선택하면 재고 유무에 따라 필터링합니다.
 // 7. 정렬 기준을 선택하면 상품 순서를 변경합니다.
 // 8. 검색과 필터링 조건에 맞는 상품 개수를 계산합니다.
 // 9. 최종 상품 목록을 카드 형태로 화면에 출력합니다.
 // 10. 초기화 버튼을 누르면 모든 조건을 기본값으로 되돌립니다.
 // =====================================================


 // =====================================================
 // 1단계. React 기능 및 CSS 불러오기
 // =====================================================
 // useState는 검색어, 카테고리, 재고, 정렬 상태를 저장합니다.
 // useMemo는 카테고리 목록과 필터링 결과를 계산합니다.
 // App.css는 상품 카드와 필터 영역의 디자인을 담당합니다.


 // =====================================================
 // 2단계. 상품 기본 데이터 준비
 // =====================================================
 // items 배열에 상품 8개의 정보를 저장합니다.
 // 각 상품에는 다음 정보가 있습니다.
 //
 // id       → 상품 고유번호
 // name     → 상품 이름
 // category → 상품 카테고리
 // price    → 상품 가격
 // rating   → 상품 평점
 // stock    → 재고 유무
 //
 // stock이 true이면 재고가 있는 상품입니다.
 // stock이 false이면 재고가 없는 상품입니다.
 // 이 예제에서는 서버 API가 아닌 미리 준비한 데이터를 사용합니다.


 // =====================================================
 // 3단계. 검색 및 필터 상태 관리
 // =====================================================
 // search는 사용자가 입력한 검색어를 저장합니다.
 // selectedCategory는 선택한 상품 카테고리를 저장합니다.
 // stockFilter는 선택한 재고 조건을 저장합니다.
 // sortType은 선택한 상품 정렬 기준을 저장합니다.
 //
 // 초기 상태
 // 검색어: 빈 문자열
 // 카테고리: 전체
 // 재고: 전체
 // 정렬: 최신순
 //
 // 사용자가 조건을 변경하면 해당 상태가 업데이트됩니다.


 // =====================================================
 // 4단계. 카테고리 목록 자동 생성
 // =====================================================
 // items 배열에서 각 상품의 category 값을 추출합니다.
 // map을 사용하여 카테고리만 새로운 배열로 만듭니다.
 // Set을 이용해 중복된 카테고리를 제거합니다.
 // 맨 앞에 "전체" 항목을 추가합니다.
 //
 // 예시
 // 전체, 전자기기, 주방용품, 패션, 잡화, 생활용품
 //
 // useMemo를 사용하여 items가 변경될 때만 다시 계산합니다.


 // =====================================================
 // 5단계. 상품 필터링 및 정렬 준비
 // =====================================================
 // filteredItems는 화면에 표시할 최종 상품 목록입니다.
 // 원본 items 배열을 복사하여 result에 저장합니다.
 // 원본 데이터를 직접 변경하지 않고 복사본을 사용합니다.
 //
 // 검색 → 카테고리 → 재고 → 정렬 순서로 처리합니다.
 // 모든 조건을 적용한 결과를 화면에 표시합니다.


 // =====================================================
 // 6단계. 상품 이름 검색
 // =====================================================
 // 사용자가 검색창에 입력한 검색어를 가져옵니다.
 // trim으로 검색어 앞뒤의 공백을 제거합니다.
 // toLowerCase로 영어 대소문자를 통일합니다.
 //
 // 검색어가 있으면 filter로 상품을 검색합니다.
 // includes를 사용하여 상품명에 검색어가 포함되어 있는지 확인합니다.
 //
 // 예시
 // "키보드" 입력 → 기계식 키보드 출력
 // "무선" 입력 → 무선 블루투스 이어폰 출력
 //
 // 검색어가 없으면 검색 필터를 적용하지 않습니다.


 // =====================================================
 // 7단계. 카테고리별 상품 필터링
 // =====================================================
 // 사용자가 선택한 카테고리를 확인합니다.
 //
 // "전체"를 선택하면 모든 카테고리를 유지합니다.
 // 특정 카테고리를 선택하면 해당 상품만 남깁니다.
 //
 // 예시
 // 전자기기 선택
 // → 무선 블루투스 이어폰
 // → 기계식 키보드
 //
 // 검색어가 입력되어 있다면 검색 결과에
 // 카테고리 조건을 추가로 적용합니다.


 // =====================================================
 // 8단계. 재고 상태별 상품 필터링
 // =====================================================
 // 사용자가 선택한 재고 조건에 따라 상품을 구분합니다.
 //
 // 전체 재고 → 재고 유무와 관계없이 상품 표시
 // 재고 있음 → stock이 true인 상품만 표시
 // 재고 없음 → stock이 false인 상품만 표시
 //
 // filter를 사용하여 조건에 맞는 상품만 남깁니다.
 // 검색어와 카테고리 조건도 함께 적용됩니다.


 // =====================================================
 // 9단계. 상품 정렬 기능
 // =====================================================
 // 사용자가 선택한 정렬 기준에 따라 상품 순서를 변경합니다.
 // sort를 이용하여 result 배열을 정렬합니다.
 //
 // priceLow   → 가격 낮은순
 // priceHigh  → 가격 높은순
 // ratingHigh → 평점 높은순
 // name       → 이름순
 // latest     → 최신순
 //
 // 가격 낮은순은 가격이 작은 상품부터 배치합니다.
 // 가격 높은순은 가격이 큰 상품부터 배치합니다.
 // 평점 높은순은 평점이 높은 상품부터 배치합니다.
 // 이름순은 localeCompare를 이용하여 한글 이름을 정렬합니다.
 // 최신순은 상품 ID가 큰 상품부터 배치합니다.
 //
 // 이 예제에서는 ID가 클수록 최신 상품이라고 가정합니다.


 // =====================================================
 // 10단계. 최종 필터링 결과 반환
 // =====================================================
 // 검색, 카테고리, 재고, 정렬 조건을 모두 적용합니다.
 // 조건에 맞는 최종 상품 목록을 result로 반환합니다.
 //
 // useMemo는 관련 상태가 변경될 때 다시 계산합니다.
 //
 // 변경을 감지하는 상태
 // items
 // search
 // selectedCategory
 // stockFilter
 // sortType
 //
 // 최종 결과는 filteredItems에 저장됩니다.




  return (
    <div className="container">
      <h1 className="title">상품 필터</h1>

      {/* 검색창과 필터 선택창을 감싸는 영역 */}
      <div className="filterBox">

        {/* 상품 이름을 검색하는 입력창입니다. */}
        <input
          type="search"
          value={search}

          // 사용자가 입력할 때 search 상태를 변경합니다.
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색"
        />

        {/* 카테고리를 선택합니다. */}
        <select

          // 현재 선택된 카테고리를 표시합니다.
          value={selectedCategory}

          // 카테고리가 변경되면 상태를 변경합니다.
          onChange={(e) => setSelectedCategory(e.target.value)}
        >

          {/*categories 배열의 카테고리를 option으로 만듭니다. */}
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* 재고 상태를 선택 */}
        <select

          // 현재 선택한 재고 필터
          value={stockFilter}

          // 재고 필터가 변경되면 상태를 업데이트합니다.
          onChange={(e) => setStockFilter(e.target.value)}
        >

          {/* 모든 상품 */}
          <option value="전체">전체 재고</option>
          <option value="재고있음">재고 있음</option>
          <option value="재고없음">재고 없음</option>
        </select>

        {/* 정렬 기준 */}
        <select
          value={sortType}

          // 정렬 기준이 변경되면 상태를 업데이트합니다.
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="priceLow">가격 낮은순</option>
          <option value="priceHigh">가격 높은순</option>
          <option value="ratingHigh">평점 높은순</option>
          <option value="name">이름순</option>
        </select>

        <button type="button" onClick={resetFilters}>
          초기화
        </button>
      </div>

      {/* 현재 필터 결과로 남은 상품의 개수를 표시합니다. */}
      <p className="count">총 {filteredItems.length}개</p>

      {/* 상품 카드를 여러 칸으로 배치하는 영역입니다. */}
      <div className="grid">

        {/* 필터 결과가 없으면 상품 없음 문구를 표시합니다. */}
        {filteredItems.length === 0 ? (
          <div className="empty">상품 없음</div>
        ) : (

          // 필터 결과가 있으면 상품 카드를 반복해서 표시합니다.
          filteredItems.map((item) => (

            // 하나의 상품 정보를 표시하는 카드입니다.
            <div key={item.id} className="card">

              {/* 카테고리 */}
              <span className="category">{item.category}</span>

              {/* 상품 이름 */}
              <h3>{item.name}</h3>

              {/* 가격 쉼표형식 */}
              <p className="price">
                {formatPrice(item.price)}원
              </p>

              {/* 평점을 별모양 문자와 함께 표시 */}
              <p>⭐ {item.rating}</p>

              {/* 재고 상태에 따라 CSS 클래스를 다르게 적용합니다. */}
              <p className={item.stock ? "inStock" : "outStock"}>

                {/* stock이 ture이면 재고 있음, false이면 재고 없음을 표시합니다. */}
                {item.stock ? "재고 있음" : "재고 없음"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;