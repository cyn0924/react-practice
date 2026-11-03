// React 라이브러리에서 useMemo, useState Hook을 불러옵니다.
// useState는 검색어, 선택한 카테고리, 정렬기준 처럼 변경되는 값을 저장합니다.
// useMemo는 상품 목록을 검색하거나 정렬한 결과를 기억하여 필요할 때만 다시 계산하도록 도와줍니다.
import React, { useMemo, useState } from "react";
import "./App.css";


// 상품리스트 화면 전체를 담당하는 App 컴포넌트를 선언합니다.
function App() {

  // 상품 데이터를 배열 형태로 저장합니다.
  // 상품 데이터를 직접 작성하고, useState를 사용하여 상품 목록 형태로 관리합니다.
  const [products] = useState([
    {
      // 상품을 구분하기 위한 고유 번호입니다.
      id: 1,

      // 상품 이름
      name: "무선 블루투스 이어폰",

      // 상품이 속한 카테고리
      category: "전자기기",

      // 상품의 가격
      price: 59000,

      // 현재 남아있는 수량
      stock: 12,

      // 이미지 주소
      image: "https://picsum.photos/id/180/800/600",
    },
    {
      id: 2,
      name: "기계식 키보드",
      category: "전자기기",
      price: 89000,
      stock: 7,
      image: "https://picsum.photos/id/1080/800/600",
    },
    {
      id: 3,
      name: "화이트 머그컵",
      category: "주방용품",
      price: 12000,
      stock: 30,
      image: "https://picsum.photos/id/30/800/600",
    },
    {
      id: 4,
      name: "데일리 백팩",
      category: "패션",
      price: 45000,
      stock: 9,
      image: "https://picsum.photos/id/1062/800/600",
    },
    {
      id: 5,
      name: "러닝화",
      category: "패션",
      price: 99000,
      stock: 5,
      image: "https://picsum.photos/id/21/800/600",
    },
    {
      id: 6,
      name: "노트북 파우치",
      category: "잡화",
      price: 27000,
      stock: 18,
      image: "https://picsum.photos/id/180/800/600",
    },
    {
      id: 7,
      name: "캔들 세트",
      category: "생활용품",
      price: 32000,
      stock: 14,
      image: "https://picsum.photos/id/433/800/600",
    },
    {
      id: 8,
      name: "스테인리스 텀블러",
      category: "주방용품",
      price: 22000,
      stock: 21,
      image: "https://picsum.photos/id/292/800/600",
    },
  ]);

  // 검색창에 입력한 검색어를 저장합니다.
  // 사용자가 상품 이름을 검색하면 이 값이 변경됩니다.
  const [search, setSearch] = useState("");

  // 현재 선택한 상품 카테고리를 저장합니다.
  // 처음에는 모든 상품을 보여주기 위해 "전체" 로 시작합니다.
  const [selectedCategory, setSelectedCategory] =
    useState("전체");

  // 상품 정렬 방식을 저장합니다.
  // 처음에는 상품 번호가 높은 순서인 최신순으로 설정합니다.
  const [sortType, setSortType] = useState("latest");

  
  // 상품 배열에서 카테고리 목록을 자동으로 만들어 저장합니다.
  // useMemo를 사용하여 products가 변경될 때만 카테고리를 다시 계산합니다.
  const categories = useMemo(() => {

    // 전체 카테고리를 가장 앞에 추가합니다.
    return [
      "전체",

      // products 배열에서 category 값만 꺼내 새로운 배열을 만듭니다.
      // Set을 사용하면 중복된 카테고리를 하나로 합칠 수 있습니다.
      ...new Set(
        products.map((product) => product.category)
      ),
    ];
  }, [products]);

  // 검색어, 카테고리, 정렬 조건을 모두 적용한 최종 상품 목록입니다.
  // 검색이나 정렬 조건이 변경될 때만 결과를 다시 계산합니다.
  const filteredProducts = useMemo(() => {

    // 원본 products 배열을 복사합니다.
    // 원본 배열을 직접 정렬하면 원본 데이터가 변경될 수 있으므로 
    // 스프레드 문법으로 새로운 배열을 만들어 사용합니다.
    let result = [...products];

    // 선택한 카테고리가 "전체"가 아닌 경우에만 카테고리 필터를 적용합니다.
    if (selectedCategory !== "전체") {

      // 선택한 카테고리와 같은 상품만 남깁니다.
      result = result.filter(
        (product) =>
          product.category === selectedCategory
      );
    }

    // 검색어 앞뒤 공백을 제거한 결과가 비어 있지 않은지 확인합니다.
    if (search.trim()) {

      // 검색어 앞뒤 공백을 제거하고 소문자로 변환합니다.
      // 대문자와 소문자를 구분하지 않고 검색하기 위해 사용합니다.
      const keyword = search.trim().toLowerCase();

      // 상품 이름에 검색어가 포함된 상품만 남깁니다.
      result = result.filter((product) =>
        product.name.toLowerCase().includes(keyword)
      );
    }

    // 선택한 정렬 방식에 따라 상품 배열의 순서를 변경합니다.
    if (sortType === "priceLow") {

      // 가격이 낮은 상품부터 높은 상품 순서로 정렬합니다.
      result.sort((a, b) => a.price - b.price);
    } else if (sortType === "priceHigh") {

      // 가격이 높은 상품부터 낮은 상품 순서로 정렬합니다.
      result.sort((a, b) => b.price - a.price);
    } else if (sortType === "name") {

      // 상품 이름을 가나다 순으로 정렬합니다.
      // localeCompare를 사용하면 한국어 정렬 기준을 ko를 사용하여 적용할 수 있습니다.
      result.sort((a, b) =>
        a.name.localeCompare(b.name, "ko")
      );
    } else {

      // 다른 정렬 기준이 없다면 상품 id가 높은 순서로 정렬합니다.
      // 일반적으로 최근에 추가된 상품이 위쪽에 표시되는 효과를 냅니다.
      result.sort((a, b) => b.id - a.id);
    }

    // 필터링과 정렬이 끝난 최종 배열을 반환합니다.
    return result;
  }, [

    // 상품 목록이 변경되면 결과를 다시 계산합니다.
    products,

    // 검색어가 변경되면 결과를 다시 계산합니다.
    search,

    // 선택한 카테고리가 변경되면 결과를 다시 계산합니다.
    selectedCategory,

    // 정렬방식이 변경되면 결과를 다시 계산합니다.
    sortType,
  ]);

  // 숫자로 된 가격을 한국식 천 단위 표시 문자열로 바꾸는 함수입니다.
  const formatPrice = (price) => {

    // toLocalString("ko-KR")을 사용하여 59000을 59,000 처럼 표시할 수 있습니다.
    return price.toLocaleString("ko-KR");
  };

  // 화면에 표시
  return (

    // 상품 리스트 전체를 감싸는 가장 바깥쪽 컨테이너
    <div className="container">

    {/* 화면의 제목 */}
      <h1 className="title">상품 리스트</h1>
    
    {/* 검색창과 카테고리, 정렬 선택창을 감싸는 영역입니다. */}
      <div className="filterBox">

        {/* 상품 이름을 검색하는 입력창입니다. */}
        <input
          type="text"

          // input에 표시되는 값을 search 상태와 연결합니다.
          value={search}

          // 사용자가 입력할 때마다 search 상태를 변경합니다.
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색"
        />

        {/* 상품 카테고리를 선택하는 select 요소입니다. */}
        <select

        // 선택된 카테고리 값을 selectedCategory 상태와 연결합니다.
          value={selectedCategory}

          // 카테고리가 변경되면 선택한 값을 상태에 저장합니다.
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
        >

          {/* categories 배열을 반복하여 option 목록을 만듭니다. */}
          {categories.map((category) => (

            // 카테고리
            <option

            // React가 option을 구분할 수 있도록 category를 key로 사용합니다.
              key={category}

              // 실제로 선택되었을 때 저장될 값입니다.
              value={category}
            >

              {/* 화면에 표시될 카테고리입니다. */}
              {category}
            </option>
          ))}
        </select>

        {/* 상품 정렬 방식 */}
        <select

        // 현재 선택된 정렬 방식을 sortType 상태와 연결합니다.
          value={sortType}

          // 정렬 방식이 변경되면 sortType 상태를 변경합니다.
          onChange={(e) =>
            setSortType(e.target.value)
          }
        >
          <option value="latest">최신순</option>
          <option value="priceLow">
            가격 낮은순
          </option>
          <option value="priceHigh">
            가격 높은순
          </option>
          <option value="name">이름순</option>
        </select>
      </div>

      {/* 현재 필터 조건에 맞는 상품의 총 개수를 표시합니다. */}
      <p className="count">
        총 {filteredProducts.length}개
      </p>

      {/* 상품 카드들이 표시되는 그리드 영역입니다. */}
      <div className="grid">

        {/* 필터링된 상품이 없는지 확인합니다. */}
        {filteredProducts.length === 0 ? (

          // 상품이 없으면 상품 없음 문구를 표시합니다.
          <div className="empty">상품 없음</div>
        ) : (

          // 상품이 있으면 map을 사용하여 상품 카드를 반복해서 만듭니다.
          filteredProducts.map((product) => (

            // 상품 하나를 표시하는 카드 영역입니다.
            <div

            // 상품의 id를 사용하여 각 카드에 고유한 key를 설정합니다.
              key={product.id}
              className="card"
            >

              {/* 상품의 이미지를 표시 */}
              <img

                // 이미지 주소
                src={product.image}
                // 이미지가 나오지 않을 때에는 대체 텍스트를 사용합니다.
                alt={product.name}
              />

              {/* 상품의 카테고리, 이름, 가격, 재고, 버튼을 감싸는 영역입니다. */}
              <div className="body">

                {/* 카테고리 */}
                <span className="category">
                  {product.category}
                </span>

                {/* 이름 */}
                <h3>{product.name}</h3>

                {/* 가격 */}
                <p className="price">

                  {/* formatPrice 함수를 사용하여 천 단위 콤마를 추가합니다. */}
                  {formatPrice(product.price)}원
                </p>

                {/* 상품의 현재 재고 수량을 표시합니다. */}
                <p className="stock">
                  재고 {product.stock}
                </p>

                {/* 장바구니 버튼입니다. */}
                {/* 현재 코드에서는 버튼 화면만 있고 클릭 기능은 연결되지 않았습니다. */}
                <button type="button">
                  장바구니
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;