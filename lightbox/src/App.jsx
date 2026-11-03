
import React, { useState } from "react";
import "./App.css";

function App() {
  // 갤러리에 표시할 이미지 주소 배열
  const images = [
    "https://picsum.photos/id/1015/1200/800",
    "https://picsum.photos/id/1016/1200/800",
    "https://picsum.photos/id/1018/1200/800",
    "https://picsum.photos/id/1020/1200/800",
    "https://picsum.photos/id/1024/1200/800",
    "https://picsum.photos/id/1035/1200/800",
  ];

  // 현재 선택된 이미지의 인덱스
  // null이면 라이트박스가 닫힌 상태
  const [currentIndex, setCurrentIndex] = useState(null);

  // 라이트박스 열기
  const openLightbox = (index) => {
    setCurrentIndex(index);
  };

  // 라이트박스 닫기
  const closeLightbox = () => {
    setCurrentIndex(null);
  };

  // 이전 이미지 이동
  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // 다음 이미지 이동
  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="page">
      <h1 className="title">이미지 라이트박스</h1>

      {/* 이미지 썸네일 갤러리 */}
      <div className="gallery">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`gallery-${index + 1}`}
            className="thumb"
            onClick={() => openLightbox(index)}
          />
        ))}
      </div>

      {/* 이미지가 선택된 경우에만 라이트박스 표시 */}
      {currentIndex !== null && (
        <div className="overlay" onClick={closeLightbox}>
          <div
            className="lightbox"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 현재 선택된 이미지 확대 표시 */}
            <img
              src={images[currentIndex]}
              alt={`lightbox-${currentIndex + 1}`}
              className="image"
            />

            {/* 이전 이미지 */}
            <button
              className="btn left"
              onClick={prevImage}
            >
              ◀
            </button>

            {/* 다음 이미지 */}
            <button
              className="btn right"
              onClick={nextImage}
            >
              ▶
            </button>

            {/* 라이트박스 닫기 */}
            <button
              className="close"
              onClick={closeLightbox}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
