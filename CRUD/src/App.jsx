import React, { useMemo, useState } from "react";
import "./App.css";

function App() {
  const initialPosts = [
    {
      id: 1,
      title: "첫 번째 게시글입니다.",
      content: "안녕하세요. 첫 번째 게시글 내용입니다.",
      author: "관리자",
      createdAt: "2026-03-22",
    },
    {
      id: 2,
      title: "React 게시판 CRUD 예제",
      content: "목록, 상세, 작성, 수정, 삭제를 연습할 수 있는 예제입니다.",
      author: "김지애",
      createdAt: "2026-03-22",
    },
  ];

  const [posts, setPosts] = useState(initialPosts);
  const [mode, setMode] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    content: "",
  });

  const selectedPost = useMemo(() => {
    return posts.find((post) => post.id === selectedId) || null;
  }, [posts, selectedId]);

  const changeForm = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      author: "",
      content: "",
    });
  };

  const goList = () => {
    setMode("list");
    setSelectedId(null);
    resetForm();
  };

  const goDetail = (id) => {
    setSelectedId(id);
    setMode("detail");
  };

  const goWrite = () => {
    resetForm();
    setMode("write");
  };

  const createPost = () => {
    if (
      form.title.trim() === "" ||
      form.author.trim() === "" ||
      form.content.trim() === "" 
    ) {
      alert("제목, 작성자, 내용을 모두 입력하세요.");
      return;
    }

    const newPost = {
      id: Date.now(),
      title: form.title,
      author: form.author,
      content: form.content,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setPosts([newPost, ...posts]);
    setselectedId(newPost.id);
    resetForm();
    setMode("detail");
  };

  const goEdit = () => {
    if (!selectedPost) return;
    setForm({
      title: selectedPost.title,
      author: selectedPost.author,
      content: selectedPost.content,
    });

    setMode("edit");
  };

  const updatePost = () => {
    if (
      form.title.trim() === "" ||
      form.author.trim() === "" ||
      form.content.trim() === ""
    ){
      alert("제목, 작성자, 내용을 모두 입력하세요.");
      return;
    }

    setPosts(
      posts.map((post) =>
      post.id === selectedId
        ? {
          ...post,
          title: form.title,
          author: form.author,
          content: form.content,
        }
        : post
      )
    );
    setMode("detail");
  };

  const deletePost = () => {
    if (!selectedPost) return;

    const isDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!isDelete) return;

    setPosts(posts.filter((post) => post.id !== selectedId));
    goList();
  };

  return (
    <div className="container">
      <h1 className="title">게시판 CRUD</h1>

      {mode === "list" && (
        <div>
          <div className="topBar">
            <span className="countText">전체 게시글: {posts.length}개</span>

            <button className="writeButton" onClick={goWrite}>글쓰기</button>
          </div>

          {posts.length === 0 ? (
            <div className="emptyBox">등록된 게시글이 없습니다.</div>
          ) : (
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th className="th">번호</th>
                    <th className="th">제목</th>
                    <th className="th">작성자</th>
                    <th className="th">작성일</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, index) => (
                    <tr key={post.id} className="tr">
                      <td className="td">{posts.length - index}</td>
                      <td className="td linkText" onClick={() => goDetail(post.id)}>{post.title}</td>
                      <td className="td">{post.author}</td>
                      <td className="td">{post.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {mode === "detail" && selectedPost && (
        <div className="detailBox">
          <div className="detailHeader">
            <h2 className="detailTitle">{selectedPost.title}</h2>

            <div className="metaBox">
              <span>작성자: {selectedPost.author}</span>
              <span>작성일: {selectedPost.createdAt}</span>
            </div>
          </div>

          <div className="contentBox">{selectedPost.content}</div>

          <div className="buttonRow">
            <button className="grayButton" onClick={goList}>
              목록
            </button>
            <button className="editButton" onClick={goEdit}>
              수정
            </button>
            <button className="deleteButton" onClick={deletePost}>
              삭제
            </button>
          </div>
        </div>
      )}

      {(mode === "write" || mode === "edit") && (
        <div className="formBox">
          <h2 className="formTitle">
            {mode === "write" ? "게시글 작성" : "게시글 수정"}
          </h2>

          <div className="formGroup">
            <label className="label">제목</label>
            <input 
              type="text"
              name="title"
              value={form.title}
              onChange={changeForm}
              className="input"
              placeholder="제목을 입력하세요" 
            />
          </div>

          <div className="formGroup">
            <label className="label">작성자</label>
            <input 
              type="text"
              name="author"
              value={form.author}
              onChange={changeForm}
              className="input"
              placeholder="작성자를 입력하세요" 
            />
          </div>

          <div className="formGroup">
            <label className="label">내용</label>
            <textarea 
              name="content"
              value={form.content}
              onChange={changeForm}
              className="textarea"
              placeholder="내용을 입력하세요" 
            />
          </div>

          <div className="buttonRow">
            <button className="grayButton" onClick={goList}>취소</button>
            <button className="saveButton" onClick={mode === "write" ? createPost : updatePost}>
              {mode === "write" ? "등록" : "수정 완료"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;