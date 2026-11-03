import { useEffect, useState } from "react";
import "./App.css";

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a 
          className="logo"
          href="#home">
            STUDY FLOW
          </a>
          <nav className="navigation" aria-label="주요 메뉴">
            <a href="#home">홈</a>
            <a href="#timer">타이머</a>
            <a href="#guide">학습 안내</a>
          </nav>
      </div>
    </header>
  );
}

function CurrentClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    console.log(
      "CurrentClock Mount: 시계를 시작합니다.",
    );
    const clockId = setInterval (() => {
      setCurrentTime(new Date());
    }, 1000);
    return () =>{
      clearInterval(clockId);
      console.log(
        "CurrentClock Unmount: 시계를 정리합니다.",
      );
    };
  }, []);
  const dateText = currentTime.toLocaleDateString(
    "ko-KR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    },
  );
  const timeText = 
  currentTime.toLocaleTimeString(
    "ko-KR",
  );
  return (
    <section className="clock-card">
      <p className="card-label">CURRENT TIME</p>
      <time dateTime={currentTime.toISOString()}>
        <strong>{timeText}</strong>
        <span>{dateText}</span>
      </time>
    </section>
  );
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const minuteText = String(minutes).padStart( 2, "0",);
  const secondText = String(seconds).padStart( 2, "0",);
  return `${minuteText}:${secondText}`;
}

function StudyTimer({
  sessionCount,
  onCompleteSession,
}) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  console.log(
    "StudyTimer 렌더링",
  );
  useEffect(() => {
    console.log(
      "StudyTimer Mount: 컴포넌트가 생성되었습니다.",
    );
    return () => {
      console.log(
        "StudyTimer Unmount: 컴포넌트가 제거되었습니다.",
      );
    };
  }, []);
  useEffect(() => {
    if (!isRunning) {
      console.log(
        "StudyTimer Update: 타이머가 정지 상태입니다.",
      );
      return undefined;
    }
    console.log(
      "StudyTimer Update: 타이머를 시작합니다.",
    );
    const timerId = setInterval(() => {
      setSeconds(
        (previousSeconds) => previousSeconds + 1,
      );
    }, 1000);
    return () => {
      clearInterval(timerId);
      console.log(
        "StudyTimer Cleanup: 기존 타이머를 정리합니다.",
      );
    };
  }, [isRunning]);
  useEffect(() => {
    document.title = `학습 시간 ${formatTime(seconds)}`;
  }, [seconds]);
  useEffect(() => {
    return () => {
      document.title = "Study Flow";
    };
  }, []);
    function toggleTimer() {
    setIsRunning(
      (previousIsRunning) => !previousIsRunning,
    );
  }

    function resetTimer() {
    setSeconds(0);
    setIsRunning(false);
  }

  function completeSession() {
    if (seconds === 0) {
      return;
    }
    onCompleteSession(seconds);
    setSeconds(0);
    setIsRunning(false);
  }
  const timerClassName = 
    isRunning
      ? "study-timer timer-running"
      : "study-timer";
  return (
    <article className={timerClassName}>
      <div className="timer-top">
        <div>
          <p className="card-label">STUDY SESSION</p>
          <h2>React 집중 학습</h2>
        </div>
        <span className={
          isRunning
            ? "status-badge running-badge"
            : "status-badge"
        }>
          {isRunning
          ? "학습 중"
          : "일시 정지"}
        </span>
      </div>
      <strong className="timer-number">
        {formatTime(seconds)}
      </strong>
      <p className="timer-description">완료한 학습 세션:
        <b>{" "} {sessionCount}회</b>
      </p>
      <div className="timer-buttons">
            <button 
            className="timer-button primary-button"
            type="button"
            onClick={toggleTimer}>
              {isRunning
              ? "일시 정지"
              : "학습 시작"}
            </button>
            <button
            className="timer-button"
            type="button"
            onClick={resetTimer}>
              초기화
            </button>
            <button
            className="timer-button complete-button"
            type="button"
            onClick={completeSession}
            disabled={seconds === 0}>
              세션 완료
            </button>
      </div>
    </article>
  );
}

