
import { useEffect, useMemo, useState } from "react";
import "./App.css";

// localStorage에 저장할 데이터의 키 이름
const TOKEN_KEY = "memo_login_token";
const USER_KEY = "memo_login_user";
const NOTES_KEY = "memo_notes";

// localStorage에서 메모 목록을 안전하게 불러오는 함수
const getSavedNotes = () => {
  try {
    const savedNotes = localStorage.getItem(NOTES_KEY);

    if (!savedNotes) {
      return [];
    }

    const parsedNotes = JSON.parse(savedNotes);

    // 저장된 데이터가 배열인지 확인
    if (!Array.isArray(parsedNotes)) {
      return [];
    }

    // 메모의 제목과 내용이 문자열인지 확인하고 보정
    return parsedNotes.map((note) => ({
      ...note,
      title: String(note.title ?? ""),
      content: String(note.content ?? ""),
      createdAt: note.createdAt ?? "",
      updatedAt: note.updatedAt ?? "",
    }));
  } catch (error) {
    console.error("메모 불러오기 오류:", error);
    return [];
  }
};

// localStorage에서 사용자 정보를 안전하게 불러오는 함수
const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem(USER_KEY);

    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("사용자 정보 불러오기 오류:", error);
    return null;
  }
};

export default function App() {
  // 로그인 입력값
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // 로그인 토큰
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) || ""
  );

  // 로그인한 사용자 정보
  const [user, setUser] = useState(getSavedUser);

  // 안내 메시지
  const [message, setMessage] = useState("");

  // 전체 메모 목록
  const [notes, setNotes] = useState(getSavedNotes);

  // 메모 입력값
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 검색어
  const [search, setSearch] = useState("");

  // 현재 수정 중인 메모 ID
  const [editId, setEditId] = useState(null);

  // 로그인 상태 확인
  const isLoggedIn = Boolean(token);

  // 메모가 변경되면 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("메모 저장 오류:", error);
      setMessage("메모 저장에 실패했습니다.");
    }
  }, [notes]);

  // 로그인 토큰과 사용자 정보가 서로 맞지 않으면 로그아웃 처리
  useEffect(() => {
    if (!token || !user) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken("");
      setUser(null);
    }
  }, []);

  // 검색어에 맞는 메모 목록 계산
  const filteredNotes = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return notes;
    }

    return notes.filter((note) => {
      const noteTitle = String(note.title ?? "").toLowerCase();
      const noteContent = String(note.content ?? "").toLowerCase();

      return (
        noteTitle.includes(keyword) ||
        noteContent.includes(keyword)
      );
    });
  }, [notes, search]);

  // 로그인 입력값 변경
  const handleLoginChange = (e) => {
    const { name, value } = e.target;

    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  // 로그인 처리
  const handleLogin = (e) => {
    e.preventDefault();

    const email = loginForm.email.trim();
    const password = loginForm.password;

    if (!email || !password) {
      setMessage("이메일과 비밀번호를 입력하세요.");
      return;
    }

    // 테스트 계정 확인
    if (email === "test@test.com" && password === "1234") {
      const loginToken = "sample-token";

      const loginUser = {
        name: "테스트유저",
        email,
      };

      try {
        localStorage.setItem(TOKEN_KEY, loginToken);
        localStorage.setItem(USER_KEY, JSON.stringify(loginUser));
      } catch (error) {
        console.error("로그인 정보 저장 오류:", error);
        setMessage("로그인 정보를 저장하지 못했습니다.");
        return;
      }

      setToken(loginToken);
      setUser(loginUser);

      setLoginForm({
        email: "",
        password: "",
      });

      setMessage("로그인 성공");
      return;
    }

    setMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
  };

  // 메모 입력창 초기화
  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditId(null);
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken("");
    setUser(null);

    setSearch("");
    resetForm();

    setMessage("로그아웃되었습니다.");
  };

  // 메모 추가 및 수정
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    // 제목과 내용이 모두 입력되었는지 확인
    if (!trimmedTitle || !trimmedContent) {
      setMessage("제목과 내용을 모두 입력하세요.");
      return;
    }

    const currentTime = new Date().toLocaleString();

    // 기존 메모 수정
    if (editId !== null) {
      setNotes((prevNotes) =>
        prevNotes.map((note) => {
          if (note.id === editId) {
            return {
              ...note,
              title: trimmedTitle,
              content: trimmedContent,
              updatedAt: currentTime,
            };
          }

          return note;
        })
      );

      setMessage("메모가 수정되었습니다.");
    }

    // 새 메모 추가
    else {
      const newNote = {
        id: Date.now(),
        title: trimmedTitle,
        content: trimmedContent,
        createdAt: currentTime,
        updatedAt: currentTime,
      };

      setNotes((prevNotes) => [newNote, ...prevNotes]);

      setMessage("메모가 추가되었습니다.");
    }

    resetForm();
  };

  // 메모 수정
  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);

    setMessage("메모를 수정한 후 수정 버튼을 눌러주세요.");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 메모 수정 취소
  const handleCancelEdit = () => {
    resetForm();
    setMessage("메모 수정을 취소했습니다.");
  };

  // 메모 삭제
  const handleDelete = (id) => {
    const isDelete = window.confirm("메모를 삭제하시겠습니까?");

    if (!isDelete) {
      return;
    }

    setNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== id)
    );

    // 수정 중인 메모를 삭제했다면 입력창 초기화
    if (editId === id) {
      resetForm();
    }

    setMessage("메모가 삭제되었습니다.");
  };

  return (
    <div className="container">
      <h1 className="mainTitle">메모 앱</h1>

      {!isLoggedIn ? (
        // 로그인 화면
        <div className="card">
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              placeholder="이메일"
              required
            />

            <input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              placeholder="비밀번호"
              required
            />

            <button type="submit">
              로그인
            </button>
          </form>

          <div className="loginInfo">
            <p>테스트 계정</p>
            <p>test@test.com / 1234</p>
          </div>
        </div>
      ) : (
        // 로그인 후 메모 관리 화면
        <div className="grid">
          {/* 왼쪽 영역 */}
          <div className="left">
            <div className="userInfo">
              <p>{user?.name}</p>
              <p>{user?.email}</p>

              <button
                type="button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>

            {/* 메모 작성 및 수정 폼 */}
            <form onSubmit={handleSubmit}>
              <h2>
                {editId !== null ? "메모 수정" : "새 메모 작성"}
              </h2>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                required
              />

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용"
                required
              />

              <button type="submit">
                {editId !== null ? "메모 수정" : "메모 추가"}
              </button>

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

          {/* 오른쪽 영역 */}
          <div className="right">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="메모 검색"
            />

            <p>
              전체 메모 {filteredNotes.length}개
            </p>

            {filteredNotes.length === 0 ? (
              <div className="empty">
                등록된 메모가 없습니다.
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="note"
                >
                  <h3>{note.title}</h3>

                  <p>{note.content}</p>

                  <small>
                    수정: {note.updatedAt}
                  </small>

                  <div className="buttonGroup">
                    <button
                      type="button"
                      onClick={() => handleEdit(note)}
                    >
                      수정
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
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

      {/* 안내 메시지 */}
      {message && (
        <p className="message">
          {message}
        </p>
      )}
    </div>
  );
}