function SessionSummary({
  sessionCount,
  totalSeconds,
}) {
  return (
    <article className="summary-card">
      <p className="card-label">TODAY SUMMARY</p>
      <h2>오늘의 학습 기록</h2>
      <dl className="summary-list">
        <div>
          <dt>완료한 세션</dt>
          <dd>{sessionCount}회</dd>
        </div>
        <div>
          <dt>전체 학습 시간</dt>
          <dd>{formatTime(totalSeconds)}</dd>
        </div>
        <div>
          <dt>현재 상태</dt>
          <dd>{sessionCount === 0
            ? "학습 전"
            : "꾸준히 학습 중"}
          </dd>
        </div>
      </dl>
    </article>
  );
}

function LifecycleGuide() {
  return (
    <section
    className="guide-section"
    id="guide"
    aria-labelledby="guide-title">
      <div className="section-heading">
        <p className="section-label">STATE & LIFECYCLE</p>
        <h2 id="guide-title">코드의 동작 흐름</h2>
      </div>
      <div className="guide-grid">
        <article className="guide-card">
          <span>01</span>
          <h3>Mount</h3>
          <p>컴포넌트가 생성되면 초기 State로 화면을 렌더링하고 Effect를 실행합니다.</p>
        </article>
        <article className="guide-card">
          <span>02</span>
          <h3>Update</h3>
          <p>타이머가 State를 변경하면 컴포넌트가 다시 렌더링되고 시간이 업데이트 됩니다.</p>
        </article>
        <article className="guide-card">
          <span>03</span>
          <h3>Unmount</h3>
          <p>컴포넌트가 제거되면 정리 함수가 실행되어 타이머 작업을 종료합니다.</p>
        </article>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <strong>STUDY FLOW</strong>
        <p>ⓒ 2026 Study Flow.</p>
      </div>
    </footer>
  );
}

function App() {
  const [
    isTimerVisible,
    setIsTimerVisible,
  ] = useState(true);
  const [
    sessionCount,
    setSessionCount,
  ] = useState(0);
  const [
    totalSeconds,
    setTotalSeconds,
  ] = useState(0);

  function toggleTimerVisibility() {
    setIsTimerVisible(
      (previousIsVisible) => !previousIsVisible,
    );
  }

  function completeSession(
    sessionSeconds,
  ) {
    setSessionCount(
      (previousCount) => previousCount + 1,
    );
    setTotalSeconds(
      (previousTotalSeconds) => previousTotalSeconds + sessionSeconds,
    );
  }

  return (
    <>
    <Header />
    <main className="page-container">
      <section
      className="hero"
      id="home">
        <div className="hero-content">
          <p className="hero-label">STATE & LIFECYCLE</p>

          <h1>
            시간을 기억하고
            <br />
            작업을 정리하는
            <br />
            React 컴포넌트
          </h1>

          <p className="hero-description">State와 useEffect를 함께 사용하여 시작, 업데이트, 일시 정지, 제거 과정을 직접 확인합니다.</p>

          <a 
          className="hero-link"
          href="#timer"
          >타이머 실습하기</a>
        </div>
        <CurrentClock />
      </section>
      <section
        className="timer-section"
        id="timer"
        aria-labelledby="timer-title"
      >
        <div className="section-heading timer-heading">
          <div>
            <p className="section-label">LIFECYCLE TIMER</p>

            <h2 id="timer-title">학습 세션 타이머</h2>

            <p>타이머를 생성하거나 제거한 후 Console에서 생명주기 로그를 확인하세요.</p>
          </div>
          <button
            className="visibility-button"
            type="button"
            onClick={toggleTimerVisibility}>
              {isTimerVisible
              ? "타이머 컴포넌트 제거"
              : "타이머 컴포넌트 생성"}
          </button>
        </div>
        <div className="timer-layout">
          {isTimerVisible ? (
            <StudyTimer sessionCount={sessionCount} onCompleteSession={completeSession} />
          ) : (
            <article className="empty-timer">
              <span aria-hidden="true">o</span>
              <h2>타이머가 제거되었습니다.</h2>
              <p>Effect의 정리 함수가 실행되어 타이머가 종료되었습니다.</p>
            </article>
          )}
          <SessionSummary 
            sessionCount={sessionCount}
            totalSeconds={totalSeconds}
          />
        </div>
      </section>
      <LifecycleGuide />
    </main>

    <Footer />
    </>
  );
}

export default App